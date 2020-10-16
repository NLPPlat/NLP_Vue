<template>
  <div class="app-container">
    <div class="block">
      <el-row type="flex" justify="space-between">
        <el-col :span="2" style="text-align:center">
          <el-button type="primary" icon="el-icon-arrow-left" @click="handleBack">上一个</el-button>
        </el-col>
        <el-col :span="2" style="text-align:center">
          <el-button type="primary" @click="handleNext">下一个<i class="el-icon-arrow-right el-icon--right" /></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>文&nbsp;&nbsp;&nbsp;&nbsp;本&nbsp;&nbsp;&nbsp;&nbsp;1</span>
            </div>
            <div ref="textShow" style="line-height:27.5px">
              {{ text1 }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>文本关系标签</span>
            </div>
            <div>
              <el-checkbox-group v-model="label.text">
                <el-checkbox-button v-for="item in tags.textTags" :key="item" :label="item" />
              </el-checkbox-group>
            </div>
          </el-card>
          <el-row>
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix" style="text-align:center">
                  <span>文本1标签</span>
                </div>
                <div>
                  <el-checkbox-group v-model="label.text1" size="mini">
                    <el-checkbox-button v-for="item in tags.text1Tags" :key="item" :label="item" />
                  </el-checkbox-group>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix" style="text-align:center">
                  <span>文本2标签</span>
                </div>
                <div>
                  <el-checkbox-group v-model="label.text2" size="mini">
                    <el-checkbox-button v-for="item in tags.text2Tags" :key="item" :label="item" />
                  </el-checkbox-group>
                </div>
              </el-card>
            </el-col>
          </el-row>

        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>文&nbsp;&nbsp;&nbsp;&nbsp;本&nbsp;&nbsp;&nbsp;&nbsp;2</span>
            </div>
            <div ref="textShow" style="line-height:27.5px">
              {{ text2 }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { fetchTags, fetchVector, uploadAnnotationTags } from '@/api/process-manage/annotation'
import { Pass } from 'codemirror'
export default {
  name: 'RelationAnalysisVector',
  components: { },
  data() {
    return {
      listQuery: {
        datasetid: '',
        vectorid: ''
      },
      tags: {
        textTags: [],
        text1Tags: [],
        text2Tags: []
      },
      text1: '',
      text2: '',
      label: {
        text: [],
        text1: [],
        text2: []
      },
      extractionDialogVisible: false,
      relationDialogVisible: false,
      tempEntity: {
        text: '',
        start: '',
        end: ''
      },
      tempRelation: {
        entity1: {},
        entity2: {},
        count: 0
      }
    }
  },
  created() {
    this.listQuery.datasetid = this.$route.params.datasetid
    this.listQuery.vectorid = this.$route.params.vectorid
    this.getTags()
  },
  methods: {
    getTags() {
      fetchTags(this.listQuery).then(response => {
        this.tags.textTags = response.data.annotationFormat.textTags
        this.tags.text1Tags = response.data.annotationFormat.text1Tags
        this.tags.text2Tags = response.data.annotationFormat.text2Tags
        this.getVector()
      })
    },
    getVector() {
      fetchVector(this.listQuery).then(response => {
        this.text1 = response.data.vector.text1
        this.text2 = response.data.vector.text2
        if (response.data.vector.label === '') {
          Pass
        } else {
          this.label = response.data.vector.label
        }
      })
    },
    upload() {
      uploadAnnotationTags({ 'datasetid': this.listQuery.datasetid, 'vectorid': this.listQuery.vectorid, 'label': this.label }).then(response => {
        console.log(response)
      })
    },
    handleBack() {
      this.upload()
      this.$router.push('/process-manage/annotation/annotation-detail/' + this.listQuery.datasetid + '/' + (Number(this.listQuery.vectorid) - 1))
    },
    handleNext() {
      this.upload()
      this.$router.push('/process-manage/annotation/annotation-detail/' + this.listQuery.datasetid + '/' + (Number(this.listQuery.vectorid) + 1))
    }
  }
}
</script>

<style lang="scss" scoped>
.board {
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}

.box-card{
  margin:20px 10px 0px 10px
}

::v-deep{
  .el-checkbox-button__inner{
    border-left: 1px solid #DCDFE6;
    margin:10px;
}
}
</style>
