import Image from "next/image";

type GuideHeroProps = {
  illustration: "buy-vs-lease" | "depreciation" | "car-loans" | "insurance" | "electric-vs-gasoline" | "tax-benefits" | "about";
};

// Bento-style illustrations (black / lime on the site's warm grey), one per guide.
// Each one shows a figure from its guide: depreciation by year, loan interest vs
// principal with a balloon, nested insurance cover, yearly energy cost, the 45% rule.
const imageMap: Record<GuideHeroProps["illustration"], { src: string; alt: string }> = {
  "buy-vs-lease": { src: "/images/guides/buy-vs-lease.png", alt: "Buying (owning the car) vs leasing (monthly payments)" },
  depreciation: { src: "/images/guides/depreciation.png", alt: "Car value by year: 100%, 85%, 75%, 67%, 61%, 55%" },
  "car-loans": { src: "/images/guides/car-loans.png", alt: "Loan payments split into interest and principal, with a balloon payment at the end" },
  insurance: { src: "/images/guides/insurance.png", alt: "Mandatory, third-party and comprehensive insurance as nested layers of cover" },
  "electric-vs-gasoline": { src: "/images/guides/electric-vs-gasoline.png", alt: "Yearly energy cost for 15,000 km: petrol 7,700, public fast charging 4,500, home charging 1,500 ILS" },
  "tax-benefits": { src: "/images/guides/tax-benefits.png", alt: "45% of car expenses recognised for tax" },
  about: { src: "/images/guides/about.png", alt: "About CarCalc" },
};

export default function GuideHero({ illustration }: GuideHeroProps) {
  const { src, alt } = imageMap[illustration];
  return (
    <div className="mb-8">
      <Image
        src={src}
        alt={alt}
        width={1440}
        height={960}
        sizes="(min-width: 768px) 720px, 100vw"
        className="w-full h-auto rounded-[28px]"
        priority
      />
    </div>
  );
}
