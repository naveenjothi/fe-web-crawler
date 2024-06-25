import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import App from "./App.vue";
import router from "./router";
import ToastService from "primevue/toastservice";
import PrimeVue from "primevue/config";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/aura-light-blue/theme.css";
import "primeicons/primeicons.css";

createApp(App).use(router).use(PrimeVue).use(ToastService).mount("#app");
