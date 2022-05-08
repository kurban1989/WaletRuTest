<template>
  <div class="home__symbol-type">
    Symbol = <u>{{ symbol }}</u>
  </div>
  <div v-if="!loading" class="home">
    <div class="home__grid-wrapper">
      <b>Bids</b>
      <GlassGrid :headers="headers" :items="response.bids" />
    </div>
    <div class="home__grid-wrapper">
      <b>Asks</b>
      <GlassGrid :headers="headers" :items="response.asks" />
    </div>
  </div>
  <p class="home__loader" v-else>
    {{ hasError ? "Произошла ошибка!" : "Загрузка..." }}
  </p>
</template>

<script lang="ts">
import {
  inject,
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeMount,
  onUnmounted,
  ref,
} from "vue";
import { SDKI, EventBusI } from "../interface";
import { Headers } from "../components/grid/GlassGrid";
import GlassGrid from "@/components/grid/GlassGrid.vue";

interface Items {
  price: string;
  amount: string;
  total: number;
}

interface Res {
  bids: Items[];
  asks: Items[];
}

export default defineComponent({
  name: "HomeView",
  components: {
    GlassGrid,
  },
  setup() {
    const ws = ref<WebSocket | null>(null);
    const symbol = ref("BTCUSDT");
    const response = ref<Res>();
    const vm = getCurrentInstance();
    const emitter = inject<EventBusI>("eventBus")!;
    const uid = emitter.uid();
    const lastUpdateId = ref(0);
    const loading = ref(true);
    const hasError = ref(false);
    const isLastColumn = ref(true);
    const limit = Number(process.env.VUE_APP_MAX_LENGTH);

    const sdk = computed<SDKI>(
      () => vm?.appContext.config.globalProperties.$sdk
    );

    const resizeTable = () => {
      isLastColumn.value = window.innerWidth > 780;
    };

    const headers = computed<Headers[]>(() => {
      const headers = [
        {
          prop: "price",
          label: "Price",
        },
        {
          prop: "amount",
          label: "Amount",
        },
      ];

      if (isLastColumn.value) {
        headers.push({
          prop: "total",
          label: "Total",
        });
      }

      return headers.length > 2 && !isLastColumn.value
        ? headers.slice(1, 1)
        : headers;
    });

    const makeArrObj = (val: string[][]): Items[] => {
      return val.map((v) => {
        return {
          price: v[0],
          amount: v[1],
          total: Number(v[0]) * Number(v[1]),
        };
      });
    };

    const transformRes = (res, isAdd = false) => {
      if (isAdd && response.value) {
        response.value.bids = [...makeArrObj(res.bids), ...response.value.bids];
        response.value.asks = [...makeArrObj(res.asks), ...response.value.asks];
        response.value.bids.splice(limit, response.value.bids.length - limit);
        response.value.asks.splice(limit, response.value.asks.length - limit);
      } else {
        response.value = {
          bids: makeArrObj(res.bids),
          asks: makeArrObj(res.asks),
        };
      }
    };

    const wsSubscribe = () => {
      if (ws.value) {
        ws.value.close();
      }

      ws.value = sdk.value?.subscribe(symbol.value);

      ws.value.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        if (data.u >= lastUpdateId.value) {
          lastUpdateId.value = data.u;

          const [asks, bids] = [
            data.a.filter((item) => Number(item[1]) > 0),
            data.b.filter((item) => Number(item[1]) > 0),
          ];

          transformRes({ asks, bids }, true);
        }
      };
    };

    const snapshot = async () => {
      try {
        const res = await sdk.value?.get(symbol.value);
        lastUpdateId.value = res.lastUpdateId;

        transformRes(res);
        wsSubscribe();
        hasError.value = false;
      } catch (err) {
        console.warn(err, " !!! ");
        hasError.value = true;
      } finally {
        loading.value = false;
      }
    };

    onBeforeMount(async () => {
      resizeTable();
      window.addEventListener("resize", resizeTable);
      await snapshot();

      emitter.on(
        "set-symbol",
        async (payload) => {
          symbol.value = payload;
          await snapshot();
        },
        uid
      );
    });

    onUnmounted(() => {
      emitter.destroy(uid);
      window.removeEventListener("resize", resizeTable);

      if (ws.value) {
        ws.value.close();
      }
    });

    return {
      symbol,
      headers,
      response,
      loading,
      hasError,
    };
  },
});
</script>
<style lang="scss">
.home {
  display: flex;

  @media screen and (max-width: 1100px) {
    flex-direction: column;

    .home__grid-wrapper {
      width: 100%;

      b {
        background-color: rgb(61, 194, 0);
        color: white;
        display: block;
        width: 100%;
      }
    }

    .ps {
      max-height: calc(81vh / 2) !important;
    }
  }

  &__symbol-type {
    text-align: center;
    width: 100%;
    background-color: rgb(25, 0, 82);
    color: white;
    padding: 10px 0;
    font-weight: bold;
  }

  &__grid-wrapper {
    width: 50%;

    &:nth-child(1) {
      border-right: 2px solid gray;
    }

    .g-grid {
      border-top: 1px solid gray;
    }
  }

  &__loader {
    color: blue;
    font-size: 20px;
    font-weight: bold;
    margin-top: 40px;
  }

  .ps {
    max-height: 82vh;
  }
}
</style>
<style src="vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css" />
