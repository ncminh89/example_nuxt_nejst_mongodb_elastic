<template>
  <div >
    <div class="d-flex justify-center" style="position: relative; top: 18vh">
      <div class="">
        <!-- Login form -->
        <v-card width="450" class="pa-5">
          <!-- Title  -->
          <div
            class="
              d-flex
              title
              text-uppercase
              font-weight-bold
              mb-3
              primary--text
            "
          >
            Create new account
          </div>
          <!-- Start form  -->
          <v-form v-model="valid" @submit.prevent="onSubmit" ref="form">
            <!-- User full name input -->
            <div class="">
              <v-text-field
                prepend-icon="mdi-account"
                v-model="createUserInput.name"
                label="Full Name"
                :rules="userFullName_rules"
              ></v-text-field>
            </div>
            <!-- Email input -->
            <div class="">
              <v-text-field
                prepend-icon="mdi-email"
                v-model="createUserInput.email"
                label="Email"
                type="email"
                :rules="email_rules"
              ></v-text-field>
            </div>
            <!-- Password input -->
            <div class="">
              <v-text-field
                prepend-icon="mdi-key"
                v-model="createUserInput.password"
                label="Password"
                :rules="password_rules"
                type="password"
              ></v-text-field>
            </div>
            <!-- Confirm password input -->
            <div class="">
              <v-text-field
                prepend-icon="mdi-clipboard-check"
                v-model="confirmedPassword"
                label="Confirm Password"
                type="password"
                :rules="confirmedPassword_rules"
              ></v-text-field>
            </div>
            <!-- Error -->
            <div class="caption red--text" v-if="error">
              * {{ error }}
            </div>
            <div class="mt-5">
              <v-btn
                type="submit"
                color="primary"
                :disabled="!valid"
                block
                :loading="loading"
                >Register</v-btn
              >
            </div>
            <div class="d-flex align-ceneter mt-3 caption primary--text">
              <!-- Register -->
              <div class="mr-auto">
                Have already an account, please
                <span style="cursor: pointer" class="font-weight-bold primary--text" @click="$router.push('/')"
                  >login</span
                >
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
      createUserInput: {
        name: "",
        email: "",
        password: "",
      },
      confirmedPassword: "",
      email_rules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
      userFullName_rules: [(v) => !!v || "Full Name is required"],
      password_rules: [(v) => !!v || "Password is required"],
      confirmedPassword_rules: [
        (v) => !!v || "Please confirm your password",
        (v) =>
          this.createUserInput.password == this.confirmedPassword ||
          "Password is not matched",
      ],
    };
  },
  created() {
    this.$store.commit("setError",null)
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch("createUser", {
          input: this.createUserInput,
        })
        .then((data) => {
          this.$router.push({ path: "/tasks" });
        })
    },
  },
  computed: {
    ...mapGetters({
      windowSize: "layout/getWindowSize",
      loading: "getLoading",
      error: "getError"
    }),
  },
};
</script>

<style scoped>
</style>