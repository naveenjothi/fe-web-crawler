<template>
  <div class="container mt-5">
    <h1 class="mb-4">List Page</h1>
    <ul class="list-group">
      <li v-for="item in items" :key="item.id" class="list-group-item">
        <router-link :to="'/detail/' + item.id">{{ item.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

interface Item {
  id: number;
  name: string;
}

export default defineComponent({
  data() {
    return {
      items: [] as Item[],
    };
  },
  async mounted() {
    try {
      const response = await axios.get(`/api/clients?q=""`);
      this.items = response.data;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  },
});
</script>
