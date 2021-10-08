import Api from '@/services/Api'


export const state = {
  
    Data:[],
    query: {},
    totalItems: 0,
    recordPerpage: 0,
    total_page: 0,
    statusCode: [],
}
export const mutations = {

    SET_DATA(state: any, response: any) {
        state.Data = response.data
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

    async get_all({ commit }: any, { query }: any) {
        const response = await Api().get('/api/v1/ota-reports', {
            params: query
        })
        console.log('response', response.data);
        return commit("SET_DATA", response.data)
    },
    
    
}

export const reports = {
    namespaced: true,
    state,
    actions ,
    mutations
 }

