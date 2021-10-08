import Api from "@/services/Api";

export const state = {
  Data: [],
  statusCode: [],
};
export const mutations = {
  SET_DATA(state: any, response: any) {
    state.Data = response.data;
  },
  GET_CODE(state: any, response: any) {
    state.statusCode = response;
  },
  UPDATE_DATA(state: any, response: any) {
    const dataUpdate = response.data;
    const index = state.Data.findIndex(
      (item: any) => item.name === dataUpdate.name
    );
    state.Data.splice(index, 1, dataUpdate);
  },
};
export const actions = {
  async get_all({ commit }: any) {
    const response = await Api().get("/api/v1/updates");
    console.log("all file", response.data);
    return commit("SET_DATA", response.data);
  },
  async get_package({ commit }: any) {
    const response = await Api().get("/api/v1/updates?qc_passed=true");
    console.log("all file", response.data);
    return commit("SET_DATA", response.data);
  },
  async update_status({ commit }: any, { changeStatus, versionUpdate }: any) {
    const response = await Api().put(`/api/v1/updates/${versionUpdate}`, {
      status: changeStatus,
    });
    console.log("change status", response.data);
    return commit("UPDATE_DATA", response.data);
  },
  async download_file({ commit }: any, { updateVersion }: any) {
    return await Api()
      .get(`/api/v1/updates/${updateVersion}/file`)
      .then((res: any) => {
        commit("GET_CODE", res.data);
      })
      .catch((e: any) => {
        commit("GET_CODE", e.response.data);
      });
    // .then((res :any)=> {
    //     const responseData = res.data
    //     const getLink = responseData.data
    //     var fileURL = getLink.linkDownload
    //     console.log('fileURL', fileURL);
    //     var fileLink = document.createElement('a');
    //     fileLink.href = fileURL;
    //     document.body.appendChild(fileLink)
    //     fileLink.click();
    // })
  },
};

export const pathManagement = {
  namespaced: true,
  state,
  actions,
  mutations,
};
