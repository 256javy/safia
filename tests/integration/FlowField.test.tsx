import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FlowField } from "@/features/simulator/engine/FlowField";
import type { FieldSpec, FlowCtx, Translator } from "@/features/simulator/engine/types";

const t: Translator = ((key: string) => key) as Translator;
(t as unknown as { has: (k: string) => boolean }).has = () => true;

const ctx: FlowCtx = {
  platform: "google",
  data: {},
  t,
  tp: t,
  tv: t,
  patch: () => {},
  locale: "es",
  exit: () => {},
};

const resolve = (k: string) => k;

describe("FlowField", () => {
  it("renders email input with label, placeholder, autocomplete=email", () => {
    const field: FieldSpec = {
      name: "email",
      type: "email",
      autoComplete: "email",
      i18n: { label: "fields.email.label", placeholder: "fields.email.placeholder" },
    };
    render(<FlowField field={field} value="" onChange={() => {}} ctx={ctx} tp={t} resolve={resolve} />);
    const input = screen.getByLabelText("fields.email.label") as HTMLInputElement;
    expect(input.type).toBe("email");
    expect(input.placeholder).toBe("fields.email.placeholder");
    expect(input.autocomplete).toBe("email");
  });

  it("password reveal toggle flips type from password to text", () => {
    const field: FieldSpec = {
      name: "password",
      type: "password",
      reveal: true,
      i18n: { label: "fields.password.label" },
    };
    render(<FlowField field={field} value="hunter2" onChange={() => {}} ctx={ctx} tp={t} resolve={resolve} />);
    const input = screen.getByLabelText("fields.password.label") as HTMLInputElement;
    expect(input.type).toBe("password");
    fireEvent.click(screen.getByLabelText("Show"));
    expect(input.type).toBe("text");
  });

  it("confirmPassword shows mismatch error from parent", () => {
    const field: FieldSpec = {
      name: "passwordConfirm",
      type: "confirmPassword",
      matches: "password",
      i18n: { label: "fields.confirm.label" },
    };
    render(
      <FlowField
        field={field}
        value="abc"
        onChange={() => {}}
        ctx={ctx}
        tp={t}
        resolve={resolve}
        error="password.mismatch"
      />,
    );
    expect(screen.getByText("password.mismatch")).toBeInTheDocument();
  });

  it("strength meter renders 4 bars when meter=true", () => {
    const field: FieldSpec = {
      name: "password",
      type: "newPassword",
      meter: true,
      i18n: { label: "fields.password.label" },
    };
    const { container } = render(
      <FlowField field={field} value="abc" onChange={() => {}} ctx={ctx} tp={t} resolve={resolve} />,
    );
    const bars = container.querySelectorAll('[aria-hidden="true"] > div');
    expect(bars.length).toBe(4);
  });

  it("calls onChange when user types", () => {
    const onChange = vi.fn();
    const field: FieldSpec = {
      name: "email",
      type: "email",
      i18n: { label: "fields.email.label" },
    };
    render(<FlowField field={field} value="" onChange={onChange} ctx={ctx} tp={t} resolve={resolve} />);
    const input = screen.getByLabelText("fields.email.label");
    fireEvent.change(input, { target: { value: "a@b.co" } });
    expect(onChange).toHaveBeenCalledWith("a@b.co");
  });
});
