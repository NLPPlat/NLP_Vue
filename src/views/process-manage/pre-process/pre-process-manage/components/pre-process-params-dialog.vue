<template>
  <div>
    <el-row>
      <el-form :inline="true" :model="preprocessDialog" class="demo-form-inline" label-width="100px">
        <el-form-item label="参数项">
          <el-select v-model="preprocessDialog.preprocessParamsSelect" placeholder="请选择要修改的参数">
            <el-option v-for="item in Object.keys(preprocessDialog.preprocessParams)" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="参数值">
          <el-input v-model="preprocessDialog.preprocessParams[preprocessDialog.preprocessParamsSelect]" placeholder="参数值" />
        </el-form-item>
      </el-form>
    </el-row>
    <el-row type="flex" justify="space-around" style="margin-top:30px">
      <el-col :span="10" style="text-align:right">
        <el-button type="primary" @click="confirmParams">确认配置</el-button>
      </el-col>
      <el-col :span="10" style="text-align:left">
        <el-button type="primary">保存为默认值</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'PreProcessParamsDialog',
  components: { },
  directives: { },
  filters: {
  },
  props: {
    preprocessName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      preprocessDialog: {
        preprocessParams: {},
        preprocessParamsSelect: ''
      }
    }
  },
  created() {
    this.getParams()
  },
  methods: {
    getParams() {
      this.preprocessDialog.preprocessParams = this.$store.state.preprocessParams[this.preprocessName]
    },
    confirmParams() {
      this.$emit('getPreprocessParams', this.preprocessDialog.preprocessParams)
    }
  }
}
</script>
