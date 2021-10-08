import Api from '@/services/Api'

 const state = () =>({
    MessageData:[]
})
 const mutations = {
     ADD_MESSAGEDATA( state: any, response: any ){
         state.MessageData = response
     }
 }
 const actions = {

    async updateFile({ commit }: any, { listFile }: any) {
        console.log('listFileInfo', listFile);
        const response = await Api().post('/api/v1/updates', listFile)
        console.log('file update', response);
    },
    async  updateVersion({ commit }: any, { version, fileOTA, fileSignature }: any){
        console.log('fileOTA', fileOTA);
        console.log('fileSignature ', fileSignature);
        let formData = new FormData();
        formData.append('packageOTA', fileOTA.raw)
        formData.append('packageSignature', fileSignature.raw)
        const response =   await Api().post(`/api/v1/updates/${version}/file`, 
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        return response;
        
    }
    /* updateVersion({ commit }: any, { version, fileUpdate }: any){
        console.log('version', version, fileUpdate);
      
        const response = fetch(`https://ota-update-v2-jx-staging.jenkins-x-viettel.iviet.com/api/v1/updates/${version}/file`,
        {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'include', // include, *same-origin, omit
                headers: { 
                        // 'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *client
                body: fileUpdate.raw
            })
            return response;
            // .then(resp => resp.json())
            // .then(resp => {
            //     return commit('ADD_MESSAGEDATA', resp)
            // })
            // .catch(e => {
            //     console.log('error', e) 
            //     // commit('ADD_MESSAGEDATA', e)
            //   })
    }*/
}

export const upload = {
    namespaced: true,
    state,
    actions ,
    mutations
 }

