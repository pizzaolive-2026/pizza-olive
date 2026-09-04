import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { products, getProductBySlug } from "@/data/products";
import { formatCents } from "@/lib/money";
import AddToCartForm from "@/components/AddToCartForm";

// URL pattern preserved exactly: /product/{slug}/
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  return {
    title: product ? `${product.name} – Pizza Olive` : "Pizza Olive",
    description: product?.shortDescription || product?.description,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <article className="product-detail">
      <div className="product-detail__media">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={700}
            height={560}
            priority
          />
        ) : (
          <div className="product-card__image--placeholder" aria-hidden />
        )}
      </div>

      <div className="product-detail__info">
        <h1>{product.name}</h1>
        <p className="product-detail__price">
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
            formatCents(product.priceCents)
          )}
        </p>

        {product.shortDescription && <p>{product.shortDescription}</p>}
        {product.description && <p>{product.description}</p>}

        <AddToCartForm product={product} />
      </div>
    </article>
  );
}
