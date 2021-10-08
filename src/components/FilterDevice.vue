<template>
    <div class="filter-device"> 
        <div class="filter-group flex">
            <el-input size="small" placeholder="Enter a device"
            v-model="formFilter.deviceID"
            clearable
            @clear="onReset()">
        </el-input> 
        <el-input size="small" class="filter-device-version" placeholder="Enter a version"
            v-model="formFilter.versionInfo"
            clearable
            @clear="onReset2()">
            <template slot="append"><i class="el-icon-search" @click="onFilter()"></i></template>
        </el-input>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import querystring from 'querystring';

@Component
export default class FilterDevice extends Vue {
    formFilter: any = {}
    onReset() {
        this.formFilter.deviceID = ''
        if(this.formFilter.versionInfo) {
            this.onFilter();
        } else {
            return this.$router.push('/device-management');
        }
        
    }
    onReset2() {
        this.formFilter.versionInfo = '';
        if(this.formFilter.deviceID) {
            this.onFilter();
        } else {
            return this.$router.push('/device-management');
        }
    }
    onFilter() {
        const pageUrl = `?${querystring.stringify(this.formFilter)}`;
        return this.$router.push(pageUrl)
        
    }
    created() {
        this.formFilter = {
            deviceID: this.$route.query.deviceID,
            versionInfo: this.$route.query.versionInfo
        }
    }
}
</script>

<style lang="scss" >
    div.filter-device {
        float: right;
    }
    .filter-group {
        margin-right: 15px;
    }
    .filter-group >div{
        margin: 0 5px;
        .el-input-group__append {
            width: auto;
            padding: 0;
            &:hover {
                background-color: teal;
                color: #fff;
                cursor: pointer;
            }
            .el-icon-search {
                width: 35px;
                line-height: 30px;
            }
        }
        &.filter-device-version {
            display: flex;
            width: 100%;
            align-items: center;
            line-height: 30px;
        }
    }
    
</style>