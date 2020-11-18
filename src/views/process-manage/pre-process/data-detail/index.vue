<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="vectors">
        <data-detail-table />
      </el-tab-pane>
      <el-tab-pane v-for="nature in Object.keys(natures)" :key="nature" :label="nature">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-card class="box-card natureShow">
              <div slot="header" class="clearfix">
                <span>文件导入（覆盖）</span>
              </div>
              <div>
                <el-form ref="form" :model="natureConfig" label-width="100px">
                  <el-form-item label="选择资源">
                    <el-select v-model="natureConfig.resourceSelect" placeholder="选择已上传的资源">
                      <el-option
                        v-for="item in resources"
                        :key="item._id"
                        :label="item.resourceName"
                        :value="item._id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="或" />
                  <el-form-item label="临时上传" prop="filelist">
                    <el-upload
                      :ref="nature"
                      class="upload-demo"
                      :action="natureConfig.uploadUrl"
                      :file-list="natureConfig.filelist"
                      :headers="natureConfig.headers"
                      :data="{'datasetid':listQuery.datasetid,'preprocessid':listQuery.preprocessid, 'nature':nature,'resourceSelect':natureConfig.resourceSelect}"
                      :limit="1"
                      :auto-upload="false"
                      style="height:60px"
                    >
                      <el-button type="primary">上传<i class="el-icon-upload el-icon--right" /></el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onUploadSubmit(nature)">确认导入</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="box-card  natureShow">
              <div slot="header" class="clearfix">
                <span>文件信息</span>
              </div>
              <div>
                <el-form ref="form" :model="natureConfig" label-width="120px">
                  <el-form-item label="属性含义">
                    {{ natures[nature] }}
                  </el-form-item>
                  <el-form-item label="文件名称">
                    {{ preprocessObj[nature]['filename'] }}
                  </el-form-item>
                  <el-form-item label="文件类型">
                    {{ preprocessObj[nature]['filetype'] }}
                  </el-form-item>
                  <el-form-item v-if="preprocessObj[nature]['filetype']==='npy文件'" label="数据Shape">
                    {{ preprocessObj[nature] ['fileshape'] }}
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-col>
          <el-col :span="11">
            <el-card class="box-card  natureShow">
              <div slot="header" class="clearfix">
                <span>内容预览</span>
              </div>
              <div>
                {{ preprocessObj[nature]['fileContent'] }}
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DataDetailTable from './components/data-detail-table'

import { preprocessDataFetch, preprocessUpload } from '@/api/process-manage/preprocess'
import { resourcesForUserFetch } from '@/api/common/resource'

export default {
  name: 'PreprocessDataDetail',
  components: { DataDetailTable },
  data() {
    return {
      listQuery: {
        datasetid: null,
        preprocessid: null
      },
      natureConfig: {
        resourceSelect: '',
        filelist: [],
        uploadUrl: process.env.VUE_APP_BASE_API + '/process-manage/pre-process/datasets/ID/preprocesses/ID/data',
        headers: { 'Authorization': 'Bearer ' + this.$store.state.user.token }
      },
      resources: [],
      natures: { 'feature': '特征', 'label': 'label映射后标签', 'label_name': '映射后标签id对应关系', 'embedding': '嵌入', 'embedding_matrix': '嵌入矩阵' },
      preprocessObj: {}
    }
  },
  computed: {
  },
  created() {
    this.listQuery.datasetid = this.$route.params.datasetid
    this.listQuery.preprocessid = this.$route.params.preprocessid
    this.getResource()
    this.getData()
  },
  methods: {
    getData() {
      preprocessDataFetch(this.listQuery).then(response => {
        this.preprocessObj = response.data.preprocessObj
      })
    },
    getResource() {
      resourcesForUserFetch().then(response => {
        this.resources = response.data.items
      })
    },
    onUploadSubmit(nature) {
      if (this.natureConfig.resourceSelect === '') {
        this.$refs[nature][0].submit()
      } else {
        preprocessUpload({ 'datasetid': this.listQuery.datasetid, 'preprocessid': this.listQuery.preprocessid, 'nature': nature, 'resourceSelect': this.natureConfig.resourceSelect }).then(response => {
          this.$message.success('文件导入成功！')
          this.getResource()
          this.getData()
        })
      }
    }
  }
}
</script>

<style scoped>
.natureShow {
  height:350px
}
</style>
