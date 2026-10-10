import SectionHeading from '@/components/SectionHeading';
import { site } from '@/data/site';

const { services } = site;

export default function ServicesSection() {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <SectionHeading
          kicker={services.kicker}
          title={services.title}
          description={services.body}
        />
        <div className="services">
          {services.items.map((service) => (
            <article className="service" key={service.num}>
              <div className="service-top">
                <span className="service-num">{service.num}</span>
                <span className="service-icon">{service.icon}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <a href={service.link.href}>{service.link.label}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
