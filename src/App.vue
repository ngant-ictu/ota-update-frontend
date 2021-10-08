<template>
  <div id="app">
    <el-row class="layout-container flex ">
      <el-col :span="24" class="flex column box grow">
        <header-top></header-top>
        <router-view/>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import HeaderTop from "@/components/Header.vue";

@Component({
  components: {
    HeaderTop
  }
})
export default class MainPage extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.container {
  padding: 0 50px;
}
.main-content {
  margin: 30px 0 80px 0;
}
</style>
