<template>
  <div class="device-management ota-main-content">
    <div class="inner-device-manage">
      <h2>Device patch management</h2>
      <el-form label-position="left" label-width="150px" :model="formDevice">
        <el-form-item label="Device S/N">
          <el-input v-model="formDevice.deviceID" disabled></el-input>
        </el-form-item>
        <el-form-item label="Device group">
          <el-input v-model="nameGroup" disabled></el-input>
        </el-form-item>
        <el-form-item label="Status">
          <el-select
            v-model="formDevice.status"
            placeholder="Select Status"
            disabled
          >
            <el-option
              v-for="(item, index) in statusGroup"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="System A patch">
          <el-input v-model="formDevice.systemAPatch" disabled></el-input>
        </el-form-item>
        <el-form-item label="System B patch">
          <el-input v-model="formDevice.systemBPatch" disabled></el-input>
        </el-form-item>
        <el-form-item label="Live System">
          <div class="group-block flex">
            <el-input v-model="liveSystem" disabled></el-input>
            <el-button type="danger" @click="handleReboot()">Reboot</el-button>
          </div>
        </el-form-item>
        <el-form-item label="Boot system">
          <el-select
            v-model="formDevice.bootSystem"
            placeholder="Select boot system"
          >
            <el-option
              v-for="(item, index) in bootSystem"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="iplVersion">
          <el-input v-model="formDevice.iplVersion" disabled></el-input>
        </el-form-item>
        <el-form-item label="uBoot system">
          <el-input v-model="formDevice.ubootVersion" disabled></el-input>
        </el-form-item>
        <el-form-item label="Kernel system">
          <el-input v-model="formDevice.kernelVersion" disabled></el-input>
        </el-form-item>
        <el-form-item label="Version system">
          <el-input v-model="formDevice.systemVersion" disabled></el-input>
        </el-form-item>
        <el-form-item label="Patch selection">
          <el-select
            v-model="formDevice.updateSelection"
            placeholder="Select path selection"
          >
            <el-option
              v-for="(item, index) in patchSelection"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-show="formDevice.updateSelection == 'manual'"
          label="Patch name"
        >
          <el-select v-model="patch_name" placeholder="Select package">
            <el-option
              v-for="item in filterPackage"
              :key="item.name"
              :value="item.name"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Update check">
          <div class="group-block flex">
            <el-select
              v-model="formDevice.updateChecking"
              placeholder="Select updata check"
              disabled
            >
              <el-option
                v-for="(item, index) in patchSelection"
                :value="item"
                :key="index"
              ></el-option>
            </el-select>
            <el-button
              v-show="formDevice.updateChecking == 'manual'"
              type="success"
              @click="handleCheckUpdate()"
              >Check update</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="Reboot schedule">
          <el-select
            v-model="formDevice.rebootSchedule"
            placeholder="Select reboot schedule"
          >
            <el-option
              v-for="(item, index) in rebootSchedule"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formDevice.rebootSchedule == 'manual'"
          label="Time Reboot"
        >
          <el-time-picker
            v-model="formDevice.rebootTime"
            :picker-options="{
              selectableRange: handleTime(),
            }"
            placeholder="Select time reboot"
            value-format="HH:mm:ss"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="Patch verification">
          <el-select
            v-model="selectVerification"
            placeholder="Select reboot schedule"
          >
            <el-option
              v-for="(item, index) in verificationOptions"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="handleSubmit()"
            >Save changes</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import moment from "moment";

@Component
export default class DeviceDetail extends Vue {
  @State((state) => state.deviceManage.DataItem) dataItem: any;
  @State((state) => state.groupDevice.DataItem) groupItem: any;
  @State((state) => state.pathManagement.Data) packageData: any;
  @State((state) => state.deviceManage.DeviceGroup) deviceGroup: any;
  @State((state) => state.deviceManage.ServerEndpoint) serverEndpoint: any;
  @State((state) => state.deviceManage.BootSystem) bootSystem: any;
  @State((state) => state.deviceManage.PatchSelection) patchSelection: any;
  @State((state) => state.deviceManage.RebootSchedule) rebootSchedule: any;
  @State((state) => state.deviceManage.statusCode) getCode: any;
  @Action("deviceManage/get_one") listAction: any;
  @Action("pathManagement/get_package") listAllAction: any;
  @Action("deviceManage/reboot") rebootAction: any;
  @Action("deviceManage/check_update") checkUpdateAction: any;
  @Action("deviceManage/update_all") updateAllAction: any;
  @Action("groupDevice/get_one") devicegroupAction: any;

  formDevice: any = {};
  formUpdate: any = {};

  statusGroup = ["activated", "unactivated"];
  verificationOptions = ["On", "Off"];
  selectVerification: any = "";
  liveSystem: any = "";
  filterPackage: any = [];
  patch_name: any = "";
  timeSchedule: any = "";
  nameGroup: any = "";

  @Watch("$route")
  onPageChanged() {
    this.initData();
    if (this.formDevice.liveSystem == 0) {
      this.liveSystem = "System A";
    } else {
      this.liveSystem = "System B";
    }
    if (this.formDevice.updateSelection == "manual") {
      console.log(
        "this.packageData",
        this.filterPackage,
        this.formDevice.updateTarget
      );

      const targetVersion = this.filterPackage.find(
        (item: any) => item.version === this.formDevice.updateTarget
      );
      console.log("targetVersion", targetVersion);
      if (targetVersion) {
        this.patch_name = targetVersion.name;
      }
    }
  }

  @Watch("dataItem")
  onDataItemChanged() {
    this.formDevice = Object.assign({}, this.deviceData);

    if (this.formDevice.updateVerification === false) {
      this.selectVerification = "Off";
    } else {
      this.selectVerification = "On";
    }

    if (this.formDevice.liveSystem === 0) {
      this.liveSystem = "System A";
    } else {
      this.liveSystem = "System B";
    }
    if (this.formDevice.updateSelection == "manual") {
      console.log(
        "this.packageData",
        this.filterPackage,
        this.formDevice.updateTarget
      );

      const targetVersion = this.filterPackage.find(
        (item: any) => item.version === this.formDevice.updateTarget
      );
      console.log("targetVersion", targetVersion);
      if (targetVersion) {
        this.patch_name = targetVersion.name;
      }
    }
    if (this.formDevice.deviceGroup) {
      this.devicegroupAction({
        id: this.formDevice.deviceGroup,
      });
    }
  }
  @Watch("groupItem")
  onGroupItemChanged() {
    this.nameGroup = this.groupItem.name;
  }
  @Watch("packageData")
  onPackageDataChanged() {
    this.packageData.forEach((element: any) => {
      //   if (element.status === "qc_passed") {
      this.filterPackage.push(element);
      //   }
    });
  }
  @Watch("filterPackage")
  onFilterPackageChanged() {
    if (this.formDevice.updateSelection == "manual") {
      console.log(
        "this.packageData",
        this.filterPackage,
        this.formDevice.updateTarget
      );

      const targetVersion = this.filterPackage.find(
        (item: any) => item.version === this.formDevice.updateTarget
      );
      console.log("targetVersion", targetVersion);
      if (targetVersion) {
        this.patch_name = targetVersion.name;
      }
    }
  }
  @Watch("formDevice", { deep: true })
  onFormDeviceChanged() {
    if (this.formDevice.updateSelection == "auto") {
      this.formDevice.updateChecking = "auto";
    } else if (this.formDevice.updateSelection == "manual") {
      this.formDevice.updateChecking = "manual";
    }

    // console.log('time', moment(this.formDevice.rebootTime, 'DD/MM/YYYY HH:mm:ss').format('HH:mm:ss'));
  }

  get Id() {
    return this.$route.params.id;
  }
  get deviceData() {
    return this.dataItem;
  }
  get statusCode() {
    return this.getCode;
  }
  handleTime() {
    return new Date().toTimeString().split(" ")[0] + " - 23:59:59";
  }
  handleReboot() {
    if (this.formDevice.bootSystem) {
      this.rebootAction({
        deviceId: this.formDevice.deviceID,
        signal: "reboot",
        bootSystem: this.formDevice.bootSystem,
      }).then((res: any) => {
        this.$notify.success({
          title: "Success",
          message: "Update Success",
          offset: 100,
        });
      });
    } else {
      this.$notify.error({
        title: "Error",
        message: "Please choose a boot system",
      });
    }
  }
  async handleSubmit() {
    if (this.formDevice.deviceGroup !== this.dataItem.deviceGroup) {
      this.formUpdate.deviceGroup = this.formDevice.deviceGroup;
    }
    if (this.formDevice.serverEndPoint !== this.dataItem.serverEndPoint) {
      this.formUpdate.serverEndPoint = this.formDevice.serverEndPoint;
    }
    if (this.formDevice.bootSystem !== this.dataItem.bootSystem) {
      this.formUpdate.bootSystem = this.formDevice.bootSystem;
    }
    if (this.formDevice.bootSystem !== this.dataItem.bootSystem) {
      this.formUpdate.bootSystem = this.formDevice.bootSystem;
    }
    if (this.formDevice.updateChecking !== this.dataItem.updateChecking) {
      this.formUpdate.updateChecking = this.formDevice.updateChecking;
    }
    if (this.formDevice.updateSelection !== this.dataItem.updateSelection) {
      this.formUpdate.updateSelection = this.formDevice.updateSelection;
    }
    if (this.formDevice.updateSelection !== this.dataItem.updateSelection) {
      this.formUpdate.updateSelection = this.formDevice.updateSelection;
    }
    if (this.formDevice.rebootSchedule !== this.dataItem.rebootSchedule) {
      this.formUpdate.rebootSchedule = this.formDevice.rebootSchedule;
    }
    if (
      this.formDevice.rebootTime &&
      this.formDevice.rebootSchedule == "manual"
    ) {
      if (this.formDevice.rebootTime !== this.dataItem.rebootTime) {
        this.formUpdate.rebootTime = this.formDevice.rebootTime;
        this.formUpdate.rebootSchedule = this.formDevice.rebootSchedule;
      }
    }

    // const versionUpdate = this.packageData.find((item: any) => item.name === this.formDevice.patch_name)
    // this.formUpdate.versionInfo = versionUpdate.version
    if (this.selectVerification === "On") {
      this.formDevice.updateVerification = true;
    } else if (this.selectVerification === "Off") {
      this.formDevice.updateVerification = false;
    }
    if (
      this.formDevice.updateVerification !== this.dataItem.updateVerification
    ) {
      this.formUpdate.updateVerification = this.formDevice.updateVerification;
    }
    if (this.formDevice.updateSelection == "manual") {
      const versionUpdate = this.filterPackage.find(
        (item: any) => item.name === this.patch_name
      );
      if (versionUpdate != undefined) {
        this.formUpdate.updateTarget = versionUpdate.version;
        await this.updateAllAction({
          deviceId: this.formDevice.deviceID,
          allUpdate: this.formUpdate,
        }).then(() => {
          if (this.statusCode.code === 200) {
            this.$notify({
              title: this.statusCode.message,
              message: "Save changes success",
              type: "success",
            });
          } else {
            this.$notify.error({
              title: "Error",
              message: this.statusCode.errors && this.statusCode.errors.reason,
            });
          }
          this.formUpdate = {};
        });
      } else {
        this.$notify.error({
          title: "Error",
          message: "Please choose a patch name ",
        });
      }
    } else {
      await this.updateAllAction({
        deviceId: this.formDevice.deviceID,
        allUpdate: this.formUpdate,
      }).then(() => {
        if (this.statusCode.code === 200) {
          this.$notify({
            title: this.statusCode.message,
            message: "Save changes success",
            type: "success",
          });
        } else {
          this.$notify.error({
            title: "Error",
            message: this.statusCode.errors && this.statusCode.errors.reason,
          });
        }
        this.formUpdate = {};
      });
    }
  }
  async handleCheckUpdate() {
    const versionUpdate = this.filterPackage.find(
      (item: any) => item.name === this.patch_name
    );
    console.log("versionUpdate", versionUpdate);
    if (
      versionUpdate !== undefined &&
      this.formDevice.updateSelection == "manual"
    ) {
      await this.checkUpdateAction({
        updateVersion: versionUpdate.version,
        deviceId: this.formDevice.deviceID,
        patchSelection: this.formDevice.updateSelection,
        updateChecking: this.formDevice.updateChecking,
        rebootSchedule: this.formDevice.rebootSchedule,
      }).then(() => {
        if (this.statusCode.code === 200) {
          this.$notify({
            title: this.statusCode.message,
            message: "Check update success",
            type: "success",
          });
        } else {
          this.$notify.error({
            title: "Error",
            message: this.statusCode.errors && this.statusCode.errors.reason,
          });
        }
      });
    } else {
      this.$notify.error({
        title: "Error",
        message:
          "Please choose patch selection as manual and package name is not empty",
      });
    }
  }
  async initData() {
    this.listAction({
      deviceId: this.Id,
    });
    this.listAllAction();
  }

  created() {
    this.initData();
  }
  mounted() {
    this.formDevice = Object.assign({}, this.deviceData);
  }
}
</script>

<style lang="scss" scoped>
.inner-device-manage {
  width: 600px;
  margin: auto;
  margin-bottom: 100px;
}
.el-select {
  width: 100%;
}
.group-block .el-button {
  margin-left: 15px;
}
.el-date-editor {
  width: 100% !important;
}
</style>
