import Image from "next/image";

type GuideHeroProps = {
  illustration: "buy-vs-lease" | "depreciation" | "car-loans" | "insurance" | "electric-vs-gasoline" | "tax-benefits" | "about";
};

const imageMap: Record<GuideHeroProps["illustration"], { src: string; alt: string }> = {
  "buy-vs-lease": { src: "/images/1.png", alt: "Buying vs Leasing" },
  depreciation: { src: "/images/2.png", alt: "Car Depreciation" },
  "car-loans": { src: "/images/3.png", alt: "Car Loans" },
  insurance: { src: "/images/4.png", alt: "Car Insurance" },
  "electric-vs-gasoline": { src: "/images/5.png", alt: "Electric vs Gasoline" },
  "tax-benefits": { src: "/images/6.png", alt: "Tax Benefits" },
  about: { src: "/images/7.png", alt: "About CarCalc" },
};

export default function GuideHero({ illustration }: GuideHeroProps) {
  const { src, alt } = imageMap[illustration];
  return (
    <div className="mb-8 flex justify-center">
      <Image
        src={src}
        alt={alt}
        width={480}
        height={320}
        className="rounded-xl"
        priority
      />
    </div>
  );
}
