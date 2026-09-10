export interface StoreOption {
  storeId: number;
  storeName: string;
  defaultCategoryId: number;
  defaultCategoryName: string;
}

export interface CategoryOption {
  categoryId: number;
  categoryName: string;
}

export interface ExpenseOptionsResponse {
  stores: StoreOption[];
  categories: CategoryOption[];
}
