export interface InterfaceTypeProductMetaData {
  typeProducts: {
    overview: {
      totalSearchCount: number;
    }[];
    data: InterfaceTypeProductItem[];
  }[];
}

export interface InterfaceTypeProductItem {
  type_product_name: string;
  type_product_description: string;
  typeProductId: string;
}

export interface InterfaceTypeProductDetailItem {
  message: string;
  status: number;
  metaData: {
    typeProductDetail: InterfaceTypeProductItem;
  };
}

export interface InterfaceTypeProductList {
  message: string;
  status: number;
  metaData: InterfaceTypeProductMetaData;
}

export interface InterfaceTypeProductDetailItemMetaData {
  typeProductDetail: InterfaceTypeProductItem;
}
