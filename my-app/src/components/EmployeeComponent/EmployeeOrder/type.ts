type Maybe<T> = T | null;

export interface InterfaceAccountFormData {
  accountId?: Maybe<string | undefined>;
  product_name: string;
  account_email: number;
  account_phone_number: number;
  account_role: string[];
  account_address: string;
  account_avatar: File | null | undefined | string;
}

export interface InterfaceFormAddNewState {
  account_name: string;
  account_email: string;
  account_phone_number: string;
  account_address: string;
  account_role: Maybe<Blob[] | undefined>;
  account_avatar: File;
}

export interface InterfaceFormEditState {
  account_name: string;
  account_email: string;
  account_phone_number: string;
  account_address: string;
  account_avatar: File | null | undefined | string;

  account_role?: Maybe<Blob[] | undefined | string[]>;
  account_role_list?: string[];
}

export interface InterfaceSubmitFormAddState
  extends Omit<InterfaceFormAddNewState, 'account_avatar'> {
  account_avatar?: Maybe<string | File | null | undefined>;
}

export interface InterfaceSubmitFormEditState
  extends Omit<InterfaceFormEditState, 'account_role' | 'account_avatar'> {
  account_role?: Maybe<Blob[] | undefined>;

  account_avatar?: Maybe<string | File | null | undefined>;
}

export interface InterfaceFormAccountDetail
  extends Omit<InterfaceFormEditState, 'account_avatar' | 'account_role'> {
  account_avatar?: Maybe<string | File | null | undefined>;
  account_role?: unknown[] | undefined;
}
