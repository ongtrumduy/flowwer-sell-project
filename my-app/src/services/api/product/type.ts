export interface InterfaceProductItem {
  product_name: string;
  product_quantity: number;
  product_price: number;
  product_image: string | null;
  product_description: string;
  productId: string;
  categoryId_document_list?: {
    category_description: string;
    category_name: string;
    _id: string;
  }[];
  product_category: string[];
  product_average_rating: number;
  product_total_review: number;
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
