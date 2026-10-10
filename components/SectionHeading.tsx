type SectionHeadingProps = {
  kicker: string;
  title: string;
  description?: string;
};

export default function SectionHeading({
  kicker,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="section-head">
      <div>
        <div className="kicker">{kicker}</div>
        <h2>{title}</h2>
      </div>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
