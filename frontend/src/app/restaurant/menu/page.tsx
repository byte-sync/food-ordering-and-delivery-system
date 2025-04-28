import MenuItems from "@/components/restaurant/menu-items";

// Fetch menu items on the server side
async function fetchMenuItems() {
  const response = await fetch("http://localhost:8083/menu/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch menu items");
  }

  return response.json();
}

export default async function MenuPage() {
  const menuItems = await fetchMenuItems();

  return (
    <div>
      <MenuItems menuItems={menuItems} />
    </div>
  );
}