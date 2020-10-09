<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit style="width: 100%">

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

  </div>
</template>

<script>
import { fetchDetail, editDataVector, deletetDataVector } from '@/api/process-manage/data-set'
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
      titleContain: false,
      listQuery: {
        id: null,
        page: 1,
        limit: 10
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
