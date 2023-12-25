// Import the native module. On web, it will be resolved to ExpoLineLogin.web.ts
// and on native platforms to ExpoLineLogin.ts
import ExpoLineLoginModule from "./ExpoLineLoginModule";
import { LoginResult, ProfileResult, AccessToken } from "./types";

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

export const logout = async () => {
  return await ExpoLineLoginModule.logout();
};

export const getProfile = async (): Promise<ProfileResult> => {
  return await ExpoLineLoginModule.getProfile();
};

export const getAccessToken = async (): Promise<AccessToken> => {
  return await ExpoLineLoginModule.getAccessToken();
};

export const getBotFriendshipStatus = async (): Promise<boolean> => {
  return await ExpoLineLoginModule.getBotFriendshipStatus();
};
