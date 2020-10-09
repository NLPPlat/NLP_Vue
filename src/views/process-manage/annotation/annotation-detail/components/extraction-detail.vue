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
              <span>文&nbsp;&nbsp;&nbsp;&nbsp;本</span>
            </div>
            <div ref="textShow" style="line-height:27.5px" @mouseup="textSelect">
              {{ text }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="7">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>实&nbsp;&nbsp;&nbsp;&nbsp;体</span>
            </div>
            <el-collapse v-model="tags.activeEntityTags" @change="handleChange">
              <el-collapse-item v-for="item in tags.entityTags" :key="item" :title="item" :name="item">
                <el-tag v-for="entityTag in label.entity[item]" :key="entityTag" :type="entityTag.type" closable effect="dark" :disable-transitions="false" style="margin:5px 10px;cursor:pointer" @close="handleCloseEntityTag(entityTag,item)" @click="handleSelectEntityTag(entityTag,item)">{{ entityTag.text }}</el-tag>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>
        <el-col :span="7">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>关&nbsp;&nbsp;&nbsp;&nbsp;系</span>
            </div>
            <el-collapse v-model="tags.activeRelationTags" @change="handleChange">
              <el-collapse-item v-for="item in tags.relationTags" :key="item" :title="item" :name="item">
                <el-tag v-for="relationTag in label.relation[item]" :key="relationTag" type="success" closable effect="dark" :disable-transitions="false" style="margin:5px 10px;" @close="handleCloseEntityTag(entityTag,item)">{{ relationTag.entity1.text+"-"+relationTag.entity2.text }}</el-tag>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      title="选择实体"
      :visible.sync="extractionDialogVisible"
      width="30%"
    >
      <el-button v-for="item in tags.entityTags" :key="item" type="primary" @click="entitySelectChange(item)">{{ item }}</el-button>
    </el-dialog>

    <el-dialog
      title="选择关系"
      :visible.sync="relationDialogVisible"
      width="30%"
    >
      <el-button v-for="item in tags.relationTags" :key="item" type="primary" @click="relationSelectChange(item)">{{ item }}</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTags, fetchVector, uploadAnnotationTags } from '@/api/process-manage/annotation'
export default {
  name: 'ExtractionDetail',
  components: { },
  data() {
    return {
      listQuery: {
        datasetid: '',
        vectorid: ''
      },
      tags: {
        entityTags: [],
        relationTags: [],
        activeEntityTags: [],
        activateRelationTags: []
      },
      annotation: {

      },
      text: '',
      label: {
        entity: {},
        relation: {}
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
    this.getVector()
  },
  methods: {
    getTags() {
      fetchTags(this.listQuery).then(response => {
        this.tags.entityTags = response.data.annotationFormat.entityTags
        this.tags.relationTags = response.data.annotationFormat.relationTags
        this.tags.activeEntityTags = response.data.annotationFormat.entityTags
        this.tags.activeRelationTags = response.data.annotationFormat.relationTags
      })
    },
    getVector() {
      fetchVector(this.listQuery).then(response => {
        this.text = response.data.vector.text1
        if (response.data.vector.label === '') {
          for (var entityTag of this.tags.entityTags) {
            this.label.entity[entityTag] = []
          }
          for (var relationTag of this.tags.relationTags) {
            this.label.relation[relationTag] = []
          }
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
    },
    entitySelectChange(item) {
      this.label.entity[item].push({ ...this.tempEntity })
      this.extractionDialogVisible = false
    },
    handleCloseEntityTag(entityTag, item) {
      this.label.entity[item].splice(this.label.entity[item].indexOf(entityTag), 1)
      this.$forceUpdate()
    },
    handleSelectEntityTag(entityTag, item) {
      if (this.tempRelation.count === 0) {
        entityTag.type = 'danger'
        this.tempRelation.entity1 = entityTag
        this.tempRelation.count = 1
      } else {
        entityTag.type = 'danger'
        this.tempRelation.entity2 = entityTag
        this.tempRelation.count = 0
        this.relationDialogVisible = true
      }
      this.$forceUpdate()
    },
    relationSelectChange(item) {
      console.log({ 'entity1': this.tempRelation.entity1, 'entity2': this.tempRelation.entity2 })
      this.label.relation[item].push({ 'entity1': this.tempRelation.entity1, 'entity2': this.tempRelation.entity2 })
      this.relationDialogVisible = false
      this.tempRelation.entity1.type = null
      this.tempRelation.entity2.type = null
      this.$forceUpdate()
    },
    textSelect() {
      var text = window.getSelection()
      if (text.toString() !== '') {
        var start = text.anchorOffset
        var end = text.focusOffset
        if (start <= end) {
          this.tempEntity.start = start
          this.tempEntity.end = end
        } else {
          this.tempEntity.start = end
          this.tempEntity.end = start
        }
        this.tempEntity.text = text.toString()
        text.empty()
        this.extractionDialogVisible = true
      }
    }
    // this.text = this.reCal(text, this.text)
    // var textNode = this.$refs.textShow.childNodes[0]
    // var textNode = this.$refs.textShow
    // textNode.normalize()
    // console.log(this.$refs.textShow.childNodes)
    // console.log(textNode.childNodes)
    // var textSelect = window.getSelection()
    // console.log(textSelect)
    // var start = textSelect.anchorOffset
    // var end = textSelect.focusOffset
    // console.log(start, end)
    // this.rangeEdit(start, end, textSelect.anchorNode)
    // this.$refs.textShow.childrens.normalize()
    // text.splitText(start)
    // console.log(text)
    // var text = window.getSelection().getRangeAt(0)
    // if (text.toString() !== '') {
    //   var selectionContents = text.extractContents()
    //   var span = document.createElement('span')
    //   span.style.backgroundColor = 'yellow'
    //   span.appendChild(selectionContents)
    //   text.insertNode(span)
    // }

    // rangeEdit(start, end, node) {
    //   var range = document.createRange()
    //   range.setStart(node, start)
    //   range.setEnd(node, end)
    //   var selectionContents = range.extractContents()
    //   var span = document.createElement('span')
    //   span.style.backgroundColor = 'yellow'
    //   span.appendChild(selectionContents)
    //   range.insertNode(span)
    // },
    // reCal(subStr, str) {
    //   var replaceStr = '<span style="background-color:red">' + subStr + '</span>'
    //   var initRe = new RegExp(subStr, 'g')
    //   var strRes = str.replace(initRe, replaceStr)
    //   return strRes
    // }
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
