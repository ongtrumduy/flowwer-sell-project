export interface InterfaceProductItem {
  product_name: string;
  product_quantity: number;
  product_price: number;
  product_image: string;
  product_description: string;
  productId: string;
}

export interface InterfaceProductMetaData {
  products: {
    overview: {
      totalSearchCount: number;
    }[];
    data: InterfaceProductItem[];
  }[];
}

export interface InterfaceProductList {
  message: string;
  status: number;
  metaData: InterfaceProductMetaData;
}

export interface InterfaceProductDetailItem {
  message: string;
  status: number;
  metaData: {
    productDetail: InterfaceProductItem;
  };
}

export interface InterfaceProductDetailItemMetaData {
  productDetail: InterfaceProductItem;
}
