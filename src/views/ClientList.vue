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

interface Item {
  id: number;
  name: string;
}

export default defineComponent({
  data() {
    return {
      items: [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
      ] as Item[],
    };
  },
});
</script>
