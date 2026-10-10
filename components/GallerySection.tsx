import SectionHeading from '@/components/SectionHeading';
import { site } from '@/data/site';

const { gallery } = site;

export default function GallerySection() {
  return (
    <section className="gallery-section" id="gallery">
      <div className="wrap">
        <SectionHeading kicker={gallery.kicker} title={gallery.title} />
        <div className="gallery-grid">
          {gallery.images.map((image, index) => (
            <div className="gallery-item" key={`gallery-${index + 1}`}>
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
