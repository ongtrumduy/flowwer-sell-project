export interface InterfaceCategoryMetaData {
  categories: {
    overview: {
      totalSearchCount: number;
    }[];
    data: InterfaceCategoryItem[];
  }[];
}

export interface InterfaceCategoryItem {
  category_name: string;
  category_description: string;
  categoryId: string;
}

export interface InterfaceCategoryDetailItem {
  message: string;
  status: number;
  metaData: {
    categoryDetail: InterfaceCategoryItem;
  };
}

export interface InterfaceCategoryList {
  message: string;
  status: number;
  metaData: InterfaceCategoryMetaData;
}

export interface InterfaceCategoryDetailItemMetaData {
  categoryDetail: InterfaceCategoryItem;
}
