import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us – Pizza Olive",
  description: "Visit Pizza Olive at 275 Dundas St W, Toronto. Call us at (647) 221-1145 or email info@pizzaolive.ca.",
  alternates: { canonical: "/contact-us" },
};

export default function ContactPage() {
  return (
    <section style={{ maxWidth: 700, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "2rem", color: "#111" }}>Contact Us</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>

        {/* Address */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>📍</span>
          <div>
            <div style={{ fontWeight: 700, color: "#111", marginBottom: "0.2rem" }}>Address</div>
            <a
              href="https://maps.google.com/?q=275+Dundas+St+W,+Toronto,+Canada+M5T+3K1"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#dc2626", textDecoration: "none", fontSize: "1rem" }}
            >
              275 Dundas St W, Toronto, Canada M5T 3K1
            </a>
          </div>
        </div>

        {/* Phone */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>📞</span>
          <div>
            <div style={{ fontWeight: 700, color: "#111", marginBottom: "0.2rem" }}>Phone</div>
            <a
              href="tel:+16472211145"
              style={{ color: "#dc2626", textDecoration: "none", fontSize: "1rem" }}
            >
              (647) 221-1145
            </a>
          </div>
        </div>

        {/* Email */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>✉️</span>
          <div>
            <div style={{ fontWeight: 700, color: "#111", marginBottom: "0.2rem" }}>Email</div>
            <a
              href="mailto:info@pizzaolive.ca"
              style={{ color: "#dc2626", textDecoration: "none", fontSize: "1rem" }}
            >
              info@pizzaolive.ca
            </a>
          </div>
        </div>

      </div>

      {/* Google Map embed */}
      <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
        <iframe
          title="Pizza Olive location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.6!2d-79.3939!3d43.6533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34c67b7a7a7b%3A0x1!2s275+Dundas+St+W%2C+Toronto%2C+ON+M5T+3K1!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
          width="100%"
          height="380"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
