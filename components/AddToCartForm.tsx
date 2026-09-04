"use client";

import { useMemo, useState } from "react";
import type { Product, AddonGroup } from "@/types/product";
import { useCart } from "@/lib/cart-context";
import { formatCents } from "@/lib/money";

type Selection = Record<string, string[]>; // groupName -> selected option names

export default function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [selection, setSelection] = useState<Selection>({});
  const [added, setAdded] = useState(false);

  const basePriceCents = product.salePriceCents ?? product.priceCents;

  function optionsForGroup(group: AddonGroup) {
    return group.options;
  }

  function isSelected(group: AddonGroup, optionName: string) {
    return (selection[group.name] ?? []).includes(optionName);
  }

  function toggleRadio(group: AddonGroup, optionName: string) {
    setSelection((prev) => ({ ...prev, [group.name]: [optionName] }));
  }

  function toggleCheckbox(group: AddonGroup, optionName: string) {
    setSelection((prev) => {
      const current = prev[group.name] ?? [];
      const next = current.includes(optionName)
        ? current.filter((n) => n !== optionName)
        : group.selectExactly && current.length >= group.selectExactly
        ? current // at the select-exactly cap; ignore further picks until one is unchecked
        : [...current, optionName];
      return { ...prev, [group.name]: next };
    });
  }

  function setSelectValue(group: AddonGroup, optionName: string) {
    setSelection((prev) => ({ ...prev, [group.name]: optionName ? [optionName] : [] }));
  }

  const optionsTotalCents = useMemo(() => {
    let total = 0;
    for (const group of product.addonGroups) {
      const chosen = selection[group.name] ?? [];
      for (const optionName of chosen) {
        const option = group.options.find((o) => o.name === optionName);
        if (option) total += option.priceDeltaCents;
      }
    }
    return total;
  }, [selection, product.addonGroups]);

  const grandTotalCents = basePriceCents + optionsTotalCents;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const selectedAddons = product.addonGroups.flatMap((group) =>
      (selection[group.name] ?? []).map((optionName) => {
        const option = group.options.find((o) => o.name === optionName);
        return {
          groupName: group.name,
          optionName,
          priceDeltaCents: option?.priceDeltaCents ?? 0,
        };
      })
    );

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        unitPriceCents: grandTotalCents,
        specialInstructions: instructions || undefined,
        selectedAddons: selectedAddons.length > 0 ? selectedAddons : undefined,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <form className="add-to-cart-form" onSubmit={handleSubmit}>
      {product.includedAddons.length > 0 && (
        <fieldset>
          <legend>Included</legend>
          <ul>
            {product.includedAddons.map((addon) => (
              <li key={addon}>{addon}</li>
            ))}
          </ul>
        </fieldset>
      )}

      {product.addonGroups.map((group) => (
        <fieldset key={group.name} className="addon-group">
          <legend>
            {group.name}
            {group.needsConfirmation && (
              <span className="addon-group__flag"> (NEEDS CONFIRMATION)</span>
            )}
            {group.selectExactly && (
              <span className="addon-group__hint"> — Select {group.selectExactly} options</span>
            )}
          </legend>

          {group.type === "select" ? (
            <select
              value={(selection[group.name] ?? [])[0] ?? ""}
              onChange={(e) => setSelectValue(group, e.target.value)}
            >
              <option value="">Choose an option</option>
              {optionsForGroup(group).map((option) => (
                <option key={option.name} value={option.name}>
                  {option.name}
                  {option.priceDeltaCents > 0 ? ` (+${formatCents(option.priceDeltaCents)})` : ""}
                </option>
              ))}
            </select>
          ) : (
            <ul className="addon-group__options">
              {optionsForGroup(group).map((option, i) => (
                <li key={`${option.name}-${i}`}>
                  <label>
                    <input
                      type={group.type}
                      name={group.type === "radio" ? group.name : undefined}
                      checked={isSelected(group, option.name)}
                      onChange={() =>
                        group.type === "radio"
                          ? toggleRadio(group, option.name)
                          : toggleCheckbox(group, option.name)
                      }
                    />
                    {option.name}
                    {option.priceDeltaCents > 0 && (
                      <span className="addon-group__price"> (+{formatCents(option.priceDeltaCents)})</span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </fieldset>
      ))}

      <label className="add-to-cart-form__instructions">
        Special instructions
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={2}
        />
      </label>

      <div className="add-to-cart-form__totals">
        <div>
          <span>Product total</span>
          <span>{formatCents(basePriceCents)}</span>
        </div>
        <div>
          <span>Options total</span>
          <span>{formatCents(optionsTotalCents)}</span>
        </div>
        <div className="add-to-cart-form__grand-total">
          <span>Grand total</span>
          <span>{formatCents(grandTotalCents)}</span>
        </div>
      </div>

      <div className="add-to-cart-form__qty">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
        >
          &minus;
        </button>
        <span>{quantity}</span>
        <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
          +
        </button>
      </div>

      <button type="submit" className="product-card__cta">
        {added ? "Added!" : "Add to Cart"}
      </button>
    </form>
  );
}
