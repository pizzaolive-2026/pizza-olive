import { defineField, defineType } from "sanity";

export default defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
    }),
    defineField({
      name: "stripeSessionId",
      title: "Stripe Session ID",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Preparing", value: "preparing" },
          { title: "Ready", value: "ready" },
          { title: "Completed", value: "completed" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "fulfillment",
      title: "Fulfillment",
      type: "string",
      options: {
        list: [
          { title: "Pickup", value: "pickup" },
          { title: "Delivery", value: "delivery" },
        ],
      },
    }),
    defineField({
      name: "deliveryAddress",
      title: "Delivery Address",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Product Name", type: "string" }),
            defineField({ name: "quantity", title: "Quantity", type: "number" }),
            defineField({ name: "unitAmountCents", title: "Unit Price (cents)", type: "number" }),
          ],
        },
      ],
    }),
    defineField({
      name: "totalCents",
      title: "Total (cents)",
      type: "number",
    }),
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "orderNumber",
      subtitle: "status",
      date: "createdAt",
    },
    prepare({ title, subtitle, date }) {
      const d = date ? new Date(date).toLocaleString() : "";
      return {
        title: `Order ${title ?? ""}`,
        subtitle: `${subtitle ?? ""} · ${d}`,
      };
    },
  },
});
