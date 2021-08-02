<template>
  <v-app>
    <!-- Appbar -->
    <div>
      <v-app-bar color="deep-purple" dark height="60">
        <v-container class="d-flex align-center">
          <v-btn icon @click="drawer = true" v-if="$vuetify.breakpoint.xs">
            <v-icon> mdi-menu </v-icon>
          </v-btn>
          <div class="title text-uppercase mr-auto">TASKS</div>
          <div>
            <profile-menu />
         </div>
        </v-container>
      </v-app-bar>
      <!-- Naviagtor drawer -->
      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list nav dense>
          <v-list-item-group active-class="deep-purple--text text--accent-4">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Account</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </div>
    <!-- Main area -->
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
    };
  },
};
</script>
