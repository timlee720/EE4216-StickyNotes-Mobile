import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

export default {
  install(Vue) {
    // Install BootstrapVue
    Vue.use(BootstrapVue);
    // Optionally install the BootstrapVue icon components plugin
    Vue.use(IconsPlugin);
  }
};
