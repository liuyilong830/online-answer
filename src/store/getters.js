const getters = {
  getUserInfo(state) {
    return state.user ? state.user : {};
  }
}

export default getters;