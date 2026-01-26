// Import the native module. On web, it will be resolved to ExpoLineLogin.web.ts
// and on native platforms to ExpoLineLogin.ts
import { CodedError } from "expo-modules-core";
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
  try {
    return await ExpoLineLoginModule.login(
      scopes.map((scope) => scope.toString()),
      botPrompt.toString(),
    );
  } catch (error: any) {
    throw new CodedError(error?.code ?? "UNKNOWN_ERROR", error?.message ?? "Unknown error");
  }
};

export const logout = async () => {
  try {
    return await ExpoLineLoginModule.logout();
  } catch (error: any) {
    throw new CodedError(error?.code ?? "UNKNOWN_ERROR", error?.message ?? "Unknown error");
  }
};

export const getProfile = async (): Promise<ProfileResult> => {
  try {
    return await ExpoLineLoginModule.getProfile();
  } catch (error: any) {
    throw new CodedError(error?.code ?? "UNKNOWN_ERROR", error?.message ?? "Unknown error");
  }
};

export const getAccessToken = async (): Promise<AccessToken> => {
  try {
    return await ExpoLineLoginModule.getAccessToken();
  } catch (error: any) {
    throw new CodedError(error?.code ?? "UNKNOWN_ERROR", error?.message ?? "Unknown error");
  }
};

export const getBotFriendshipStatus = async (): Promise<boolean> => {
  try {
    return await ExpoLineLoginModule.getBotFriendshipStatus();
  } catch (error: any) {
    throw new CodedError(error?.code ?? "UNKNOWN_ERROR", error?.message ?? "Unknown error");
  }
};
