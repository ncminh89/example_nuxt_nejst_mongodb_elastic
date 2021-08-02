import Vue from "vue"

import Avatar from "@/components/utils/Avatar.vue"
Vue.component("avatar", Avatar)

import ProfileMenu from "@/components/ProfileMenu.vue"
Vue.component("profile-menu", ProfileMenu)

import UpdateTaskDialog from "@/components/updateTaskDialog.vue"
Vue.component("update-task-dialog", UpdateTaskDialog)

import draggable from 'vuedraggable'
Vue.component("draggable", draggable)

import TaskItem from "@/components/taskItem.vue"
Vue.component("task-item", TaskItem)

