export default ({ store, redirect, app }) => {
  console.log("trigger anomynous")
  if (!store.state.authUser) {
    redirect("/");
  }
};

