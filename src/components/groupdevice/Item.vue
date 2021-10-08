<template>
  <div class="container">
    <div class="edit-group">
      <div class="top-edit-block">
        <div class="top-block">
          <h3>
            Edit Group Item: <span class="red-color">{{ formInfo.name }}</span>
          </h3>
          <el-button type="primary" @click="handleSubmit()">Update</el-button>
        </div>
      </div>
      <el-form ref="formInfo" :model="formInfo" label-width="150px">
        <el-form-item
          label="Name Group"
          prop="name"
          :rules="[{ required: true, message: 'Name is required' }]"
        >
          <el-input
            type="text"
            placeholder="Enter a title playlist"
            v-model="formInfo.name"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="other_names">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="Enter a description"
            v-model="formInfo.description"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="Add device" prop="deviceIDs">
          <el-select
            v-model="selectedDevice"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="Please enter a keyword"
            :remote-method="remoteDevice"
            :loading="loading"
          >
            <el-option
              v-for="item in optionsDevice"
              :key="item.deviceID"
              :label="item.deviceID"
              :value="item.deviceID"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <device-item
        :id="formInfo.id"
        :deviceData="deviceData"
        :handlePageChange="handlePageChange"
      ></device-item>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import DeviceItem from "@/components/groupdevice/DeviceItem.vue";

@Component({
  components: {
    DeviceItem,
  },
})
export default class GroupItem extends Vue {
  @State((state) => state.groupDevice.DataItem) dataItem: any;
  @State((state) => state.groupDevice.DeviceData) deviceData: any;
  @State((state) => state.groupDevice.errorMessage) dataError: any;
  @Action("groupDevice/get_one") listAction: any;
  @Action("groupDevice/search_device") searchAction: any;
  @Action("groupDevice/update_group") updateAction: any;
  @Action("groupDevice/get_device") deviceAction: any;

  formInfo: any = {};
  formUpdate: any = {};
  selectedDevice: any = "";
  optionsDevice: any = [];
  loading: boolean = false;
  $refs: any = {
    formInfo: HTMLFormElement,
  };

  @Watch("$route")
  onPageChanged() {
    this.initData();
    this.loadDeviceData(1);
  }
  @Watch("dataItem")
  onDataItemChange() {
    this.formInfo = Object.assign({}, this.dataItem);
  }
  get Id() {
    return this.$route.params.id;
  }
  async remoteDevice(query: any) {
    if (query !== "") {
      console.log("query", query);
      this.loading = true;
      await this.searchAction({ deviceID: query }).then((res: any) => {
        console.log("res search", res);
        res.data.forEach((item: any) => {
          if (
            !this.optionsDevice.find((el: any) => el.deviceID === item.deviceID)
          ) {
            this.optionsDevice.push(item);
          }
        });
        this.loading = false;
        console.log("res.results", res.data);
        console.log("this.optionsDevice", this.optionsDevice);
      });
    } else {
      this.optionsDevice = [];
    }
  }
  handleSubmit() {
    this.$refs.formInfo.validate((valid: any) => {
      if (valid) {
        console.log("this.selectedDevice", this.selectedDevice);
        if (this.formInfo.name !== this.dataItem.name) {
          this.formUpdate.name = this.formInfo.name;
        }
        if (this.formInfo.description !== this.dataItem.description) {
          this.formUpdate.description = this.formInfo.description;
        }
        if (this.selectedDevice.length > 0) {
          this.formUpdate.action = "add";
        }
        this.formUpdate.deviceIDs = this.selectedDevice;
        this.updateAction({
          formUpdate: this.formUpdate,
          id: this.formInfo.id,
        }).then(() => {
          if (this.dataError.code === 200) {
            this.$notify({
              title: this.dataError.message,
              message: "Save changes success",
              type: "success",
            });
          } else {
            this.$notify.error({
              title: "Error",
              message: this.dataError.errors && this.dataError.errors.reason,
            });
          }
          this.formUpdate = {};
          this.loadDeviceData(1);
        });
      }
    });
  }
  async handlePageChange(page: any) {
    return await this.loadDeviceData(page);
  }
  async initData() {
    this.listAction({
      id: this.Id,
    });
  }
  async loadDeviceData(page: any) {
    return await this.deviceAction({
      query: {
        page: page,
        limit: 20,
        deviceGroupID: this.Id,
      },
    });
  }

  created() {
    this.initData();
    this.loadDeviceData(1);
  }
}
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.top-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
