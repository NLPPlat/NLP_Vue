<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="vectors">
        <data-detail-table />
      </el-tab-pane>
      <el-tab-pane label="label_name">\
        {{ preprocessObj.label_name }}
      </el-tab-pane>
      <el-tab-pane label="label">
        {{ preprocessObj.label }}
      </el-tab-pane>
      <el-tab-pane label="matrix">
        {{ preprocessObj.matrix }}
      </el-tab-pane>
      <el-tab-pane label="url">
        {{ preprocessObj.url }}
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
