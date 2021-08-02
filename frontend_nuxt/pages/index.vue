<template>
  <div >
    <div class="d-flex justify-center" style="position: relative; top: 25vh">
      <div class="">
        <!-- Login form -->
        <v-card width="370" class="pa-5">
          <!-- Title  -->
          <div
            class="d-flex title text-uppercase font-weight-bold primary--text"
          >
            Login to demo
          </div>
          <!-- Start form  -->
          <v-form v-model="valid" @submit.prevent="onSubmit" ref="form">
            <!-- Email input -->
            <div class="mt-5">
              <v-text-field
                prepend-icon="mdi-email"
                v-model="loginInput.email"
                label="Email"
                type="email"
                :rules="email_rules"
              ></v-text-field>
            </div>
            <!-- Password input -->
            <div class="mt-5">
              <v-text-field
                prepend-icon="mdi-key"
                v-model="loginInput.password"
                label="Password"
                :rules="password_rules"
                type="password"
              ></v-text-field>
            </div>

            <!-- Error -->
            <div class="caption red--text">
              {{ error }}
            </div>
            <!-- Forget password -->

            <div class="mt-5">
              <v-btn type="submit" color="primary" :disabled="!valid" block
                >Login</v-btn
              >
            </div>
            <div class="d-flex align-ceneter mt-3 caption primary--text">
              <!-- Register -->
              <div class="mr-auto">
                Don't have account, register
                <span
                  style="cursor: pointer"
                  class="font-weight-bold"
                  @click="$router.push('/signup')"
                >
                  here
                </span>
              </div>
            </div>
          </v-form>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  layout: "authLayout",
  middleware: "isAuth",
  data() {
    return {
      valid: false,
      loginInput: {
        email: "",
        password: "",
      },
      email_rules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      password_rules: [(v) => !!v || "Password is required"],
      error: "",
    };
  },
  methods: {
    onSubmit() {
      this.error = "";
      this.$store
        .dispatch("login", {
          input: this.loginInput,
        })
        .then((data) => {
          this.$router.push({ name: "calendar" });
        })
        .catch((err) => {
          this.error = err;
        });
    },
  },
  computed: {
    ...mapGetters({
      windowSize: "layout/getWindowSize",
    }),
  },
};
</script>

<style scoped>
</style>