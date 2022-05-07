<template>
  <div class="about">
    <h1>This is an about page</h1>
    <br />
    <button @click="mymethod">click me</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject } from "vue";
import { EventBusI } from "../interface";

export default defineComponent({
  setup() {
    const emitter = inject<EventBusI>("eventBus")!;

    const mymethod = () => {
      emitter.emit("myevent", { id: 100 });
    };
    return {
      mymethod,
    };
  },
});
</script>
