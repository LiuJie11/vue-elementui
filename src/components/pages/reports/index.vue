


<template>
 <div>
    <!-- 面包屑 -->
    <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
 </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
 export default {
     name:'Reports',
   data () {
     return {
        //折线图数据
        reportsData:{},
        // 需要合并的对象
       options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
     }
   },
   methods:{
     // 获取折线图数据
     async getReportsData(){
      const {data:res} = await this.$http.get('reports/type/1')
      if(res.meta.status!==200){
        this.$message.error('获取折线图数据失败!')
      }
      this.reportsData = res.data

      // 基于准备好的dom，初始化echarts实例
         var myChart = echarts.init(document.getElementById('main'));
      // 合并需要展示的报表数据
         const result = _.merge(res.data, this.options)
      // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result); 
       }
   },
  
   mounted(){
     this.getReportsData()
   },
   
 }
</script>

<style lang='less' scoped>

 
</style>
