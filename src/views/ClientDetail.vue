<template>
  <div class="container mt-5">
    <h1 class="mb-4">Detail Page</h1>
    <p v-if="item">Item Name: {{ item.companyName }}</p>
    <p v-else>Loading...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

interface Item {
  id: number;
  companyName: string;
}

export default defineComponent({
  data() {
    return {
      item: null as Item | null,
    };
  },
  async mounted() {
    const route = useRoute();
    const itemId = route.params.id as string;
    try {
      const response = await axios.get(`/api/clients/${itemId}`);
      this.item = response.data;
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  },
});
</script>
