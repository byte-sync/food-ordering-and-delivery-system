import React from "react";
import DisplayCategories from "@/components/common/categories/categories"; // Adjust the import path as needed
import RestaurantsSlider from "@/components/common/restaurants/restaurantSlider";
function Page() {
  return (
    <div>
      <DisplayCategories />
      <RestaurantsSlider/>
    </div>
  );
}

export default Page;