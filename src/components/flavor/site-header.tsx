import { Heart, List } from "@phosphor-icons/react";
import type { Dispatch, SetStateAction } from "react";
import { FlavorSearch } from "./flavor-search";
import type { FlavorPanel } from "./flavors";

export function SiteHeader({
  favorites,
  openPanel,
  select,
  searchOpen,
  setSearchOpen,
}: {
  favorites: string[];
  openPanel: (panel: FlavorPanel) => void;
  select: (index: number) => void;
  searchOpen: boolean;
  setSearchOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <header className="site-header absolute inset-x-0 top-0 flex items-center justify-between">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          className="menu-button grid place-items-center text-white"
          aria-label="Open flavor menu"
          aria-haspopup="dialog"
          onClick={() => openPanel("menu")}
        >
          <List weight="bold" />
        </button>
        <a className="wordmark text-white" href="/" aria-label="Mojito home">
          Mojito
        </a>
      </div>
      <div className="header-actions flex items-center gap-3">
        <FlavorSearch
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          onSelect={select}
        />
        <button
          className="favorites-button relative grid shrink-0 place-items-center rounded-full bg-white"
          aria-label="Open favorite flavors"
          aria-haspopup="dialog"
          onClick={() => openPanel("favorites")}
        >
          <Heart size={25} weight={favorites.length ? "fill" : "regular"} />
          {favorites.length > 0 && (
            <span className="favorite-count absolute grid place-items-center rounded-full bg-[#202532] text-white">
              {favorites.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
