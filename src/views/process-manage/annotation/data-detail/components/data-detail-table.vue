<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit style="width: 100%">

      <!-- <el-table-column width="120px" align="center" label="Author">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->

      <!-- <el-table-column align="center" width="60px" label="标签" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.label" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.label }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="文本" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.text1" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.text1 }}</span>
        </template>
      </el-table-column>
      <!--
      <el-table-column label="文本2" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.text2" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.text2 }}</span>
        </template>
      </el-table-column> -->

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
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.total = data.total
      this.listLoading = false
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
      this.$router.push('/process-manage/annotation/annotation-detail/' + this.listQuery.id + '/' + row.id)
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
