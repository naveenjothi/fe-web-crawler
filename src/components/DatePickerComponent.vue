<template>
  <div class="datepicker-wrapper">
    <label v-if="label" class="form-label fw-semibold">{{ label }}</label>
    <VueDatePicker
      v-model="date"
      :value="date"
      :placeholder="placeholder"
      :enable-time-picker="false"
      format="dd/MM/yyyy"
      utc
      auto-apply
      :clearable="false"
      :teleport="true"
      :hide-input-icon="false"
      class="h-14"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const props = defineProps({
  modelValue: {
    type: [String, Date],
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
});

const { placeholder, label } = toRefs(props);

const emit = defineEmits(["update:modelValue"]);

const date = ref(props.modelValue);

watch(date, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>

<style scoped>
.datepicker-wrapper {
  display: flex;
  flex-direction: column;
}
</style>
