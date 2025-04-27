import React from "react";
import DisplayCategories from "@/components/common/categories/categories"; // Adjust the import path as needed
import RestaurantsSlider from "@/components/common/restaurants/restaurantSlider";
import MenuItemsWithOffers from "@/components/customer/offer-menu-items";
function Page() {
  return (
    <div>
      <MenuItemsWithOffers/>
      <DisplayCategories />
      <RestaurantsSlider/>
    </div>
  );
}

export default Page;