import { createApp } from "vue";
import { createPinia } from 'pinia'
import App from "./App.vue";

import "vue-sonner/style.css";
import "./style.css";

import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import router from "./router";

const pinia = createPinia()
const app = createApp(App);

app
    .use(pinia)
    .use(router)
    .component("DatePicker", VueDatePicker)
    .mount("#app");
