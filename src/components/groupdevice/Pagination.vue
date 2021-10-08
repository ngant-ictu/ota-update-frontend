
<template>
  <div class="wrap-pagination">
      <el-pagination
        :page-size="recordPerPage"
        layout="prev, pager, next"
        :total="totalItems"
        :current-page.sync="currentPage"
        @next-click="handlePageChange(nextPage)"
        @prev-click="handlePageChange(prevPage)"
        @current-change="handlePageChange(currentPage)">
      </el-pagination>
  </div>

</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
const querystring = require('querystring');

@Component
export default class Pagination extends Vue {
  @Prop() totalItems: any;
  @Prop() currentPage: any;
  @Prop() recordPerPage: any;
  @Prop({ type: Function, required: true }) handlePageChange: any 


  get current_page() {
    return this.currentPage
  }
  get nextPage() {
    return this.currentPage + 1;
  }
  get prevPage() {
    return this.currentPage - 1;
  }
  
}
</script>

<style lang="scss" scoped>
  .wrap-pagination {
    display: inline-block;
    width: 100%;
    margin-top: 30px;
    text-align: right;
  }
</style>


