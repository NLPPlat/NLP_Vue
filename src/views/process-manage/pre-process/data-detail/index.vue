<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="vectors（文本向量）">
        <data-detail-table />
      </el-tab-pane>
      <el-tab-pane label="label_name（映射后标签名称）">\
        {{ preprocessObj.label_name }}
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
