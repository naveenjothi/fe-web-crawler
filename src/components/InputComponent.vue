<template>
  <div :class="['mb-3', wrapperClass]">
    <label v-if="label" :for="id" class="form-label fw-semibold">{{
      label
    }}</label>
    <input
      :type="type"
      :id="id"
      :value="modelValue"
      @input="($e:any) => $emit('update:modelValue', $e?.target?.value)"
      :class="['form-control', inputClass]"
      :placeholder="placeholder"
      :disabled="disabled"
    />
    <small v-if="helperText" class="form-text text-muted">{{
      helperText
    }}</small>
    <div v-if="errorMessage" class="invalid-feedback">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: "",
  },
  id: {
    type: String,
    required: false,
    default: "",
  },
  type: {
    type: String,
    required: false,
    default: "text",
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  placeholder: {
    type: String,
    required: false,
    default: "",
  },
  helperText: {
    type: String,
    required: false,
    default: "",
  },
  errorMessage: {
    type: String,
    required: false,
    default: "",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  wrapperClass: {
    type: String,
    required: false,
    default: "",
  },
  inputClass: {
    type: String,
    required: false,
    default: "",
  },
});

const {
  modelValue,
  id,
  type,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled,
  wrapperClass,
  inputClass,
} = toRefs(props);
</script>
