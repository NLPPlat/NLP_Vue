<template>
  <div class="app-container">

    <el-card shadow="hover" style="width:100%;background-color:#f5f5f5;margin-bottom:50px">
      <div style="margin-bottom:40px">
        <span style="font-size:25px">批处理管理</span>
      </div>
      <div>
        <el-row type="flex" justify="space-between">
          <el-col :span="9">
            <el-card shadow="never" class="feature-config">
              <div slot="header" class="clearfix">
                <span>执行设置</span>
              </div>
              <el-form ref="form" :model="batchConfig" label-width="100px" style="width:300px">
                <el-form-item label="训练模型">
                  <el-select v-model="batchConfig.trainedmodelSelect" placeholder="选择已有的模型">
                    <el-option v-for="model in trainedmodels" :key="model" :label="model.modelName" :value="model._id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="自定义批处理">
                  <el-switch v-model="batchConfig.operatorOn" />
                </el-form-item>
                <el-form-item v-if="batchConfig.operatorOn===true" label="算子选择">
                  <el-select v-model="batchConfig.operatorSelect" placeholder="选择批处理算子" @change="handleOperatorChange">
                    <el-option v-for="operator in operators" :key="operator" :label="operator.operatorName" :value="operator._id" />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="batchConfig.operatorOn===true" label="算子调整">
                  <el-button type="success" round size="small" @click="batchConfig.show=true">点击调整</el-button>
                </el-form-item>
                <el-button type="primary" style="margin:10px 0px 0px 120px" :loading="dataStatus.batchStatus==='处理中'" @click="handleBatchRun()">{{ dataStatus.batchStatus==='处理中'?'处理中':'开始处理' }}</el-button>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <transition name="el-zoom-in-top">
      <el-card v-if="dataStatus.batchStatus==='处理完成'" shadow="hover" style="width:100%;background-color:#f5f5f5;margin-top:50px">
        <div style="margin-bottom:40px">
          <span style="font-size:25px">批处理结果</span>
        </div>
        <data-detail-table ref="result" :datasetid="dataStatus.resultDataset" :task-type="dataStatus.taskType" />
      </el-card>
    </transition>

    <el-dialog
      title="模型调整"
      width="70%"
      fullscreen:true
      :visible.sync="batchConfig.show"
      style="top:-90px"
    >
      <el-row>
        <python-editor ref="pythonEditor" v-model="batchConfig.code" />
      </el-row>
      <el-row justify="space-between" style="margin-top:30px">
        <el-col :span="2" :offset="11">
          <el-button type="primary" @click="batchConfig.show=false">暂存调整</el-button>
        </el-col>
      </el-row>
    </el-dialog>

  </div>

</template>

<script>
import { datasetInfoFetch } from '@/api/common/dataset'
import { operatorsForUserFetch } from '@/api/common/operator'
import { trainedmodelsForUserFetch } from '@/api/common/model'
import { batchRun } from '@/api/process-manage/batch-process'
import PythonEditor from '@/components/PythonEditor'

import DataDetailTable from '@/views/process-manage/batch-process/components/data-detail-table'

export default {
  name: 'BatchManageTable',
  components: { PythonEditor, DataDetailTable },
  directives: { },
  filters: {
  },
  data() {
    return {
      datasetid: '',
      dataInfo: {},
      dataStatus: {
        batchStatus: '未开始',
        resultDataset: null,
        taskType: ''
      },
      operators: [],
      trainedmodels: [],
      batchConfig: {
        operatorSelect: '',
        trainedmodelSelect: '',
        operatorOn: false,
        show: false,
        code: ''
      },
      timer: null
    }
  },
  watch: {
    'dataStatus.batchStatus': {
      handler(newVal, oldVal) {
        if (newVal === '处理完成') {
          setTimeout(() => {
            this.$refs.result.getList()
          }, 300)
        }
      }
    }
  },
  created() {
    this.datasetid = this.$route.params.datasetid
    this.getInfo()
    this.getOpreators()
    this.getTrainedmodels()
    this.timer = setInterval(() => {
      this.getInfo()
    }, 1000 * 2)
  },
  beforeDestroy() {
    if (this.timer !== null) {
      clearInterval(this.timer)
    }
  },
  methods: {
    getInfo() {
      datasetInfoFetch({ 'datasetid': this.datasetid }).then(response => {
        this.datasetInfo = response.data
        this.dataStatus.batchStatus = response.data.batchStatus
        this.dataStatus.resultDataset = response.data.resultDataset
        this.dataStatus.taskType = response.data.taskType
      })
    },
    getOpreators() {
      operatorsForUserFetch({ 'operatorType': '批处理算子' }).then(response => {
        this.operators = response.data.items
      })
    },
    getTrainedmodels() {
      trainedmodelsForUserFetch({ }).then(response => {
        this.trainedmodels = response.data.items
      })
    },
    handleOperatorChange(val) {
      if (val !== '') {
        for (var i = 0; i < this.operators.length; i++) {
          if (this.operators[i]._id === val) {
            this.batchConfig.code = this.operators[i].code
            break
          }
        }
      }
    },
    handleBatchRun() {
      batchRun({ 'datasetid': this.datasetid, 'trainedmodelSelect': this.batchConfig.trainedmodelSelect, 'operatorOn': this.batchConfig.operatorOn }).then(response => {

      })
    }
  }
}
</script>

<style scoped>

.feature-config{
  height:380px
}

.feature-info{
  height:300px
}
</style>
