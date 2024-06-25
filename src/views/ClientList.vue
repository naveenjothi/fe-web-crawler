<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center">
      <h1 class="mb-4">Companies List</h1>
      <ButtonComponent @click="handleShowForm"> Create Client </ButtonComponent>
    </div>
    <div class="mb-2">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          @input="onInputChange"
          class="form-control custom-input"
          style="
            width: 100%;
            height: 2.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            background-color: white;
            border: 1px solid;
            border-radius: 0.25rem;
            outline: none;
          "
          placeholder="Search..."
        />
      </div>
    </div>
    <div>
      <div class="bg-white p-2 p-md-4 pb-2 rounded-md shadow-sm mb-3">
        <div class="mb-3">
          <DataTable
            show-gridlines
            class="bg-white"
            resizable-columns
            :row-class="rowClass"
            column-resize-mode="fit"
            :rows="10"
            :loading="loading"
            :value="items"
          >
            <template #empty>
              <div
                class="d-flex justify-content-center align-items-center"
                style="height: calc(100vh - 550px)"
              >
                <div>
                  <span>No data available{{ searchQuery ? ` for ` : "" }}</span>
                  <span class="text-muted">{{ searchQuery }}</span>
                </div>
              </div>
            </template>
            <div>
              <Column
                v-for="(col, idx) in columns"
                :key="col.key"
                :class="columns.length - 1 < idx ? '' : 'border-bottom'"
                :field="col.key"
                :header="col.title"
              >
                <template #body="{ data }">
                  <div
                    class="position-relative"
                    @mouseenter="selectedRow = data.cin"
                    @mouseleave="selectedRow = ''"
                  >
                    <SwitchComponent
                      v-if="col.key == 'companyStatus'"
                      :value="data[col.key] == 'ACTIVE'"
                      :disabled="true"
                      label="Status"
                      class="text-gray-700 flex gap-2 items-center justify-between w-full"
                    />
                    <div
                      v-else-if="col.key == 'action'"
                      class="d-flex align-items-center justify-content-center"
                    >
                      <i
                        class="pi pi-trash"
                        @click.prevent="handleDelete(data.id)"
                      ></i>
                    </div>
                    <router-link
                      v-else-if="col.key == 'companyName'"
                      :to="'/detail/' + data.id"
                      class="text-black no-underline"
                    >
                      <div
                        class="d-inline-flex flex-column align-items-start flex-grow-1"
                      >
                        <div
                          class="small font-weight-semibold text-dark mb-1"
                          style="line-height: 1"
                        >
                          {{ getStartCase(data[col.key]) }}
                        </div>
                        <div class="d-inline-flex align-items-center">
                          <div class="small font-weight-medium text-muted">
                            <img
                              src="/src/assets/building.png"
                              height="22"
                              width="22"
                              style="margin-right: 6px"
                            />
                          </div>
                          <div class="small font-weight-medium text-muted">
                            {{ getStartCase(data["state"]) }},
                            {{ getStartCase(data["country"]) }}
                          </div>
                        </div>
                      </div>
                    </router-link>
                    <router-link
                      v-else
                      :to="'/detail/' + data.id"
                      class="small text-black no-underline"
                    >
                      <span>{{ data[col.key] }}</span>
                    </router-link>
                  </div>
                </template>
              </Column>
            </div>
          </DataTable>
        </div>
        <div
          class="d-flex flex-column flex-md-row align-items-center justify-content-between py-2 w-100 gap-2"
        >
          <div class="d-inline-flex align-items-center">
            <div class="text-muted small">
              Total Count:
              <span class="font-weight-bold text-dark">{{ totalCount }}</span>
            </div>
          </div>
          <Paginator
            :totalRecords="totalCount"
            :rows="itemsPerPage"
            @page="changePage"
          />
        </div>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="visible"
    modal
    header="Add Client"
    :style="{ width: '50rem' }"
  >
    <FormComponent component-type="create" @on-success="handleSuccess" />
  </Dialog>
  <Toast />
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref, computed } from "vue";
import axios from "axios";
import { IClient } from "../models/client.model";
import Paginator from "primevue/paginator";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import SwitchComponent from "../components/SwitchComponent.vue";
import { startCase } from "lodash";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import ButtonComponent from "../components/ButtonComponent.vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FormComponent from "../components/details/FormComponent.vue";
const toast = useToast();

defineComponent([
  Paginator,
  DataTable,
  Column,
  SwitchComponent,
  ButtonComponent,
  Dialog,
  InputText,
  Button,
  FormComponent,
  Toast,
]);

onMounted(async () => {
  await fetchItems(searchQuery.value, currentPage.value - 1);
});

const searchQuery = ref<string>("");
const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(10);
const loading = ref<boolean>(false);
const visible = ref<boolean>(false);
const items = ref<IClient[]>([]);
const totalCount = ref<number>(0);
const selectedRow = ref<string>("");

const columns = computed(() => [
  { title: "Status", key: "companyStatus" },
  { title: "Name", key: "companyName", sortable: false },
  { title: "CIN", key: "cin" },
  { title: "Class", key: "companyClass" },
  { title: "Email", key: "email" },
  { title: "Actions", key: "action" },
]);

const fetchItems = async (query: string, page: number) => {
  try {
    loading.value = true;
    const params = {
      q: query,
      page: page.toString(),
      size: itemsPerPage.value.toString(),
    };
    const urlParams = new URLSearchParams(params);
    const queryString = urlParams.toString();
    const response = await axios.get(`/api/clients?${queryString}`);
    items.value = response.data?.items ?? [];
    totalCount.value = response.data?.count ?? 0;
  } catch (error: any) {
    console.error("Error fetching items:", error);
    toast.add({
      severity: "error",
      summary: "Failed Fetching Records",
      detail: error?.message,
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const getStartCase = (value: string) => {
  return startCase(value.toLowerCase());
};

const rowClass = (data: any) => {
  return selectedRow.value === data.cin ? "table-active" : "";
};

const totalPages = computed(() =>
  Math.ceil(totalCount.value / itemsPerPage.value)
);

const changePage = (meta: { page: number }) => {
  const { page } = meta;
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    fetchItems("", page - 1);
  }
};

const onInputChange = () => {
  fetchItems(searchQuery.value, 0);
};

const handleDelete = async (itemId: string) => {
  try {
    await axios.delete(`/api/clients/${itemId}`);
    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: "Successfully deleted!",
      life: 3000,
    });
    await fetchItems("", 0);
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Delete Failed",
      detail: error?.message,
      life: 3000,
    });
  }
};

const handleShowForm = () => {
  visible.value = true;
};

const handleSuccess = () => {
  visible.value = false;
  toast.add({
    severity: "success",
    summary: "Success Message",
    detail: "Successfully created!",
    life: 3000,
  });
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
