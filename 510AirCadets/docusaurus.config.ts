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
  plugins: ["./plugins/squadron-content/index.cjs"],
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
        { to: "/", label: "Home", position: "left", activeBaseRegex: "^/$" },
        { to: "/about", label: "About", position: "left" },
        { to: "/join", label: "Join", position: "left" },
        { to: "/activities", label: "Activities", position: "left" },
        { to: "/events", label: "Events", position: "left" },
        { to: "/announcements", label: "Announcements", position: "left" },
        { to: "/parents-cadets", label: "Parents & Cadets", position: "left" },
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
            { label: "Parents & Cadets", to: "/parents-cadets" },
            { label: "Contact", to: "/contact" },
          ],
        },
        {
          title: "Stay connected",
          items: [
            { label: "Facebook", href: "https://www.facebook.com/510Lions/" },
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
        "Independently maintained by a parent volunteer. Not an official DND, CAF or Government of Canada website.",
    },
  } satisfies Preset.ThemeConfig,
};
export default config;
