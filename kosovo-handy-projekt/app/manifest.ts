import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kosovo Handy",
    short_name: "Handy",
    description: "Puntorë të shërbimeve të shtëpisë në Kosovë; lista publike për lexim offline.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b101b",
    theme_color: "#2563eb",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}