<template>
  <div>
    <data-chart />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import dataChart from './components/data-chart'

export default {
  name: 'Home',
  components: { dataChart },
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
</style>
