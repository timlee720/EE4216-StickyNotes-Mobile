<template>
  <div class="container col-12 col-md-6 my-3">
    <b-card class="mt-3 mx-auto" id = "register-form" header="Register" variant="primary">
      <b-form @submit.stop.prevent="onSubmit">
        <b-form-input
          v-model="form.username"
          required
          placeholder="Username"
        ></b-form-input>

        <b-form-input
          v-model="form.password"
          class="mt-2"
          type="password"
          required
          placeholder="Password"
        ></b-form-input>

        <b-form-input
          v-model="form.confirmPassword"
          class="mt-2"
          type="password"
          required
          placeholder="Confirm Password"
        ></b-form-input>

        <b-form-invalid-feedback :state="form.errors.length == 0">
          <ul class="form-errors">
            <li v-for="(error, index) in form.errors" :key="index">
              {{ error }}
            </li>
          </ul>
        </b-form-invalid-feedback>

        <b-button
          pill
          style="background-color: #f1b200"
          @click="onSubmit"
          class="mt-3"
          variant="primary"
          >Register</b-button
        >
        <b-row class="mt-3">
         <b-col cols="12" class="text-right">
            <b-link :to="{ name: 'login' }">Already have an account?</b-link>
          </b-col>
        </b-row>

      </b-form>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    form: {
      username: null,
      name: null,
      password: null,
      confirmPassword: null,
      errors: [],
      show: true
    }
  }),
  methods: {
    isValidForm() {
      this.form.errors = [];
      if (this.form.password != this.form.confirmPassword) {
        this.form.errors.push("confirm password must equal to password");
        return false;
      }
      return true;
    },
    async onSubmit() {
      if (!this.isValidForm()) {
        return;
      }
      const user = {
        username: this.form.username,
        password: this.form.password
      };
      this.form.errors = [];
      await axios
        .post("http://54.161.118.5:8080/api/register/", user)
        .then(res => {
          if (res) {
            this.$router.push("/login");
            this.$root.$bvToast.toast("Resgistered", {
              title: "Success",
              variant: "success",
              autoHideDelay: 3000,
              toaster: "b-toaster-bottom-center"
            });
          }
        })
        .catch(err => {
          if (err.code && err.code == 400) {
            this.form.errors.push(err.message);
            return;
          }
        });
    }
  }
};
</script>
<style>
#register-form{
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