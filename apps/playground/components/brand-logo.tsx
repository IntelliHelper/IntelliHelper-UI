import Image from "next/image";
import { BRAND_NAME, LOGO_PATH } from "../lib/seo";

type BrandLogoProps = {
  size?: number;
  className?: string;
  showLabel?: boolean;
};

export function BrandLogo({
  size = 40,
  className,
  showLabel = false,
}: BrandLogoProps) {
  return (
    <div className={className}>
      <Image
        src={LOGO_PATH}
        alt={`${BRAND_NAME} logo`}
        width={size}
        height={size}
        className="rounded-lg"
        priority
      />
      {showLabel ? (
        <span className="sr-only">{BRAND_NAME}</span>
      ) : null}
    </div>
  );
}