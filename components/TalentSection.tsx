import SectionHeading from '@/components/SectionHeading';
import { site } from '@/data/site';

const { talent } = site;

export default function TalentSection() {
  return (
    <section className="section roster" id="talent">
      <div className="wrap">
        <SectionHeading
          kicker={talent.kicker}
          title={talent.title}
          description={talent.body}
        />
        <div className="roster-grid">
          {talent.artists.map((artist) => (
            <article className="artist-card" key={artist.name}>
              <div className="artist-photo">
                <img src={artist.photo} alt={artist.alt} />
                <span className="artist-label">{artist.label}</span>
              </div>
              <div className="artist-info">
                <h3>{artist.name}</h3>
                <p>{artist.bio}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="roster-foot">{talent.foot}</div>
      </div>
    </section>
  );
}
