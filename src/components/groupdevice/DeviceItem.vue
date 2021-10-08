<template>
    <div class="device-list">
        <div class="top-block">
             <pagination :handlePageChange="handlePageChange" :totalItems="totalItems" :recordPerPage="recordPerPage" :currentPage="query.page" ></pagination>
            <el-button  type="danger" @click="handleDelete" size="mini" :disabled="multipleSelection.length ? false: true">Delete device</el-button>
        </div>
        <el-table   
            id="table-id"
            style="width: 100%" 
            :data="deviceData"
            row-key=""
            :default-sort = "{ Order:'Descending '} " 
            ref="multipleTable"
                @selection-change="handleSelectionChange">
            >
            
            <el-table-column label="Device">
                <template slot-scope="scope">
                    {{ scope.row.deviceID }}
                </template>
            </el-table-column>
            <el-table-column label="Current Patch" align="center">
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
            <el-table-column label="Patched" align="center">
                No
            </el-table-column>
            <el-table-column label="Patch attempts" align="center">
                <template slot-scope="scope">
                    {{ scope.row.updateAttempts }}
                </template>     
            </el-table-column>
            <el-table-column label="Status" align="center">
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
            
             <el-table-column
                type="selection"
                width="55"  align="center">
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import Pagination from '@/components/groupdevice/Pagination.vue'

@Component({
    components: {
        Pagination
    }
}) 
export default class DeviceItem extends Vue{
    @Prop() deviceData: any
    @Prop() id: any
    @Prop({ type: Function, required: true }) handlePageChange: any 
    @State(state => state.groupDevice.errorMessage) dataError: any
    @State(state => state.groupDevice.totalItems) totalItems: any;
    @State(state => state.groupDevice.recordPerpage) recordPerPage: any; 
    @State(state => state.groupDevice.query) query: any;
    @Action("groupDevice/update_group") updateAction : any; 

    multipleSelection: any = [];
    formUpdate: any  = {}

    handleSelectionChange(val: any) {
        console.log('val', val);
        this.multipleSelection = [];
        val.forEach((item: any) => {
            const index = this.multipleSelection.findIndex((deviceId: any) => deviceId == item.deviceID)
            if(item.deviceID && index === -1) {
                this.multipleSelection.push(item.deviceID)
            }
        })
    }
    handleDelete() {
        
        this.formUpdate.deviceIDs = this.multipleSelection
        this.formUpdate.action = 'remove'
        this.updateAction({
            formUpdate: this.formUpdate,
            id: this.id
        })
        .then(() => {
            if(this.dataError.code === 200) {
                this.$notify({
                title: this.dataError.message,
                message: 'Removed success',
                type: 'success'
                })
            } else {
                this.$notify.error({
                title: 'Error',
                message: this.dataError.errors && this.dataError.errors.reason
                });
            }
            this.formUpdate = {}
            this.handlePageChange(1);
        })
    }
}
</script>
<style lang="scss" scoped>
    .top-block {
        margin: 40px 0 20px;
        display: flex;
        align-items: center;
        .wrap-pagination {
            margin-top: 0;
        }
    }
</style>