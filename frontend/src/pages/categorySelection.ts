interface StoreOption {
  storeId: number;
  storeName: string;
  defaultCategoryId: number;
  defaultCategoryName: string;
}

export default function getDefaultCategoryId(
  selectedStoreId: number,
  storeList: StoreOption[],
): number {
  // Store id provided as an argument

  // Get store info using store id
  const storeInfo = storeList.find(
    (store) => store.storeId === selectedStoreId,
  );

  // If store info is not found or storeName = "Other", return category id = 0
  if (!storeInfo || storeInfo.storeName === "Other") {
    return 0;
  }
  // If store info is found, return its category id
  return storeInfo.defaultCategoryId;
}
