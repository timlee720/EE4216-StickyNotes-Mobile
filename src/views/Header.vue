<template>
  <header class="sticky-top">
    <b-navbar toggleable="lg" type="dark" >
      <b-navbar-brand>Sticky Notes Mobile</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse class="float: left" id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav align="left" class="ml-auto">
          <b-nav-item v-if="this.$store.state.userID">
            Hello! 
          </b-nav-item>
          <b-nav-item v-if="this.$store.state.userID" @click="Logout()">
            Sign Out
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
import store from "../store";
export default {
  methods: {
    Logout() {
      store.dispatch("LOGOUT");
      this.$router.push("/login");
    }
  }
};
</script>

<style>
.navbar-toggle.navbar-left {
  float: left;
  margin-left: 10px;
}
.sticky-top{
  background-color: #8a7ace;
}
</style>