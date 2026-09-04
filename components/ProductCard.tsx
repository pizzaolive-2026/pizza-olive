"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { formatCents } from "@/lib/money";
import { useCart } from "@/lib/cart-context";

// Same card renders in a multi-column desktop grid and a full-width mobile
// list — controlled entirely by CSS (see globals.css), so no product is ever
// clipped, hidden behind a slider, or dependent on hover.
export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const hasOptions = product.addonGroups.length > 0;

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      unitPriceCents: product.salePriceCents ?? product.priceCents,
    });
  }

  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-card__media">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={320}
            className="product-card__image"
          />
        ) : (
          <div className="product-card__image product-card__image--placeholder" aria-hidden />
        )}
      </Link>

      <div className="product-card__body">
        <h3 className="product-card__name">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        {product.shortDescription && (
          <p className="product-card__desc">{product.shortDescription}</p>
        )}

        <div className="product-card__price">
          {product.salePriceCents ? (
            <>
              <span className="product-card__price--sale">
                {formatCents(product.salePriceCents)}
              </span>
              <span className="product-card__price--regular">
                {formatCents(product.priceCents)}
              </span>
            </>
          ) : (
            <span>{formatCents(product.priceCents)}</span>
          )}
        </div>

        {hasOptions ? (
          <Link href={`/product/${product.slug}`} className="product-card__cta">
            Select options
          </Link>
        ) : (
          <button type="button" className="product-card__cta" onClick={handleAdd}>
            Add to cart
          </button>
        )}
      </div>
    </article>
  );
}
