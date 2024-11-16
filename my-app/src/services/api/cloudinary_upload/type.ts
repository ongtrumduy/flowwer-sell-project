export interface InterfaceCloudinaryUploadMetaData {
  imageUrl: string;
}

export interface InterfaceCloudinaryUploadData {
  message: string;
  status: number;
  metaData: InterfaceCloudinaryUploadMetaData;
}

export interface InterfaceCreatePaymentMetaData {
  clientSecret: string;
}

export interface InterfaceCreatePaymentData {
  message: string;
  status: number;
  metaData: InterfaceCreatePaymentMetaData;
}
