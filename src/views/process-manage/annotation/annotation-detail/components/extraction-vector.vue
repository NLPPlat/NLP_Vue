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
  name: 'ExtractionVector',
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
  },
  methods: {
    getTags() {
      fetchTags(this.listQuery).then(response => {
        this.tags.entityTags = response.data.annotationFormat.entityTags
        this.tags.relationTags = response.data.annotationFormat.relationTags
        this.tags.activeEntityTags = response.data.annotationFormat.entityTags
        this.tags.activeRelationTags = response.data.annotationFormat.relationTags
        this.getVector()
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
        setTimeout(() => {
          this.drawEntities()
        }, 100)
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
      this.drawEntitiy(this.tempEntity.start, this.tempEntity.end)
      var text = window.getSelection()
      text.empty()
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
      var textAnchorNode = text.anchorNode
      if (text.toString() !== '') {
        var start = text.anchorOffset
        var end = text.focusOffset
        if (start > end) {
          [start, end] = [end, start]
        }
        var textShow = this.$refs.textShow
        var textNodeList = textShow.childNodes
        var nodeLen = 0
        for (var i = 0; i < textNodeList.length; i++) {
          var node = textNodeList[i]
          if (node.nodeType === 3) {
            if (node.contains(textAnchorNode)) {
              start = start + nodeLen
              end = end + nodeLen
              break
            }
            nodeLen = nodeLen + node.length
          }
        }
        this.tempEntity.start = start
        this.tempEntity.end = end
        this.tempEntity.text = text.toString()
        this.extractionDialogVisible = true
      }
    },
    drawEntities() {
      for (var i = 0; i < this.tags.entityTags.length; i++) {
        var tag = this.tags.entityTags[i]
        for (var j = 0; j < this.label.entity[tag].length; j++) {
          var entity = this.label.entity[tag][j]
          this.drawEntitiy(entity.start, entity.end)
        }
      }
    },
    drawEntitiy(start, end) {
      console.log(start, end)
      var textShow = this.$refs.textShow
      var textNodeList = textShow.childNodes
      var nodeLen = 0
      for (var i = 0; i < textNodeList.length; i++) {
        var node = textNodeList[i]
        if (node.nodeType === 3) {
          if (nodeLen + node.textContent.length > start) {
            var range = document.createRange()
            range.setStart(node, start - nodeLen)
            range.setEnd(node, end - nodeLen)
            var selectionContents = range.extractContents()
            var span = document.createElement('span')
            span.style.backgroundColor = 'green'
            span.appendChild(selectionContents)
            range.insertNode(span)
            break
          }
          nodeLen = nodeLen + node.length
        }
      }
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
