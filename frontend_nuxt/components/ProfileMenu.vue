<template>
  <div v-if="authUser">
    <v-menu offset-y left nudge-bottom="10">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <avatar :size="40" />
        </div>
      </template>
      <v-card width="300" class="pa-5">
        <div class="d-flex">
          <div class="mr-5">
            <avatar :size="45" />
          </div>
          <div>
            <div class="text-truncate font-weight-bold">
              {{ authUser.name }}
            </div>
            <div class="caption">
              {{ authUser.email }}
            </div>
          </div>
        </div>
        <div class="caption mt-3" style="cursor: pointer">
          <v-btn text small block class="red white--text" @click="onLogout()"
            ><v-icon small class="mr-3">mdi-logout</v-icon> logout</v-btn
          >
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      authUser: "getAuthUser",
    }),
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    onLogout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
