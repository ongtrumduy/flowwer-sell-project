type Maybe<T> = T | null;

export interface InterfaceCategoryFormData {
  categoryId?: Maybe<string | undefined>;
  category_name: string;
  category_description: string;
}

export interface InterfaceFormAddNewState {
  category_name: string;
  category_description: string;
}

export interface InterfaceFormEditState {
  category_name: string;
  category_description: string;
}

export interface InterfaceSubmitFormAddState extends Omit<InterfaceFormAddNewState, 'category_description'> {
  category_description: string;
}

export interface InterfaceSubmitFormEditState extends Omit<InterfaceFormEditState, 'category_description'> {
  category_description: string;
}

export interface InterfaceFormCategoryDetail extends Omit<InterfaceFormEditState, 'category_description'> {
  category_description: string;
}
