import Brand from '@/components/Brand';
import { site } from '@/data/site';

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <Brand />
        <small>
          © {new Date().getFullYear()} {site.brand.copyrightName}. All rights
          reserved.
          <br />
          {site.brand.tagline}
        </small>
        <div className="footer-links">
          {site.footerLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a
            href="https://www.instagram.com/hopkinstalentgroup/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
