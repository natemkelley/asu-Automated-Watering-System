<template>
  <v-card height="100%">
    <v-card-title>Current Status</v-card-title>
    <v-card-text>
      And: ({{willRun.andActive}}/{{willRun.andCounts}}),
      Or: ({{willRun.orActive}}/{{willRun.orCounts}})
      <v-chip style="float:right" small outlined :color="getColor">
        The system will
        {{ willRun.text }} on next trigger
      </v-chip>
    </v-card-text>

    <v-simple-table class="px-2" dense fixed-header height="240px">
      <template v-slot:default>
        <thead>
          <tr>
            <th v-for="head in headers" :key="head" class="text-left">{{head}}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(setting,n) in currentStati"
            :key="n"
            v-bind:class="[setting.status.toLowerCase(),setting.operand.toLowerCase()]"
          >
            <td>{{ setting.name }}</td>
            <td>{{ setting.level }}</td>
            <td class="capitalize">{{ setting.threshhold }}</td>
            <td class="capitalize">{{ setting.operand }}</td>
            <td>{{ setting.status }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <div class="pb-4 pt-2 px-3">
      <v-btn
        block
        :dark="!loading"
        :color="color"
        depressed
        :loading="loading"
        :disabled="loading"
        @click="check()"
      >
        Run System Check
        <template v-slot:loader>
          <span class="custom-loader">
            <v-icon light>mdi-cached</v-icon>
          </span>
        </template>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import colors from "vuetify/es5/util/colors";
import axios from "axios";
import moment from "moment";

export default {
  name: "CurrentStatus",
  props: ["weatherSettings", "color"],
  data() {
    return {
      headers: ["Name", "Current Level", "Threshhold(s)", "Operand", "Status"],
      isOpen: false,
      loading: false,
      weather: null,
      lastCheck: "...",
      currentTime: new Date()
    };
  },
  mounted() {
    this.getCurrentWeather();
    this.updateCurrentTime();
  },
  computed: {
    willRun() {
      let andCounts = 0;
      let orCounts = 0;
      let thetotal = 0;
      let andActive = 0;
      let orActive = 0;
      let status = false;
      let text = "will not run";
      //console.log(this.currentStati);
      this.currentStati.forEach(el => {
        if (el.operand == "and" || el.operand == "or") {
          thetotal++;
        }
        if (el.operand == "and") {
          andCounts++;
          //console.log(el);
          if (el.status == "Activated") {
            andActive++;
          }
        }
        if (el.operand == "or") {
          orCounts++;
          if (el.status == "Activated") {
            orActive++;
          }
        }
      });

      if (orActive > 0 || andCounts === andActive) {
        status = true;
        text = "will run";
      }

      return {
        andActive: andActive,
        andCounts: andCounts,
        orCounts: orCounts,
        orActive: orActive,
        total: thetotal,
        status: status,
        text: text
      };
    },
    currentStati() {
      if (!this.weatherSettings.temperature || !this.weather) {
        return [];
      }

      var returnArray = [];

      //time
      returnArray.push({
        name: "Time",
        level: "Check " + this.getCountDownForTime(),
        threshhold: JSON.parse(this.weatherSettings.time.value).join(", "),
        operand:
          this.weatherSettings.time.active == "true" ? "Activated" : "Inactive",
        status:
          this.weatherSettings.time.active == "true" ? "Running" : "Stopped"
      });

      //timer
      returnArray.push({
        name: "Timer",
        level: this.getTimer(),
        threshhold: "Every " + this.weatherSettings.timer.value + " minutes",
        operand:
          this.weatherSettings.timer.active == "true"
            ? "Activated"
            : "Inactive",
        status:
          this.weatherSettings.timer.active == "true" ? "Running" : "Stopped"
      });

      //temperature
      returnArray.push({
        name: "Temperature",
        level: Math.round(Number(this.weather.main.temp)),
        threshhold: Math.round(Number(this.weatherSettings.temperature.value)),
        operand: this.weatherSettings.temperature.active,
        status: this.returnStatus(
          this.weatherSettings.temperature.active,
          Math.round(Number(this.weather.main.temp)),
          Math.round(Number(this.weatherSettings.temperature.value)),
          false
        )
          ? "Activated"
          : "Inactive"
      });
      //console.log(this.weather)
      returnArray.push({
        name: "% of Rain",
        level: Math.round(this.weather.futureweather.list[0].clouds.all) + "%",
        threshhold: Math.round(Number(this.weatherSettings.rain.value)) + "%",
        operand: this.weatherSettings.rain.active,
        status: this.returnStatus(
          this.weatherSettings.rain.active,
          Math.round(Number(this.weather.futureweather.list[0].clouds.all)),
          Math.round(Number(this.weatherSettings.rain.value)),
          false
        )
          ? "Activated"
          : "Inactive"
      });
      returnArray.push({
        name: "Humidity",
        level: Math.round(Number(this.weather.main.humidity)) + "%",
        threshhold:
          Math.round(Number(this.weatherSettings.humidity.value)) + "%",
        operand: this.weatherSettings.humidity.active,
        status: this.returnStatus(
          this.weatherSettings.humidity.active,
          Math.round(Number(this.weather.main.humidity)),
          Math.round(Number(this.weatherSettings.humidity.value)),
          true
        )
          ? "Activated"
          : "Inactive"
      });
      returnArray.push({
        name: "Moisture Sensors",
        level: this.getNumMoistureSensors(),
        threshhold: this.getReqMoistureSensors(),
        operand: this.weatherSettings.moistureSensors.active,
        status: this.returnStatus(
          this.weatherSettings.moistureSensors.active,
          this.getNumMoistureSensors(),
          this.getReqMoistureSensors(),
          false
        )
          ? "Activated"
          : "Inactive"
      });

      return returnArray;
    },
    getColor(){
      if(this.willRun.status == false){
        return ''
      } else{
        return 'success'
      }
    }
  },
  methods: {
    getTimer() {
      var future = moment(new Date(this.weatherSettings.timer.lastRunTime))
        .add(Number(this.weatherSettings.timer.value), "minutes")
        .fromNow();
      return "Check " + future;
    },
    returnStatus(active, value, threshhold, lowerbound) {
      if (active == "disabled") {
        return false;
      }
      if (lowerbound) {
        if (value <= threshhold) {
          return true;
        }
      } else {
        if (value >= threshhold) {
          return true;
        }
      }
      return false;
    },
    getCountDownForTime() {
      var today = moment(new Date()).format("YYYY/MM/DD");
      var sortedTimes = JSON.parse(this.weatherSettings.time.value).sort(
        function(a, b) {
          return new Date(today + " " + a) - new Date(today + " " + b);
        }
      );
      var nextDay = false;
      for (var i = 0; i < sortedTimes.length; i++) {
        if (
          moment(new Date(today + " " + sortedTimes[i])).diff(
            moment(new Date())
          ) < 0
        ) {
          nextDay = true;
        } else {
          return moment(new Date(today + " " + sortedTimes[i])).fromNow();
        }

        if (i === sortedTimes.length - 1) {
          if ((nextDay = true)) {
            today = moment(new Date(today))
              .add(1, "days")
              .format("YYYY/MM/DD");
            i = -1;
          }
        }
      }
    },
    check() {
      this.loading = true;
      setTimeout(() => {
        axios.get(`http://localhost:3000/api/system-check`).then(res => {
          this.$store.commit("triggerRefresh"); //this will trigger a refresh
          this.loading = false;
        });
      }, 1000);
    },
    getCurrentWeather() {
      axios.get(`http://localhost:3000/api/current-weather`).then(res => {
        this.weather = res.data;
      });
    },
    updateCurrentTime() {
      setInterval(() => {
        this.currentTime = new Date();
      }, 60 * 1000);
    },
    getReqMoistureSensors() {
      var count = 0;
      JSON.parse(this.weatherSettings.moistureSensors.value).forEach(
        (el, n) => {
          if (el.mustBeTrue == true) {
            count++;
          }
        }
      );
      return count;
    },
    getNumMoistureSensors() {
      var count = 0;
      JSON.parse(this.weatherSettings.moistureSensors.value).forEach(
        (el, n) => {
          if (el.moist == "true" || el.moist == true) {
            count++;
          }
        }
      );
      return count;
    }
  }
};
</script>

<style scoped>
.activeStatus {
  color: green;
}
.inactiveStatus {
  color: rgb(204, 0, 0);
}

.fixed_header {
  width: 400px;
  table-layout: fixed;
  border-collapse: collapse;
}

.fixed_header tbody {
  display: block;
  width: 100%;
  overflow: auto;
  height: 100px;
}

.fixed_header thead tr {
  display: block;
}

th {
  color: rgba(0, 0, 0, 0.54);
  user-select: none;
}
td,
th {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  text-align: left;
  padding: 8px;
  font-size: 14px;
}

tr:nth-child(even) {
  background-color: #fcfcfc;
}

.activated {
  background: rgba(0, 128, 0, 0.06) !important;
}

.inactive,
.running {
  background: white !important;
}
.disabled,
.stopped {
  /*background: rgba(128, 128, 128, 0.423) !important;*/
  color: rgba(27, 27, 27, 0.909);
}

.capitalize {
  text-transform: capitalize;
}

table {
  width: 100%;
}

.put-to-bottom {
  position: absolute;
  width: 100%;
  bottom: 0;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

//https://haltu.github.io/muuri/
//https://interactjs.io/
//---- https://codepen.io/eljefedelrodeodeljefe/pen/vybegM