import { ArrowRight, Check, Heart, X } from "@phosphor-icons/react";
import type { RefObject } from "react";
import { flavors, type Flavor, type FlavorPanel } from "./flavors";

export function FlavorDialog({
  dialog,
  panel,
  favorites,
  flavor,
  select,
  toggleFavorite,
}: {
  dialog: RefObject<HTMLDialogElement | null>;
  panel: FlavorPanel;
  favorites: string[];
  flavor: Flavor;
  select: (index: number) => void;
  toggleFavorite: (id: string) => void;
}) {
  return (
    <dialog
      ref={dialog}
      className="flavor-dialog m-auto w-[calc(100%-2rem)] max-w-lg rounded-[28px] bg-white p-6 text-[#202532] sm:p-9"
      aria-labelledby="dialog-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            dialog.current?.close();
        }
      }}
    >
      <div className="mb-7 flex items-center justify-between gap-4">
        <h2 id="dialog-title" className="text-3xl font-bold tracking-tight">
          {panel === "menu" ? "Find your flavor." : "Your fresh favorites."}
        </h2>
        <button
          autoFocus
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f4f4f4]"
          aria-label="Close dialog"
          onClick={() => dialog.current?.close()}
        >
          <X size={21} />
        </button>
      </div>
      {panel === "favorites" && favorites.length === 0 && (
        <p className="mb-6 text-[#64666b]">
          A flavor you love? Tap its heart to save it here for your next visit.
        </p>
      )}
      <div className="grid gap-2">
        {flavors
          .filter(
            (item) =>
              panel === "menu" ||
              !favorites.length ||
              favorites.includes(item.id),
          )
          .map((item) => (
            <div
              key={item.id}
              className="dialog-flavor flex items-center gap-2 rounded-2xl bg-[#f7f7f7] p-2"
            >
              <button
                className="flex min-w-0 flex-1 items-center gap-4 rounded-xl p-3 text-left"
                onClick={() => select(flavors.indexOf(item))}
              >
                <span
                  className="h-9 w-9 shrink-0 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="flex-1 text-lg font-semibold">
                  {item.name}
                </span>
                {item.id === flavor.id ? (
                  <Check size={21} />
                ) : (
                  <ArrowRight size={21} />
                )}
              </button>
              <button
                className="heart-toggle grid h-12 w-12 shrink-0 place-items-center rounded-full"
                aria-label={`${favorites.includes(item.id) ? "Remove" : "Save"} ${item.name} ${favorites.includes(item.id) ? "from" : "to"} favorites`}
                aria-pressed={favorites.includes(item.id)}
                onClick={() => toggleFavorite(item.id)}
              >
                <Heart
                  size={23}
                  weight={favorites.includes(item.id) ? "fill" : "regular"}
                  style={{
                    color: favorites.includes(item.id) ? item.color : undefined,
                  }}
                />
              </button>
            </div>
          ))}
      </div>
      <p className="mt-7 text-sm text-[#676a70]">
        Four flavors. A little sip of sunshine.
      </p>
    </dialog>
  );
}
