import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "./views/Dashboard.vue";
import Header from "./views/Header.vue";
import loginPage from "./views/loginPage.vue";
import registerPage from "./views/registerPage.vue";

Vue.use(VueRouter);

const routerOptions = {
  mode: "history",
  routes: [
    { path: "/", name: "root", components: { default: Dashboard } },
    {
      path: "/login",
      name: "login",
      components: { default: loginPage }
    },
    {
      path: "/register",
      name: "register",
      components: { default: registerPage }
    }
  ]
};

routerOptions.routes.forEach(route => {
  // set default header/footer if not set
  if (!route.components.header) {
    route.components.header = Header;
  }
});

const router = new VueRouter(routerOptions);

export default router;