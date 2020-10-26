<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="ID" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="步骤名称" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.preprocessName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="步骤类别" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.preprocessType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="承接步骤ID" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.previousProcessID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行参数" width="140px" align="center">
        <template slot-scope="{}">
          <el-button type="success" plain size="mini">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="执行状态" column-key="preprocessStatus" :filters="statusFilter" class-name="status-col" width="120px">
        <template slot-scope="{row}">
          <el-tag :type="row.preprocessStatus | statusFilter">
            {{ row.preprocessStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Spark支持" width="120px" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.sparkSupport" disabled />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <div v-if="row.preprocessStatus==='已完成'">
            <el-button type="primary" size="mini" @click="handleManageData(row.id)">
              查看数据
            </el-button>
            <el-button size="mini" type="success">
              导出
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </div>
          <div v-if="row.preprocessStatus==='执行中'">
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </div>
          <div v-if="row.preprocessStatus==='未开始'">
            <el-button type="primary" size="mini" @click="handleDealPreprocess(row,$index)">
              开始执行
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="space-around" style="margin-top:50px">
      <el-col :span="9" style="text-align:right">
        <el-button type="primary" @click="preprocessAdd.show=true">新增步骤</el-button>
      </el-col>
      <el-col :span="6" style="text-align:center">
        <el-button type="primary">一键执行</el-button>
      </el-col>
      <el-col :span="9" style="text-align:left">
        <el-button type="primary" @click="featuresConstruction.show=true">特征集生成</el-button>
      </el-col>
    </el-row>

    <!-- 新增步骤对话框 -->
    <el-dialog title="新增步骤" :visible.sync="preprocessAdd.show" width="500px">
      <el-row type="flex" justify="center">
        <el-col :span="18" style="text-align:left">
          <el-form :model="preprocessAdd" label-width="100px">
            <el-form-item label="选择步骤">
              <el-cascader
                v-model="preprocessAdd.preprocessSelect"
                :options="preprocessAdd.preprocessList"
                :props="{ expandTrigger: 'hover' }"
                placeholder="下一步需要执行的步骤"
              />
            </el-form-item>
            <el-form-item label="承接步骤">
              <el-select v-model="preprocessAdd.previousProcessID" placeholder="从哪一步骤开始执行">
                <el-option
                  v-for="item in list"
                  :key="item.id"
                  :label="'ID:'+item.id+'  '+item.preprocessName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Spark支持">
              <el-switch v-model="preprocessAdd.sparkSwitch" />
            </el-form-item>
            <el-form-item v-if="preprocessAdd.sparkSwitch===true" label="Spark Master">
              <el-input v-model="preprocessAdd.sparkMaster" />
            </el-form-item>
            <el-form-item label="参数配置">
              <el-button type="success" plain size="small" @click="preprocessParams.show=true">点击配置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top:20px">
        <el-col :span="4" style="text-align:center">
          <el-button type="primary" @click="handlePreprocessAdd">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 参数配置对话框 -->
    <el-dialog title="参数配置" :visible.sync="preprocessParams.show" width="700px">
      <pre-process-params-dialog :key="preprocessAdd.preprocessSelect" :preprocess-name="preprocessAdd.preprocessSelect[1]" @getPreprocessParams="getPreprocessParams" />
    </el-dialog>

    <!-- 特征生成对话框 -->
    <el-dialog title="特征生成配置" :visible.sync="featuresConstruction.show" width="700px">
      <features-construction-dialog />
    </el-dialog>
  </div>

</template>

<script>
import PreProcessParamsDialog from './pre-process-params-dialog'
import FeaturesConstructionDialog from './features-construction-dialog'

import { preprocessStatusFetch, preprocessAdd, preprocessDeal } from '@/api/process-manage/preprocess'
import { operatorsForUserFetch } from '@/api/common/operator'

export default {
  name: 'PreProcessManageTable',
  components: { PreProcessParamsDialog, FeaturesConstructionDialog },
  directives: { },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '已完成': 'success',
        '执行中': 'primary',
        '未开始': 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      listLoading: false,
      listQuery: {
        datasetid: ''
      },
      preprocessAdd: {
        show: false,
        preprocessSelect: '',
        previousProcessID: '',
        sparkSwitch: false,
        sparkMaster: 'local[4]',
        preprocessList: []
      },
      preprocessParams: {
        show: false,
        preprocessShow: ''
      },
      featuresConstruction: {
        show: false
      },
      timer: null
    }
  },
  watch: {
    'preprocessAdd.preprocessSelect': {
      deep: true,
      handler(newVal, oldVal) {
        this.preprocessParams.params = this.$store.state.preprocessParams[newVal[1]]
      }
    }
  },
  created() {
    this.listQuery.datasetid = this.$route.params.datasetid
    this.preprocessAdd.preprocessList = this.$store.state.preprocessParams.preprocessList
    this.getList()
    this.getOperators()
    this.timeout = setInterval(() => {
      this.getList()
    }, 1000 * 2)
  },
  beforeDestroy() {
    clearInterval(this.timeout)
  },
  methods: {
    getList() {
      preprocessStatusFetch(this.listQuery).then(response => {
        this.list = response.data.items
      })
    },
    getOperators() {
      operatorsForUserFetch({ 'operatorType': '预处理算子' }).then(response => {
        var operators = {}
        operators['value'] = '自定义算子'
        operators['label'] = '自定义算子'
        operators['children'] = []
        for (var i = 0; i < response.data.items.length; i++) {
          operators['children'].push({ 'value': response.data.items[i].operatorName, 'label': response.data.items[i].operatorName })
        }
        this.preprocessAdd.preprocessList.push(operators)
      })
    },
    handlePreprocessAdd() {
      preprocessAdd({ 'datasetid': this.listQuery.datasetid, 'preprocessAdd': this.preprocessAdd.preprocessSelect, 'previousProcessID': this.preprocessAdd.previousProcessID, 'sparkSupport': this.preprocessAdd.sparkSwitch, 'preprocessParams': this.preprocessParams.params }).then(response => {
        this.getList()
        this.preprocessAdd.show = false
      })
    },
    getPreprocessParams(params) {
      this.preprocessParams.params = params
      this.preprocessParams.show = false
    },
    handleDealPreprocess(row, $index) {
      preprocessDeal({ 'datasetid': this.listQuery.datasetid, 'preprocessIndex': $index }).then(response => {
        this.getList()
        this.$message({
          message: row.preprocessName + '开始执行'
        })
      })
    },
    handleManageData(preprocessid) {
      this.$router.push('/process-manage/pre-process/data-detail/' + this.listQuery.datasetid + '/' + preprocessid)
    },
    handleAddOperator() {
      this.$router.push('/data-manage/operator-manage/codehub/-1')
    }
  }
}
</script>
