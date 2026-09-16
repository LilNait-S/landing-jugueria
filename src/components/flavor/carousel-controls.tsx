import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { flavors } from "./flavors";

export function CarouselControls({
  active,
  select,
  setActive,
}: {
  active: number;
  select: (index: number) => void;
  setActive: Dispatch<SetStateAction<number>>;
}) {
  return (
    <nav className="carousel-controls" aria-label="Choose a flavor">
      <div className="flavor-dots flex items-center justify-center gap-3">
        {flavors.map((item, index) => (
          <button
            key={item.id}
            className={`dot-button grid place-items-center rounded-full ${index === active ? "selected" : ""}`}
            style={{ "--dot-color": item.color } as CSSProperties}
            aria-label={`Show ${item.name}`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => select(index)}
          >
            <span />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button
          className="arrow-button grid place-items-center rounded-full"
          aria-label="Previous flavor"
          onClick={() =>
            setActive(
              (current) => (current - 1 + flavors.length) % flavors.length,
            )
          }
        >
          <ArrowLeft weight="regular" />
        </button>
        <button
          className="arrow-button grid place-items-center rounded-full"
          aria-label="Next flavor"
          onClick={() => setActive((current) => (current + 1) % flavors.length)}
        >
          <ArrowRight weight="regular" />
        </button>
      </div>
    </nav>
  );
}
