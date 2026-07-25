/**
 * Renders the given partners twice back-to-back and animates the whole strip
 * left with a CSS keyframe (translateX 0 -> -50%), which creates a seamless
 * infinite loop. Hovering pauses the animation (see .partner-track:hover in CSS).
 */
export default function PartnerSlider({ partners = [], speedSeconds = 30 }) {
  if (!partners.length) return null;

  const doubled = [...partners, ...partners];

  return (
    <div className="partner-slider">
      <div className="partner-track" style={{ animationDuration: `${speedSeconds}s` }}>
        {doubled.map((p, i) => (
          <a
            key={`${p._id}-${i}`}
            href={p.websiteUrl || undefined}
            target={p.websiteUrl ? "_blank" : undefined}
            rel={p.websiteUrl ? "noreferrer" : undefined}
            className="partner-logo"
            title={p.name}
            onClick={(e) => {
              if (!p.websiteUrl) e.preventDefault();
            }}
          >
            <img src={p.logoUrl} alt={p.name} />
          </a>
        ))}
      </div>
    </div>
  );
}
