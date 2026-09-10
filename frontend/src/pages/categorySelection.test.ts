import getDefaultCategoryId from "./categorySelection";
import { expect, test } from "vitest";
import type { StoreOption } from "./expenseOptions.types";

// Arrange
// Create a list of stores
const storeList: StoreOption[] = [
  {
    storeId: 1,
    storeName: "Walmart",
    defaultCategoryId: 1,
    defaultCategoryName: "Groceries",
  },
  {
    storeId: 3,
    storeName: "Tim Hortons",
    defaultCategoryId: 2,
    defaultCategoryName: "Dining",
  },
  {
    storeId: 13,
    storeName: "Tim Hortons",
    defaultCategoryId: 7,
    defaultCategoryName: "Health",
  },
  {
    storeId: 16,
    storeName: "Other",
    defaultCategoryId: 8,
    defaultCategoryName: "Other",
  },
];

// When store info is not found, return 0
test("Returns 0 when store info is not found", () => {
  // Act
  // Call the function
  const result = getDefaultCategoryId(5, storeList);
  // Assert: Check if it returns 0
  expect(result).toBe(0);
});

// When selecting a store, return its default category id
test("It returns default category id when store info is found", () => {
  // Act
  // Call the function
  const result = getDefaultCategoryId(3, storeList);
  // Assert: Check if it returns 2
  expect(result).toBe(2);
});

// When selecting "Other" as a store, return 0
test("It returns 0 when 'Other' is selected as a store", () => {
  // Act
  // Call the function
  const result = getDefaultCategoryId(16, storeList);
  // Assert: Check if it returns 0
  expect(result).toBe(0);
});
