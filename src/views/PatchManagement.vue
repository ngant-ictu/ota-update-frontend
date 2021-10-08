<template>
  <div class="page-management main-content">
    <div class="container">
      <patch-management :pathData="pathData"></patch-management>
  </div>
    </div>
</template>

<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Action} from 'vuex-class';

import PatchManagement from '@/components/PatchManagement.vue'

@Component({
  name: 'PathManagement',
  components: {
    PatchManagement
  }
})
export default class Index extends Vue {
  @State(state => state.pathManagement.Data) data: any;
  @Action("pathManagement/get_all") listAction : any;

  @Watch('$route')
  onPageChanged() {
    this.initData();
  }

  get pathData() {
    return this.data
  }
  async initData() {
    return this.listAction();
  }
  created() {
    this.initData();
  }
}
</script>
