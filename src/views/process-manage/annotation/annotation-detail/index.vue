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
import L2rVectorListwise from './components/l2r-vector-listwise'
import L2rVectorPointwise from './components/l2r-vector-pointwise'
import classificationVector from './components/classification-vector'
import SummaryVectorExtractive from './components/summary-vector-extractive'
import SummaryVectorAbstractive from './components/summary-vector-abstractive'
import SentimentAnalysisVectorAspect from './components/sentiment-analysis-vector-aspect'
import SentimentAnalysisVectorText from './components/sentiment-analysis-vector-text'
import SentimentAnalysisVectorSentence from './components/sentiment-analysis-vector-sentence'

export default {
  name: 'DataDetail',
  components: { ExtractionVector, RelationAnalysisVector, L2rVectorListwise, L2rVectorPointwise, classificationVector, SummaryVectorExtractive, SummaryVectorAbstractive, SentimentAnalysisVectorAspect, SentimentAnalysisVectorText, SentimentAnalysisVectorSentence },
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
            if (this.annotationFormat.level === '列表标注') {
              this.annotationVectorComponent = L2rVectorListwise
            } else if (this.annotationFormat.level === '单点标注') {
              this.annotationVectorComponent = L2rVectorPointwise
            }
            break
          case '通用单文本分类':
            this.annotationVectorComponent = classificationVector
            break
          case '文本摘要':
            if (this.annotationFormat === '抽取式') {
              this.annotationVectorComponent = SummaryVectorExtractive
            } else if (this.annotationFormat === '生成式') {
              this.annotationVectorComponent = SummaryVectorAbstractive
            }
            break
          case '情感分析/意图识别':
            if (this.annotationFormat.level === 'aspect级') {
              this.annotationVectorComponent = SentimentAnalysisVectorAspect
            } else if (this.annotationFormat.level === '篇章级') {
              this.annotationVectorComponent = SentimentAnalysisVectorText
            } else {
              this.annotationVectorComponent = SentimentAnalysisVectorSentence
            }
            break
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
