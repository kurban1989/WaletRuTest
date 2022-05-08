import { App } from "vue";
import { mainInstance } from "@/api/axios";

export default {
  install(app: App) {
    class SDK {
      async get(symbol: string) {
        const { data: glass } = await mainInstance.get(
          `/depth?symbol=${symbol}&limit=${process.env.VUE_APP_MAX_LENGTH}`
        );
        return glass;
      }

      subscribe(symbol: string): WebSocket {
        const ws = new WebSocket(
          `${process.env.VUE_APP_BASE_URL_WS}${symbol.toLowerCase()}@depth`
        );
        return ws;
      }
    }

    const sdk = new SDK();

    app.config.globalProperties.$sdk = sdk;

    app.provide("sdk", sdk);
  },
};
