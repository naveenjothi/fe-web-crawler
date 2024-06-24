<template>
  <div class="container mt-5">
    <h1 class="mb-4">List Page</h1>
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
                    @click.prevent="redirectTo(data?.id)"
                  >
                    <span
                      v-if="
                        selectedRow == data?.cin && columns.length - 1 === idx
                      "
                      class="position-absolute end-0 text-primary cursor-pointer text-small"
                    >
                      Go to <i class="pi pi-arrow-right"></i>
                    </span>
                    <SwitchComponent
                      v-else-if="col.key == 'companyStatus'"
                      :value="data[col.key] == 'ACTIVE'"
                      :disabled="true"
                      class="text-gray-700 flex gap-2 items-center justify-between w-full"
                    />
                    <span v-else>{{ data[col.key] }}</span>
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { IClient } from "../models/client.model";
import Paginator from "primevue/paginator";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import SwitchComponent from "../components/SwitchComponent.vue";
import { useRouter } from "vue-router";

const router = useRouter();

export default defineComponent({
  components: {
    Paginator,
    DataTable,
    Column,
    SwitchComponent,
  },
  data() {
    return {
      items: [] as IClient[],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      totalCount: 0,
      selectedRow: "",
      loading: false,
      columns: [
        { title: "Status", key: "companyStatus" },
        { title: "Company Name", key: "companyName", sortable: false },
        { title: "CIN", key: "cin" },
        { title: "Company Class", key: "companyClass" },
        { title: "Email", key: "email" },
        { title: "Company Category", key: "category" },
        { title: "Company SubCategory", key: "subCategory" },
      ],
    };
  },
  computed: {
    totalPages(): number {
      return Math.ceil(this.totalCount / this.itemsPerPage);
    },
  },
  methods: {
    async fetchItems(query: string, page: number) {
      try {
        this.loading = true;
        const params = {
          q: query,
          page: page.toString(),
          size: this.itemsPerPage.toString(),
        };
        const urlParams = new URLSearchParams(params);
        const queryString = urlParams.toString();
        const response = await axios.get(`/api/clients?${queryString}`);
        this.items = response.data?.items ?? [];
        this.totalCount = response.data?.count ?? 0;
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        this.loading = false;
      }
    },
    changePage(meta: { page: number }) {
      const { page } = meta;
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchItems("", page - 1);
      }
    },
    onInputChange() {
      this.fetchItems(this.searchQuery, 0);
    },
    rowClass(data: any) {
      return this.selectedRow === data.cin ? "table-active" : "";
    },
    updateCurrentMax(max: number) {
      this.itemsPerPage = max;
      // this.fetchItems();
    },
    redirectTo(itemId: string) {
      console.log("ite", itemId);

      router.push(`/details/${itemId}`);
    },
  },
  async mounted() {
    this.fetchItems(this.searchQuery, this.currentPage - 1);
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
</style>
