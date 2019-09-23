//  v-if="category.name === settings.active"
<template>
  <v-container fluid style="min-height: 500px">
    <v-row v-show="loading" justify="center" align="center" class="loader">
      <div class="text-center ma-12">
        <v-progress-circular :size="80" :width="7" color="white" indeterminate></v-progress-circular>
      </div>
    </v-row>
    <v-row
      v-show="!loading"
      v-bind:class="{ loading: loading }"
      class="board"
      align="start"
      justify="start"
    >
      <v-col md="4" v-for="category in categories" class="board-column my-n6" :key="category.name">
        <div class="board-column-style" v-if="gridSettings">
          <div :class="'allcaps board-column-header '+ category.color">{{category.name}}</div>
          <div class="board-column-content-wrapper">
            <div class="board-column-content" :activeStatus="category.name">
              <div
                v-for="(setting) in filteredItems(gridSettings, category.name)"
                class="board-item"
                :objectname="setting.objectName"
                :key="setting.objectName"
              >
                <div class="board-item-content caps">{{setting.objectName}} - {{setting.active}}</div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  props: ["gridSettings"],
  data() {
    return {
      loading: true,
      ableToSave: false,
      created: false,
      categories: [
        { name: "and", color: "blue" },
        { name: "or", color: "orange" },
        { name: "disabled", color: "blue-grey darken-1" }
      ],
      columnGrids: []
    };
  },
  methods: {
    filteredItems: function(items, catName) {
      var arr = [];
      for (var key in items) {
        if (items[key].active == catName) {
          arr.push(items[key]);
        }
      }
      return arr;
    },
    //This creates a grid and triggers api refresh when items are moved
    createdGrid() {
      const Muuri = require("muuri");

      var itemContainers = [].slice.call(
        this.$el.querySelectorAll(".board-column-content")
      );

      // Define the column grids so we can drag those
      // items around.
      itemContainers.forEach(container => {
        // Instantiate column grid.
        var grid = new Muuri(container, {
          items: ".board-item",
          layoutDuration: 200,
          layoutEasing: "ease",
          dragEnabled: true,
          dragSort: () => {
            return this.columnGrids;
          },
          dragSortInterval: 0,
          dragContainer: this.$el,
          dragReleaseDuration: 400,
          dragReleaseEasing: "ease"
        })
          .on("dragStart", function(item) {
            // Let's set fixed widht/height to the dragged item
            // so that it does not stretch unwillingly when
            // it's appended to the document body for the duration of the drag.
            item.getElement().style.width = item.getWidth() + "px";
            item.getElement().style.height = item.getHeight() + "px";
          })
          .on("dragReleaseEnd", item => {
            // Let's remove the fixed width/height from the
            // dragged item now that it is back in a grid
            // column and can freely adjust to it's surroundings.
            item.getElement().style.width = "";
            item.getElement().style.height = "";
            this.startSavingGrids();
          });

        grid.hide();
        // Add the column grid reference to the column grids
        // array, so we can access it later on.
        this.columnGrids.push(grid);
      });
    },
    async saveLayout(columnGrids) {
      return new Promise(resolve => {
        columnGrids.forEach(container => {
          serializeLayout(container, "objectname").forEach(objectName => {
            this.saveValue(
              objectName,
              null,
              container.getElement().getAttribute("activeStatus")
            );
          });
        });
        resolve(true);
      });

      function serializeLayout(grid, attribute) {
        var itemIds = grid.getItems().map(function(item) {
          return item.getElement().getAttribute(attribute);
        });
        return itemIds;
      }
    },
    saveValue(objectName, value, active) {
      return new Promise(resolve => {
        axios
          .post(
            "/api/weather-settings",
            `query=${objectName}&value=${value}&active=${active}`
          )
          .then(response => {
            //console.log(response.data);
            resolve(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      });
    },
    toggleLoader() {
      this.loading = false;
      this.ableToSave = true;
    },
    refreshGrid() {
      this.columnGrids.forEach(function(grid) {
        grid.show(null, {
          onFinish: items => {
            grid.refreshItems().layout();
          }
        });
      });
    },
    startSavingGrids() {
      console.log("saving!!!!!");
      if (!this.loading && this.ableToSave) {
        this.ableToSave = false;
        this.saveLayout(this.columnGrids).then(() => {
          this.$store.commit("triggerRefresh"); //this will trigger a refresh
          this.ableToSave = true;
        });
      }
    },
    destoryGrid() {
      if (this.columnGrids.length) {
        console.log(this.columnGrids);
        this.columnGrids.forEach(grid => {
          console.log("destoryed", grid);
          grid.destroy();
        });

        this.columnGrids = [];
      }
    }
  },
  watch: {
    gridSettings(newData, oldData) {
      this.$nextTick(() => {
        this.destoryGrid();
        this.createdGrid();
        this.toggleLoader();
        this.refreshGrid();
      });
    }
  },
  computed: {
    showError() {
      if (this.gridSettings && !this.loading) {
        if (
          this.gridSettings.timer.active == "disabled" &&
          this.gridSettings.time.active == "disabled"
        ) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>

<style scoped>
.allcaps {
  text-transform: uppercase;
}

.caps {
  text-transform: capitalize;
}

.loader {
  width: 100%;
  height: 500px;
}
.loading {
  width: 100%;
  opacity: 0.05;
  top: 0;
  padding-top: 50px;
  transition: 1s;
  height: 500px !important;
}

.board {
  /*position: relative;*/
  height: auto !important;
}
.board-column {
  z-index: 1;
  transform: none !important;
}

.board-column-style {
  margin: 0 0;
  background: #f0f0f0;
  border-radius: 3px;
  z-index: 1;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
}

.board-column.muuri-item-releasing {
  z-index: 2;
}
.board-column.muuri-item-dragging {
  z-index: 3;
  cursor: move;
}
.board-column-header {
  position: relative;
  height: 50px;
  line-height: 50px;
  overflow: hidden;
  padding: 0 20px;
  text-align: center;
  background: #333;
  color: #fff;
  border-radius: 3px 3px 0 0;
}

.board-column.todo .board-column-header {
  background: #4a9ff9;
}
.board-column.working .board-column-header {
  background: #f9944a;
}
.board-column.done .board-column-header {
  background: #2ac06d;
}
.board-column-content {
  position: relative;
  border: 10px solid transparent;
  min-height: 95px;
}
.board-item {
  position: absolute;
  width: 100%;
  margin: 5px 0;
}
.board-item.muuri-item-releasing {
  z-index: 9998;
}
.board-item.muuri-item-dragging {
  z-index: 9999;
  cursor: move;
}
.board-item.muuri-item-hidden {
  z-index: 0;
}
.board-item-content {
  position: relative;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  font-size: 17px;
  cursor: pointer;
  -webkit-box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
  color: black;
}
@media (max-width: 600px) {
  .board-item-content {
    text-align: center;
  }
  .board-item-content span {
    display: none;
  }
}
</style>

https://codepen.io/niklasramo/pen/YveqNN