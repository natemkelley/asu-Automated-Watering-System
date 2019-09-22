export const state = () => ({
  refresh: 0,
  model: null
});

export const mutations = {
  triggerRefresh(state) {
    state.refresh++;
  },
  toggleNav(state, val) {
    if (val) {
      return;
    }
    state.model = !state.model;
  }
};
