<template>
	<el-menu
    :default-active.sync="activeLink"
    @select="goto"
    :unique-opened="true"
    background-color="transparent"
    class="main-navigation-menu"
	mode="horizontal"
  >
    <template>
        <!-- <el-menu-item index="/">
            <span>New patch</span>
        </el-menu-item>
        <el-menu-item index="/path-management">
            <span>Patch management</span>
        </el-menu-item>
        <el-menu-item index="/device-management"> 
            <span>Device management</span>
        </el-menu-item> 
        <el-menu-item index="/group-device"> 
            <span>Group Device</span>
        </el-menu-item> 
        <el-menu-item index="/history-active"> 
            <span>History Active</span>
        </el-menu-item>  -->
        <el-menu-item>
          <router-link to="/">New patch</router-link>
        </el-menu-item>
        <el-menu-item>
          <router-link to="/path-management">Patch management</router-link>
        </el-menu-item>
        <el-menu-item> 
          <router-link to="/device-management">Device management</router-link>
        </el-menu-item> 
        <el-menu-item> 
          <router-link to="/group-device">Group Device</router-link>
        </el-menu-item> 
        <el-menu-item>
          <router-link to="/history-active">History Active</router-link> 
        </el-menu-item> 
    </template>
  </el-menu>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class MainMenu extends Vue {
  activeLink: any;

  goto(index: any, indexPath: any) {
    if (index.charAt(0) === "/") {
      this.$router.push(index);
      this.$emit("push-page", { page: index });
    }
  }
  setLink(path: any) {
    this.activeLink = path
  }
  created() {
    this.setLink(this.$router.currentRoute.path)
    this.$router.afterEach((to, from) => {
      this.setLink(this.$router.currentRoute.path)
    })
  }
 
}
</script>
<style lang="scss" scoped>
.el-menu--horizontal > .el-menu-item {
    padding: 0;
    a {
      color: #000;
      text-decoration: none;
      line-height: 60px;
      display: inline-block;
      padding: 0 20px;
      border-bottom: 2px solid transparent;
      &.router-link-exact-active, &:hover {
        border-color: #ff0033;
      }
    }
  } 
.el-menu--horizontal > .el-menu-item:not(:first-child) a.router-link-active {
  border-color: #ff0033;
}
</style>
