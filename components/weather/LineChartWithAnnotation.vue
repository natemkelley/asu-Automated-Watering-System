<script>
import "chartjs-plugin-annotation";
import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ["chartData", "options", "annotateValue"],
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    options: {
      handler(newOption, oldOption) {
        this.options.animation = false;
        //this.options.annotation.annotations[0].value = this.annotateValue
        this.renderChart(this.chartData, this.options);
      },
      deep: true
    }
  }
};
</script>
<style>
</style>