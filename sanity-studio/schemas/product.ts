import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "priceCents",
      title: "Price (cents)",
      type: "number",
      description: "Price in integer cents, e.g. 899 = $8.99",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "salePriceCents",
      title: "Sale Price (cents)",
      type: "number",
      description: "Optional sale price in cents. Leave empty for no sale.",
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "addonGroups",
      title: "Add-on Groups (Size, Toppings, Dips, etc.)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "addonGroup",
          title: "Add-on Group",
          fields: [
            defineField({
              name: "name",
              title: "Group Name",
              type: "string",
              description: 'e.g. "Size", "Add Cheese Toppings", "Choose Dip"',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "type",
              title: "Selection Type",
              type: "string",
              options: {
                list: [
                  { title: "Radio (pick one)", value: "radio" },
                  { title: "Checkbox (pick many)", value: "checkbox" },
                  { title: "Dropdown", value: "select" },
                ],
              },
              initialValue: "checkbox",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "selectExactly",
              title: "Select Exactly N",
              type: "number",
              description: "For checkbox groups: require exactly this many selections (e.g. 2 for drinks). Leave empty for no limit.",
            }),
            defineField({
              name: "options",
              title: "Options",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "addonOption",
                  title: "Option",
                  fields: [
                    defineField({
                      name: "name",
                      title: "Option Name",
                      type: "string",
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: "priceDeltaCents",
                      title: "Price Upcharge (cents)",
                      type: "number",
                      description: "Extra cost in cents. 0 for free options.",
                      initialValue: 0,
                      validation: (r) => r.required().min(0),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "includedAddons",
      title: "Included Add-ons (display only)",
      type: "array",
      of: [{ type: "string" }],
      description: "Items listed as included, e.g. Garlic Aioli Dip",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.name",
      media: "image",
    },
  },
  orderings: [
    { title: "Name", name: "name", by: [{ field: "name", direction: "asc" }] },
    { title: "Price", name: "price", by: [{ field: "priceCents", direction: "asc" }] },
  ],
});
