export interface InterfaceProductItem {
  product_name: string;
  order_quantity: number;
  product_price: number;
  product_image: string;
  product_description: string;
  productId: string;
}

export interface InterfaceProductMetaData {
  products: {
    overview: {
      totalCount: number;
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
  message: 'Get product item detail successfully !!!';
  status: 200;
  metaData: {
    productDetail: {
      product_name: string;
      order_quantity: 20;
      product_price: 50000;
      product_image: string;
      product_description: string;
      productId: string;
    };
  };
}

export interface InterfaceProductDetailItemMetaData {
  productDetail: InterfaceProductItem;
}
