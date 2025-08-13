import { defineAppConfig } from "nuxt/app";

export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: "cursor-pointer",
      },
    },
  },
});
