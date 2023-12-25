// Import the native module. On web, it will be resolved to ExpoLineLogin.web.ts
// and on native platforms to ExpoLineLogin.ts
import ExpoLineLoginModule from "./ExpoLineLoginModule";
import { LoginResult } from "./types";

export enum LoginPermission {
  EMAIL = "email",
  PROFILE = "profile",
  OPEN_ID = "openid",
}

export enum BotPrompt {
  NORMAL = "normal",
  AGGRESSIVE = "aggressive",
}

export const login = async (
  scopes: LoginPermission[],
  botPrompt: BotPrompt,
): Promise<LoginResult> => {
  return await ExpoLineLoginModule.login(
    scopes.map((scope) => scope.toString()),
    botPrompt.toString(),
  );
};
