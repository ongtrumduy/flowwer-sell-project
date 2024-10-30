export enum EnumRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface InterfaceAuthInformationMetaData {
  user: {
    userId: string;
    name: string;
    email: string;
    roles: string[];
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
