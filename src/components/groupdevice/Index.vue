<template>
    <div class="ota-main-content">
        <add-group></add-group>
        <el-table   
                id="table-id"
                style="width: 100%" 
                :data="groupData"
                row-key=""
                :default-sort = "{ Order:'Descending '} " >
                >
               
                <el-table-column label="ID">
                    <template slot-scope="scope">
                        {{ scope.row.id }}
                    </template>
                </el-table-column>
                <el-table-column label="Name">
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column label="Number Of Devices" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.numberOfDevices }}
                    </template>
                </el-table-column>
                <el-table-column label="Description" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.description }}
                    </template>
                </el-table-column>
               
               
                <el-table-column label="View" align="center">
                    <template slot-scope="scope" >
                        <div class="flex btn-group">
                             <el-tooltip content="Edit group item" placement="top">
                                <router-link :to="{name: 'GroupItem', params: {id: scope.row.id}}"><el-button type="primary" icon="el-icon-edit" size = "mini" circle></el-button></router-link>
                             </el-tooltip>
                            <delete-button :id="scope.row.id"></delete-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import AddGroup from '@/components/groupdevice/AddGroup.vue'
import DeleteButton from '@/components/groupdevice/Delete.vue'

@Component({
    components: {
        AddGroup,
        DeleteButton
    }
})
export default class GroupDetail  extends Vue {
    @Prop() groupData: any
}

</script>

<style lang="scss" scoped>
.flex.btn-group {
    align-items: center;
    justify-content: center;
    .el-button {
        margin: 0 5px;
    }
}
</style>