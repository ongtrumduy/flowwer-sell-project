export interface InterfaceAuthInformationMetaData {
  user: {
    userId: string;
    name: string;
    email: string;
    roles: string[];
    address: string;
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
