import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const app = createApp(App);

app.component("DatePicker", VueDatePicker);

app.mount("#app");
