export interface InterfaceAuthInformationMetaData {
  user: {
    userId: string;
    name: string;
    email: string;
    roles: string[];
    address: string;
    avatar_url: string;
    phone_number: string;
    status: boolean;
    verified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  roleList: Array<string>;
}

export interface InterfaceAuthInformation {
  message: string;
  status: number;
  metaData: InterfaceAuthInformationMetaData;
}

export interface InterfaceLogoutResponseMetaData {
  delKey: {
    acknowledged: boolean;
    deletedCount: number;
  };
}

export interface InterfaceLogoutResponseData {
  message: string;
  status: number;
  metaData: InterfaceLogoutResponseMetaData;
}
