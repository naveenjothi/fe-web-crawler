<template>
  <div class="container bg-white my-5">
    <nav aria-label="Breadcrumb">
      <ol class="breadcrumb">
        <li
          v-for="page in breadCrumbItems"
          :key="page.name"
          class="breadcrumb-item"
        >
          <div class="d-flex align-items-center">
            <router-link
              :to="page.href"
              :class="[
                page.current
                  ? 'text-body fw-medium disabled'
                  : 'text-body fw-semibold',
                'me-2 text-decoration-none small',
              ]"
            >
              {{ getStartCase(page.name) }}
            </router-link>
            <i
              :class="[
                page.current
                  ? 'd-none pi pi-angle-right'
                  : 'h-4 w-4 flex-shrink-0 text-muted pi pi-angle-right',
              ]"
            ></i>
          </div>
        </li>
      </ol>
    </nav>
    <div v-if="data" class="d-flex justify-content-between w-100 py-3">
      <div
        class="d-inline-flex gap-2 align-items-center w-auto transition-all delay-75 duration-150 ease-in-out"
      >
        <div class="flex-shrink-0 w-10">
          <img
            src="/src/assets/building.png"
            height="22"
            width="22"
            style="margin-right: 6px"
          />
        </div>
        <div class="flex-grow-1 w-100">
          <h3 class="h5 fw-bold text-dark mb-0">
            {{ getStartCase(data.companyName) }}
          </h3>
          <p class="small text-muted mb-0">
            {{ getStartCase(data["state"]) }},
            {{ getStartCase(data["country"]) }}
          </p>
        </div>
      </div>
    </div>
    <div class="d-inline-flex gap-2">
      <!-- <slot name="ActionButton" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { IClient } from "../models/client.model";
import { startCase } from "lodash";

export default defineComponent({
  data() {
    return {
      data: null as IClient | null,
    };
  },
  methods: {
    getStartCase(value: string) {
      return startCase(value.toLowerCase());
    },
  },
  computed: {
    breadCrumbItems() {
      return [
        {
          name: "Home",
          href: "/",
          current: false,
        },
        {
          name: this.data?.companyName || "",
          href: "#",
          current: true,
        },
      ];
    },
  },
  async mounted() {
    const route = useRoute();
    const itemId = route.params.id as string;
    try {
      const response = await axios.get<IClient>(`/api/clients/${itemId}`);
      this.data = response.data;
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  },
});
</script>
<style scoped>
.custom-input:focus {
  --tw-border-opacity: 1;
  border-color: rgb(147 51 234 / var(--tw-border-opacity));
}

.custom-input::placeholder {
  color: #d1d5db; /* Equivalent to placeholder:text-gray-300 */
  text-transform: capitalize; /* Equivalent to placeholder:capitalize */
}

.custom-input:disabled {
  opacity: 0.75; /* Equivalent to disabled:opacity-75 */
}

.position-relative .cursor-pointer {
  cursor: pointer;
}
.text-small {
  font-size: 0.875rem;
}
.no-underline {
  text-decoration: none;
}
</style>
