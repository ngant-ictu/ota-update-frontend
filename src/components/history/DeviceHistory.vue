<template>
    <div class="dialog-devicegroup">
        <el-tooltip class="item" effect="dark" content="View detail" placement="top">
            <el-button type="primary" icon="el-icon-view" @click="onOpen()" circle size="mini"> </el-button>
        </el-tooltip>
        <el-dialog
        title="Devices list update"
        :visible.sync="visible"
        v-on:open="onOpen"
        v-on:close="onClose"
        width="50%"
        center
        >
        <el-tag
            v-for="item in Devices"
            :key="item"
            :type="item"
            effect="plain"
            size="mini">
             <el-link :href="'/device-management/'+item">{{ item }}</el-link>
        </el-tag>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="onClose()">Cancel</el-button>
        </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class DeviceHistory extends Vue{
    @Prop() Devices: any
    visible: boolean = false;
    
    async onOpen(){
        this.visible = true;
    }
    onClose() {
        this.visible = false;
    }
}
</script>   

<style lang="scss" scoped>
    .el-tag {
        margin: 0 5px;
    }
</style>