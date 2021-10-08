<template>
    <div class="page-management main-content">
        <div class="container">
            <group-detail :groupData="groupData"></group-detail> 
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Action } from 'vuex-class'
import GroupDetail from '@/components/groupdevice/Index.vue'

@Component({
    name: 'GroupManage',
    components: {
        GroupDetail
    }
}) 
export default  class GroupManage extends Vue{
    @State(state => state.groupDevice.Data) data: any;
    @Action("groupDevice/get_all") listAction : any;

    @Watch('$route')
    onPageChanged() {
        this.initData();
    }

    get groupData() {
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