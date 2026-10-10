import { site } from '@/data/site';

const { hero } = site;

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="kicker">{hero.kicker}</div>
          <h1>
            {hero.title.lead}
            <span>{hero.title.highlight}</span>
            {hero.title.tail}
          </h1>
          <p>{hero.body}</p>
          <div className="hero-actions">
            <a className="btn" href={hero.primaryCta.href}>
              {hero.primaryCta.label} <span>↗</span>
            </a>
            <a className="btn secondary" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </a>
          </div>
          <div className="hero-stats">
            {hero.stats.map((stat) => (
              <div className="stat" key={stat.strong}>
                <strong>{stat.strong}</strong>
                <small>{stat.small}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <img src={hero.photo} alt={hero.photoAlt} />
          <div className="visual-tag">
            <div>
              <strong>{hero.photoTag.strong}</strong>
              <span>{hero.photoTag.span}</span>
            </div>
            <div className="live-mark">{hero.photoTag.mark}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
