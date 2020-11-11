<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="vectors（文本向量）">
        <data-detail-table />
      </el-tab-pane>
      <el-tab-pane label="label_name（映射后标签id对应关系）">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="10">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>内容/形状/URL</span>
              </div>
              <div>
                {{ preprocessObj.label_name }}
              </div>
            </el-card>
          </el-col>
          <el-col :span="7">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>重新生成</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
              </div>
              <div>
                违法违法
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="label（映射后标签）">
        {{ preprocessObj.label }}
      </el-tab-pane>
      <el-tab-pane label="feature（特征）">
        {{ preprocessObj.feature }}
      </el-tab-pane>
      <el-tab-pane label="embedding（嵌入）">
        {{ preprocessObj.embedding }}
      </el-tab-pane>
      <el-tab-pane label="embedding_matrix(嵌入矩阵)">
        {{ preprocessObj.embedding_matrix }}
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DataDetailTable from './components/data-detail-table'

import { preprocessDataFetch } from '@/api/process-manage/preprocess'

export default {
  name: 'PreprocessDataDetail',
  components: { DataDetailTable },
  data() {
    return {
      listQuery: {
        datasetid: null,
        preprocessid: null
      },
      preprocessObj: {}
    }
  },
  computed: {
  },
  created() {
    this.listQuery.datasetid = this.$route.params.datasetid
    this.listQuery.preprocessid = this.$route.params.preprocessid
    this.getData()
  },
  methods: {
    getData() {
      preprocessDataFetch(this.listQuery).then(response => {
        this.preprocessObj = response.data.preprocessObj
      })
    }
  }
}
</script>
