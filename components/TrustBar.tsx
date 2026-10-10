import { site } from '@/data/site';

export default function TrustBar() {
  return (
    <section className="trustbar">
      <div className="wrap trust-inner">
        {site.trustBar.map((item) => (
          <div className="trust-item" key={item.strong}>
            <span className="trust-icon">{item.icon}</span>
            <div>
              <strong>{item.strong}</strong>
              <small>{item.small}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
