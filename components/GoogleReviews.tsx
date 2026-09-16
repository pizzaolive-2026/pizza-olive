const REVIEWS = [
  {
    name: "Robert Garcia",
    initial: "R",
    time: "3 months ago",
    text: "Love in every slice! Pizza Olive inside the Village by the Grange food court. Their pizza is the best I have had in the city. Pizza Olive is the one with the most spectacular, memorable first bite! No fancy ingredients just superb quality, crafted pizza.",
    rating: 5,
  },
  {
    name: "Nel D.",
    initial: "N",
    time: "1 month ago",
    text: "The best pizza in downtown Toronto. Great customer service. A must-try pizza specially the Philly steak pizza.",
    rating: 5,
  },
  {
    name: "Mac M.",
    initial: "M",
    time: "2 months ago",
    text: "Great pizza and service. Love the little patio to sit outside as well. Always fresh pizza and no warming lights cooked pizza that has been sitting there for hours!",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="reviews__stars">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

export default function GoogleReviews() {
  return (
    <section className="reviews">
      <div className="reviews__header">
        <svg className="reviews__google-icon" width="24" height="24" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <div>
          <span className="reviews__score">4.9</span>
          <Stars count={5} />
        </div>
        <span className="reviews__count">Based on 362+ Google Reviews</span>
      </div>

      <div className="reviews__grid">
        {REVIEWS.map((review) => (
          <div key={review.name} className="reviews__card">
            <div className="reviews__card-top">
              <div className="reviews__avatar">{review.initial}</div>
              <div>
                <div className="reviews__name">{review.name}</div>
                <div className="reviews__time">{review.time} on Google</div>
              </div>
              <Stars count={review.rating} />
            </div>
            <p className="reviews__text">&ldquo;{review.text}&rdquo;</p>
          </div>
        ))}
      </div>
    </section>
  );
}
