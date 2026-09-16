import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { flavors } from "./flavors";

export function FlavorSearch({
  searchOpen,
  setSearchOpen,
  onSelect,
}: {
  searchOpen: boolean;
  setSearchOpen: Dispatch<SetStateAction<boolean>>;
  onSelect: (index: number) => void;
}) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const search = useRef<HTMLDivElement>(null);
  const matches = flavors.filter((item) =>
    `${item.name} ${item.keywords}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!search.current?.contains(event.target as Node)) setSearchOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [setSearchOpen]);
  function select(index: number) {
    setQuery("");
    setSearchOpen(false);
    onSelect(index);
  }
  return (
    <div
      className={`search-wrap relative ${searchOpen ? "is-open" : ""}`}
      ref={search}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setSearchOpen(false);
      }}
    >
      <form
        role="search"
        className="search-form flex items-center rounded-full bg-white"
        onSubmit={(event) => {
          event.preventDefault();
          if (matches.length) select(flavors.indexOf(matches[0]));
        }}
      >
        <input
          ref={input}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setSearchOpen(false);
              input.current?.blur();
            }
          }}
          aria-label="Search flavors"
          aria-controls={searchOpen ? "flavor-results" : undefined}
          placeholder="Find your fresh favorite..."
          className="min-w-0 flex-1 bg-transparent outline-none"
          autoComplete="off"
        />
        <button
          type="button"
          aria-label="Search flavors"
          className="search-button grid shrink-0 place-items-center rounded-full"
          onClick={() => {
            setSearchOpen((value) => !value);
            input.current?.focus();
          }}
        >
          <MagnifyingGlass size={23} weight="regular" />
        </button>
      </form>
      {searchOpen && (
        <div
          id="flavor-results"
          className="search-results absolute right-0 rounded-3xl bg-white p-3 shadow-xl"
        >
          <p className="px-3 pb-2 pt-1 text-xs font-medium text-[#6a6d75]">
            {query ? "Matching flavors" : "Pick a little sunshine"}
          </p>
          {matches.length ? (
            matches.map((item) => (
              <button
                key={item.id}
                className="result-row flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left hover:bg-[#f4f4f4]"
                onClick={() => select(flavors.indexOf(item))}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: item.color }}
                  />
                  {item.name}
                </span>
                <ArrowRight size={19} />
              </button>
            ))
          ) : (
            <p role="status" className="px-3 py-4 text-sm">
              No flavors found. Try orange, watermelon, lime or blackberry.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
