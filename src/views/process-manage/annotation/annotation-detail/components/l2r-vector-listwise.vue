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
        <el-col :span="10">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>查询文本</span>
            </div>
            <div ref="textShow" style="line-height:27.5px">
              {{ text }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>结果文本列表</span>
            </div>
            <div style="line-height:27.5px">
              <drag-list :list="textList" />
            </div>
          </el-card>

        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { fetchTags, uploadAnnotationTags } from '@/api/process-manage/annotation'
import { groupVectorsFetch } from '@/api/common/dataset'
import DragList from '@/components/DragList'
export default {
  name: 'L2rVectorListwise',
  components: { DragList },
  data() {
    return {
      listQuery: {
        datasetid: '',
        group: ''
      },
      text: '',
      textList: []
    }
  },
  created() {
    this.listQuery.datasetid = this.$route.params.datasetid
    this.listQuery.group = this.$route.params.vectorid
    this.getVector()
  },
  methods: {
    getTags() {
      fetchTags(this.listQuery).then(response => {
      })
    },
    getVector() {
      groupVectorsFetch({ 'datasetid': this.listQuery.datasetid, 'group': this.listQuery.group }).then(response => {
        this.text = response.data.vectors[0].text1
        for (var i = 1; i < response.data.vectors.length; i++) {
          this.textList.push(response.data.vectors[i])
          if (this.textList[i - 1].label === '') {
            this.textList[i - 1].label = i
          }
        }
        this.textList.sort(function(a, b) { return a.label - b.label })
      })
    },
    upload() {
      for (var i = 1; i <= this.textList.length; i++) {
        this.textList[i - 1].label = i
      }
      uploadAnnotationTags({ 'datasetid': this.listQuery.datasetid, 'group': this.listQuery.group, 'vectors': this.textList }).then(response => {
      })
    },
    handleBack() {
      this.upload()
      this.$router.push('/process-manage/annotation/annotation-detail/' + this.listQuery.datasetid + '/' + (Number(this.listQuery.group) - 1))
    },
    handleNext() {
      this.upload()
      this.$router.push('/process-manage/annotation/annotation-detail/' + this.listQuery.datasetid + '/' + (Number(this.listQuery.group) + 1))
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
</style>
