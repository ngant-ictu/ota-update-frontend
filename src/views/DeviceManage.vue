<template>
    <div class="page-management main-content">
        <device-management  :deviceData="deviceData"></device-management>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import DeviceManagement from '@/components/DeviceManagement.vue'

@Component({
    name: 'DeviceManage',
    components: {
        DeviceManagement
    }
}) 
export default  class DeviceManage extends Vue{
    @State(state => state.deviceManage.Data) data: any;
    @Action("deviceManage/get_all") listAction : any;

    @Watch('$route')
    onPageChanged() {
        this.initData();
    }

    get deviceData() {
        return this.data
    }
    async initData() {
        return this.listAction({ query: this.$route.query }); 
    }
    created() {
        this.initData();
    }
}
</script>