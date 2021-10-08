<template>
  <div class="dialog-devicegroup">
    <el-button type="success" @click="onOpen()">Update DeviceGroup</el-button>
    <el-dialog
      title="Update follow group"
      :visible.sync="visible"
      v-on:close="onClose"
      width="50%"
      center
    >
      <el-form ref="formInfo" :model="formInfo" label-width="150px">
        <el-form-item
          v-if="formInfo.deviceIDs.length == 0"
          label="Select device group"
          prop="valueGroup"
          :rules="[{ required: true, message: 'valueGroup is required' }]"
        >
          <!-- {{ deviceGroup }} -->
          <el-select
            v-model="formInfo.valueGroup"
            placeholder="Select device group"
          >
            <el-option
              v-for="item in deviceGroup"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="formInfo.deviceIDs.length > 0" label="Devices">
          <el-select
            v-model="formInfo.deviceIDs"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="Add a device"
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
        <el-form-item
          label="Patch Selection"
          prop="updateChecking"
          :rules="[{ required: true, message: 'Patch selection is required' }]"
        >
          <el-select
            v-model="formInfo.updateChecking"
            placeholder="Select patch selection"
            @change="handlePatchSelection"
          >
            <el-option
              v-for="(item, index) in patchSelectionOption"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formInfo.updateChecking === 'manual'"
          label="Select version"
          prop="versionUpdate"
          :rules="[{ required: true, message: 'versionUpdate is required' }]"
        >
          <el-select
            v-model="formInfo.versionUpdate"
            placeholder="Select a version"
          >
            <el-option
              v-for="item in listVersion"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formInfo.updateChecking === 'auto'"
          label="Select version"
          prop="versionUpdate"
          :rules="[{ required: true, message: 'versionUpdate is required' }]"
        >
          <el-select
            v-model="formInfo.versionUpdate"
            placeholder="Select a version"
          >
            <el-option
              :key="listVersionAuto"
              :label="listVersionAuto"
              :value="listVersionAuto"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="Reboot schedule"
          prop="rebootSchedule"
          :rules="[{ required: true, message: 'Reboot schedule is required' }]"
        >
          <el-select
            v-model="formInfo.rebootSchedule"
            placeholder="Select reboot schedule"
          >
            <el-option
              v-for="(item, index) in rebootScheduleOption"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose()">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit()">Update</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { State, Action } from "vuex-class";

@Component
export default class GroupDevice extends Vue {
  @Prop() listDevices: any;
  @State((state) => state.deviceManage.DataVersion) dataVersion: any;
  @State((state) => state.deviceManage.DataVersionAuto) dataVersionAuto: any;
  @State((state) => state.groupDevice.Data) deviceGroup: any;
  @State((state) => state.deviceManage.RebootSchedule)
  rebootScheduleOption: any;
  @State((state) => state.deviceManage.PatchSelection)
  patchSelectionOption: any;
  @State((state) => state.deviceManage.statusCode) statusCode: any;
  @Action("deviceManage/update_group") updateGroupAction: any;
  @Action("deviceManage/get_version") versionAction: any;
  @Action("deviceManage/get_version_auto") versionAutoAction: any;
  @Action("groupDevice/get_all") groupDeviceAction: any;
  @Action("groupDevice/search_device") searchAction: any;

  visible: boolean = false;
  listVersion: any = [];
  listVersionAuto: any = [];
  optionsDevice: any = [];
  formInfo: any = {
    updateChecking: "",
    valueGroup: "",
    versionUpdate: "",
    rebootSchedule: "",
    deviceIDs: [],
  };
  formUpdate: any = {};
  loading: boolean = false;
  $refs: any = {
    formInfo: HTMLFormElement,
  };
  //   @Watch("formInfo", { deep: true })
  //   onFormInfoChanged() {
  //     console.log("vao day");
  //     if (this.formInfo.valueGroup) {
  //       this.formInfo.deviceIDs = [];
  //     }
  //   }
  @Watch("dataVersion")
  onDataVersionChanged() {
    this.getVersion();
  }
  @Watch("dataVersionAuto")
  onDataVersionAutoChanged() {
    console.log("dataVersionAuto", this.dataVersionAuto);
    this.getVersionAuto();
  }

  getVersion() {
    this.dataVersion.forEach((item: any) => {
      const index = this.listVersion.findIndex(
        (version: any) => version === item.version
      );
      //   console.log("index", index, item.version);
      if (item.version && index === -1) {
        this.listVersion.push(item.version);
      }
    });
  }
  getVersionAuto() {
    this.listVersionAuto = this.dataVersionAuto.version;
  }
  async remoteDevice(query: any) {
    if (query !== "") {
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

  handlePatchSelection(val: any) {
    console.log("val", val);
    if (val === "auto") {
      this.versionAutoAction();
    } else if (val === "manual") {
      this.versionAction();
    }
  }

  handleSubmit() {
    this.$refs.formInfo.validate((valid: any) => {
      if (valid) {
        this.formUpdate.rebootSchedule = this.formInfo.rebootSchedule;
        this.formUpdate.updateChecking = this.formInfo.updateChecking;
        if (this.formInfo.valueGroup && this.formInfo.deviceIDs.length == 0) {
          this.updateGroupAction({
            formInfo: this.formInfo,
            formUpdate: this.formUpdate,
            query: {
              deviceGroup: this.formInfo.valueGroup,
              //   numberOfDevices: this.formInfo.numberOfDevices,
            },
          }).then((res: any) => {
            if (this.statusCode.code === 200) {
              this.$notify({
                title: this.statusCode.message,
                message: "Save changes success",
                type: "success",
              });
            } else {
              this.$notify.error({
                title: "Error",
                message:
                  this.statusCode.errors && this.statusCode.errors.reason,
              });
            }
            this.listVersion = [];
            this.visible = false;
            this.formInfo.deviceIDs = [];
            this.$refs.formInfo.resetFields();
          });
        } else if (
          this.formInfo.deviceIDs.length > 0 &&
          !this.formInfo.valueGroup
        ) {
          this.formUpdate.deviceIDs = this.formInfo.deviceIDs;
          this.updateGroupAction({
            formInfo: this.formInfo,
            formUpdate: this.formUpdate,
            query: {
              //   numberOfDevices: this.formInfo.numberOfDevices,
            },
          }).then((res: any) => {
            if (this.statusCode.code === 200) {
              this.$notify({
                title: this.statusCode.message,
                message: "Save changes success",
                type: "success",
              });
            } else {
              this.$notify.error({
                title: "Error",
                message:
                  this.statusCode.errors && this.statusCode.errors.reason,
              });
            }
            this.listVersion = [];
            this.visible = false;
            this.formInfo.deviceIDs = [];
            this.$refs.formInfo.resetFields();
          });
        } else {
          console.log(
            "vao day nha",
            this.formInfo.deviceIDs.length,
            this.formInfo.valueGroup
          );
        }
      }
    });
  }
  async onOpen() {
    this.visible = true;
    console.log("this.listDevices", this.listDevices);
    this.listDevices.forEach((item: any) => {
      const index = this.formInfo.deviceIDs.findIndex(
        (deviceID: any) => deviceID === item.deviceID
      );
      if (item.deviceID && index === -1) {
        this.formInfo.deviceIDs.push(item.deviceID);
      }
    });
    this.groupDeviceAction();
  }
  onClose() {
    this.listVersion = [];
    this.visible = false;
    this.formInfo.deviceIDs = [];
    this.$refs.formInfo.resetFields();
  }
}
</script>

<style lang="scss" scoped>
form.el-form {
  width: 650px;
  margin: auto;
}
.el-select,
.el-input {
  width: 400px !important;
}
</style>
