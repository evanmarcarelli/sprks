import type { Product } from "@/lib/products";
import { ArrowUpRight } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative overflow-hidden border border-border bg-card transition-all hover:border-silver/40">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/0 to-card/0 opacity-60" />
        <div className="absolute inset-x-0 bottom-0 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 p-5">
          <p className="text-xs text-muted-foreground leading-relaxed">{product.blurb}</p>
        </div>
      </div>
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.3em] text-silver">{product.brand}</p>
          <h3 className="mt-2 font-serif text-xl leading-tight truncate">{product.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            ${product.price.toLocaleString()}
          </p>
        </div>
        <button
          className="shrink-0 grid place-items-center h-10 w-10 border border-border rounded-full text-muted-foreground transition-all group-hover:border-silver group-hover:text-foreground group-hover:rotate-45"
          aria-label={`View ${product.name}`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
