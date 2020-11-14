<template>
  <el-dialog
    title="已训练模型上传"
    :visible.sync="show"
  >
    <el-row type="flex" justify="space-between">
      <el-col :span="2" />
      <el-col :span="16">
        <el-form ref="uploadForm" :model="uploadForm" :rules="uploadRules" label-width="100px">
          <el-form-item label="运行平台" prop="taskType">
            <el-select v-model="uploadForm.plat" placeholder="请选择运行平台" style="width:400px">
              <el-option label="Tensorflow1.X" value="Tensorflow1.X" />
              <el-option label="Tensorflow2.X" value="Tensorflow2.X" />
              <el-option label="Keras" value="Keras" />
              <el-option label="Pytorch" value="Pytorch" />
            </el-select>
          </el-form-item>
          <el-form-item label="训练模型名称" prop="trainedmodelName">
            <el-input v-model="uploadForm.trainedmodelName" placeholder="请填写训练模型名称" style="width:400px" />
          </el-form-item>
          <el-form-item label="训练模型描述">
            <el-input v-model="uploadForm.desc" type="textarea" placeholder="选填" style="width:400px" />
          </el-form-item>
          <el-form-item label="公开性" prop="publicity">
            <el-radio-group v-model="uploadForm.publicity">
              <el-radio label="公开" />
              <el-radio label="不公开" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文件上传" prop="filelist">
            <el-upload
              ref="uploadFunc"
              class="upload-demo"
              :action="uploadInfo.uploadUrl"
              :file-list="uploadInfo.filelist"
              :headers="uploadInfo.headers"
              :data="uploadForm"
              :limit="1"
              :auto-upload="false"
              :on-success="handleUploadSuccess"
              accept=".csv, .txt, .tsv, .doc, .docx, .xls, .xlsx, .json"
              style="height:60px"
            >
              <el-button size="small" type="primary">点击选择</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-left:120px" @click="onUploadSubmit()">确认上传</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2" />
    </el-row>
  </el-dialog>
</template>

<script>

export default {
  name: 'TrainedmodelUpload',
  props: [],
  data() {
    return {
      show: false,
      uploadForm: {
        plat: '',
        trainedmodelName: '',
        desc: '',
        publicity: ''
      },
      uploadInfo: {
        filelist: [],
        uploadUrl: process.env.VUE_APP_BASE_API + '/data-manage/trainedmodel/trainedmodels',
        headers: { 'Authorization': 'Bearer ' + this.$store.state.user.token }
      }
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    showDialog() {
      this.show = true
    },
    setURL(url) {
      this.uploadInfo.uploadURL = process.env.VUE_APP_BASE_API + url
    },
    onUploadSubmit() {
      this.$refs.uploadFunc.submit()
    },
    handleUploadSuccess() {
      this.$notify({
        title: '上传成功',
        message: '资源已添加至资源列表',
        type: 'success',
        duration: 2000
      })
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
