<template>
  <div id="app" class="d-flex flex-column">
    <router-view name="header"></router-view>
    <main>
      <fade-transition origin="center" mode="out-in" :duration="250">
        <router-view></router-view>
      </fade-transition>
    </main>
  </div>
</template>

<script>
import { FadeTransition } from "vue2-transitions";
export default {
  components: {
    FadeTransition
  },
  created() {
    if (this.$store.state.userID == null) {
      this.$router.push("/login");
    }
    window.addEventListener("beforeunload", this.handler);
  },
  methods: {
    handler: function handler() {}
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#content {
  background-image: url("~@/assets/background.jpg");
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>