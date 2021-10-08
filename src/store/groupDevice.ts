import Api from '@/services/Api'


export const state = {
    Data:[],
    DataItem: [],
    DeviceData: [],
    errorMessage: [],
    query: {},
    totalItems: 0,
    recordPerpage: 0,
    total_page: 0,
}
export const mutations = {
    SET_DATA(state: any, response: any) {
        state.Data = response.data
    }, 
    SET_DATAITEM(state: any, reponse: any){
        state.DataItem = reponse.data
        console.log('DataItem', state.DataItem);
    },
    SET_DEVICEDATA(state: any, response: any) {
        state.DeviceData = response.data
        state.totalItems = typeof response.total !== 'undefined' ?  response.total : 0
        state.recordPerpage = typeof response.recordPerPage !== 'undefined' ? response.recordPerPage: 2
        state.query.page = typeof response.currentPage !== 'undefined' ? response.currentPage : 1;
        console.log('state.recordPerpage', state.recordPerpage, state.totalItems, state.query.page);
    }, 
    SET_ERROR(state: any, response: any) {
        state.errorMessage = response
    },
    ADD_DATA(state: any, response: any) {
        console.log('response', response.data);
        state.Data.unshift(response.data)
    }, 
    UPDATE_DATA(state: any, response: any){
        const index = state.Data.findIndex((item: any) => item.id === response.id)
        state.Data.splice(index, 1, response)
    },
    DELETE_DATA(state: any, id: any){
        console.log('id', id);
        const index = state.Data.findIndex((item: any) => item.id === id)
        console.log ('index', index)
        state.Data.splice(index, 1)
    },
}
export const actions = {

    async get_all({ commit }: any) {
        const response = await Api().get('/api/v1/device-group')
        console.log('all file', response.data); 
        return commit("SET_DATA", response.data)
    },
    async get_one({ commit }: any, { id }: any) {
        const response =  await Api().get(`/api/v1/device-group/${id}`)
        return commit("SET_DATAITEM", response.data)
        
    },
    async get_device({ commit }: any, { query }: any) {
        console.log('query', query);
        const response =  await Api().get('/api/v1/devices' , {
            params: query
        })
        return commit("SET_DEVICEDATA", response.data)
        
    },
    async add_group({ commit }: any, { formInfo }: any) {

        const response = await Api().post('/api/v1/device-group', formInfo )
        .then((res: any) => {
            console.log('response update', res.data);
            commit('ADD_DATA', res.data)
            commit('SET_ERROR', res.data)
        })
        .catch((e: any) => {
            console.log('error', e.response.data);
            commit('SET_ERROR', e.response.data)
        })
    },
    async update_group({ commit }: any, { formUpdate, id }: any) {
        console.log('formInfo', formUpdate);
        const response = await Api().put(`/api/v1/device-group/${id}`, formUpdate )
        .then((res: any) => {
            console.log('response update', res.data);
            commit('UPDATE_DATA', res.data)
            commit('SET_ERROR', res.data)
        })
        .catch((e: any) => {
            console.log('error', e.response.data);
            commit('SET_ERROR', e.response.data)
        })
    },
    
    async delete({ commit }: any, { id }: any){
        const response = await Api().delete(`/api/v1/device-group/${id}`)
        return (
            commit('DELETE_DATA', id),
            commit('SET_ERROR', response.data)

        )
    },
    async search_device({ commit }: any, { deviceID }: any) {

        const response = await Api().get(`/api/v1/devices?deviceID=${deviceID}`)
        return response.data
    },
    
}

export const groupDevice = {
    namespaced: true,
    state,
    actions ,
    mutations
 }

