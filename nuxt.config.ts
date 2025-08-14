// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxt/content", "@nuxt/image", "@nuxt/ui", "@nuxt/eslint"],
  css: ["~/assets/css/main.css"],
  ui: {
    prefix: "Nuxt",
  },

  runtimeConfig: {
    public: {
      tbsAuth: process.env.TBS_DEENA_AUTH,
      otpSecret: process.env.TBS_DEENA_OTP_SECRET,
      otpKey: process.env.TBS_DEENA_OTP_KEY,
    },
  },
});
