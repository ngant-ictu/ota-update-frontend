import Api from "@/services/Api";

export const state = {
  Data: [],
  DataItem: [],
  DataVersion: [],
  DataVersionAuto: [],
  DeviceGroup: ["qc", "uat", "dev", "production"],
  ServerEndpoint: ["production", "uat", "dev"],
  BootSystem: ["System A", "System B"],
  PatchSelection: ["auto", "manual"],
  RebootSchedule: ["auto", "manual", "after_patch_completed"],
  query: {},
  totalItems: 0,
  recordPerpage: 0,
  total_page: 0,
  statusCode: [],
};
export const mutations = {
  SET_DATA(state: any, response: any) {
    console.log("response check", response, response.recordPerPage);
    state.Data = response.data;
    state.totalItems =
      typeof response.total !== "undefined" ? response.total : 0;
    state.recordPerpage =
      typeof response.recordPerpage !== "undefined"
        ? response.recordPerpage
        : 20;
    state.query.page =
      typeof response.currentPage !== "undefined" ? response.currentPage : 1;
    console.log(
      "state.recordPerpage",
      state.recordPerpage,
      state.totalItems,
      state.query.page
    );
  },
  SET_DATAVERSION(state: any, response: any) {
    state.DataVersion = response.data;
  },
  SET_DATAVERSIONAUTO(state: any, response: any) {
    state.DataVersionAuto = response.data;
  },
  SET_DATAITEM(state: any, response: any) {
    state.DataItem = response.data;
  },

  GET_CODE(state: any, response: any) {
    state.statusCode = response;
  },
  UPDATE_DATAITEM(state: any, response: any) {
    console.log("response updateitem", response);
    state.DataItem = response.data;
  },
};
export const actions = {
  async get_all({ commit }: any, { query }: any) {
    const response = await Api().get("/api/v1/devices?limit=30", {
      params: query,
    });
    // console.log('all file', response.data);
    return commit("SET_DATA", response.data);
  },
  async get_version({ commit }: any) {
    const response = await Api().get("/api/v1/updates?qc_passed=true");
    return commit("SET_DATAVERSION", response.data);
  },
  async get_version_auto({ commit }: any) {
    const response = await Api().get("/api/v1/updates?newest=true");
    return commit("SET_DATAVERSIONAUTO", response.data);
  },
  async get_one({ commit }: any, { deviceId }: any) {
    const response = await Api().get(`/api/v1/devices/${deviceId}`);
    console.log("data item", response);
    return commit("SET_DATAITEM", response.data);
  },
  async reboot({ commit }: any, { deviceId, signal, bootSystem }: any) {
    console.log("bootsystem", deviceId, signal, bootSystem);
    const response = await Api().post(
      `/api/v1/devices/${deviceId}/sendSignal?signal=${signal}`,
      {
        bootSystem: bootSystem,
      }
    );
    console.log("response reboot", response);
  },
  async check_update(
    { commit }: any,
    {
      updateVersion,
      deviceId,
      patchSelection,
      updateChecking,
      rebootSchedule,
    }: any
  ) {
    console.log(
      "infoUpdate",
      updateVersion,
      deviceId,
      patchSelection,
      updateChecking,
      rebootSchedule
    );
    const response = await Api()
      .post(`/api/v1/updates/${updateVersion}/send?deviceID=${deviceId}`, {
        patchSelection: patchSelection,
        updateChecking: updateChecking,
        rebootSchedule: rebootSchedule,
      })
      .then((res: any) => {
        console.log("response infoUpdate", res.data);
        commit("GET_CODE", res.data);
      })
      .catch((e: any) => {
        console.log("error", e.response.data);
        commit("GET_CODE", e.response.data);
      });
  },
  async update_all({ commit }: any, { deviceId, allUpdate }: any) {
    console.log("allUpdate", allUpdate);
    const response = await Api()
      .put(`/api/v1/devices/${deviceId}`, allUpdate)
      .then((res: any) => {
        console.log("response update", res.data);
        commit("UPDATE_DATAITEM", res.data);
        commit("GET_CODE", res.data);
      })
      .catch((e: any) => {
        console.log("error", e.response.data);
        commit("GET_CODE", e.response.data);
      });
  },
  async update_group({ commit }: any, { formInfo, query, formUpdate }: any) {
    const response = await Api()
      .post(`/api/v1/updates/${formInfo.versionUpdate}/send`, formUpdate, {
        params: query,
      })
      .then((res: any) => {
        return commit("GET_CODE", res.data);
      })
      .catch((e: any) => {
        commit("GET_CODE", e.response.data);
      });
  },
  async request_log({ commit }: any, { deviceId }: any) {
    console.log("bootsystem", deviceId);
    const response = await Api()
      .post(`/api/v1/devices/${deviceId}/sendSignal?signal=getLog`)
      .then((res: any) => {
        commit("GET_CODE", res.data);
      })
      .catch((e: any) => {
        commit("GET_CODE", e.response.data);
      });
  },
};

export const deviceManage = {
  namespaced: true,
  state,
  actions,
  mutations,
};
