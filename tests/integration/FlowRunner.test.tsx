import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FlowRunner } from "@/features/simulator/engine/FlowRunner";
import type { FlowSpec, PlatformChrome } from "@/features/simulator/engine/types";

const PassthroughChrome: PlatformChrome = ({ children }) => <div data-testid="chrome">{children}</div>;

function buildFlow(overrides: Partial<FlowSpec> = {}): FlowSpec {
  return {
    kind: "create",
    platform: "google",
    onComplete: vi.fn(async () => {}),
    screens: [
      {
        id: "one",
        title: "screen.one.title",
        cta: { primary: "cta.next" },
        next: () => "two",
      },
      {
        id: "two",
        title: "screen.two.title",
        cta: { primary: "cta.next" },
        next: () => "done",
      },
    ],
    ...overrides,
  };
}

describe("FlowRunner", () => {
  it("renders first screen and advances via primary CTA", async () => {
    render(<FlowRunner flow={buildFlow()} chrome={PassthroughChrome} />);
    expect(screen.getByText("screen.one.title")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "cta.next" }));
    await waitFor(() => expect(screen.getByText("screen.two.title")).toBeInTheDocument());
  });

  it("submit calls preventDefault on form event", async () => {
    render(<FlowRunner flow={buildFlow()} chrome={PassthroughChrome} />);
    const form = document.querySelector("form")!;
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
    expect(submitEvent.defaultPrevented).toBe(true);
  });

  it("blocks advance when a required field is empty", async () => {
    const flow = buildFlow({
      screens: [
        {
          id: "one",
          title: "screen.one.title",
          cta: { primary: "cta.next" },
          next: () => "done",
          fields: [
            {
              name: "email",
              type: "email",
              required: true,
              i18n: { label: "fields.email.label" },
              validate: (v) => (v ? null : "email.invalid"),
            },
          ],
        },
      ],
    });
    render(<FlowRunner flow={flow} chrome={PassthroughChrome} />);
    fireEvent.click(screen.getByRole("button", { name: "cta.next" }));
    await waitFor(() => expect(screen.getByText("required")).toBeInTheDocument());
    expect(flow.onComplete).not.toHaveBeenCalled();
  });

  it("screen.next throwing surfaces the error message via screenError", async () => {
    const flow = buildFlow({
      screens: [
        {
          id: "one",
          title: "screen.one.title",
          cta: { primary: "cta.next" },
          next: () => {
            throw new Error("server.exploded");
          },
        },
      ],
    });
    render(<FlowRunner flow={flow} chrome={PassthroughChrome} />);
    fireEvent.click(screen.getByRole("button", { name: "cta.next" }));
    await waitFor(() => expect(screen.getByText("server.exploded")).toBeInTheDocument());
  });

  it("customLayout: true skips form rendering", () => {
    const flow = buildFlow({
      screens: [
        {
          id: "one",
          title: "screen.one.title",
          cta: { primary: "cta.next" },
          next: () => "done",
          customLayout: true,
          render: () => <div data-testid="custom">CUSTOM</div>,
        },
      ],
    });
    render(<FlowRunner flow={flow} chrome={PassthroughChrome} />);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
    expect(document.querySelector("form")).toBeNull();
  });
});
