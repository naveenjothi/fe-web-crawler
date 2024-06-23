<template>
  <div class="container mt-5">
    <h1 class="mb-4">List Page</h1>
    <ul class="list-group">
      <li v-for="item in items" :key="item.id" class="list-group-item">
        <router-link :to="'/detail/' + item.id">{{
          item.companyName
        }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { IClient } from "../models/client.model";

export default defineComponent({
  data() {
    return {
      items: [] as IClient[],
    };
  },
  async mounted() {
    try {
      const response = await axios.get(`/api/clients`);
      this.items = response.data.items;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  },
});
</script>
