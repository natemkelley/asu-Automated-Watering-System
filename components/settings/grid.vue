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
      <v-col md="4" v-for="category in categories" class="board-column">
        <div class="board-column-style mx-1">
          <div :class="'board-column-header '+ category.color">{{category.name}}</div>
          <div class="board-column-content-wrapper">
            <div class="board-column-content" blast="123" :testing="category.name">
              <div v-for="n in 5" class="board-item" :swaggah="n">
                <div class="board-item-content">
                  <span>Item #</span>
                  {{n}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      items: 15,
      loading: true,
      categories: [
        { name: "AND", color: "blue" },
        { name: "OR", color: "orange" },
        { name: "DISABLED", color: "blue-grey darken-1" }
      ],
      columnGrids: []
    };
  },
  created() {},
  mounted() {
    this.createdGrid(); //will turn off loader when finished
  },
  methods: {
    createdGrid() {
      const Muuri = require("muuri");

      var itemContainers = [].slice.call(
        this.$el.querySelectorAll(".board-column-content")
      );
      var boardGrid;

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
            // it's appended to the document body for the
            // duration of the drag.
            item.getElement().style.width = item.getWidth() + "px";
            item.getElement().style.height = item.getHeight() + "px";
          })
          .on("dragReleaseEnd", item => {
            // Let's remove the fixed width/height from the
            // dragged item now that it is back in a grid
            // column and can freely adjust to it's
            // surroundings.
            item.getElement().style.width = "";
            item.getElement().style.height = "";
          })
          .on("layoutEnd", items => {
            // Let's keep the board grid up to date with the
            // dimensions changes of column grids.
            this.saveLayout(this.columnGrids, "swaggah");
          });

        grid.hide();
        // Add the column grid reference to the column grids
        // array, so we can access it later on.
        this.columnGrids.push(grid);
      });
      this.toggleLoader();
    },
    saveLayout(columnGrids) {
      columnGrids.forEach((container, n) => {
        window.localStorage.setItem(
          container.getElement().getAttribute("testing"),
          serializeLayout(container, "swaggah")
        );
      });
      function serializeLayout(grid, attribute) {
        var itemIds = grid.getItems().map(function(item) {
          return item.getElement().getAttribute(attribute);
        });
        return JSON.stringify(itemIds);
      }
    },
    toggleLoader() {
      this.loading = false;
      this.toggleGrid();
    },
    toggleGrid() {
      this.columnGrids.forEach(function(grid) {
        grid.show(null, {
          onFinish: items => {
            grid.refreshItems().layout();
          }
        });
      });
    }
  }
};
</script>

<style scoped>
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
  max-width: 100%;
  height: auto !important;
}
.board-column {
  /*position: absolute;*/
  left: 0;
  right: 0;
  /*width: 30%;*/
  margin: 0 0;
  z-index: 1;
  transform: none !important;
}

.board-column-style {
  margin: 0 0;
  background: #f0f0f0;
  border-radius: 3px;
  z-index: 1;
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