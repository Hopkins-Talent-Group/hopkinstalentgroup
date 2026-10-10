import InquiryForm from '@/components/InquiryForm';
import { site } from '@/data/site';

const { contact } = site;

export default function ContactSection() {
  return (
    <section className="contact" id="contact">
      <div className="wrap contact-grid">
        <div className="contact-copy">
          <div className="kicker">{contact.kicker}</div>
          <h2>
            {contact.titleLines[0]}
            <br />
            {contact.titleLines[1]}
          </h2>
          <p>{contact.body}</p>
          <div className="contact-points">
            {contact.points.map((point) => (
              <div key={point.strong}>
                <strong>{point.strong}</strong>
                {point.body}
              </div>
            ))}
          </div>
        </div>
        <InquiryForm />
      </div>
    </section>
  );
}
