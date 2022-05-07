<template>
  <div class="home">
    <GlassGrid />

    <GlassGrid />
  </div>
</template>

<script lang="ts">
import {
  inject,
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeMount,
  onUnmounted,
} from "vue";
import { SDKI, EventBusI } from "../interface";
// import { Headers } from '@/components/grid/GlassGrid';

export default defineComponent({
  name: "HomeView",
  setup() {
    const vm = getCurrentInstance();
    const emitter = inject<EventBusI>("eventBus")!;
    const uid = emitter.uid();

    const sdk = computed<SDKI>(
      () => vm?.appContext.config.globalProperties.$sdk
    );

    onBeforeMount(async () => {
      await sdk.value?.get("BTCUSDT");

      emitter.on(
        "set-symbol",
        (payload) => {
          console.log(payload, "==============", process.env);
        },
        uid
      );
    });

    onUnmounted(() => {
      emitter.destroy(uid);
    });
  },
});
</script>
<style lang="scss">
.home {
  display: flex;
}
</style>
