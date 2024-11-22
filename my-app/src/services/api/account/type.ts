export interface InterfaceAccountItem {
  account_name: string;
  account_email: string;
  account_phone_number: string;
  account_avatar: string | null;
  account_address: string;
  accountId: string;
  account_role_list?: {
    roleId: string;
    roleName: string;
  }[];
  account_role: string[];
}

export interface InterfaceAccountMetaData {
  accounts: {
    overview: {
      totalSearchCount: number;
    }[];
    data: InterfaceAccountItem[];
  }[];
}

export interface InterfaceAccountList {
  message: string;
  status: number;
  metaData: InterfaceAccountMetaData;
}

export interface InterfaceAccountDetailItem {
  message: string;
  status: number;
  metaData: {
    accountDetail: InterfaceAccountItem;
  };
}

export interface InterfaceAccountDetailItemMetaData {
  accountDetail: InterfaceAccountItem;
}
