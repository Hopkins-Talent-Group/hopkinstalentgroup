import { site } from '@/data/site';

type BrandProps = {
  href?: string;
};

export default function Brand({ href = '#home' }: BrandProps) {
  return (
    <a className="brand" href={href}>
      <span className="crest">{site.brand.crest}</span>
      <span className="brand-name">
        {site.brand.name}
        <span className="brand-sub">{site.brand.sub}</span>
      </span>
    </a>
  );
}
