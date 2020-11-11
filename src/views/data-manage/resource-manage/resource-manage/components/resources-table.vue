<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.resourceName" placeholder="任务名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="searchQuery.usernameSelect" placeholder="归属者" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in usernameOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="searchQuery.resourceTypeSelect" placeholder="任务类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in resourceTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleSearch">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleResourceAdd">
        资源添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        资源列表导出
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
      <el-table-column label="资源名称" width="180px" align="center">
        <template slot-scope="{row}">
          <el-popover
            placement="right"
            width="400"
            trigger="click"
          >
            <el-form>
              <el-form-item label="资源名称">
                <el-input v-model="row.resourceName" />
              </el-form-item>
              <el-form-item label="资源描述">
                <el-input v-model="row.desc" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="margin-left:150px" @click="handleInfoVerity(row._id,row.resourceName,row.desc)">保存</el-button>
              </el-form-item>
            </el-form>
            <span slot="reference" class="link-type">{{ row.resourceName }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="归属者" column-key="username" :filters="usernameFilter" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公开性" width="180px" align="center">
        <template slot-scope="{row}">
          <el-radio-group v-model="row.publicity" :disabled="row.username!=$store.state.user.username">
            <el-radio-button label="公开" />
            <el-radio-button label="不公开" />
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ (row.datetime.$date-8*60*60*1000) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源类型" column-key="resourceType" :filters="resourceTypeFilter" width="180px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.resourceType | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div v-if="row.username===$store.state.user.username">
            <el-button type="primary" size="mini" @click="handleManage(row)">
              查看资源
            </el-button>
            <el-button type="primary" size="mini" @click="copyDataSet(row)">
              拷贝
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </div>
          <div v-else>
            <el-button type="primary" size="mini" @click="copyDataSet(row)">
              拷贝
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <resource-upload ref="ResourceUpload" />
  </div>
</template>

<script>
import { resourcesFetch } from '@/api/data-manage/resource'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import ResourceUpload from './resource-upload'
const resourceTypeOptions = [
  { key: '停用词表', display_name: '停用词表' },
  { key: '预训练向量', display_name: '预训练向量' }
]

const calendarTypeKeyValue = resourceTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ResourcesTable',
  components: { Pagination, ResourceUpload },
  directives: { waves },
  filters: {
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
      listQuery: {
        page: 1,
        limit: 20,
        sort: '-id',
        resourceName: '',
        datasetType: '原始数据集',
        username: ['自己', '他人'],
        resourceType: ['停用词表', '预训练向量']
      },
      searchQuery: {
        usernameSelect: '',
        resourceTypeSelect: ''
      },
      usernameOptions: ['自己', '他人'],
      resourceTypeOptions,
      sortOptions: [{ label: 'ID升序', key: 'id' }, { label: 'ID降序', key: '-id' }],
      downloadLoading: false,
      usernameFilter: [
        { text: '自己', value: '自己' },
        { text: '他人', value: '他人' }
      ],
      resourceTypeFilter: [
        { key: '停用词表', display_name: '停用词表' },
        { key: '预训练向量', display_name: '预训练向量' }
      ],
      datasetCopy: {
        copyDialogVisible: false,
        copyDes: '',
        datasetInitid: ''
      },
      upload: {
        show: false
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      resourcesFetch(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0 * 1000)
      })
    },
    handleResourceAdd() {
      this.$refs.ResourceUpload.showDialog()
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
    handleManage(row) {
      this.$router.push('/data-manage/resource-manage/codehub/' + row._id)
    },
    copyDataSet(row) {
      this.datasetCopy.datasetInitid = row._id
      this.datasetCopy.copyDes = ''
      this.datasetCopy.copyDialogVisible = true
    },
    handleDelete(row) {
    },
    handleInfoVerity(id, resourceName, desc) {
    },
    handleDataVenation(row) {
      this.$router.push('/data-manage/data-venation/' + row._id)
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
      if (this.searchQuery.resourceTypeSelect === '') {
        this.listQuery.resourceType = ['停用词表', '预训练向量']
      } else {
        this.listQuery.resourceType = [this.searchQuery.resourceTypeSelect]
      }
      this.handleFilter()
    },
    handleCopy() {
      this.datasetCopy.copyDialogVisible = false
    },
    handleShowTest(row) {
      console.log(this.$store.state.user.username)
      return true
    }
  }
}
</script>
