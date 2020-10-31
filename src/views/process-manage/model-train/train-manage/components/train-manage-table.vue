<template>
  <div class="app-container">
    <el-card shadow="hover" style="width:100%;background-color:#f5f5f5">
      <div style="margin-bottom:40px">
        <span style="font-size:25px">数据集配置</span>
      </div>
      <div>
        <el-row type="flex" justify="space-between">
          <el-col :span="9">
            <el-card shadow="never" class="feature-config">
              <div slot="header" class="clearfix" style="vertical-align:middle">
                <span>数据切割</span>
                <el-button v-if="datasetInfo.splitStatus==='未完成'" style="float: right; padding: 3px 0" type="text" @click="handleFeaturesSplit()">确认配置</el-button>
                <span v-else style="float: right;display:inline"><i class="el-icon-check el-icon--right" /> </span>
                <!-- <el-button v-else type="success" icon="el-icon-check" circle size="mini" style="float: right;margin:0px" /> -->
              </div>
              <el-form ref="form" :model="featuresConfig" label-width="100px" style="width:300px">
                <el-form-item label="Shape">
                  <span>{{ datasetInfo.featuresShape }}</span>
                </el-form-item>
                <el-form-item label="Stratify">
                  <el-select v-model="featuresConfig.stratify" placeholder="选择参数值" :disabled="datasetInfo.splitStatus==='已完成'">
                    <el-option label="None" value="None" />
                    <el-option label="x" value="x" />
                    <el-option label="y" value="y" />
                  </el-select>
                </el-form-item>
                <el-form-item label="训练集比例">
                  <el-slider v-model="featuresConfig.trainRate" :format-tooltip="formatTooltip" :disabled="datasetInfo.splitStatus==='已完成'" />
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="9">
            <el-card shadow="never" class="feature-config">
              <div slot="header" class="clearfix">
                <span>模型载入</span>
                <el-button v-if="datasetInfo.modelStatus==='未完成'" style="float: right; padding: 3px 0" type="text" @click="handleModelUpdate()">确认配置</el-button>
                <span v-else style="float: right;display:inline"><i class="el-icon-check el-icon--right" /> </span>
              </div>
              <el-form ref="form" :model="modelConfig" label-width="100px" style="width:300px">
                <el-form-item label="基础模型">
                  <el-select v-model="modelConfig.modelSelect" placeholder="选择已有的模型" :disabled="datasetInfo.modelStatus==='已完成'" @change="handleBaseModelChange">
                    <el-option v-for="model in models" :key="model._id" :label="model.modelName" :value="model._id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="模型命名">
                  <el-input v-model="modelConfig.modelName" placeholder="请输入名称" :disabled="datasetInfo.modelStatus==='已完成'" />
                </el-form-item>
                <el-form-item label="模型调整">
                  <el-button type="success" round size="small" :disabled="datasetInfo.modelStatus==='已完成'" @click="modelConfig.show=true">点击调整</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card shadow="never" class="feature-config">
              暂留拷贝
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <transition name="el-zoom-in-top">
      <el-card v-if="datasetInfo.splitStatus==='已完成' && datasetInfo.modelStatus==='已完成'" shadow="hover" style="width:100%;background-color:#f5f5f5;margin-top:50px">
        <div style="margin-bottom:40px">
          <span style="font-size:25px">数据集信息</span>
        </div>
        <el-row type="flex" justify="space-between">
          <el-col :span="9">
            <el-card shadow="never" class="feature-config">
              <div slot="header" class="clearfix" style="vertical-align:middle">
                <span>基本信息</span>
              </div>
              <el-form ref="form" :model="datasetInfo" label-width="100px" style="width:300px">
                <el-form-item label="训练集Shape">
                  <span>{{ datasetInfo.trainShape }}</span>
                </el-form-item>
                <el-form-item label="测试集Shape">
                  <span>{{ datasetInfo.testShape }}</span>
                </el-form-item>
                <el-form-item label="训练模型">
                  <span>{{ modelConfig.modelName }}</span>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </transition>

    <transition name="el-zoom-in-top">
      <el-card v-if="datasetInfo.splitStatus==='已完成' && datasetInfo.modelStatus==='已完成'" shadow="hover" style="width:100%;background-color:#f5f5f5;margin-top:50px">
        <div style="margin-bottom:40px">
          <span style="font-size:25px">训练控制台</span>
        </div>
        <el-row type="flex" justify="space-between">
          <el-col :span="5">
            <el-card shadow="never" class="feature-config">
              <el-button type="primary" style="margin:30px 0px 0px 40px" @click="handleModelRun()">开始训练</el-button>
              <el-button type="success" style="margin:30px 0px 0px 40px" @click="trainedmodel.codeshow=true">模型调整</el-button>
            </el-card>
          </el-col>
          <el-col :span="18">
            <el-card shadow="never" class="feature-config">
              <div slot="header" class="clearfix" style="vertical-align:middle">
                <span>超参数调整</span>
              </div>
              <el-form ref="form" :model="trainedmodel.modelParams" label-width="100px" style="width:100%">
                <el-row>
                  <el-col v-for="key in Object.keys(trainedmodel.modelParams)" :key="key" :span="8">
                    <el-form-item :label="key">
                      <el-input v-model="trainedmodel.modelParams[key]" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </transition>

    <transition name="el-zoom-in-top">
      <el-card v-if="datasetInfo.splitStatus==='已完成' && datasetInfo.modelStatus==='已完成'" shadow="hover" style="width:100%;background-color:#f5f5f5;margin-top:50px">
        <div style="margin-bottom:40px">
          <span style="font-size:25px">输出控制台</span>
        </div>
        <div class="editor-container">
          <python-console ref="pythonConsole" v-model="trainedmodel.result" />
        </div>
      </el-card>
    </transition>

    <transition name="el-zoom-in-top">
      <el-card v-if="datasetInfo.splitStatus==='已完成' && datasetInfo.modelStatus==='已完成'" shadow="hover" style="width:100%;background-color:#f5f5f5;margin-top:50px">
        <div style="margin-bottom:40px">
          <span style="font-size:25px">图形展示窗</span>
        </div>
        <el-tabs type="border-card">
          <el-tab-pane v-for="key in Object.keys(trainedmodel.figs)" :key="key" :label="key">
            <el-image
              :src="trainedmodel.figs[key]"
              :fit="fit"
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </transition>

    <el-dialog
      title="模型调整"
      width="70%"
      fullscreen:true
      :visible.sync="modelConfig.show"
      style="top:-90px"
    >
      <el-row>
        <python-editor ref="pythonEditor" v-model="modelConfig.code" />
      </el-row>
      <el-row justify="space-between" style="margin-top:30px">
        <el-col :span="2" :offset="11">
          <el-button type="primary" @click="modelConfig.show=false">暂存调整</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      title="模型调整"
      width="70%"
      fullscreen:true
      :visible.sync="trainedmodel.codeshow"
      style="top:-90px"
    >
      <el-row>
        <python-editor ref="pythonEditor" v-model="trainedmodel.code" />
      </el-row>
      <el-row justify="space-between" style="margin-top:30px">
        <el-col :span="2" :offset="11">
          <el-button type="primary" @click="handleCodeUpdate()">保存调整</el-button>
        </el-col>
      </el-row>
    </el-dialog>

  </div>

</template>

<script>
import PythonEditor from '@/components/PythonEditor'
import PythonConsole from '@/components/PythonConsole'

import { datasetInfoFetch } from '@/api/common/dataset'
import { modelsForUserFetch, modelFetch, trainedmodelFetch } from '@/api/common/model'
import { featuresSplit, modelUpdate, trainedModelRun, codeUpdate } from '@/api/process-manage/model-train'

export default {
  name: 'TrainManageTable',
  components: { PythonEditor, PythonConsole },
  directives: { },
  filters: {
  },
  data() {
    return {
      datasetid: '',
      datasetInfo: {},
      featuresConfig: {
        stratify: 'None',
        trainRate: 80
      },
      modelConfig: {
        show: false,
        modelSelect: '',
        modelName: '',
        code: ''
      },
      models: [],
      trainedmodel: {
        id: '',
        modelParams: {},
        code: '',
        codeshow: false,
        result: '',
        figs: {}
      }
    }
  },
  watch: {
  },
  created() {
    this.datasetid = this.$route.params.datasetid
    this.getInfo()
    this.getModels()
  },
  methods: {
    handleBaseModelChange(val) {
      alert(val)
      if (val !== '') {
        modelFetch({ 'modelid': val }).then(response => {
          this.modelConfig.code = response.data.code
        })
      }
    },
    getInfo() {
      datasetInfoFetch({ 'datasetid': this.datasetid }).then(response => {
        this.datasetInfo = response.data
        this.featuresConfig.stratify = this.datasetInfo.splitStratify
        this.featuresConfig.trainRate = Math.round(this.datasetInfo.trainRate * 100)
        if (this.datasetInfo.modelStatus === '已完成') {
          this.trainedmodel.id = this.datasetInfo.model
          this.getTrainedModel()
        }
      })
    },
    getModels() {
      modelsForUserFetch().then(response => {
        this.models = response.data.items
      })
    },
    getTrainedModel() {
      trainedmodelFetch({ 'trainedmodelid': this.trainedmodel.id }).then(response => {
        this.modelConfig.modelSelect = response.data.baseModelID
        this.modelConfig.modelName = response.data.modelName
        this.trainedmodel.code = response.data.code
        this.trainedmodel.modelParams = response.data.modelParams
        this.trainedmodel.result = response.data.result
        this.trainedmodel.figs = response.data.figs
      })
    },
    handleFeaturesSplit() {
      featuresSplit({ 'datasetid': this.datasetid, 'stratify': this.featuresConfig.stratify, 'trainRate': (this.featuresConfig.trainRate / 100).toFixed(2) }).then(response => {
        this.getInfo()
        this.$notify({
          title: '切割成功',
          message: '完成全部配置后展示训练集和测试集',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleCodeUpdate() {
      codeUpdate({ 'trainedmodelid': this.trainedmodel.id, 'code': this.trainedmodel.code }).then(response => {
        this.getTrainedModel()
        this.trainedmodel.codeshow = false
        this.$notify({
          title: '代码修改成功',
          message: '仅对本数据集有效',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleModelUpdate() {
      modelUpdate({ 'datasetid': this.datasetid, 'modelSelect': this.modelConfig.modelSelect, 'modelName': this.modelConfig.modelName, 'code': this.modelConfig.code }).then(response => {
        this.getInfo()
        this.$notify({
          title: '模型载入成功',
          message: '完成全部配置后展示训练集和测试集',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleModelRun() {
      trainedModelRun({ 'datasetid': this.datasetid, 'trainedmodelid': this.trainedmodel.id }).then(response => {

      })
    },
    formatTooltip(value) {
      return (value / 100).toFixed(2)
    }
  }
}
</script>

<style scoped>

.feature-config{
  height:250px
}
</style>
