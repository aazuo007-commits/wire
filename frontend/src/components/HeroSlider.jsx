import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const AUTO_ROTATE_MS = 4500; // within the requested 3-5s range

export default function HeroSlider({ slides }) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i) => {
    setIndex((i + slides.length) % slides.length);
  }, [slides.length]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(next, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (!slides.length) return null;

  return (
    <section className="hero-slider">
      {slides.map((slide, i) => (
        <div
          key={slide._id}
          className={`hero-slide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        >
          <div className="hero-slide-overlay">
            <div className="container hero-slide-content">
              <h1>{slide.title}</h1>
              {slide.subtitle && <p>{slide.subtitle}</p>}
              {slide.buttonText && (
                <Link to={slide.buttonLink || "/services"} className="btn btn-primary">
                  {slide.buttonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button className="hero-nav hero-nav-prev" onClick={prev} aria-label="Previous slide">‹</button>
          <button className="hero-nav hero-nav-next" onClick={next} aria-label="Next slide">›</button>

          <div className="hero-dots">
            {slides.map((slide, i) => (
              <button
                key={slide._id}
                className={`hero-dot ${i === index ? "active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
