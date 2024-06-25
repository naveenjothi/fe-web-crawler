<template>
  <div v-if="!loading" class="container bg-white mt-5">
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
  </div>
  <div
    v-if="loading"
    class="d-flex justify-content-center align-items-center"
    style="height: 300px"
  >
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-if="!loading" class="container bg-white">
    <FormComponent
      component-type="edit"
      :data="data"
      @on-success="handleSuccess"
    />
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { IClient } from "../models/client.model";
import { startCase } from "lodash";
import FormComponent from "../components/details/FormComponent.vue";

import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
const toast = useToast();

defineComponent([FormComponent]);

onMounted(async () => {
  loading.value = true;
  const route = useRoute();
  const itemId = route.params.id as string;
  try {
    const response = await axios.get<IClient>(`/api/clients/${itemId}`);
    data.value = response.data;
  } catch (error: any) {
    console.error("Error fetching item details:", error);
    toast.add({
      severity: "error",
      summary: "Failed Fetching Records",
      detail: error?.message,
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
});

const data = ref<IClient>();
const loading = ref<boolean>(false);

const getStartCase = (value: string) => {
  return startCase(value.toLowerCase());
};

const breadCrumbItems = computed(() => [
  {
    name: "Home",
    href: "/",
    current: false,
  },
  {
    name: data.value?.companyName || "",
    href: "#",
    current: true,
  },
]);

const handleSuccess = () => {
  toast.add({
    severity: "success",
    summary: "Success Message",
    detail: "Successfully updated!",
    life: 3000,
  });
};
</script>
<style scoped>
.custom-data:focus {
  --tw-border-opacity: 1;
  border-color: rgb(147 51 234 / var(--tw-border-opacity));
}

.custom-data::placeholder {
  color: #d1d5db; /* Equivalent to placeholder:text-gray-300 */
  text-transform: capitalize; /* Equivalent to placeholder:capitalize */
}

.custom-data:disabled {
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
