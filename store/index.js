export const state = () => ({
    counter: 0,
    model: null
  })
  
export const mutations = {
    increment (state) {
      state.counter++
    },
    toggleNav(state, val){
      if(val){
        return
      }
      state.model = !state.model
    }
  }