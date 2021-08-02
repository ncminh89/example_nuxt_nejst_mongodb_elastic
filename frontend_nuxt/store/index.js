export const strict = false

export const state = () => ({
  authUser: null,
  loading: false,
  error: null,
})

export const getters = {
  getAuthUser: state => state.authUser,
  getLoading: state => state.loading,
  getError: state => state.error,
}

export const mutations = {
  setAuthUser(state, user) {
    state.authUser = user
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setError(state, error) {
    state.error = error
  }
}

import login from '@/graphql/user/login.mutation.gql'
import me from '@/graphql/user/me.query.gql'
import createUser from '@/graphql/user/createUser.mutation.gql'

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { app, req }) {
    var token = await this.$apolloHelpers.getToken()
    if (token) {
      let client = await app.apolloProvider.defaultClient
      await client
        .query({
          query: me,
        })
        .then(({ data }) => {
          commit('setAuthUser', data.me)
        })
        .catch(error => {
          let err = error.message.split(': ').pop()
          commit('setError', err)
        })
    }
  },

  async login({ commit, dispatch }, payload) {
    commit('setError', null)
    commit('setLoading', true)
    return new Promise((resolve, reject) => {
      let client = this.app.apolloProvider.defaultClient
      client
        .mutate({
          mutation: login,
          variables: payload
        })
        .then(async ({ data }) => {
          resolve(data.login)
          commit('setLoading', false)
          commit('setAuthUser', data.login.user)
          await this.$apolloHelpers.onLogin(data.login.token)
          await this.$router.push('/tasks')
        })
        .catch(err => {
          commit('setLoading', false)
          let error = err.message.split(':').pop()
          reject(error)
          commit('setError', error)
        })
    })
  },

  async createUser({ commit, dispatch }, payload) {
    commit('setError', null)
    commit('setLoading', true)
    return new Promise((resolve, reject) => {
      let client = this.app.apolloProvider.defaultClient
      client
        .mutate({
          mutation: createUser,
          variables: payload
        })
        .then(async ({ data }) => {
          resolve(data.createUser)
          commit('setLoading', false)
          commit('setAuthUser', data.createUser.user)
          await this.$apolloHelpers.onLogin(data.createUser.token)
        })
        .catch(err => {
          commit('setLoading', false)
          let error = err.message.split(':').pop()
          reject(error)
          commit('setError', error)
        })
    })
  },

  async logout({ commit, state }, payload) {
    return new Promise(async (resolver, reject) => {
      await this.app.$apolloHelpers.onLogout()
      commit('setAuthUser', null)
      await this.$router.push('/')
    })
  },
}