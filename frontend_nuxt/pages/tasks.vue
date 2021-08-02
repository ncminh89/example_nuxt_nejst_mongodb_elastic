<template>
  <div>
    <!-- Task lists -->
    <div>
      <!-- If have tasks -->
      <div v-if="myTasks" class="pt-5">
        <!-- No item found -->
        <div v-if="myTasks.length == 0" class="pb-5">
          There are no tasks, please create one
        </div>
        <div v-else>
          <!-- Task list -->
          <draggable
            v-model="myTasks_clone"
            handle=".handle"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
            @change="onChange($event)"
          >
            <transition-group>
              <div v-for="task in myTasks_clone" :key="task.id" class="item">
                <task-item :task="task" @deleteTask="deleteTask($event)" />
              </div>
            </transition-group>
          </draggable>
        </div>
      </div>
      <!-- else  loading -->
      <div class="py-5" v-else>
        <v-progress-linear
          indeterminate
          color="yellow darken-2"
          height="15"
        ></v-progress-linear>
      </div>
    </div>
    <!-- Create new task -->
    <div>
      <v-text-field
        outlined
        block
        placeholder="Input new task"
        hide-details
        v-model="newTaskText"
        @keyup.enter="createTask()"
      >
        <template v-slot:append>
          <div
            class="d-flex align-center"
            style="position: relative; bottom: 3px"
          >
            <v-btn
              small
              icon
              class="warning  mr-2"
              v-if="newTaskText"
              @click="clearText()"
              ><v-icon small color="white mr-1">mdi-close</v-icon></v-btn
            >
            <v-btn
              small
              color="primary"
              :disabled="!newTaskText"
              @click="createTask()"
              ><v-icon small class="mr-2">mdi-plus</v-icon> add</v-btn
            >
          </div>
        </template>
      </v-text-field>
    </div>
  </div>
</template>

<script>
import myTasks from "@/graphql/task/myTasks.query.gql";
export default {
  data() {
    return {
      newTaskText: "",
      tasks: [],
      drag: false,
      drop: false,
      myTasks_clone: [],
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  watch: {
    myTasks(value) {
      this.myTasks_clone = [...value];
    },
  },
  methods: {
    onChange(event) {
      var newOrder;
      var newIndex = event.moved.newIndex;
      var element = event.moved.element;
      var myTasks = this.myTasks_clone;
      if (newIndex == 0) {
        newOrder = myTasks[1].order / 2;
      } else if (newIndex == myTasks.length - 1) {
        newOrder = myTasks[myTasks.length - 2].order + 2;
      } else {
        newOrder = (myTasks[newIndex - 1].order + myTasks[newIndex].order) / 2;
      }
      console.log(newOrder);
      element.order = newOrder;
      this.updateOrder(element, newOrder);
    },
    updateOrder(task, newOrder) {
      this.$store.dispatch("task/updateTask", {
        input: {
          task_id: task.id,
          order: newOrder,
        },
      });
    },
    createTask() {
      console.log("create task");
      this.$store
        .dispatch("task/createTask", {
          input: {
            text: this.newTaskText,
            order:
              this.myTasks.length == 0
                ? 1
                : this.myTasks[this.myTasks.length - 1].order + 2,
          },
        })
        .then((data) => {
          this.clearText();
        });
    },
    clearText() {
      this.newTaskText = "";
    },
    deleteTask(task) {
      console.log("delete task", task);
      this.$store.dispatch("task/deleteTask", {
        input: {
          task_id: task.id,
        },
      });
    },
  },
  apollo: {
    myTasks: {
      query: myTasks,
    },
  },
};
</script>