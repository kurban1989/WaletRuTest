import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router);

const requirePlugin = require.context("@/plugins", false, /\w+\.(ts|js)$/);

requirePlugin.keys().forEach((pluginName) => {
  const plugin = requirePlugin(pluginName);
  app.use(plugin.default);
});

app.mount("#app");
