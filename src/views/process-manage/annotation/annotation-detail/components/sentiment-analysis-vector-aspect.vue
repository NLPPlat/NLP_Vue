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
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>文&nbsp;&nbsp;&nbsp;&nbsp;本</span>
            </div>
            <div ref="textShow" style="line-height:27.5px">
              {{ text }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>aspect标注</span>
            </div>
            <div>
              <el-table v-if="label.length>0" :data="label" fit style="width: 100%" :show-header="false">

                <el-table-column label="aspect" width="180px">
                  <template slot-scope="{row}">
                    <el-select v-model="row.aspect" placeholder="选择aspect">
                      <el-option
                        v-for="item in aspects"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="极性">
                  <template slot-scope="{row}">
                    <el-radio-group v-model="row.polarity">
                      <el-radio-button label="Positive" />
                      <el-radio-button label="Negative" />
                    </el-radio-group>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="60px">
                  <template slot-scope="row">
                    <el-button
                      type="text"
                      size="small"
                      @click="deleteRow(row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" icon="el-icon-plus" circle style="margin-top:10px;margin-left:10px" @click="handleAdd()" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { fetchTags, fetchVector, uploadAnnotationTags } from '@/api/process-manage/annotation'
export default {
  name: 'SentimentAnalysisVectorAspect',
  components: { },
  data() {
    return {
      listQuery: {
        datasetid: '',
        vectorid: ''
      },
      aspects: [],
      label: [],
      text: ''
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
        this.aspects = response.data.annotationFormat.tags
        this.getVector()
      })
    },
    getVector() {
      fetchVector({ 'datasetid': this.listQuery.datasetid, 'vectorid': this.listQuery.vectorid }).then(response => {
        this.text = response.data.vector.text1
        if (response.data.vector.label !== '') {
          this.label = response.data.vector.label
        }
      })
    },
    handleAdd() {
      this.label.push({ 'aspect': '', 'polarity': 'Positive' })
    },
    deleteRow(row) {
      this.label.splice(row.$index, 1)
    },
    upload() {
      uploadAnnotationTags({ 'datasetid': this.listQuery.datasetid, 'vectorid': this.listQuery.vectorid, 'label': this.label }).then(response => {
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
