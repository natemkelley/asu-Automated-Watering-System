<template>
  <v-card height="100%">
    <v-card-title>Current Status</v-card-title>
    <v-card-text>Last system check was {{lastCheck}}</v-card-text>

    <v-simple-table class="px-2" dense fixed-header height="240px">
      <template v-slot:default>
        <tbody>
          <tr>
            <th v-for="head in headers" :key="head" class="text-left">{{head}}</th>
          </tr>
          <tr v-for="(setting,n) in currentStati" :key="n">
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
        color="green darken-1 white--text"
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
  props: ["weatherSettings"],
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
    color() {
      return colors.green.darken1;
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
          this.weatherSettings.time.active == "true" ? "Active" : "Inactive",
        status:
          this.weatherSettings.time.active == "true" ? "Running" : "Stopped"
      });

      //timer
      returnArray.push({
        name: "Timer",
        level: "...",
        threshhold: "Every " + this.weatherSettings.timer.value + " minutes",
        operand:
          this.weatherSettings.timer.active == "true" ? "Active" : "Inactive",
        status:
          this.weatherSettings.timer.active == "true" ? "Running" : "Stopped"
      });

      //temperature
      returnArray.push({
        name: "Temperature",
        level: Math.round(Number(this.weather.main.temp)),
        threshhold: Math.round(Number(this.weatherSettings.temperature.value)),
        operand: this.weatherSettings.temperature.active,
        status: this.returnStatus(this.weatherSettings.temperature.active, Math.round(Number(this.weather.main.temp)),Math.round(Number(this.weatherSettings.temperature.value)),false) ? 'Active' : 'Inactive'
      });
      returnArray.push({
        name: "% of Rain",
        level: Math.round(Number(this.weather.clouds.all)) +"%",
        threshhold: Math.round(Number(this.weatherSettings.rain.value)) +"%",
        operand: this.weatherSettings.rain.active,
        status: this.returnStatus(this.weatherSettings.rain.active, Math.round(Number(this.weather.clouds.all)),Math.round(Number(this.weatherSettings.rain.value)),true) ? 'Active' : 'Inactive'
      });
      returnArray.push({
        name: "Humidity",
        level: Math.round(Number(this.weather.main.humidity)) +"%",
        threshhold: Math.round(Number(this.weatherSettings.humidity.value)) +'%',
        operand: this.weatherSettings.humidity.active,
        status: this.returnStatus(this.weatherSettings.humidity.active, Math.round(Number(this.weather.main.humidity)),Math.round(Number(this.weatherSettings.humidity.value)),true) ? 'Active' : 'Inactive'
      });
      returnArray.push({
        name: "Moisture Sensors",
        level: this.getNumMoistureSensors(),
        threshhold: this.getReqMoistureSensors(),
        operand: this.weatherSettings.moistureSensors.active,
        status: this.returnStatus(this.weatherSettings.moistureSensors.active, this.getNumMoistureSensors(),this.getReqMoistureSensors(),false) ? 'Active' : 'Inactive'
      });


      return returnArray;
    }
  },
  methods: {
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
        this.loading = false;
        console.log(this.weatherSettings);
        console.log(this.weather);
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
      JSON.parse(this.weatherSettings.moistureSensors.value).forEach((el, n) => {
        if (el.mustBeTrue == true) {
          count++;
        }
      });
      return count;
    },
    getNumMoistureSensors() {
      var count = 0;
      JSON.parse(this.weatherSettings.moistureSensors.value).forEach((el, n) => {
        if (el.moist == 'true' || el.moist == true) {
          count++;
        }
      });
      return count;
    }
  }
};
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}

table {
  width: 100%;
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
    <v-container fluid>
      <v-row style="height: 100%;" class="yellow lighten-3" align="end" justify="center">

      </v-row>
    </v-container>