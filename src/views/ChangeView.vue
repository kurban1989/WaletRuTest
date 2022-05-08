<template>
  <div class="about">
    <h1>This is an about change Symbol page</h1>
    <br />

    <select class="select" v-model="currentSymbol" @change="changeSymbol">
      <option
        v-for="(option, index) in listOptions"
        :key="index"
        class="select__option"
      >
        {{ option }}
      </option>
    </select>

    <ol class="diff-list">
      <li
        v-for="(diff, index) in diffList"
        :key="`diffList${index}`"
        class="diff-list__content"
      >
        {{ diff }}
      </li>
    </ol>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import { EventBusI } from "../interface";

export default defineComponent({
  name: "ChangeView",
  setup() {
    const emitter = inject<EventBusI>("eventBus")!;
    const listOptions = ["BTCUSDT", "BNBBTC", "ETHBTC"];
    const currentSymbol = ref("BTCUSDT");
    const diffList = ref<string[]>([]);

    const changeSymbol = () => {
      diffList.value.push(currentSymbol.value);
      emitter.emit("set-symbol", currentSymbol.value);
    };

    return {
      diffList,
      listOptions,
      changeSymbol,
      currentSymbol,
    };
  },
});
</script>
<style lang="scss">
.select {
  width: 150px;
  height: 50px;
  background-color: grey;
  color: #8fd4ff;
  text-align: center;
  margin-bottom: 15px;

  &__option {
    width: 150px;
    min-height: 3em !important;
    background-color: grey;
    color: #8fd4ff;
    text-align: center;
  }
}

.diff-list {
  max-width: 20%;
  margin: 0 auto;
  counter-reset: li;
  list-style: none;
  padding: 0;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);

  &__content {
    position: relative;
    display: block;
    padding: 0.4em 0.4em 0.4em 2em;
    margin: 0.5em 0;
    background: #dad2ca;
    color: #444;
    text-decoration: none;
    border-radius: 0.3em;
    transition: 0.3s ease-out;

    &:hover {
      background: #e9e4e0;
    }
    &:hover:before {
      transform: rotate(360deg);
    }
    &:before {
      content: counter(li);
      counter-increment: li;
      position: absolute;
      left: -1.3em;
      top: 50%;
      margin-top: -1.3em;
      background: #8fd4c1;
      height: 2em;
      width: 2em;
      line-height: 2em;
      border: 0.3em solid white;
      text-align: center;
      font-weight: bold;
      border-radius: 2em;
      transition: all 0.3s ease-out;
    }
  }
}
</style>
