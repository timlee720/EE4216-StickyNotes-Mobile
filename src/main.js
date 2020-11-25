import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import UiKits from "./ui-kits/ui-kits";

Vue.config.productionTip = false;

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(UiKits);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
