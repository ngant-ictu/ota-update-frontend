<template>
  <div  class="header ">
    <div class="container">
        <div class="flex align-center justify-space-between align-item-center">
             <div class="box-left box grow flex">
            <div class="box-logo flex align-center">
                <router-link to="/"><img class="image-logo" src="../assets/logo.svg" alt="logo" style="width: 80px"></router-link>
            </div>
            <div class="main-menu">
                <main-menu></main-menu>
            </div>
            </div>
        </div>
    </div>
   
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import MainMenu from "@/components/MainMenu.vue";

@Component({
  components: {
    MainMenu
  }
})
export default class HeaderTop extends Vue {}
</script>

<style lang="scss" scoped>
.header {
    box-sizing: border-box;
    border-bottom: 1px solid #eaecef;
    .box-logo {
        margin-right: 50px;
    }
    .el-menu.el-menu--horizontal {
        border-bottom: 0;
    }
}
</style>


