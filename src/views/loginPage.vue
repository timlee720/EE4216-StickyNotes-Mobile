<template>
  <div class="container col-12 col-md-6 my-3">
    <b-card class="mt-3" id = "login-form" header="Welcome , Please Login "  variant="primary" >
      <b-form>
        <b-form-input
          required
          v-model="form.username"
          placeholder="Username"
        ></b-form-input>

        <b-form-input
          v-model="form.password"
          class="mt-2"
          type="password"
          required
          placeholder="Password"
        ></b-form-input>

        <b-button
          pill
          style="background-color: #2fa9d8;"
          @click="onSubmit"
          class="mt-3"
          variant="primary"
          >Login</b-button
        >

        <b-row class="mt-3">
          <b-col cols="12" class="text-right">
            <b-link :to="{ name: 'register' }">Create new account</b-link>
          </b-col>
        </b-row>

        <b-form-invalid-feedback :state="form.errors.length == 0">
          <ul class="form-errors">
            <li v-for="(error, index) in form.errors" :key="index">
              {{ error }}
            </li>
          </ul>
        </b-form-invalid-feedback>
      </b-form>
    </b-card>
  </div>
</template>
<script>
import axios from "axios";
import store from "../store";
export default {
  data: () => ({
    form: {
      username: null,
      password: null,
      errors: [],
      show: true
    }
  }),
  methods: {
    async onSubmit() {
      const user = {
        username: this.form.username,
        password: this.form.password
      };
      this.form.errors = [];
      await axios
        .post("http://54.161.118.5:8080/api/login/", user)
        .then(res => {
          console.log(res);
          const { userID } = res.data;
          if (res) {
            console.log(res.data);
            store.dispatch("LOGIN", { userID } );
            console.log(this.$store.state.userID);
            this.$router.push("/");
          }
        })
        .catch(err => {
          if (err) {
            this.form.errors.push("Wrong username or password");
            return;
          }
        });
    }
  }
};
</script>
<style>
#login-form{
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
</style>