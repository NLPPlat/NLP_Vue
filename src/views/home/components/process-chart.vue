<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

// const animationDuration = 6000

export default {
  name: 'ProcessChart',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '450px'
    }
  },
  data() {
    return {
      chart: null,
      chartStyle: {
        processNode: {
          color: '#3E4150',
          symbol: 'rect',
          symbolSize: [90, 50]
        },
        assistantNode: {
          color: '#DF0101',
          symbol: 'circle',
          symbolSize: 40
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      // 监听图标点击节点事件
      var self = this
      this.chart.on('click', function(params) {
        if (params.componentType === 'series') {
          if (params.seriesType === 'graph') {
            if (params.dataType === 'node') {
              // 点击到了 graph 的 node（节点）上。
              switch (params.name) {
                case '数据接入':
                  self.$router.push('/process-manage/data-upload')
                  break
                case '数据集':
                  self.$router.push('/process-manage/data-set')
                  break
                case '数据标注':
                  self.$router.push('/process-manage/annotation')
                  break
                case '预处理':
                  self.$router.push('/process-manage/pre-process')
                  break
                case '模型训练':
                  self.$router.push('/process-manage/model-train')
                  break
                case '批处理':
                  self.$router.push('/process-manage/batch-process')
                  break
                case '任务管理':
                  self.$router.push('/process-manage/task-manage')
                  break
                case '模型管理':
                  self.$router.push('/process-manage/model-manage')
                  break
              }
            }
          }
        }
      })
      this.chart.setOption({
        tooltip: {
          show: false
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        hoverAnimation: true,
        textStyle: {
          fontSize: 16
        },
        series: [{
          name: '过程管理',
          type: 'graph',
          layout: 'none',
          label: {
            normal: {
              show: true
            }
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [0, 0],
          lineStyle: {
            normal: {
              color: '#000000',
              opacity: 1,
              width: 1
            }
          },
          data: [{
            name: '数据接入',
            x: 0,
            y: 800,
            symbol: this.chartStyle.processNode.symbol,
            symbolSize: this.chartStyle.processNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.processNode.color }
            }
          }, {
            x: 500,
            y: 800,
            symbol: this.chartStyle.assistantNode.symbol,
            symbolSize: this.chartStyle.assistantNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.assistantNode.color }
            }
          }, {
            name: '数据查看',
            x: 1000,
            y: 800,
            symbol: this.chartStyle.processNode.symbol,
            symbolSize: this.chartStyle.processNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.processNode.color }
            }
          }, {
            x: 1500,
            y: 800,
            symbol: this.chartStyle.assistantNode.symbol,
            symbolSize: this.chartStyle.assistantNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.assistantNode.color }
            }}, {
            name: '数据标注',
            x: 2000,
            y: 500,
            symbol: this.chartStyle.processNode.symbol,
            symbolSize: this.chartStyle.processNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.processNode.color }
            }
          }, {
            x: 2000,
            y: 1100,
            symbol: this.chartStyle.assistantNode.symbol,
            symbolSize: this.chartStyle.assistantNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.assistantNode.color }
            }}, {
            x: 2500,
            y: 800,
            symbol: this.chartStyle.assistantNode.symbol,
            symbolSize: this.chartStyle.assistantNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.assistantNode.color }
            }}, {
            name: '预处理',
            x: 3000,
            y: 800,
            symbol: this.chartStyle.processNode.symbol,
            symbolSize: this.chartStyle.processNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.processNode.color }
            }
          }, {
            x: 3000,
            y: 500,
            symbol: this.chartStyle.assistantNode.symbol,
            symbolSize: this.chartStyle.assistantNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.assistantNode.color }
            }}, {
            x: 3000,
            y: 1100,
            symbol: this.chartStyle.assistantNode.symbol,
            symbolSize: this.chartStyle.assistantNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.assistantNode.color }
            }}, {
            x: 3500,
            y: 800,
            symbol: this.chartStyle.assistantNode.symbol,
            symbolSize: this.chartStyle.assistantNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.assistantNode.color }
            }}, {
            name: '模型训练',
            x: 4000,
            y: 500,
            symbol: this.chartStyle.processNode.symbol,
            symbolSize: this.chartStyle.processNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.processNode.color }
            }
          }, {
            name: '批处理',
            x: 4000,
            y: 1100,
            symbol: this.chartStyle.processNode.symbol,
            symbolSize: this.chartStyle.processNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.processNode.color }
            }
          }, {
            x: 4500,
            y: 800,
            symbol: this.chartStyle.assistantNode.symbol,
            symbolSize: this.chartStyle.assistantNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.assistantNode.color }
            }}, {
            name: '任务管理',
            x: 2500,
            y: 1500,
            symbol: this.chartStyle.processNode.symbol,
            symbolSize: this.chartStyle.processNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.processNode.color }
            }
          }, {
            name: '结果应用',
            x: 5000,
            y: 800,
            symbol: this.chartStyle.processNode.symbol,
            symbolSize: this.chartStyle.processNode.symbolSize,
            itemStyle: {
              normal: { color: this.chartStyle.processNode.color }
            }
          }],
          links: [{
            source: 0,
            target: 1,
            lineStyle: {
              curveness: 0
            }
          }, {
            source: 1,
            target: 2,
            lineStyle: {
              curveness: 0
            }
          }, {
            source: 2,
            target: 3,
            lineStyle: {
              curveness: 0
            }
          }, {
            source: 3,
            target: 4,
            lineStyle: {
              curveness: 0.35
            }
          }, {
            source: 3,
            target: 5,
            lineStyle: {
              curveness: -0.3
            }
          }, {
            source: 4,
            target: 6,
            lineStyle: {
              curveness: 0.35
            }
          }, {
            source: 5,
            target: 6,
            lineStyle: {
              curveness: -0.3
            }
          }, {
            source: 6,
            target: 7,
            lineStyle: {
              curveness: 0
            }
          }, {
            source: 4,
            target: 8,
            lineStyle: {
              curveness: 0
            }
          }, {
            source: 5,
            target: 9,
            lineStyle: {
              curveness: 0
            }
          }, {
            source: 7,
            target: 10,
            lineStyle: {
              curveness: 0
            }
          }, {
            source: 8,
            target: 11,
            lineStyle: {
              curveness: 0
            }
          }, {
            source: 9,
            target: 12,
            lineStyle: {
              curveness: 0
            }
          }, {
            source: 10,
            target: 11,
            lineStyle: {
              curveness: 0.35
            }
          }, {
            source: 10,
            target: 12,
            lineStyle: {
              curveness: -0.3
            }
          }, {
            source: 11,
            target: 13,
            lineStyle: {
              curveness: 0.35
            }
          }, {
            source: 12,
            target: 13,
            lineStyle: {
              curveness: -0.3
            }
          }, {
            source: 13,
            target: 15,
            lineStyle: {
              curveness: 0
            }
          }]
        }]
      })
    }
  }
}
</script>
