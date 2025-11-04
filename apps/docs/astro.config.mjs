// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "My Docs",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
        {
          label: "SDK",
          autogenerate: { directory: "sdk" },
        },
        {
          label: "Authentication",
          autogenerate: { directory: "authentication" },
        },
        {
          label: "Billing",
          autogenerate: { directory: "billing" },
        },
        {
          label: "Events",
          autogenerate: { directory: "events" },
        },
        {
          label: "Health",
          autogenerate: { directory: "health" },
        },
        {
          label: "Tenants",
          autogenerate: { directory: "tenants" },
        },
        {
          label: "Users",
          autogenerate: { directory: "users" },
        },
      ],
    }),
  ],
});
