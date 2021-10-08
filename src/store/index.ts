import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { upload } from './upload'
import { pathManagement } from './pathManagement'
import { deviceManage } from './deviceManage'
import { groupDevice } from './groupDevice'
import { deviceLog } from './devicelog'
import { reports } from './reports'

export const store =  new Vuex.Store({

  modules: {
    upload,
    pathManagement,
    deviceManage,
    groupDevice,
    deviceLog,
    reports
  }
})
