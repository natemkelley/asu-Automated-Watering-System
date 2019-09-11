<template>
  <ul>
    <li v-for="todo in todos">
      <input type="checkbox" :checked="todo.done" @change="toggle(todo)">
      <span :class="{ done: todo.done }">{{ todo.text }}</span>
    </li>
    <li><input placeholder="What needs to be done?" @keyup.enter="addTodo"></li>
  </ul>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  mounted() {
    console.log(this.$store.state)
  },
  computed: {
    todos () {
      return this.$store.state.testState.list
    }
  },
  methods: {
    addTodo (e) {
      this.$store.commit('testState/add', e.target.value)
      e.target.value = ''
    },
    ...mapMutations({
      toggle: 'testState/toggle'
    })
  }
}
</script>

<style>
.done {
  text-decoration: line-through;
}
</style>