import Image from "next/image";
import type { ReactNode } from "react";

type IllustrationName =
  | "buy-vs-lease"
  | "depreciation"
  | "car-loans"
  | "insurance"
  | "electric-vs-gasoline"
  | "tax-benefits"
  | "about";

type GuideHeroProps = {
  illustration: IllustrationName;
  /** The page title, shown beside the illustration in one strip. */
  title: ReactNode;
};

// Bento-style illustrations (black / lime on the site's warm grey), one per guide.
// Each one shows a figure from its guide: depreciation by year, loan interest vs
// principal with a balloon, nested insurance cover, yearly energy cost, the 45% rule.
const imageMap: Record<IllustrationName, { src: string; alt: string }> = {
  "buy-vs-lease": { src: "/images/guides/buy-vs-lease.png", alt: "Buying (owning the car) vs leasing (monthly payments)" },
  depreciation: { src: "/images/guides/depreciation.png", alt: "Car value by year: 100%, 85%, 75%, 67%, 61%, 55%" },
  "car-loans": { src: "/images/guides/car-loans.png", alt: "Loan payments split into interest and principal, with a balloon payment at the end" },
  insurance: { src: "/images/guides/insurance.png", alt: "Mandatory, third-party and comprehensive insurance as nested layers of cover" },
  "electric-vs-gasoline": { src: "/images/guides/electric-vs-gasoline.png", alt: "Yearly energy cost for 15,000 km: petrol 7,700, public fast charging 4,500, home charging 1,500 ILS" },
  "tax-benefits": { src: "/images/guides/tax-benefits.png", alt: "45% of car expenses recognised for tax" },
  about: { src: "/images/guides/about.png", alt: "About CarCalc" },
};

/**
 * Page header strip: the illustration on the reading-start side (right in Hebrew)
 * and the title beside it, sized to the illustration's height.
 */
export default function GuideHero({ illustration, title }: GuideHeroProps) {
  const { src, alt } = imageMap[illustration];
  return (
    <div className="mb-10 flex items-center gap-4 sm:gap-7">
      <Image
        src={src}
        alt={alt}
        width={1440}
        height={960}
        sizes="(min-width: 640px) 280px, 132px"
        className="h-auto w-[132px] shrink-0 rounded-[14px] sm:w-[280px] sm:rounded-[22px]"
        priority
      />
      <h1 className="min-w-0 flex-1 text-[23px] sm:text-[44px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink text-balance">
        {title}
      </h1>
    </div>
  );
}
