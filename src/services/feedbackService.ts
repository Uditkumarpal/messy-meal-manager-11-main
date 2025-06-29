
import { MENU_ITEMS_KEY, MEAL_RECORDS_KEY } from "./localStorage";
import { getMenuItems } from "./menuService";
import { getMealRecords } from "./mealService";

// Add functions for likes and dislikes
export const likeMenuItem = (menuItemId: string, userId: string): void => {
  const items = getMenuItems();
  const mealRecords = getMealRecords();
  const index = items.findIndex((i) => i.id === menuItemId);
  
  if (index >= 0) {
    // Update the menu item likes count
    items[index].likes = (items[index].likes || 0) + 1;
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(items));
    
    // Update the user's rating on their meal records for this item
    mealRecords.forEach(record => {
      if (record.userId === userId && record.menuItemId === menuItemId) {
        // If previously disliked, decrement dislikes
        if (record.userRating === 'dislike') {
          const dislikeIndex = items.findIndex((i) => i.id === menuItemId);
          if (dislikeIndex >= 0 && items[dislikeIndex].dislikes) {
            items[dislikeIndex].dislikes = Math.max(0, (items[dislikeIndex].dislikes || 0) - 1);
          }
        }
        record.userRating = 'like';
      }
    });
    localStorage.setItem(MEAL_RECORDS_KEY, JSON.stringify(mealRecords));
  }
};

export const dislikeMenuItem = (menuItemId: string, userId: string): void => {
  const items = getMenuItems();
  const mealRecords = getMealRecords();
  const index = items.findIndex((i) => i.id === menuItemId);
  
  if (index >= 0) {
    // Update the menu item dislikes count
    items[index].dislikes = (items[index].dislikes || 0) + 1;
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(items));
    
    // Update the user's rating on their meal records for this item
    mealRecords.forEach(record => {
      if (record.userId === userId && record.menuItemId === menuItemId) {
        // If previously liked, decrement likes
        if (record.userRating === 'like') {
          const likeIndex = items.findIndex((i) => i.id === menuItemId);
          if (likeIndex >= 0 && items[likeIndex].likes) {
            items[likeIndex].likes = Math.max(0, (items[likeIndex].likes || 0) - 1);
          }
        }
        record.userRating = 'dislike';
      }
    });
    localStorage.setItem(MEAL_RECORDS_KEY, JSON.stringify(mealRecords));
  }
};

export const getUserRatingForMenuItem = (userId: string, menuItemId: string): 'like' | 'dislike' | null => {
  const records = getMealRecords();
  const userRecordsForItem = records.filter(
    (record) => record.userId === userId && record.menuItemId === menuItemId
  );
  
  // Return the most recent rating
  return userRecordsForItem.length > 0 
    ? userRecordsForItem[userRecordsForItem.length - 1].userRating || null 
    : null;
};
