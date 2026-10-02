import type { Metadata } from "next";
import OrdersDashboard from "@/components/OrdersDashboard";

export const metadata: Metadata = {
  title: "Orders – Pizza Olive",
};

export default function OrdersPage() {
  return <OrdersDashboard />;
}
