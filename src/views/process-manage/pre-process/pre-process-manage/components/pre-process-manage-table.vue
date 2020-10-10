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
      <el-table-column label="步骤名称" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.preprocessName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="步骤类别" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.preprocessType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行状态" column-key="preprocessStatus" :filters="statusFilter" class-name="status-col" width="160px">
        <template slot-scope="{row}">
          <el-tag :type="row.preprocessStatus | statusFilter">
            {{ row.preprocessStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Spark支持" width="160px" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.sparkSupport" disabled />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <div v-if="row.preprocessStatus==='已完成'">
            <el-button type="primary" size="mini" @click="handleManage(row)">
              查看数据
            </el-button>
            <el-button size="mini" type="success">
              导出
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </div>
          <div v-if="row.preprocessStatus==='未开始'">
            <el-button type="primary" size="mini" @click="handleManage(row)">
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
      <el-col :span="10" style="text-align:right">
        <el-button type="primary" @click="preprocessAdd.show=true">新增步骤</el-button>
      </el-col>
      <el-col :span="10" style="text-align:left">
        <el-button type="primary">快速执行</el-button>
      </el-col>
    </el-row>

    <el-dialog title="新增步骤" :visible.sync="preprocessAdd.show">
      <el-row type="flex" justify="center">
        <el-col :span="12" style="text-align:left">
          <el-form :model="preprocessAdd" label-width="100px">
            <el-form-item label="选择步骤">
              <el-cascader
                v-model="preprocessAdd.preprocessSelect"
                :options="preprocessAdd.preprocessList"
                :props="{ expandTrigger: 'hover' }"
                placeholder="下一步需要执行的步骤"
              />
            </el-form-item>
            <el-form-item label="Spark支持">
              <el-switch v-model="preprocessAdd.sparkSwitch" />
            </el-form-item>
            <el-form-item label="参数配置">
              <el-button type="success" plain size="small">点击配置</el-button>
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

  </div>

</template>

<script>

import { preprocessStatusFetch, preprocessAdd } from '@/api/process-manage/preprocess'

export default {
  name: 'PreProcessManageTable',
  components: { },
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
        sparkSwitch: false,
        preprocessList: [{
          value: '基本预处理',
          label: '基本预处理',
          children: [{
            value: '分词',
            label: '分词'
          }, {
            value: '词性标注',
            label: '词性标注'
          }, {
            value: '去停用词',
            label: '去停用词'
          }, {
            value: '关键词提取',
            label: '关键词提取'
          }]
        }, {
          value: '向量模型',
          label: '向量模型',
          children: [{
            value: 'TFIDF',
            label: 'TFIDF'
          }, {
            value: 'Word2vec',
            label: 'Word2vec'
          }, {
            value: 'Doc2vec',
            label: 'Doc2vec'
          }, {
            value: 'GloVe',
            label: 'GloVe'
          }, {
            value: 'ELMo',
            label: 'ELMo'
          }, {
            value: 'BERT',
            label: 'BERT'
          }]
        }, {
          value: '特征工程',
          label: '特征工程',
          children: [{
            value: 'Embedding Matrix',
            label: 'Embedding Matrix'
          }, {
            value: '自定义特征',
            label: '自定义特征'
          }]
        }, {
          value: '特征降维',
          label: '特征降维',
          children: [{
            value: 'PCA',
            label: 'PCA'
          }, {
            value: 'LDA',
            label: 'LDA'
          }]
        }, {
          value: '特征选择',
          label: '特征选择',
          children: [{
            value: '方差选择',
            label: '方差选择'
          }, {
            value: '相关系数',
            label: '相关系数'
          }, {
            value: '卡方检验',
            label: '卡方检验'
          }, {
            value: '互信息法',
            label: '互信息法'
          }, {
            value: '递归特征消除',
            label: '递归特征消除'
          }, {
            value: '惩罚项',
            label: '惩罚项'
          }, {
            value: '树模型',
            label: '树模型'
          }]
        }]
      }
    }
  },
  created() {
    this.listQuery.datasetid = this.$route.params.datasetid
    this.getList()
  },
  methods: {
    getList() {
      preprocessStatusFetch(this.listQuery).then(response => {
        this.list = response.data.items
      })
    },
    handlePreprocessAdd() {
      preprocessAdd({ 'datasetid': this.listQuery.datasetid, 'preprocessAdd': this.preprocessAdd.preprocessSelect, 'sparkSupport': this.preprocessAdd.sparkSwitch }).then(response => {
        this.getList()
        this.preprocessAdd.show = false
      })
    }
  }
}
</script>
