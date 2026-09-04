export default function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <section className="checkout-page">
      <h1>Thank you for your order!</h1>
      <p>
        We&apos;ve received your payment
        {searchParams.session_id ? ` (ref: ${searchParams.session_id})` : ""}.
        You&apos;ll receive a confirmation shortly.
      </p>
    </section>
  );
}
