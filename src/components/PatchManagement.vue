<template>
    <div class="ota-main-content">
        <!-- <pre>{{ Patchmanagement[0] }}</pre> -->
        <el-table   
            id="table-id"
            style="width: 100%"
            :data="Patchmanagement"
            row-key=""
            :default-sort = "{ Order:'Descending '} " 
            >
            <el-table-column label="Patch name">
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column label="Build">
                <template slot-scope="scope">
                    {{ scope.row.build }}
                </template>
            </el-table-column>
            <el-table-column label="Status" align="center" width="100">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 'pending_qc'" size="mini" type="danger" > QC Pending</el-tag>
                    <el-tag v-else-if="scope.row.status == 'qc_passed'" size="mini"> QC Passed</el-tag>
                    <el-tag v-else-if="scope.row.status == 'qc_failed'" size="mini" type="warning"> QC Failed</el-tag>
                    <el-tag v-else-if="scope.row.status == 'ready'" size="mini" type="danger"> Ready</el-tag>
                    <el-tag v-else-if="scope.row.status == 'live'"  size="mini" type="success"> Live </el-tag>
                    <el-tag v-else size="mini" type="success"> {{ scope.row.status }} </el-tag>
                </template>
            </el-table-column>
            
            <el-table-column label="Action" align="center">
                <template slot-scope="scope" >
                    <div v-if="scope.row.status == 'pending_qc'" class="btn-group flex flex-center justify-center justify-content-center">
                        <el-tooltip class="item" effect="dark" content="Aprrove" placement="top">
                            <el-button type="success" size="mini" @click="updateStatus(scope.row.version, 'approve')">Aprrove</el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="Reject" placement="top">
                            <el-button type="danger" size="mini" @click="updateStatus(scope.row.version, 'reject')">Reject</el-button>
                        </el-tooltip>
                    </div>
                    <div v-if="scope.row.status == 'qc_passed'" class="btn-group flex  justify-center">
                        <el-tooltip class="item" effect="dark" content="Download" placement="top">
                            <el-button type="primary" size="mini"  @click="handleDownload(scope.row.version)">Download</el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="Ready to production" placement="top">
                            <el-button type="warning" size="mini" @click="updateStatus(scope.row.version, 'ready')"> Ready to production</el-button>
                        </el-tooltip>

                    </div>
                    <div v-if="scope.row.status == 'ready'" class="btn-group flex justify-center">
                        <el-tooltip class="item" effect="dark" content="Deploy to production" placement="top">
                            <el-button type="warning" size="mini"  @click="updateStatus(scope.row.version, 'live')"> Deploy to production</el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="Remove to QC" placement="top">
                            <el-button type="danger" size="mini"  @click="updateStatus(scope.row.version, 'approve')"> Remove to QC</el-button>
                        </el-tooltip>
                        
                    </div>
                    <div v-if="scope.row.status == 'live'" class="btn-group flex justify-center">
                        <el-tooltip class="item" effect="dark" content="Remove to Ready" placement="top">
                            <el-button type="danger" size="mini"  @click="updateStatus(scope.row.version, 'ready')"> Remove to Ready</el-button>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="Comment" align="center">View</el-table-column>
        </el-table>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Action } from 'vuex-class'


@Component
export default class PatchManagement extends Vue {
    @Prop({ type: Array, required: true }) pathData: any
    @State(state => state.pathManagement.statusCode) statusCode: any;
    @Action('pathManagement/update_status') statusAction: any
    @Action('pathManagement/download_file') downloadAction: any

    get Patchmanagement() {
        return this.pathData;
    }

    async updateStatus(version: any, status: any) {
        console.log('version, status', version, status);
        let variableStatus = ''
        if(status === 'approve') {
            variableStatus = 'qc_passed'
        }
        if(status === 'reject') {
            variableStatus = 'qc_failed'
        }
        if(status === 'ready') {
            variableStatus = 'ready'
        }
        if(status === 'live') {
            variableStatus = 'live'
        }
        this.statusAction({
            changeStatus: variableStatus,
            versionUpdate: version
        })
    }
    async handleDownload(versionUpdate: any){
        await this.downloadAction({
            updateVersion: versionUpdate
        })
        .then((res: any) => {
            console.log('statusCode', this.statusCode);
            if(this.statusCode.code == 200) {
                const getLink = this.statusCode.data
                console.log('responseData', getLink);
                var fileURL = getLink.linkDownload
                console.log('fileURL', fileURL);
                var fileLink = document.createElement('a');
                fileLink.href = fileURL;
                document.body.appendChild(fileLink)
                fileLink.click();
            } else {
                this.$notify.error({
                    title: 'Error',
                    message: "Package doesn't exist"
                });
            }
        })
    }

}
</script>