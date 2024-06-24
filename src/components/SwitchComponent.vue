<template>
  <div
    :class="[
      'd-flex align-items-center gap-2',
      disabled ? 'select-none pointer-events-none cursor-not-allowed' : '',
    ]"
  >
    <label
      v-if="label"
      class="text-xs font-semibold text-uppercase text-current mb-0"
    >
      {{ label }}
    </label>
    <div class="form-check form-switch">
      <input
        :id="id"
        class="form-check-input"
        type="checkbox"
        v-model="isChecked"
        :disabled="disabled"
        @change="toggle(isChecked)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, PropType } from "vue";

const props = defineProps({
  id: {
    type: String as PropType<string>,
    required: false,
    default: "",
  },
  value: {
    type: Boolean as PropType<boolean>,
    required: true,
    default: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  label: {
    type: String as PropType<string>,
    required: true,
    default: "",
  },
});

const { disabled, id } = props;
const emit = defineEmits(["update:modelValue", "toggle"]);
const isChecked = ref<boolean>(false);

watch(isChecked, (newValue) => {
  emit("update:modelValue", newValue);
});

watch(
  props,
  (newValue) => {
    isChecked.value = newValue.value;
  },
  { immediate: true, deep: true }
);

const toggle = (isChecked: boolean) => {
  emit("toggle", isChecked);
};
</script>
