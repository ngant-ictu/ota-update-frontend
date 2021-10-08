<template>
    <div class="device-management ota-main-content">
        <div class="inner-device-manage" >
            <div class="top-page">
            <h2 class="left el-col-10">Device patch management</h2>
            <div class="block-right-group flex align-center justify-flex-end el-col-14">
                <filter-device></filter-device>
                <group-device :listDevices="listDevices"></group-device>
            </div>
            </div>
            <pagination :totalItems="totalItems" :recordPerPage="recordPerPage" :currentPage="query.page" ></pagination>
            <el-table   
                id="table-id"
                style="width: 100%" 
                :data="dataDeviceManage"
                row-key=""
                :default-sort = "{ Order:'Descending '} " 
                ref="multipleTable"
                @selection-change="handleSelectionChange"
                >
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column label="Device" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.deviceID }}
                    </template>
                </el-table-column>
                <!-- <el-table-column label="Device group" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.deviceGroup }}
                    </template>
                </el-table-column> -->
                <el-table-column label="Version" align="center" width="70">
                    <template slot-scope="scope">
                        {{ scope.row.versionInfo }}
                    </template>
                </el-table-column>
                <el-table-column label="Target Patch" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.updateTarget }}
                    </template>
                </el-table-column>
                <el-table-column label="Patch selection" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.updateSelection }}
                    </template>
                </el-table-column>
                <!-- <el-table-column label="Patched" align="center">
                    No
                </el-table-column> -->
                <el-table-column label="Patch attempts" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.updateAttempts }}
                    </template>     
                </el-table-column>
                <el-table-column label="Status" align="center" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 'activated'" size="mini" type="success"> {{ scope.row.status }}</el-tag>
                        <el-tag v-if="scope.row.status == 'inactive'" size="mini" type="danger"> {{ scope.row.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Patching status" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.firmwareUpdateStatus == 'successful'" size="mini" type="success"> {{ scope.row.firmwareUpdateStatus }}</el-tag>
                        <el-tag v-else-if="scope.row.firmwareUpdateStatus == 'updating'" size="mini"> {{ scope.row.firmwareUpdateStatus }}</el-tag>
                        <el-tag v-else-if="scope.row.firmwareUpdateStatus == 'received'" size="mini" type="warning"> {{ scope.row.firmwareUpdateStatus }}</el-tag>
                        <el-tag v-else-if="scope.row.firmwareUpdateStatus == 'failed'" size="mini" type="danger"> {{ scope.row.firmwareUpdateStatus }}</el-tag>
                        <el-tag v-else-if="scope.row.firmwareUpdateStatus == 'updated'" size="mini" type="info"> {{ scope.row.firmwareUpdateStatus }}</el-tag>
                        <div v-else>{{ scope.row.firmwareUpdateStatus }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="Reboot Schedule" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.rebootSchedule }}
                    </template>
                </el-table-column>
                
                <el-table-column label="Action" align="center">
                    <template slot-scope="scope" >
                        <div class="block-group">
                             <el-tooltip class="item" effect="dark" content="View detail" placement="top">
                                <router-link :to="{name: 'DeviceDetail', params: {id: scope.row.deviceID}}"><el-button type="primary" size="mini" icon="el-icon-view" circle></el-button></router-link>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="Request device log" placement="top">
                                <el-button type="info" icon="el-icon-s-unfold" size="mini" @click="handleRequestLog(scope.row.deviceID)" circle></el-button>
                            </el-tooltip>
                            <device-log :itemId="scope.row.deviceID"></device-log>
                        </div>
                    </template>
                </el-table-column>
                
            </el-table>
            <div class="pagination-bottom">
                <pagination :totalItems="totalItems" :recordPerPage="recordPerPage" :currentPage="query.page" ></pagination>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Action, State } from 'vuex-class';

import FilterDevice from '@/components/FilterDevice.vue'
import GroupDevice from '@/components/GroupDevice.vue'
import DeviceLog from '@/components/DeviceLog.vue'
import Pagination from '@/components/Pagination.vue'


@Component({
    components: {
        FilterDevice,
        GroupDevice,
        Pagination,
        DeviceLog
    }
})
export default class DeviceManagement extends Vue {
    @Prop({ type: Array, required: true }) deviceData: any;
    @State(state => state.deviceManage.DeviceGroup) deviceGroup: any;
    @State(state => state.deviceManage.ServerEndpoint) serverEndpoint: any;
    @State(state => state.deviceManage.BootSystem) bootSystem: any;
    @State(state => state.deviceManage.PatchSelection) patchSelection: any;
    @State(state => state.deviceManage.RebootSchedule) rebootSchedule: any
    @State(state => state.deviceManage.totalItems) totalItems: any;
    @State(state => state.deviceManage.recordPerPage) recordPerPage: any; 
    @State(state => state.deviceManage.query) query: any;
    @State(state => state.deviceManage.statusCode) statusCode: any;
    @Action("deviceManage/request_log") requestAction: any;
    formDevice: any = {
    }
    statusGroup = ['Online', 'Offline']
    multipleSelection: any = [];
    listDevices: any = [];
    @Watch('multipleSelection')
    onMutipleSelectionChanged() {
        this.listDevices = [];
        this.multipleSelection.forEach((item: any) => {
            const index = this.listDevices.findIndex((deviceId: any) => deviceId == item.deviceID)
            if(item.deviceID && index === -1) {
                this.listDevices.push(item)
            }
        })
    }

    get dataDeviceManage() {
        return this.deviceData
    }
    handleSelectionChange(val: any) {
        console.log('val', val);
        this.multipleSelection = val;
    }
    handleRequestLog(itemId: any) {
        this.requestAction({
            deviceId: itemId
        })
        .then((res: any) =>{
            if(this.statusCode.code === 200) {
                this.$notify({
                    title: 'Success',
                    message: 'Request log success',
                    type: 'success'
                })
            } else {
                this.$notify.error({
                    title: 'Error',
                    message: this.statusCode.message
                });
            }
        })
    }
}
</script>

<style lang="scss">
.page-management {
    .inner-device-manage {
        width: 90%;
        margin: auto;
    }
    .el-select {
        width: 100%;
    }
    .group-block .el-button {
        margin-left: 15px;
    }
    .left {
        text-align: left;
    }
    .block-group {
        display: flex;
        justify-content: center;
        >div {
            margin-left: 10px;
        }
        .el-button {
            margin-left: 10px;
        }
    }
    .el-table .cell {
        text-overflow: unset;
    }
}
.pagination-bottom {
    display: inline-block;
    width: 100%;
    margin-top: 20px;
  }
</style>