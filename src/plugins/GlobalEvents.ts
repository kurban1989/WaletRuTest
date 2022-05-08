import { App } from "vue";

export default {
  install(app: App, options: any[]) {
    class EventBus extends EventTarget {
      instances: [];
      constructor() {
        super();
        this.instances = [];
      }

      uid(): string {
        return Date.now().toString();
      }

      on(type: string, func: (arg: any) => void, uid: string) {
        if (!this.instances[uid]) {
          this.instances[uid] = [];
        }

        const callback = (e: Record<string, any>) => {
          func(e.detail);
        };

        this.instances[uid].push({ type, callback });
        this.addEventListener(type, callback);
      }

      emit(type: string, payload: any) {
        const event = new CustomEvent(type, { detail: payload });
        this.dispatchEvent(event);
      }

      destroy(uid: string) {
        if (this.instances[uid]) {
          this.instances[uid].forEach(({ type, callback }) => {
            this.removeEventListener(type, callback);
          });
          delete this.instances[uid];
        }
      }
    }

    const eventBus = new EventBus();

    app.config.globalProperties.$eventBus = eventBus;

    app.provide("eventBus", eventBus);

    app.mixin({
      created() {
        this.$eventBusListeners = [];
      },
      beforeUnmount() {
        this.$eventBusListeners.forEach(({ type, callback }) => {
          this.$eventBus.removeEventListener(type, callback);
        });
      },
      methods: {
        busOn(type: string, func: { call: (arg0: any, arg1: any) => void }) {
          const callback = (e: { detail: any }) => {
            func.call(this, e.detail);
          };
          this.$eventBusListeners.push({ type, callback });
          this.$eventBus.addEventListener(type, callback);
        },
        busEmit(type: string, payload: any) {
          const event = new CustomEvent(type, { detail: payload });
          this.$eventBus.dispatchEvent(event);
        },
      },
    });
  },
};
