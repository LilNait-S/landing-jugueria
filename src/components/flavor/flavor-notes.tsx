import { flavors, type Flavor } from "./flavors";

export function FlavorNotes({ flavor, previous, serial }: {
  flavor: Flavor;
  previous?: Flavor;
  serial: number;
}) {
  return (
    <div
      className="flavor-notes pointer-events-none absolute inset-0 select-none text-white"
      aria-hidden="true"
    >
      {(["left", "right"] as const).map((side, index) => (
        <span key={side} className={`note note-${side}`}>
          <span className="note-window">
            {/* Reserve the same space for every flavor, even after outgoing text unmounts. */}
            {flavors.map((item) => (
              <span key={`size-${item.id}`} className="note-sizer">
                {item.words[index]}
              </span>
            ))}
            {previous && (
              <span key={`out-${serial}`} className="note-outgoing">
                {previous.words[index]}
              </span>
            )}
            <span key={`in-${serial}`} className={previous ? "note-incoming" : "note-rest"}>
              {flavor.words[index]}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
