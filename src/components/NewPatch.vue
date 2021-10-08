<template>
  <div class="ota-main-content"  v-loading="loading"
    element-loading-text="Processing..."
    element-loading-spinner="el-icon-loading"
    >
    <div class="group-upload ">
     
        <el-upload
            :class="getClass"
            drag
            action=""
            :auto-upload="false"
            with-credentials
            :file-list="myFiles"
            :on-change="onChange"
            :on-remove="onRemove"
            list-type="zip"
            :accept="accept"
            :limit = "2"
            :multiple="true"
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
        <div class="el-upload__tip" slot="tip">Note: Please upload both the OTA file and Signature file</div>
        </el-upload>
    </div>
    <div v-show="showinfo" class="path-info">
        <h3>Path Information</h3>
        <el-form label-position="left" label-width="200px" :model="pathInfo" ref="pathInfo">
            <el-form-item label="Package name">
                <el-input v-model="pathName" disabled=""></el-input>
            </el-form-item>
            <el-form-item v-for="(item, index) in pathInfo" :label="index" :key="index"> 
                <el-input :value="item" disabled=""></el-input>
            </el-form-item>
            <el-form-item label="Patch MD5" prop="fileMD5Checksum"
            :rules="{
            required: true, message: 'Field is not empty', trigger: 'blur'
            }"
            >
                <el-input v-model="pathInfo.fileMD5Checksum" ></el-input>
            </el-form-item>
             <el-form-item>
                 <el-button type="primary" @click="handleSubmit()">Upload</el-button>
             </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Action } from 'vuex-class'
import JSZip from 'jszip'

@Component
export default class NewPatch extends Vue {
    @State(state=>state.upload.MessageData) messageData: any
    @Action('upload/updateFile') updateFileAction: any;
    @Action('upload/updateVersion') updateVersionAction: any;
    myFiles: any = [];
    pathInfo: any  = {};
    listFileInfo: any = {};
    signatureName: any  = '';
    pathName: any = '';
    showinfo: boolean = false;
    file: any = null;
    linkUpload: any  = '';
    fileOTA: any = null;
    fileSignature: any = null;
    metaData: any = {}
    fileMD5Checksum: any = '';
    loading = false;
    acceptTypes: any = {zip: true, sig: true};
    getClass: any = 'upload-ota'
    count: any = 0;
    $refs: any=  {
       pathInfo : HTMLFormElement
    };

    @Watch('count')
    onCountChanged() {
        console.log('this.myFiles.length', this.count);
        if(this.count === 2) {
            this.getClass = 'upload-ota upload-ota-disable'
        } else {
            this.getClass = 'upload-ota'
        }
    }

    get accept() {
        let types = []
        for (let t in this.acceptTypes) {
            if (this.acceptTypes[t]) {
                types.push('.' + t)
            }
        }
        return types.join(', ')
    }

    onChange(file: any, fileList: any) {
        this.count ++;
        console.log('file name', file);
        if(!file.name.endsWith('.sig')) {
            this.acceptTypes.zip = false
            console.log('vao day')
            this.fileOTA = file;
            this.pathInfo = {};
            this.pathName= this.fileOTA.name
            JSZip.loadAsync(file.raw)  
            .then((zip) => {
                console.log('zip', zip.files)
                for (const [name, value] of Object.entries(zip.files)) {
                    if(!name.startsWith('package')) continue
                    console.log("_data", (value as any)['_data'])
                    // Remove system name before file name
                    // const namFilePackage = name.split("/").pop()
                    const namFilePackage = name;
                    // console.log("name file origin", namFilePackage);

                    if ((value as any)['_data'].uncompressedSize != undefined) {
                        let nameSize = namFilePackage + "&size"
                        this.metaData[nameSize] = (value as any)['_data'].uncompressedSize.toString()
                    }
                
                    // this.pathInfo.metaData[nameSize] = value._data.uncompressedSize
                    if(!name.match(/(^|.*\/)patch_info\.json$/)) continue;
                        (zip as any).file((name as any)).async("string").then((text: any) => {
                            this.pathInfo = JSON.parse(text)
                        })
                }
            })
            this.showinfo = true;
        } else {
            this.acceptTypes.sig = false
            this.fileSignature = file;
            this.signatureName = file.name
        }
        
    }

    showInfoPackage(){
        return this.showinfo
    }

    onRemove(file: any, filelist: any) {
        this.count --;
        this.myFiles = filelist;
        console.log('delete', file);
        if(!file.name.endsWith('.sig')) {
            this.acceptTypes.zip = true
            this.showinfo = false
            this.pathInfo = {}
        } else {
            this.acceptTypes.sig = true
        }
    }
    
    async handleSubmit() {
        console.log('this.pathInfo 2', this.pathInfo, Object.keys(this.pathInfo).length);
       this.$refs.pathInfo.validate((valid: any) => {
           if(valid) {
               if(Object.keys(this.pathInfo).length > 0 && this.pathInfo.patch_version) {
                   this.loading = true;
                    this.listFileInfo.build = this.pathInfo.build;
                    this.listFileInfo.iplVersion = this.pathInfo.ipl_version;
                    this.listFileInfo.kernelVersion = this.pathInfo.kernel_version;
                    this.listFileInfo.name = this.pathName;
                    this.listFileInfo.message = this.pathInfo.note;
                    this.listFileInfo.signatureInfo = this.pathInfo.signature_info;
                    this.listFileInfo.systemVersion = this.pathInfo.system_version;
                    this.listFileInfo.targetDevices = this.pathInfo.target_device;
                    this.listFileInfo.ubootVersion = this.pathInfo.uboot_version;
                    this.listFileInfo.version = this.pathInfo.patch_version;
                    this.listFileInfo.fileMD5Checksum = this.pathInfo.fileMD5Checksum
                    this.listFileInfo.metaData = this.metaData
                    console.log('this.listFileInfo', Object.keys(this.listFileInfo).length)
                     this.updateFileAction({
                        listFile: this.listFileInfo
                    })
                    if(this.fileOTA && this.fileSignature) {
                        this.updateVersionAction({
                            version: this.pathInfo.patch_version,
                            fileOTA: this.fileOTA,
                            fileSignature: this.fileSignature
                        })
                        .then((res:any) => res.data)
                        .then((resp: any) => {
                            console.log('resp', resp);
                            if(resp.code === 200) {
                                this.loading = false;
                                this.onSusscess();
                                this.showinfo = false;
                                this.pathInfo = {};
                                this.myFiles = [];
                                this.fileSignature = '';
                                this.fileSignature = '';
                                this.count = 0;
                            } else if(resp.code === 400) {
                                this.loading = false;
                                this.onFail(resp.message);
                                this.showinfo = false;
                                this.pathInfo = {};
                                this.myFiles = [];
                                this.fileOTA = '';
                                this.fileSignature = '';
                                this.count = 0;
                            }
                        })
                        .catch((e: any) => {
                                const resp =  e.response.data; 
                                this.loading = false;
                                this.onFail(resp.message);
                                this.showinfo = false;
                                this.pathInfo = {};
                                this.myFiles = [];
                                this.fileSignature = '';
                                this.fileOTA = '';
                                this.count = 0;
                        })
                    } else {
                        this.onFail('Please upload both the OTA file and Signature file  ');
                        this.loading = false;
                    }
                    
                } else {
                    this.onFail('Only upload the OTA file and Signature file');
                    this.loading = false;
                }
           }
       })
    }
    onSusscess(){
        this.$notify({
            title: 'Success',
            message: 'Upload file success',
            type: 'success'
        })
    }
    onFail(message: any){
        let errorMessage = ''
        if(message == 'UPDATE_NOT_FOUND') {
            errorMessage = 'Please choose right package'
        } else if(message == 'UNKNOWN_ERROR') {
            errorMessage = 'Decode md5 error'
        } else {
            errorMessage = message
        }
         this.$notify.error({
            title: 'Error',
            message: errorMessage
        });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
h3 {
  margin: 40px 0 40px;
  text-align: left;
}

.group-upload {
    position: relative;
    .el-upload-list {
        display: inline-block;
        text-align: left;
    }
    .el-upload__tip {
        color: #ff0033;
        font-size: 16px;
    }
    .upload-ota {
        .el-upload-dragger .el-icon-upload {
            color: #288fe8;
        }
        &.upload-ota-disable .el-upload.el-upload--zip{
            opacity: 0.5;
            pointer-events: none;
        }
    }
}
.el-upload .el-button--small {
    margin-left: 15px;
    padding:  13px 15px;
}

</style>
