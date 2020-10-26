<template>
  <div class="app-container">

    <el-row style="margin-bottom:20px">
      <el-button type="primary" @click="dataCut.show=true">
        数据拆分
      </el-button>
      <el-button type="primary">
        数据清洗
      </el-button>
      <el-button type="success" @click="handleDataVenation(row)">
        数据脉络
      </el-button>
      <el-button type="primary" @click="handleSetAnnotation()">
        数据标注
      </el-button>
      <el-button type="primary" @click="copyDataSet(row)">
        拷贝
      </el-button>
    </el-row>

    <el-table v-loading="listLoading" :data="list" border fit style="width: 100%">

      <el-table-column v-if="taskType==='文本排序学习'|groupOn==='on'" width="60px" label="组" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.group" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.group }}</span>
        </template>
      </el-table-column>

      <el-table-column label="ID" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.vectorid }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="titleContain" label="标题" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType!=='文本关系分析'" label="文本" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.text1" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.text1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本1" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.text1" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.text1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本2" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.text2" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.text2 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-success"
            @click="confirmEdit(row)"
          >
            确认
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 数据拆分对话框 -->
    <el-dialog title="数据拆分" :visible.sync="dataCut.show" width="500px">
      <el-row type="flex" justify="center">
        <el-col :span="18" style="text-align:left">
          <el-form :model="dataCut.level" label-width="100px">
            <el-form-item label="拆分级别">
              <el-radio-group v-model="dataCut.level">
                <el-radio label="句子">句子</el-radio>
                <el-radio label="段落">段落</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="拆分算法">
              <el-select v-model="dataCut.tool" placeholder="请选择算法">
                <el-option label="系统默认" value="系统默认" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top:20px">
        <el-col :span="4" style="text-align:center">
          <el-button type="primary" @click="handleDataCut">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 数据拷贝对话框 -->
    <el-dialog
      title="拷贝至"
      :visible.sync="datasetCopy.copyDialogVisible"
      width="30%"
    >
      <div style="text-align:center;width:100%;">
        <el-radio-group v-model="datasetCopy.copyDes">
          <el-radio label="原始数据集" border>原始数据集</el-radio>
          <el-radio label="预处理数据集" border>预处理数据集</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCopy">确认</el-button>
      </div>
    </el-dialog>

    <!-- 数据标注对话框 -->
    <el-dialog title="标注任务配置" :visible.sync="annotation.configDialogShow">
      <component :is="annotation.dialogComponent" ref="annotationDialogComponent" :clickid="annotation.clickID" @closeConfigDialog="closeConfigDialog" />
    </el-dialog>

  </div>
</template>

<script>
import { datasetCopy, datasetVectorsFetch, datasetInfoFetch } from '@/api/common/dataset'
import { editDataVector, dataCut } from '@/api/process-manage/data-set'
import { fetchAnnotationStatus } from '@/api/process-manage/annotation'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import ExtractionConfigDialog from '@/views/process-manage/annotation/components/extraction-config-dialog'
import RelationAnalysisConfigDialog from '@/views/process-manage/annotation/components/relation-analysis-config-dialog'
import L2rConfigDialog from '@/views/process-manage/annotation/components/l2r-config-dialog'
import SummaryConfigDialog from '@/views/process-manage/annotation/components/summary-config-dialog'
import ClassificationConfigDialog from '@/views/process-manage/annotation/components/classification-config-dialog'
import SentimentAnalysisConfigDialog from '@/views/process-manage/annotation/components/sentiment-analysis-config-dialog'

export default {
  name: 'DataDetailTable',
  components: { Pagination, ExtractionConfigDialog, RelationAnalysisConfigDialog, L2rConfigDialog, SummaryConfigDialog, ClassificationConfigDialog, SentimentAnalysisConfigDialog },
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
      taskType: null,
      groupOn: 'off',
      titleContain: false,
      annotation: {
        configDialogShow: false,
        dialogComponent: '',
        clickID: '',
        status: ''
      },
      listQuery: {
        datasetid: null,
        page: 1,
        limit: 10,
        deleted: '未删除'
      },
      dataCut: {
        show: false,
        level: '句子',
        tool: ''
      },
      datasetCopy: {
        copyDialogVisible: false,
        copyDes: '',
        datasetInitid: ''
      }
    }
  },
  created() {
    this.listQuery.datasetid = this.$route.params.id
    this.getList()
    this.getAnnotationStatus()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await datasetVectorsFetch(this.listQuery)
      const items = data.items
      this.list = items.map(v => {
        this.$set(v, 'edit', false)
        if ('title' in v) {
          this.titleContain = true
        }
        return v
      })
      this.total = data.total
      datasetInfoFetch({ 'datasetid': this.listQuery.datasetid }).then(response => {
        this.taskType = response.data.taskType
        this.groupOn = response.data.groupOn
      })
      this.listLoading = false
    },
    getAnnotationStatus() {
      fetchAnnotationStatus({ 'datasetid': this.listQuery.datasetid }).then(response => {
        this.annotation.status = response.data.annotationStatus
      })
    },
    confirmEdit(row) {
      row.edit = false
      editDataVector({ 'datasetid': this.listQuery.datasetid, 'vectorid': row.vectorid, 'vector': row }).then(response => {
        this.$message({
          message: '文本编辑成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    handleDelete(row) {
      row.deleted = '已删除'
      editDataVector({ 'datasetid': this.listQuery.datasetid, 'vectorid': row.vectorid, 'vector': row }).then(response => {
        this.$message({
          message: '文本删除成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    handleDataCut() {
      dataCut({ 'datasetid': this.listQuery.datasetid, 'level': this.dataCut.level, 'tool': this.dataCut.tool }).then(response => {
        this.dataCut.show = false
        this.$message.success('数据拆分成功！')
        this.getList()
      })
    },
    handleDataVenation() {
      this.$router.push('/data-manage/data-venation/' + this.listQuery.datasetid)
    },
    copyDataSet(row) {
      this.datasetCopy.datasetInitid = this.listQuery.id
      this.datasetCopy.copyDes = ''
      this.datasetCopy.copyDialogVisible = true
    },
    handleCopy() {
      this.datasetCopy.copyDialogVisible = false
      datasetCopy({ 'datasetInitType': '原始数据集', 'datasetInitid': this.datasetCopy.datasetInitid, 'copyDes': this.datasetCopy.copyDes }).then(response => {
        this.getList()
        this.$notify({
          title: '拷贝成功',
          message: '可操作拷贝完成的数据集。',
          type: 'success',
          duration: 2000
        })
      })
    },
    closeConfigDialog() {
      this.annotation.configDialogShow = false
      this.$router.push('/process-manage/annotation/data-detail/' + this.listQuery.id)
    },
    handleSetAnnotation() {
      if (this.annotation.status === '未开始') {
        this.annotation.configDialogShow = true
        this.annotation.clickID = this.listQuery.id
        switch (this.taskType) {
          case '实体关系抽取':
            this.annotation.dialogComponent = ExtractionConfigDialog
            break
          case '文本关系分析':
            this.annotation.dialogComponent = RelationAnalysisConfigDialog
            break
          case '文本排序学习':
            this.annotation.dialogComponent = L2rConfigDialog
            break
          case '文本摘要':
            this.annotation.dialogComponent = SummaryConfigDialog
            break
          case '通用单文本分类':
            this.annotation.dialogComponent = ClassificationConfigDialog
            break
          case '情感分析/意图识别':
            this.annotation.dialogComponent = SentimentAnalysisConfigDialog
            break
        }
        this.$refs.annotationDialogComponent.init()
      } else {
        this.closeConfigDialog()
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
