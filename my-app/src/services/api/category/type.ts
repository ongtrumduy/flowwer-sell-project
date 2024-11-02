export interface InterfaceCategoryList {
  message: 'Get category item detail successfully !!!';
  status: 200;
  metaData: InterfaceCategoryMetaData;
}

export interface InterfaceCategoryMetaData {
  categories: {
    overview: {
      totalCount: number;
    }[];
    data: InterfaceCategoryItem[];
  }[];
}

export interface InterfaceCategoryItem {
  category_name: string;
  category_description: string;
  categoryId: string;
}
