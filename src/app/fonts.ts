import localFont from "next/font/local";

export const karla = localFont({
  src: [
    {
      path: "../../public/fonts/karla/karla-v23-latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/karla/karla-v23-latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/karla/karla-v23-latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/karla/karla-v23-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/karla/karla-v23-latin-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/karla/karla-v23-latin-500italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/karla/karla-v23-latin-700italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-karla",
});

export const spaceMono = localFont({
  src: "../../public/fonts/space_mono/space-mono-v12-latin-regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-space-mono",
});
