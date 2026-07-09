import { Cog } from "lucide-react";

type ProductImageProps = {
  image?: string;
  alt?: string;
  className?: string;
};

export function ProductImage({ image, alt = "Product", className = "" }: ProductImageProps) {
  return (
    <div className={`relative overflow-hidden bg-surface ${className}`}>
      {image ? (
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
      ) : null}

      <div
        className={`absolute inset-0 flex items-center justify-center bg-surface ${
          image ? "hidden" : ""
        }`}
      >
        <Cog className="h-16 w-16 text-muted-foreground" />
      </div>
    </div>
  );
}
