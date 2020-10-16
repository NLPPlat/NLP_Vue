<template>
  <div>
    <component :is="annotationVectorComponent" />
  </div>
</template>

<script>
import ExtractionVector from './components/extraction-vector'
import RelationAnalysisVector from './components/relation-analysis-vector'
import { tasktypeFetch } from '@/api/common/dataset'
import { fetchTags } from '@/api/process-manage/annotation'
import L2rVectorListwise from './components/l2r-vector-listwise.vue'
import classificationVector from './components/classification-vector.vue'
import SummaryVectorExtraction from './components/summary-vector-extraction'

export default {
  name: 'DataDetail',
  components: { ExtractionVector, RelationAnalysisVector, L2rVectorListwise, classificationVector, SummaryVectorExtraction },
  data() {
    return {
      datasetid: '',
      taskType: '',
      annotationFormat: '',
      annotationVectorComponent: ''
    }
  },
  computed: {
  },
  created() {
    this.datasetid = this.$route.params.datasetid
    this.getAnnotationFormat()
  },
  methods: {
    getTasktype() {
      tasktypeFetch({ 'datasetid': this.datasetid, 'datasetType': '原始数据集' }).then(response => {
        this.taskType = response.data.taskType
        switch (this.taskType) {
          case '实体关系抽取':
            this.annotationVectorComponent = ExtractionVector
            break
          case '文本关系分析':
            this.annotationVectorComponent = RelationAnalysisVector
            break
          case '文本排序学习':
            if (this.annotationFormat === '列表标注') {
              this.annotationVectorComponent = L2rVectorListwise
            }
            break
          case '通用单文本分类':
            this.annotationVectorComponent = classificationVector
            break
          case '文本摘要':
            if (this.annotationFormat === '抽取式') {
              this.annotationVectorComponent = SummaryVectorExtraction
            }
        }
      })
    },
    getAnnotationFormat() {
      fetchTags({ 'datasetid': this.datasetid }).then(response => {
        this.annotationFormat = response.data.annotationFormat
        this.getTasktype()
      })
    }
  }
}
</script>
