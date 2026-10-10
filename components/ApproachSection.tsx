import { site } from '@/data/site';

const { approach } = site;

export default function ApproachSection() {
  return (
    <section className="section feature" id="approach">
      <div className="wrap feature-grid">
        <div className="feature-image">
          <img src={approach.image.src} alt={approach.image.alt} />
          <div className="image-stamp">{approach.image.stamp}</div>
        </div>
        <div className="feature-copy">
          <div className="kicker">{approach.kicker}</div>
          <h2>
            {approach.titleLines[0]}
            <br />
            {approach.titleLines[1]}
          </h2>
          <p>{approach.body}</p>
          <div className="checklist">
            {approach.checklist.map((item) => (
              <div className="check" key={item}>
                <span>✓</span> {item}
              </div>
            ))}
          </div>
          <a className="btn" href={approach.cta.href}>
            {approach.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
