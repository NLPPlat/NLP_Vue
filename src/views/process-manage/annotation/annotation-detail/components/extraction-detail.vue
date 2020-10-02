<template>
  <div class="app-container">
    <div class="block">
      <el-carousel trigger="click" height="600px">
        <el-carousel-item v-for="item in 4" :key="item">
          <el-row>
            <el-col :span="12">
              hello
            </el-col>
            <el-col :span="6">
              <ul v-infinite-scroll="load" class="infinite-list" style="overflow:auto">
                <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
              </ul>
            </el-col>
            <el-col :span="6">
              hello
            </el-col>
          </el-row>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ExtractionDetail',
  components: { },
  data() {
    return {
      count: 0
    }
  },
  created() {
  },
  methods: {
    load() {
      this.count += 2
    }
  }
}
</script>

<style scoped>

</style>
