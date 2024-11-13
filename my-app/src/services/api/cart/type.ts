export interface InterfaceCartProductItem {
  product_name: string;
  product_quantity: number;
  product_price: number;
  product_image: string;
  product_description: string;
  productId: string;
}

export interface InterfaceCartProductInList {
  productId: InterfaceCartProductItem;
  product_quantity: number;
  product_price_now: number;
  _id: string;
}

export interface InterfaceCartProductReturnItem
  extends InterfaceCartProductInList {
  selected: boolean;
}

export interface InterfaceCartProductMetaData {
  carts: {
    overview: {
      totalSearchCount: number;
    };
    data: {
      cart_pagination_item_list: InterfaceCartProductReturnItem[];
    };
  };
}

export interface InterfaceCartProductList {
  message: string;
  status: number;
  metaData: InterfaceCartProductMetaData;
}

export interface InterfaceProductDetailItem {
  message: string;
  status: number;
  metaData: {
    productDetail: InterfaceCartProductItem;
  };
}

export interface InterfaceProductDetailItemMetaData {
  productDetail: InterfaceCartProductItem;
}
