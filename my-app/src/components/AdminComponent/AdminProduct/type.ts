type Maybe<T> = T | null;

export interface InterfaceProductFormData {
  productId?: Maybe<string | undefined>;
  product_name: string;
  product_quantity: number;
  product_price: number;
  product_category: string[];
  product_description: string;
  product_image: File | null | undefined | string;
}

export interface InterfaceFormAddNewState {
  product_name: string;
  product_quantity: number;
  product_price: number;
  product_description: string;
  product_category?: Maybe<Blob[] | undefined>;
  product_image: File;
}

export interface InterfaceFormEditState {
  product_name: string;
  product_quantity: number;
  product_price: number;
  product_description: string;
  product_image: File | null | undefined | string;

  product_category?: Maybe<Blob[] | undefined | string[]>;
  categoryId_document_list?: string[];

  product_type?: Maybe<Blob[] | undefined | string[]>;
  typeProductId_document_list?: string[];
}

export interface InterfaceSubmitFormEditState
  extends Omit<
    InterfaceFormEditState,
    'product_image' | 'product_category' | 'product_type'
  > {
  product_category?: Maybe<Blob[] | undefined>;
  product_type?: Maybe<Blob[] | undefined>;

  product_image?: Maybe<string | File | null | undefined>;
}
