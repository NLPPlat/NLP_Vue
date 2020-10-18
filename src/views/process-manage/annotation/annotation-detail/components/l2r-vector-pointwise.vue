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
              <span>查询文本</span>
            </div>
            <div ref="textShow" style="line-height:27.5px">
              {{ text }}
            </div>
          </el-card>
        </el-col>

        <el-col :span="16">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>结果文本列表</span>
            </div>
            <el-table :data="textList" fit style="width: 100%">

              <el-table-column label="句子/段落">
                <template slot-scope="{row}">
                  <span>{{ row.text1 }}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" label="程度" width="200px">
                <template slot-scope="{row}">
                  <el-select v-model="row.label" placeholder="选择程度词">
                    <el-option
                      v-for="item in tags"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
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
  name: 'L2rVectorPointwise',
  data() {
    return {
      listQuery: {
        datasetid: '',
        group: ''
      },
      tags: [],
      text: '',
      textList: []
    }
  },
  created() {
    this.listQuery.datasetid = this.$route.params.datasetid
    this.listQuery.group = this.$route.params.vectorid
    this.getTags()
  },
  methods: {
    getTags() {
      fetchTags(this.listQuery).then(response => {
        this.tags = response.data.annotationFormat.tags
        this.getVector()
      })
    },
    getVector() {
      groupVectorsFetch({ 'datasetid': this.listQuery.datasetid, 'group': this.listQuery.group }).then(response => {
        this.text = response.data.vectors[0].text1
        for (var i = 1; i < response.data.vectors.length; i++) {
          this.textList.push(response.data.vectors[i])
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
