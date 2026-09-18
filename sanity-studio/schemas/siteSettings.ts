import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      initialValue: "Pizza Olive",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      initialValue: "Authentic Italian Pizza & Pasta",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "hours",
      title: "Business Hours",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "hoursEntry",
          fields: [
            defineField({ name: "day", title: "Day", type: "string" }),
            defineField({ name: "time", title: "Hours", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "footerImage",
      title: "Footer Background Image",
      type: "image",
    }),
  ],
  // Singleton: only one site settings document
  __experimental_actions: ["update", "publish"],
});
