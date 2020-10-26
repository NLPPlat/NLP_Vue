<template>
  <div class="components-container">

    <el-row>
      <el-form :inline="true" :model="codeUpload" class="demo-form-inline">

        <el-form-item label="算子类型">
          <el-select v-model="codeUpload.operatorType" placeholder="请选择算子类型">
            <el-option label="数据清洗算子" value="数据清洗算子" />
            <el-option label="预处理算子" value="预处理算子" />
          </el-select>
        </el-form-item>
        <el-form-item label="算子名称">
          <el-input v-model="codeUpload.operatorName" placeholder="请填写算子名称" />
        </el-form-item>
        <el-form-item label="公开性">
          <el-radio-group v-model="codeUpload.publicity">
            <el-radio-button label="公开" />
            <el-radio-button label="不公开" />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row style="margin-bottom:20px">
      <el-button type="primary" @click="handleOperatorUpload()">
        保存算子
      </el-button>
      <el-button type="primary" @click="datasetSelect.show=true">
        在线调试
      </el-button>
      <el-button type="primary">
        本地读取
      </el-button>
      <el-button type="success" @click="APIDrawer=true">
        数据访问API
      </el-button>
    </el-row>

    <div class="editor-container">
      <python-editor ref="pythonEditor" v-model="codeUpload.code" />
    </div>
    <el-row style="margin:20px 0px" />
    <div class="editor-container">
      <python-console ref="pythonConsole" v-model="console.code" />
    </div>

    <el-dialog
      title="测试数据集"
      :visible.sync="datasetSelect.show"
      width="500px"
    >
      <el-form ref="form" :model="datasetSelect" label-width="180px">
        <el-form-item label="选择数据集以继续">
          <el-select v-model="datasetSelect.datasetid" placeholder="请选择数据集">
            <el-option v-for="item in datasetSelect.list" :key="item._id" :label="item._id+' '+item.taskName" :value="item._id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCodeRun()">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- API文档 -->
    <el-drawer title="API文档" :visible.sync="APIDrawer" :with-header="false">
      <el-card>
        <h2>预处理数据集：数据访问API</h2>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="app.dataAPI.preprocess.getPreprocessData(id)" name="0">
            <div>输入预处理步骤id，返回结果。id为-1时为最后一个步骤。</div>
          </el-collapse-item>
          <el-collapse-item title="dealCut(docs=[])-->list" name="1">
            <div>执行分词步骤并获取结果，以list格式返回。参数docs为要进行分词的文本列表。</div>
          </el-collapse-item>
          <el-collapse-item title="dealCutBySpark(docs=[])-->list" name="2">
            <div>基于Spark分布式计算分词并获取结果，以list格式返回。参数docs为要进行分词的文本列表。</div>
          </el-collapse-item>
          <el-collapse-item title="dealStopwords(docs=[],stopwordslist=[])-->list" name="3">
            <div>执行去停用词步骤并获取结果，以list格式返回。参数docs为要进行去停用词的二维文本列表，参数stopwordslist为停用词表。</div>
          </el-collapse-item>
          <el-collapse-item title="dealStopwordsBySpark(docs=[],stopwordslist=[])-->list" name="4">
            <div>基于Spark分布式计算去停用词并获取结果，以list格式返回。参数docs为要进行去停用词的二维文本列表，参数stopwordslist为停用词表。</div>
          </el-collapse-item>
          <el-collapse-item title="dealTFIDF(docs=[])-->ndarray" name="5">
            <div>执行TFIDF矩阵计算并获取结果，以ndarray格式返回。参数docs为要计算TFIDF的二维文本列表。</div>
          </el-collapse-item>
          <el-collapse-item title="dealTFIDFBySpark(docs=[])-->Daraframe" name="6">
            <div>训基于Spark分布式计算TFIDF矩阵并获取结果，以Dataframe格式返回。参数docs为要计算TFIDF的二维文本列表。</div>
          </el-collapse-item>
          <el-collapse-item title="dealWord2vec(docs=[],params) -->model" name="7">
            <div>执行Word2vec训练并获取结果，返回Gensim模型。参数docs为要进行模型训练的二维文本列表，参数params为训练参数，详见参数管理模块或Gensim说明文档。</div>
          </el-collapse-item>
          <el-collapse-item title="dealWord2vecBySpark(docs=[],params) -->model" name="8">
            <div>执行Word2vec训练并获取结果，返回pyspark.ml.feature的word2vec模型。参数docs为要进行模型训练的二维文本列表，参数params为训练参数，详见参数管理模块或pyspark说明文档。</div>
          </el-collapse-item>
          <el-collapse-item title="dealDoc2vec(docs=[],params) -->model" name="9">
            <div>执行doc2vec训练并获取结果，返回Gensim模型。参数docs为要进行模型训练的二维文本列表，参数params为训练参数，详见参数管理模块或Gensim说明文档。</div>
          </el-collapse-item>
          <el-collapse-item title="dealGloVe(docs=[],params) -->model" name="10">
            <div>执行GLoVe训练并获取结果，返回Gensim模型。参数docs为要进行模型训练的二维文本列表，参数params为训练参数，详见参数管理模块或GloVe官方说明文档。</div>
          </el-collapse-item>
          <el-collapse-item title="dealBERTEmbedding(docs=[],level=’char’,params)-->ndarray" name="11">
            <div>获取BERT预训练向量矩阵，以ndarray格式返回。参数docs为要进行模型训练的二维文本列表，参数level为嵌入矩阵的级别，level取值'char'时返回字向量矩阵，level取值'sen'时返回句向矩阵，level取值'doc'时返回文档向量矩阵，参数params为训练参数，详见BERT官方说明文档。</div>
          </el-collapse-item>
          <el-collapse-item title="dealEmbeddingMake(docs=[],model)-->ndarray" name="12">
            <div>使用模型和文本生成embedding矩阵，以ndarray格式返回。参数docs为要生成embedding矩阵的二维文本列表，参数model为要使用的Gensim模型。</div>
          </el-collapse-item>
          <el-collapse-item title="dealEmbeddingMakeBySpark(docs=[],model)-->ndarray" name="13">
            <div>基于Spark分布式计算模型和文本生成的embedding矩阵，以ndarray格式返回。参数docs为要生成embedding矩阵的二维文本列表，参数model为要使用的Gensim模型。</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-drawer>

  </div>
</template>

<script>
import PythonEditor from '@/components/PythonEditor'
import PythonConsole from '@/components/PythonConsole'

import { operatorUpload, operatorFetch, codeRun } from '@/api/data-manage/operator'
import { datasetIDListFetch } from '@/api/common/dataset'

export default {
  name: 'CodehubEditor',
  components: { PythonEditor, PythonConsole },
  data() {
    return {
      operatorid: '',
      codeUpload: {
        code: 'class Operator():\ndef operator(self):',
        operatorType: '',
        operatorName: '',
        publicity: '不公开'
      },
      console: {
        code: 'console'
      },
      APIDrawer: false,
      datasetSelect: {
        list: [],
        datasetid: '',
        show: false
      }
    }
  },
  created() {
    this.operatorid = this.$route.params.operatorid
    this.init()
    this.getDatasetList()
  },
  methods: {
    init() {
      if (this.operatorid !== '-1') {
        operatorFetch({ 'operatorid': this.operatorid }).then(response => {
          this.codeUpload = response.data
        })
      }
    },
    getDatasetList() {
      datasetIDListFetch({ 'datasetType': '预处理数据集' }).then(response => {
        this.datasetSelect.list = response.data.items
      })
    },
    handleOperatorUpload() {
      operatorUpload(Object.assign({ 'operatorid': this.operatorid }, this.codeUpload)).then(response => {
        this.$notify({
          title: '算子保存成功',
          message: '可在各个模块调用算子',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleCodeRun() {
      this.datasetSelect.show = false
      codeRun({ 'code': this.codeUpload.code, 'datasetid': this.datasetSelect.datasetid }).then(response => {
        this.$message.success('程序运行完成！')
        this.console.code = response.data
      })
    }
  }
}
</script>

<style scoped>
.editor-container{
  position: relative;
  height: 100%;
}
</style>

