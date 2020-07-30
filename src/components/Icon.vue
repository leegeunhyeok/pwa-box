<template>
  <span :class="iconClass" />
</template>

<script lang="ts">
import { ref, watch, computed, defineComponent } from '@vue/composition-api';

interface IconProps {
  name: string;
  color?: string;
}

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    color: String,
  },
  setup(props: IconProps) {
    const name = ref(props.name);
    const color = ref(props.color);
    const iconClass = computed(() => {
      const classIcon = color.value ? `--${color.value}` : '';
      return `icon--${name.value}${classIcon}`;
    });

    watch(
      () => props.color,
      value => {
        color.value = value;
      },
    );

    return { iconClass };
  },
});
</script>

<style lang="scss">
// TODO: Icon styles (from svg)
</style>
