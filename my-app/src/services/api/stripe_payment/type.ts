export interface InterfaceConfigPaymentMetaData {
  publishableKey: string;
}

export interface InterfaceConfigPaymentData {
  message: string;
  status: number;
  metaData: InterfaceConfigPaymentMetaData;
}

export interface InterfaceCreatePaymentMetaData {
  clientSecret: string;
}

export interface InterfaceCreatePaymentData {
  message: string;
  status: number;
  metaData: InterfaceCreatePaymentMetaData;
}
