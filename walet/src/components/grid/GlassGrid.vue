<template>
  <div class="b-grid">
    <div
      class="b-grid--grid b-grid--header"
      :style="styleGridColumns"
      :bordered="false"
    >
      <div
        v-for="(caption, i) in headers"
        :key="`label-${i}`"
        class="paragraph font-weight-bold"
        :class="caption.classNameHeader || 'b-grid--text'"
      >
        <slot :name="`header-${caption.prop}`" :caption="caption.label">
          {{ caption.label }}
        </slot>
      </div>
    </div>

    <perfect-scrollbar ref="scrollRef">
      <div
        v-for="(item, i) in items"
        :key="`body-${i}`"
        v-bind="options.props(i)"
      >
        <div
          v-for="(header, j) in headers"
          :key="`innerItem${j}`"
          class="b-grid--cell"
          :class="header.className"
        >
          <slot :name="`cell-${header.prop}`" :item="item" :index="i">
            {{ parseString(item[header.prop], header) }}
          </slot>
        </div>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref, VueElement } from "vue";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { Headers } from "./GlassGrid";

type DataGridItem = {
  [key: string]: any;
};

export default defineComponent({
  components: {
    PerfectScrollbar,
  },
  inheritAttrs: false,
  props: {
    headers: {
      type: Array as PropType<Headers[]>,
      required: true,
    },
    items: {
      type: Array as PropType<DataGridItem[]>,
      default: () => [],
    },
    stub: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const scrollRef = ref<VueElement>();
    const styleGridColumns = computed(() => {
      let cols = "grid-template-columns:";

      props.headers.forEach((v) => {
        if (v.minmax) {
          cols += ` minmax(${v.minmax[0]}, ${v.minmax[1]})`;
        } else {
          cols += v.width ? ` ${v.width}` : " 1fr";
        }
      });
      return cols;
    });

    const options = computed(() => {
      return {
        props: () => ({
          class: `b-grid--grid`,
          style: styleGridColumns.value,
        }),
      };
    });

    const parseString = (val) => {
      return typeof val === "string" || typeof val === "number"
        ? val
        : props.stub;
    };

    return {
      styleGridColumns,
      parseString,
      options,
    };
  },
});
</script>
<style lang="scss">
.b-grid {
  border-radius: $radius-base;

  &--header {
    background-color: azure;
    align-items: center;
  }

  &--grid {
    display: grid;
    grid-gap: 16px;
    padding: 0 10px;
  }

  &--cell :not(.self-end, .self-center) {
    justify-self: start;
    padding-left: 3px;
  }

  &--text {
    color: black;
  }

  .align-self-center {
    align-self: center;
  }

  .self-end {
    justify-self: end;
  }

  .self-center {
    justify-self: center;
  }
}

.ps {
  max-height: 650px;
}
</style>
<style src="vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css" />
