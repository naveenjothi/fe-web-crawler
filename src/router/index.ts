import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ListPage from "../views/ClientList.vue";
import DetailPage from "../views/ClientDetail.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "List",
    component: ListPage,
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: DetailPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
