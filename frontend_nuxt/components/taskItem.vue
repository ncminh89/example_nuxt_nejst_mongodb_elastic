<template>
  <div>
    <v-card class="pa-3 mb-4">
      <div class="d-flex align-center">
        <!-- drag vertial -->
        <div class="handle">
          <v-icon>mdi-drag-vertical</v-icon>
        </div>
        <!-- Check done -->
        <div class="mr-2" @click="check(task)" style="cursor: pointer">
          <v-icon v-if="!task.done"> mdi-checkbox-blank-outline</v-icon>
          <v-icon v-else> mdi-checkbox-marked</v-icon>
        </div>
        <!-- Text -->
        <div class="mr-auto">{{ task.text }}</div>
        <!-- Actions -->
        <div>
          <update-task-dialog :task="task" />
          <v-btn icon small @click="deleteTask(task)"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      require: true,
    },
  },
  methods: {
    deleteTask(task) {
      this.$emit("deleteTask", task);
    },
    check(task) {
      console.log("check", task);
      this.$store.dispatch("task/updateTask", {
        input: {
          task_id: task.id,
          done: !task.done,
        },
      });
    },
  },
};
</script>