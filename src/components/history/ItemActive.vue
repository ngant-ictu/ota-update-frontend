<template>
  <div>
    <el-table
      id="table-id"
      style="width: 100%"
      :data="historyData"
      row-key=""
      :default-sort="{ Order: 'Descending ' }"
    >
      <!-- <el-table-column label="Id">
                <template slot-scope="scope">
                    {{ scope.row.id }}
                </template>
            </el-table-column> -->
      <el-table-column label="Date update" align="center">
        <template slot-scope="scope">
          {{ formatDate(scope.row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="Version" align="center">
        <template slot-scope="scope">
          {{ scope.row.versionInfo }}
        </template>
      </el-table-column>
      <el-table-column label="Device Group" align="center">
        <template slot-scope="scope">
          {{ scope.row.deviceGroup }}
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Number of device" align="center">
        <template slot-scope="scope">
          {{ scope.row.numberOfDevices }}
        </template>
      </el-table-column>
      <el-table-column label="Reboot Schedule" align="center">
        <template slot-scope="scope">
          {{ scope.row.rebootSchedule }}
        </template>
      </el-table-column>
      <el-table-column label="Devices" align="center">
        <template slot-scope="scope">
          <device-history :Devices="scope.row.deviceIDs"></device-history>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import moment from "moment";

import DeviceHistory from "@/components/history/DeviceHistory.vue";

@Component({
  components: {
    DeviceHistory,
  },
})
export default class ItemActive extends Vue {
  @Prop() historyData: any;

  formatDate(data: any) {
    return moment(new Date(data))
      .local()
      .format("YYYY-MM-DD HH:mm:ss");
  }
}
</script>
