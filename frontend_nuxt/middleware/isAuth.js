export default ({ store, redirect, app }) => {
  console.log("is auth", store.state.authUser)
  if (store.state.authUser) {
    redirect('/tasks')
  }
}
