"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { flavors } from "./flavor/flavors";
import { SiteHeader } from "./flavor/site-header";
import { FlavorArtwork } from "./flavor/flavor-artwork";
import { FlavorNotes } from "./flavor/flavor-notes";
import { FlavorCopy } from "./flavor/flavor-copy";
import { CarouselControls } from "./flavor/carousel-controls";
import { FlavorDialog } from "./flavor/flavor-dialog";
import {
  useFlavorTransition,
} from "./flavor/use-flavor-transition";
import { cupMotionStyles } from "./flavor/cup-motion";

export function FlavorExperience() {
  const { active, previous, serial, setActive } = useFlavorTransition(3);
  const [searchOpen, setSearchOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [panel, setPanel] = useState<"menu" | "favorites">("menu");
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const flavor = flavors[active];

  useEffect(() => {
    try {
      const value: unknown = JSON.parse(
        localStorage.getItem("mojito-favorites") || "[]",
      );
      if (Array.isArray(value))
        setFavorites(
          value.filter(
            (id): id is string =>
              typeof id === "string" && flavors.some((f) => f.id === id),
          ),
        );
    } catch {
      /* Favorites remain usable when storage is unavailable. */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("mojito-favorites", JSON.stringify(favorites));
    } catch {
      /* Private browsing can disable storage. */
    }
  }, [favorites, ready]);

  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (
        dialog.current?.open ||
        event.target instanceof HTMLInputElement ||
        event.altKey ||
        event.metaKey ||
        event.ctrlKey
      )
        return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        setActive(
          (current) =>
            (current + (event.key === "ArrowRight" ? 1 : -1) + flavors.length) %
            flavors.length,
        );
      }
    }
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, []);

  function select(index: number) {
    setActive(index);
    setSearchOpen(false);
    dialog.current?.close();
  }
  function openPanel(nextPanel: "menu" | "favorites") {
    setPanel(nextPanel);
    setSearchOpen(false);
    dialog.current?.showModal();
  }
  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function reportImageError(id: string) {
    setFailedImages((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }

  return (
    <main
      className="experience relative isolate min-h-[100dvh] overflow-hidden bg-white text-[#202532]"
      style={
        {
          "--flavor": flavor.color,
          "--flavor-bg": flavor.bg,
          ...cupMotionStyles,
        } as CSSProperties
      }
    >
      <a href="#flavor-title" className="skip-link">
        Skip to flavor
      </a>
      <SiteHeader
        favorites={favorites}
        openPanel={openPanel}
        select={select}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
      />

      <section
        className="flavor-stage"
        data-transitioning={previous !== null}
        aria-roledescription="carousel"
        aria-label="Mojito flavors"
        onTouchStart={(event) => {
          const t = event.touches[0];
          touchStart.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (
            !start ||
            (event.target as HTMLElement).closest("button, a, input")
          )
            return;
          const t = event.changedTouches[0];
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5)
            setActive(
              (current) =>
                (current + (dx < 0 ? 1 : -1) + flavors.length) % flavors.length,
            );
        }}
      >
        <FlavorArtwork
          active={active}
          previous={previous}
          serial={serial}
          onError={reportImageError}
        />
        <FlavorNotes
          flavor={flavor}
          previous={previous === null ? undefined : flavors[previous]}
          serial={serial}
        />
        <FlavorCopy
          flavor={flavor}
          previous={previous === null ? undefined : flavors[previous]}
          serial={serial}
          imageFailed={failedImages.includes(flavor.id)}
        />
        <CarouselControls
          active={active}
          select={select}
          setActive={setActive}
        />
      </section>

      <FlavorDialog
        dialog={dialog}
        panel={panel}
        favorites={favorites}
        flavor={flavor}
        select={select}
        toggleFavorite={toggleFavorite}
      />
    </main>
  );
}
