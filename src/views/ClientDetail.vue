<template>
  <div class="container mt-5">
    <h1 class="mb-4">Detail Page</h1>
    <p>Item ID: {{ itemId }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const route = useRoute();
    const itemId = route.params.id as string;

    return {
      itemId,
    };
  },
});
</script>
