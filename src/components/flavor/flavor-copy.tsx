import type { Flavor } from "./flavors";

export function FlavorCopy({
  flavor,
  previous,
  serial,
  imageFailed,
}: {
  flavor: Flavor;
  previous?: Flavor;
  serial: number;
  imageFailed: boolean;
}) {
  return (
    <div className="flavor-copy" aria-live="polite" aria-atomic="true">
      <div className="copy-window">
        {previous && (
          <div
            key={`out-${serial}`}
            className="copy-outgoing"
            aria-hidden="true"
          >
            <h2 className="copy-title" style={{ color: previous.color }}>
              {previous.name}
            </h2>
            <p>{previous.description}</p>
          </div>
        )}
        <div
          key={`in-${serial}`}
          className={previous ? "copy-incoming" : "copy-rest"}
        >
          <h1 id="flavor-title" tabIndex={-1}>
            {flavor.name}
          </h1>
          <p>{flavor.description}</p>
        </div>
      </div>
      {imageFailed && (
        <p className="image-error" role="status">
          The artwork couldn’t load. Please refresh to try again.
        </p>
      )}
    </div>
  );
}
