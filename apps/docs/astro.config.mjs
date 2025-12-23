// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "SaaS Boilerplate Docs",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
        {
          icon: "twitter",
          label: "Twitter",
          href: "https://twitter.com/withastro",
        },
        {
          icon: "linkedin",
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/jsisques/",
        },
      ],
      sidebar: [
        { label: "Getting Started", autogenerate: { directory: "getting-started" } },
        { label: "Admin", autogenerate: { directory: "admin" } },
        { label: "API", autogenerate: { directory: "api" } },
        { label: "Mobile", autogenerate: { directory: "mobile" } },
        { label: "SDK", autogenerate: { directory: "sdk" } },
        { label: "Web", autogenerate: { directory: "web" } },
      ],
    }),
  ],
});
