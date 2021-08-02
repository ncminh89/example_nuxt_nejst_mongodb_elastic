export const strict = false

export const state = () => ({
    queryLoading: false,
    mutationLoading: false,
    error: null,
})

export const getters = {
    getQueryLoading: state => state.queryLoading,
    getMutationLoading: state => state.mutationLoading,
    getError: state => state.error,
}

export const mutations = {
    setQueryLoading(state, loading) {
        state.queryLoading = loading
    },
    setMutationLoading(state, loading) {
        state.mutationLoading = loading
    },
    setError(state, error) {
        state.error = error
    }
}

import myTasks from '@/graphql/task/myTasks.query.gql'
import createTask from '@/graphql/task/createTask.mutation.gql'
import updateTask from '@/graphql/task/updateTask.mutation.gql'
import deleteTask from '@/graphql/task/deleteTask.mutation.gql'

export const actions = {
    async createTask({ commit, dispatch }, payload) {
        commit('setError', null)
        commit('setMutationLoading', true)
        return new Promise((resolve, reject) => {
            let client = this.app.apolloProvider.defaultClient
            client
                .mutate({
                    mutation: createTask,
                    variables: payload,
                    update: (cache, { data: { createTask } }) => {
                        const data = cache.readQuery({ query: myTasks })
                        const index = data.myTasks.findIndex(e => e.id == createTask.id)
                        if (index == -1) {
                            data.myTasks.push(createTask)
                        }
                        cache.writeQuery({ query: myTasks, data })
                    },
                })
                .then(async ({ data }) => {
                    resolve(data.createTask)
                    commit('setMutationLoading', false)
                })
                .catch(err => {
                    commit('setMutationLoading', false)
                    let error = err.message.split(':').pop()
                    reject(error)
                    commit('setError', error)
                })
        })
    },
    async updateTask({ commit, dispatch }, payload) {
        commit('setError', null)
        commit('setMutationLoading', true)
        return new Promise((resolve, reject) => {
            let client = this.app.apolloProvider.defaultClient
            client
                .mutate({
                    mutation: updateTask,
                    variables: payload,
                    update: (cache, { data: { updateTask } }) => {
                        const data = cache.readQuery({ query: myTasks })
                        const index = data.myTasks.findIndex(e => e.id == updateTask.id)
                        if (index != -1) {
                            data.myTasks.splice(index, 1, updateTask)
                        }
                        cache.writeQuery({ query: myTasks, data })
                    },
                })
                .then(async ({ data }) => {
                    resolve(data.updateTask)
                    commit('setMutationLoading', false)
                })
                .catch(err => {
                    commit('setMutationLoading', false)
                    let error = err.message.split(':').pop()
                    reject(error)
                    commit('setError', error)
                })
        })
    },
    async deleteTask({ commit, dispatch }, payload) {
        commit('setError', null)
        commit('setMutationLoading', true)
        return new Promise((resolve, reject) => {
            let client = this.app.apolloProvider.defaultClient
            client
                .mutate({
                    mutation: deleteTask,
                    variables: payload,
                    update: (cache, { data: { deleteTask } }) => {
                        const data = cache.readQuery({ query: myTasks })
                        const index = data.myTasks.findIndex(e => e.id == deleteTask.id)
                        if (index != -1) {
                            data.myTasks.splice(index, 1)
                        }
                        cache.writeQuery({ query: myTasks, data })
                    },
                })
                .then(async ({ data }) => {
                    resolve(data.deleteTask)
                    commit('setMutationLoading', false)
                })
                .catch(err => {
                    commit('setMutationLoading', false)
                    let error = err.message.split(':').pop()
                    reject(error)
                    commit('setError', error)
                })
        })
    },

}