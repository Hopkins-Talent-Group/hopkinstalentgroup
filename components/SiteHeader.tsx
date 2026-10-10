import Brand from '@/components/Brand';
import { site } from '@/data/site';

export default function SiteHeader() {
  return (
    <header className="topbar">
      <div className="wrap nav">
        <Brand />
        <nav className="navlinks" aria-label="Main navigation">
          {site.navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#contact">
          Book / Inquire <span>↗</span>
        </a>
      </div>
    </header>
  );
}
