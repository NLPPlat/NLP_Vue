<template>
  <div class="app-container">

    <el-row style="margin-bottom:20px">
      <el-button type="primary" @click="dataCut.show=true">数据拆分</el-button>
      <el-button type="success">数据清洗</el-button>
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
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="titleContain" label="标题" width="250px" :show-overflow-tooltip="true">
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

  </div>
</template>

<script>
import { fetchDetail, editDataVector, deletetDataVector, dataCut } from '@/api/process-manage/data-set'
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
      taskType: null,
      groupOn: 'off',
      titleContain: false,
      listQuery: {
        id: null,
        page: 1,
        limit: 10
      },
      dataCut: {
        show: false,
        level: '句子',
        tool: ''
      }
    }
  },
  created() {
    this.listQuery.id = this.$route.params.id
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await fetchDetail(this.listQuery)
      const items = data.items
      this.list = items.map(v => {
        this.$set(v, 'edit', false)
        if ('title' in v) {
          this.titleContain = true
        }
        return v
      })
      this.total = data.total
      this.taskType = data.taskType
      this.groupOn = data.groupOn
      this.listLoading = false
    },
    confirmEdit(row) {
      row.edit = false
      editDataVector({ 'datasetid': this.listQuery.id, 'vectorid': row.id, 'vector': row }).then(response => {
        this.$message({
          message: '文本编辑成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    handleDelete(row) {
      deletetDataVector({ 'datasetid': this.listQuery.id, 'vectorid': row.id }).then(response => {
        this.$message({
          message: '文本删除成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    handleDataCut() {
      dataCut({ 'datasetid': this.listQuery.id, 'level': this.dataCut.level, 'tool': this.dataCut.tool }).then(response => {
        this.dataCut.show = false
      })
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
