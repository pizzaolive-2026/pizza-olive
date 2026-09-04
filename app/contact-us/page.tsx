import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us – Pizza Olive",
};

export default function ContactPage() {
  return (
    <section className="contact-page">
      <h1>Contact Us</h1>
      <p>275 Dundas St W, Toronto, Canada M5T 3K1</p>
      <p>(647) 221-1145</p>
      <p>info@pizzaolive.ca</p>
      {/* NEEDS CONFIRMATION: original contact page content (map embed, contact
          form fields, additional copy) — I was unable to fetch this page's
          full markup during this session; paste its content here to fill in
          exactly, or point me at it again and I'll pull it in. */}
    </section>
  );
}
