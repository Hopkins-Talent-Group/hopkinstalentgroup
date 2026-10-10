import { site } from '@/data/site';

const { quote } = site;

export default function QuoteSection() {
  return (
    <section className="quote-section">
      <div className="wrap quote-inner">
        <div className="quote-mark">“</div>
        <div>
          <blockquote>
            {quote.lines[0]}
            <br />
            <em>{quote.lines[1]}</em>
          </blockquote>
          <p>{quote.attribution}</p>
        </div>
      </div>
    </section>
  );
}
