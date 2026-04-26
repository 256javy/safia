import { definePlatform } from "@/features/simulator/engine/definePlatform";
import { FacebookChrome } from "./chrome";
import { buildCreateFlow } from "./flows/create";
import { buildLoginFlow } from "./flows/login";
import { buildChangePasswordFlow } from "./flows/change-password";
import { buildRecoverFlow } from "./flows/recover";
import { buildTotpFlow } from "./flows/totp";

export const facebookPlatform = definePlatform({
  id: "facebook",
  chrome: FacebookChrome,
  create: buildCreateFlow,
  login: buildLoginFlow,
  changePassword: buildChangePasswordFlow,
  recover: buildRecoverFlow,
  totp: buildTotpFlow,
});
