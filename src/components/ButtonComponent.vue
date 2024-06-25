<template>
  <button
    :type="type"
    :class="[
      'btn',
      buttonSizeClass,
      buttonVariantClass,
      buttonBlockClass,
      buttonActiveClass,
      buttonDisabledClass,
      customClass,
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue";

const props = defineProps({
  type: {
    type: String as PropType<"button" | "submit" | "reset">,
    default: "button",
  },
  size: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "primary",
  },
  block: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["click"]);

const buttonSizeClass = computed(() => {
  return props.size ? `btn-${props.size}` : "";
});

const buttonVariantClass = computed(() => {
  return `btn-${props.variant}`;
});

const buttonBlockClass = computed(() => {
  return props.block ? "btn-block" : "";
});

const buttonActiveClass = computed(() => {
  return props.active ? "active" : "";
});

const buttonDisabledClass = computed(() => {
  return props.disabled ? "disabled" : "";
});

const handleClick = (event: Event) => {
  if (!props.disabled) {
    emit("click", event);
  }
};
</script>
