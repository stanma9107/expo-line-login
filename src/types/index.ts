interface AccessToken {
  token_type: string;
  scope: string;
  refresh_token: string;
  createdAt: number;
  access_token: string;
  id_token?: string;
  expires_in: number;
}

interface UserProfile {
  pictureUrl: string;
  userId: string;
  displayName: string;
}

export interface LoginResult {
  friendshipStatusChanged?: boolean;
  scope: string;
  IDTokenNonce?: string;
  accessToken: AccessToken;
  userProfile?: UserProfile;
}
