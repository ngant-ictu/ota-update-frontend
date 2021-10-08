import Api from '@/services/Api'


export const state = {
  
    DataLog:[],
    query: {},
    totalItems: 0,
    recordPerpage: 0,
    total_page: 0,
    statusCode: [],
}
export const mutations = {

    SET_DATALOG(state: any, response: any) {
        state.DataLog = response.data
        state.totalItems = typeof response.total !== 'undefined' ?  response.total : 0
        state.recordPerpage = typeof response.recordPerPage !== 'undefined' ? response.recordPerPage: 20
        state.query.page = typeof response.currentPage !== 'undefined' ? response.currentPage : 1;
        console.log('state.recordPerpage', state.recordPerpage, state.totalItems, state.query.page);
    },
    GET_CODE( state: any, response: any){
        state.statusCode = response
    },
  
}
export const actions = {

    async device_log({ commit }: any, { query }: any) {
        const response = await Api().get('/api/v1/devices/logs', {
            params: query
        })
        console.log('response', response.data);
        return commit("SET_DATALOG", response.data)
    },
    async download_file({ commit }: any, { fileName }: any){
        const response =  await Api().get(`/api/v1/devices/logs/${fileName}`)
        .then((res: any) => {
            commit('GET_CODE', res.data)
        })
        .catch((e: any) => {
            commit('GET_CODE', e.response.data)
        })
        
         
    },
    
}

export const deviceLog = {
    namespaced: true,
    state,
    actions ,
    mutations
 }

