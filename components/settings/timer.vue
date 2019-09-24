<template>
  <v-text-field
    v-model="number"
    type="number"
    class="mx-5 mt-2"
    label="Minutes"
    prepend-icon="mdi-timer"
    :loading="loading"
    @change="inputValidate"
    clearable
    @click:clear="inputValidate"
  ></v-text-field>
</template>

<script>
export default {
  name: "Timer",
  data() {
    return {
      loading: false,
      min: 15,
      max: 24 * 60 * 265,
      inputVal: null,
      number: 15
    };
  },
  methods: {
    inputValidate(val) {
      if (isNaN(val)) {
        this.number = this.min;
      }

      if (!this.number) {
        this.number = this.min;
      } else if (this.number < this.min) {
        this.number = this.min;
      } else if (this.number > this.max) {
        this.number = this.max;
      }
    }
  }
};
</script>
