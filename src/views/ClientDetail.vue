<template>
  <div class="container bg-white mt-5">
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
  <div class="container bg-white overflow-hidden">
    <div class="d-flex flex-column w-100 justify-content-between h-100 my-2">
      <div class="w-50">
        <InputComponent
          label="Company Name"
          id="companyName"
          v-model="input?.companyName"
        />
      </div>
      <div class="w-50 d-flex gap-2">
        <InputComponent
          label="CIN"
          wrapper-class="w-50"
          id="cin"
          :disabled="true"
          v-model="input?.cin"
        />
        <InputComponent
          label="Company Class"
          id="companyClass"
          wrapper-class="w-50"
          v-model="input?.companyClass"
        />
      </div>

      <div class="w-50 d-flex gap-2">
        <InputComponent
          label="Category"
          wrapper-class="w-50"
          id="category"
          v-model="input?.category"
        />
        <InputComponent
          label="Sub Category"
          id="subCategory"
          wrapper-class="w-50"
          v-model="input?.subCategory"
        />
      </div>
      <div class="w-50">
        <InputComponent label="Address" id="address" v-model="input?.address" />
      </div>
      <div class="w-50 d-flex gap-2">
        <InputComponent
          label="State"
          wrapper-class="w-50"
          id="state"
          v-model="input?.state"
        />
        <InputComponent
          label="Country"
          id="country"
          wrapper-class="w-50"
          v-model="input?.country"
        />
      </div>
      <div class="w-50">
        <InputComponent label="Managed By" id="email" v-model="input?.email" />
      </div>
      <div class="w-50 d-flex gap-2">
        <InputComponent
          label="Authorized Capital"
          wrapper-class="w-50"
          type="number"
          id="authorisedCapital"
          v-model="input?.authorisedCapital"
        />
        <InputComponent
          label="Paidup Capital"
          id="paidUpCapital"
          type="number"
          wrapper-class="w-50"
          v-model="input?.paidUpCapital"
        />
      </div>
      <div class="w-50 d-flex justify-content-end">
        <ButtonComponent class="w-25 rounded" @click.prevent="handleSave"
          >Save</ButtonComponent
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { IClient } from "../models/client.model";
import { startCase } from "lodash";
import InputComponent from "../components/InputComponent.vue";
import ButtonComponent from "../components/ButtonComponent.vue";

onMounted(async () => {
  const route = useRoute();
  const itemId = route.params.id as string;
  try {
    const response = await axios.get<IClient>(`/api/clients/${itemId}`);
    data.value = response.data;
  } catch (error) {
    console.error("Error fetching item details:", error);
  }
});

defineComponent([InputComponent, ButtonComponent]);

const data = ref<IClient | null>(null);
const input = ref<IClient | null>(null);

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

const handleSave = async () => {
  console.log(data.value);
};
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
