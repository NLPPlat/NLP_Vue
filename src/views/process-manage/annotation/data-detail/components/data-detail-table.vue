<template>
  <div class="app-container">

    <el-row style="margin-bottom:20px">
      <el-col :span="4">
        <el-button v-if="annotationStatus!=='标注完成'" type="primary" @click="handleCompleteAnnotation()">
          完成标注
        </el-button>
        <el-button v-if="annotationStatus==='标注完成'" type="primary">
          拷贝
        </el-button>
      </el-col>
      <el-col :span="8">
        <el-progress :text-inside="true" :stroke-width="35" :percentage="100*(1-processController.nolabel/processController.all).toFixed(2)" />
      </el-col>

    </el-row>

    <el-table v-loading="listLoading" :data="list" border fit style="width: 100%">

      <el-table-column v-if="taskType==='文本排序学习'|groupOn==='on'" width="60px" label="组" align="center">
        <template slot-scope="{row}">
          <span>{{ row.group }}</span>
        </template>
      </el-table-column>

      <el-table-column label="ID" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType!=='文本关系分析'" label="文本" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.text1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本1" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.text1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本2" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.text2 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleEdit(row)"
          >
            标注
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchDetail } from '@/api/process-manage/data-set'
import { fetchAnnotationStatus, completeAnnotationStatus, fetchAnnotationProcess } from '@/api/process-manage/annotation'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DataDetailTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      taskType: '',
      annotationStatus: '',
      groupOn: 'off',
      listQuery: {
        id: null,
        page: 1,
        limit: 10
      },
      processController: {
        all: null,
        nolabel: null
      }
    }
  },
  created() {
    this.listQuery.id = this.$route.params.id
    this.getList()
    this.getStatus()
    this.getProcess()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await fetchDetail(this.listQuery)
      const items = data.items
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.total = data.total
      this.taskType = data.taskType
      this.groupOn = data.groupOn
      this.listLoading = false
    },
    getStatus() {
      fetchAnnotationStatus({ 'datasetid': this.listQuery.id }).then(response => {
        this.annotationStatus = response.data.annotationStatus
      })
    },
    getProcess() {
      fetchAnnotationProcess({ 'datasetid': this.listQuery.id }).then(response => {
        this.processController.all = response.data.allCount
        this.processController.nolabel = response.data.nolabelCount
      })
    },
    handleCompleteAnnotation() {
      completeAnnotationStatus({ 'datasetid': this.listQuery.id }).then(response => {
        this.getStatus()
      })
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    handleEdit(row) {
      if (this.taskType === '文本排序学习') {
        this.$router.push('/process-manage/annotation/annotation-detail/' + this.listQuery.id + '/' + row.group)
      } else {
        this.$router.push('/process-manage/annotation/annotation-detail/' + this.listQuery.id + '/' + row.id)
      }
    }
  }
}
</script>

<style scoped>
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
