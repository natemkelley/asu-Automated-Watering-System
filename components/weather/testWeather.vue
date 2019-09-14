<template>
  <div>
    <canvas id="chartJSContainer" style="height: 90%; width: 90%;"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
import "chartjs-plugin-annotation";
// load the options file externally for better readability of the component.
//https://www.npmjs.com/package/chartjs-plugin-dragdata

export default {
  data() {
    return {
      chartOptions: null
    };
  },
  mounted() {
    var options = {
      type: "bar",
      data: {
        labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: [
              "#3e95cd",
              "#8e5ea2",
              "#3cba9f",
              "#e8c3b9",
              "#c45850"
            ],
            data: [10, 15, 5, 20, 12]
          }
        ]
      },
      options: {
        responsive: false,
        dragData: true,
        onDragStart: function(e) {
          //console.log("test");
          //console.log(e.clientY)
          //console.log(test.scales["y-axis-0"].getValueForPixel(e.clientY))
        },
        onDrag: function(e, datasetIndex, index, value) {
          console.log(e);
        },
        onDragEnd: function(e, datasetIndex, index, value) {
          // console.log(datasetIndex, index, value)
        },
        annotation: {
          events: ["click"],
          annotations: [
            {
              drawTime: "afterDatasetsDraw",
              id: "hline",
              type: "line",
              mode: "horizontal",
              scaleID: "y-axis-0",
              value: 12,
              borderColor: "black",
              borderWidth: 5,
              label: {
                backgroundColor: "red",
                content: "Test Label",
                enabled: true
              },
              onClick: function(e) {
                // The annotation is is bound to the `this` variable
                console.log("Annotation", e.type, this);
              },
              draggable: true,
              onDrag: function(event) {
                console.log("draggablee", event.subject.config.value);
              }
            },
            {
              drawTime: "beforeDatasetsDraw",
              type: "box",
              xScaleID: "x-axis-0",
              yScaleID: "y-axis-0",
              xMin: "February",
              xMax: "April",
              yMin: 10,
              yMax: 13,
              backgroundColor: "rgba(101, 33, 171, 0.5)",
              borderColor: "rgb(101, 33, 171)",
              borderWidth: 1,
              onClick: function(e) {
                console.log("Box", e.type, this);
              }
            }
          ]
        }
      }
    };
    require("chartjs-plugin-dragdata");
    var ctx = document.getElementById("chartJSContainer").getContext("2d");
    window.test = new Chart(ctx, options);
  },
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById("chart");
      const myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "2015-01",
            "2015-02",
            "2015-03",
            "2015-04",
            "2015-05",
            "2015-06",
            "2015-07",
            "2015-08",
            "2015-09",
            "2015-10",
            "2015-11",
            "2015-12"
          ],
          datasets: [
            {
              label: "# of Tomatoes",
              data: [12, 19, 3, 5, 2, 3, 20, 3, 5, 6, 2, 1]
            }
          ]
        },
        options: {
          responsive: false,
          scales: {
            xAxes: [
              {
                ticks: {
                  maxRotation: 90,
                  minRotation: 80
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
    }
  }
};
</script>
<style>
</style>