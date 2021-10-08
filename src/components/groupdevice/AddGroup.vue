<template>
  <div class="dialog-addgroup">
    <el-button type="success" class="btn-add" @click="onOpen()"
      >Add Group</el-button
    >
    <el-dialog
      title="New Group Device"
      :visible.sync="visible"
      v-on:open="onOpen"
      v-on:close="onClose"
      width="50%"
      center
    >
      <el-form ref="formInfo" :model="formInfo" label-width="150px">
        <el-form-item
          label="Name group"
          prop="name"
          :rules="[{ required: true, message: 'Name is required' }]"
        >
          <el-input
            type="text"
            v-model="formInfo.name"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="Description">
          <el-input
            type="text"
            v-model.number="formInfo.description"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose()">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit()">Add</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { State, Action } from "vuex-class";

@Component
export default class AddGroup extends Vue {
  @State((state) => state.groupDevice.errorMessage) dataError: any;
  @Action("groupDevice/add_group") addAction: any;
  visible: boolean = false;
  formInfo: any = {};
  $refs: any = {
    formInfo: HTMLFormElement,
  };
  handleSubmit() {
    this.$refs.formInfo.validate((valid: any) => {
      if (valid) {
        this.addAction({
          formInfo: this.formInfo,
        }).then((res: any) => {
          if (this.dataError.code === 200) {
            this.$notify({
              title: "Success",
              message: "Add device group success",
              type: "success",
            });
          } else {
            if ((this.dataError.message = "DEVICE_GROUP_EXISTED")) {
              var message = "Device group existed";
            } else {
              message = this.dataError.message;
            }
            this.$notify.error({
              title: "Error",
              message: message,
            });
          }
          this.visible = false;
        });
      }
    });
  }
  async onOpen() {
    this.visible = true;
  }
  onClose() {
    this.visible = false;
    this.formInfo = {};
    this.$refs.formInfo.resetFields();
  }
}
</script>

<style lang="scss" scoped>
.dialog-addgroup {
  .el-button.btn-add {
    float: right;
  }
}
form.el-form {
  width: 650px;
  margin: auto;
}
.el-select,
.el-input {
  width: 400px !important;
}
</style>
