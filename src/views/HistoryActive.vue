<template>
  <div class="page-management main-content">
    <div class="container">
      <item-active :historyData="historyData"></item-active>
  </div>
    </div>
</template>

<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Action} from 'vuex-class';

import ItemActive from '@/components/history/ItemActive.vue'

@Component({
  name: 'HistoryActive',
  components: {
    ItemActive
  }
 
})
export default class Index extends Vue {
  @State(state => state.reports.Data) data: any;
  @Action("reports/get_all") listAction : any;

  @Watch('$route')
  onPageChanged() {
    this.initData();
  }

  get historyData() {
    return this.data
  }
  async initData() {
    return this.listAction({ query: this.$route.query });
  }
  created() {
    this.initData();
  }
}
</script>
