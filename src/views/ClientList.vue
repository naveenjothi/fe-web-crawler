<template>
  <div class="container mt-5">
    <h1 class="mb-4">Companies List</h1>
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { IClient } from "../models/client.model";
import Paginator from "primevue/paginator";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import SwitchComponent from "../components/SwitchComponent.vue";
import { startCase } from "lodash";

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
        { title: "Name", key: "companyName", sortable: false },
        { title: "CIN", key: "cin" },
        { title: "Class", key: "companyClass" },
        { title: "Email", key: "email" },
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
    getStartCase(value: string) {
      return startCase(value.toLowerCase());
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
.no-underline {
  text-decoration: none;
}
</style>
