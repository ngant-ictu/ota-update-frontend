<template>
  <div class="dialog-devicelog">
    <el-tooltip
      class="item"
      effect="dark"
      content="View device log"
      placement="top"
    >
      <el-button
        type="warning"
        size="mini"
        icon="el-icon-news"
        circle
        @click="onOpen()"
      ></el-button>
    </el-tooltip>
    <el-dialog
      title=""
      :visible.sync="visible"
      v-on:open="onOpen"
      v-on:close="onClose"
      width="50%"
      center
    >
      <div v-if="logDevice && logDevice[0]">
        <h3>
          Log device:
          <span style="color: red">{{
            logDevice && logDevice[0] && logDevice[0].deviceID
          }}</span>
        </h3>
        <pagination
          :handlePageChange="handlePageChange"
          :totalItems="totalItems"
          :recordPerPage="recordPerPage"
          :currentPage="query.page"
        ></pagination>
        <el-table
          id="table-id"
          style="width: 100%"
          :data="logDevice"
          row-key=""
          :default-sort="{ Order: 'Descending ' }"
        >
          >
          <el-table-column label="Create Date">
            <template slot-scope="scope">
              {{ formatDate(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="Download" align="center">
            <template slot-scope="scope">
              <el-button
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="downloadFile(scope.row.fileName)"
                >Download</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else style="color: red; font-size: 20px; text-algin: center;">
        Devicelog is empty
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import moment from "moment";
import Pagination from "@/components/groupdevice/Pagination.vue";

@Component({
  components: {
    Pagination,
  },
})
export default class DeviceLog extends Vue {
  @Prop() itemId: any;
  @State((state) => state.deviceLog.statusCode) statusCode: any;
  @State((state) => state.deviceLog.DataLog) logDevice: any;
  @State((state) => state.deviceLog.totalItems) totalItems: any;
  @State((state) => state.deviceLog.recordPerpage) recordPerPage: any;
  @State((state) => state.deviceLog.query) query: any;
  @Action("deviceLog/device_log") devicelogAction: any;
  @Action("deviceLog/download_file") downloadfileAction: any;

  visible: boolean = false;
  loading: boolean = false;
  formInfo: any = {};
  $refs: any = {
    formInfo: HTMLFormElement,
  };

  formatDate(data: any) {
    return moment(new Date(data))
      .local()
      .format("YYYY-MM-DD HH:mm:ss");
  }

  handleSubmit() {}
  async handlePageChange(page: any) {
    return await this.loadData(page);
  }
  loadData(page: any) {
    this.devicelogAction({
      query: {
        deviceID: this.itemId,
        page: page,
        limit: 5,
      },
    });
  }
  async onOpen() {
    this.visible = true;
    this.loadData(1);
  }
  onClose() {
    this.visible = false;
  }
  async downloadFile(filename: any) {
    await this.downloadfileAction({
      fileName: filename,
    }).then((res: any) => {
      console.log("statusCode", this.statusCode);
      if (this.statusCode.code == 200) {
        const getLink = this.statusCode.data;
        console.log("responseData", getLink);
        var fileURL = getLink.linkDownload;
        console.log("fileURL", fileURL);
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        document.body.appendChild(fileLink);
        fileLink.click();
      } else {
        this.$notify.error({
          title: "Error",
          message: "File isn't extis",
        });
      }
    });
  }
}
</script>

<style lang="scss">
.dialog-devicelog {
  .el-dialog__header {
    display: none;
  }
  h3 {
    margin: 0;
  }
}
</style>
