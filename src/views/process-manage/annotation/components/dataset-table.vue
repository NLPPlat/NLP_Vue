<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.taskName" placeholder="任务名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="searchQuery.usernameSelect" placeholder="归属者" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in usernameOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="searchQuery.taskTypeSelect" placeholder="任务类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in taskTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleSearch">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleDataUpload">
        数据接入
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        数据集表格导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @filter-change="filterChange"
    >
      <el-table-column label="ID" prop="_id" sortable="custom" align="center" width="60px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名称" width="180px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.taskName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归属者" column-key="username" :filters="usernameFilter" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="共同标注" width="200px" align="center">
        <template slot-scope="{row}">
          <el-radio-group v-model="row.annotationPublicity">
            <el-radio-button label="允许" />
            <el-radio-button label="不允许" />
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ (row.datetime.$date-8*60*60*1000) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" column-key="taskType" :filters="taskTypeFilter" width="160px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.taskType | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标注状态" column-key="annotationStatus" :filters="annotationStatusFilter" class-name="status-col" width="120px">
        <template slot-scope="{row}">
          <el-tag :type="row.annotationStatus | statusFilter">
            {{ row.annotationStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="280px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div v-if="row.username===$store.state.user.username&&row.annotationStatus==='未开始'">
            <el-button type="primary" size="mini" @click="handleSetAnnotation(row)">
              配置任务
            </el-button>
            <el-button size="mini" type="success">
              数据脉络
            </el-button>
          </div>
          <div v-else-if="row.annotationStatus==='标注中'">
            <el-button type="primary" size="mini" @click="handleManage(row)">
              进入标注
            </el-button>
            <el-button type="danger" size="mini" @click="handleSetAnnotation(row)">
              取消标注
            </el-button>
            <el-button size="mini" type="success">
              数据脉络
            </el-button>
          </div>
          <div v-else-if="row.annotationStatus==='标注完成'">
            <el-button type="primary" size="mini" @click="handleSetAnnotation(row)">
              查看标注
            </el-button>
            <el-button size="mini" type="success">
              数据脉络
            </el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="标注任务配置" :visible.sync="configDialogShow">
      <component :is="dialogComponent" ref="dialogComponent" :clickid="clickID" @closeConfigDialog="closeConfigDialog" />
    </el-dialog>

  </div>
</template>

<script>
import { datasetListFetch } from '@/api/common/dataset'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import ExtractionConfigDialog from './extraction-config-dialog'
import RelationAnalysisConfigDialog from './relation-analysis-config-dialog'
import L2rConfigDialog from './l2r-config-dialog'
import SummaryConfigDialog from './summary-config-dialog'
import ClassificationConfigDialog from './classification-config-dialog'

const taskTypeOptions = [
  { key: '通用单文本分类', display_name: '通用单文本分类' },
  { key: '情感分析/意图识别', display_name: '情感分析/意图识别' },
  { key: '实体关系抽取', display_name: '实体关系抽取' },
  { key: '文本关系分析', display_name: '文本关系分析' },
  { key: '文本摘要', display_name: '文本摘要' },
  { key: '文本排序学习', display_name: '文本排序学习' }
]

const calendarTypeKeyValue = taskTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'DatasetTable',
  components: { Pagination, ExtractionConfigDialog, RelationAnalysisConfigDialog, L2rConfigDialog, SummaryConfigDialog, ClassificationConfigDialog },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '标注完成': 'success',
        '标注中': 'primary',
        '未开始': 'info'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      dialogComponent: '',
      clickID: '',
      listQuery: {
        page: 1,
        limit: 20,
        sort: '-id',
        taskName: '',
        datasetType: '标注数据集',
        username: ['自己', '他人'],
        taskType: ['通用单文本分类', '情感分析/意图识别', '实体关系抽取', '文本关系分析', '文本摘要', '文本排序学习'],
        annotationStatus: ['未开始', '标注中', '标注完成']
      },
      searchQuery: {
        usernameSelect: '',
        taskTypeSelect: ''
      },
      usernameOptions: ['自己', '他人'],
      taskTypeOptions,
      sortOptions: [{ label: 'ID升序', key: 'id' }, { label: 'ID降序', key: '-id' }],
      downloadLoading: false,
      configDialogShow: false,
      usernameFilter: [
        { text: '自己', value: '自己' },
        { text: '他人', value: '他人' }
      ],
      taskTypeFilter: [
        { text: '通用单文本分类', value: '通用单文本分类' },
        { text: '情感分析/意图识别', value: '情感分析/意图识别' },
        { text: '实体关系抽取', value: '实体关系抽取' },
        { text: '文本关系分析', value: '文本关系分析' },
        { text: '文本摘要', value: '文本摘要' },
        { text: '文本排序学习', value: '文本排序学习' }
      ],
      annotationStatusFilter: [
        { text: '未开始', value: '未开始' },
        { text: '标注中', value: '标注中' },
        { text: '标注完成', value: '标注完成' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      datasetListFetch(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === '_id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleSetAnnotation(row) {
      this.configDialogShow = true
      this.clickID = row._id
      switch (row.taskType) {
        case '实体关系抽取':
          this.dialogComponent = ExtractionConfigDialog
          break
        case '文本关系分析':
          this.dialogComponent = RelationAnalysisConfigDialog
          break
        case '文本排序学习':
          this.dialogComponent = L2rConfigDialog
          break
        case '文本摘要':
          this.dialogComponent = SummaryConfigDialog
          break
        case '通用单文本分类':
          this.dialogComponent = ClassificationConfigDialog
          break
      }
      this.$refs.dialogComponent.init()
    },
    handleManage(row) {
      this.$router.push('/process-manage/annotation/data-detail/' + row._id)
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    filterChange(obj) {
      this.listQuery[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]]
      this.getList()
    },
    handleSearch() {
      if (this.searchQuery.usernameSelect === '') {
        this.listQuery.username = ['自己', '他人']
      } else {
        this.listQuery.username = [this.searchQuery.usernameSelect]
      }
      if (this.searchQuery.taskTypeSelect === '') {
        this.listQuery.taskType = ['通用单文本分类', '情感分析/意图识别', '实体关系抽取', '文本关系分析', '文本摘要', '文本排序学习']
      } else {
        this.listQuery.taskType = [this.searchQuery.taskTypeSelect]
      }
      this.handleFilter()
    },
    handleDataUpload() {

    },
    handleShowTest(row) {
      // console.log(row.username)
      console.log(this.$store.state.user.username)
      return true
    },
    closeConfigDialog() {
      this.configDialogShow = false
      this.getList()
    }
  }
}
</script>
