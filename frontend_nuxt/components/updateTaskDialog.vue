<template>
  <v-dialog v-model="dialog" width="400">
    <template v-slot:activator="{ attrs, on }">
      <v-btn v-bind="attrs" v-on="on" icon small>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card class="pa-5">
      <v-form ref="form" v-model="valid" @submit.prevent="onsubmit()">
        <div>
          <v-text-field
            v-model="editText"
            label="Text"
            :rules="text_rules"
          ></v-text-field>
        </div>
        <div class="text-right">
          <v-btn text @click="close()">Discard</v-btn>
          <v-btn
            color="primary"
            :disabled="!valid"
            :loading="loading"
            type="submit"
            >Submit</v-btn
          >
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    task: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      dialog: false,
      editText: "",
      valid: false,
      text_rules: [(v) => !!v || "Text is required"],
    };
  },
  watch: {
    dialog(value) {
      if (value) {
        this.editText = this.task.text;
      }
    },
  },
  methods: {
    onsubmit() {
      this.$store
        .dispatch("task/updateTask", {
          input: {
            task_id: this.task.id,
            text: this.editText,
          },
        })
        .then(() => {
          this.close();
        });
    },
    close() {
      this.dialog = false;
    },
  },
  computed: {
    ...mapGetters({
      loading: "task/getMutationLoading",
    }),
  },
};
</script>