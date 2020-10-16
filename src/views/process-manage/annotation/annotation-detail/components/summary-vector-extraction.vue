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
        <el-col :span="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>文本内容</span>
            </div>
            <el-table :data="textList" fit style="width: 100%">

              <el-table-column
                type="index"
                width="60px"
                label="序号"
                align="center"
              />

              <el-table-column label="句子/段落">
                <template slot-scope="{row}">
                  <span>{{ row.text1 }}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" label="选择" width="200px">
                <template slot-scope="{row}">
                  <el-checkbox v-model="row.label" />
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { fetchTags, uploadAnnotationTags } from '@/api/process-manage/annotation'
import { groupVectorsFetch } from '@/api/common/dataset'
export default {
  name: 'SummaryVectorExtraction',
  data() {
    return {
      listQuery: {
        datasetid: '',
        group: ''
      },
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
        this.textList = response.data.vectors
        for (var i = 0; i < this.textList.length; i++) {
          if (this.textList[i].label === '') {
            this.textList[i].label = false
          }
        }
      })
    },
    upload() {
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
