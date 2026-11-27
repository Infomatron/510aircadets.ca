import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "510 Air Cadets | St. John's Lions",
  tagline: "New experiences. Lasting friendships. Room to grow.",
  url: "https://510aircadets.ca",
  baseUrl: "/",
  favicon: "img/favicon.svg",
  organizationName: "Infomatron",
  projectName: "510aircadets.ca",
  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  i18n: { defaultLocale: "en", locales: ["en"] },
  plugins: [
    "./plugins/squadron-content/index.cjs",
    "./plugins/page-modified/index.cjs",
  ],
  presets: [
    [
      "classic",
      {
        docs: false,
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: "light",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: "510 Air Cadets",
      logo: { alt: "", src: "img/squadron-crest.png", width: 40, height: 40 },
      items: [
        {
          type: "dropdown",
          label: "Explore",
          position: "left",
          items: [
            { to: "/about", label: "About" },
            { to: "/join", label: "Join" },
            { to: "/activities", label: "Activities" },
          ],
        },
        {
          to: "/calendar",
          label: "Calendar & Announcements",
          position: "left",
        },
        { to: "/cadets/", label: "Cadets", position: "left" },
        {
          to: "/parents-guardians/",
          label: "Parents & Guardians",
          position: "left",
        },
        { to: "/contact", label: "Contact", position: "left" },
        {
          href: "https://registration.cadets.gc.ca/get-started.html?unitId=441",
          label: "Register Your Interest",
          position: "right",
          className: "nav-join",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "510 St. John's Lions",
          items: [
            { label: "About this website", to: "/about" },
            { label: "Cadets", to: "/cadets/" },
            { label: "Parents & Guardians", to: "/parents-guardians/" },
            { label: "Contact", to: "/contact" },
            {
              label: "View website source on GitHub",
              href: "https://github.com/Infomatron/510aircadets.ca",
            },
          ],
        },
        {
          title: "Stay connected",
          items: [
            { label: "Instagram", href: "https://www.instagram.com/510lions/" },
            {
              label: "Squadron Linktree",
              href: "https://linktr.ee/510stjohnslionsaircadets",
            },
          ],
        },
        {
          title: "Official program information",
          items: [
            {
              label: "Cadets Canada",
              href: "https://www.canada.ca/en/department-national-defence/services/cadets-junior-canadian-rangers/cadets.html",
            },
            {
              label: "Registration service",
              href: "https://registration.cadets.gc.ca/get-started.html?unitId=441",
            },
          ],
        },
      ],
      copyright:
        "Independently maintained by volunteers of the Squadron Support Committee. This is not an official Department of National Defence or Canadian Armed Forces website.",
    },
  } satisfies Preset.ThemeConfig,
};
export default config;
