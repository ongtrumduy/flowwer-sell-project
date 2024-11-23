type Maybe<T> = T | null;

export interface InterfaceTypeProductFormData {
  typeProductId?: Maybe<string | undefined>;
  type_product_name: string;
  type_product_description: string;
}

export interface InterfaceFormAddNewState {
  type_product_name: string;
  type_product_description: string;
}

export interface InterfaceFormEditState {
  type_product_name: string;
  type_product_description: string;
}

export interface InterfaceSubmitFormAddState
  extends Omit<InterfaceFormAddNewState, 'type_product_description'> {
  type_product_description: string;
}

export interface InterfaceSubmitFormEditState
  extends Omit<InterfaceFormEditState, 'type_product_description'> {
  type_product_description: string;
}

export interface InterfaceFormTypeProductDetail
  extends Omit<InterfaceFormEditState, 'type_product_description'> {
  type_product_description: string;
}
