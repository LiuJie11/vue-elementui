<template>
  <div>
       <h1>store的基本使用</h1>
      <span>{{$store.state.count}}</span>
      <el-button type='primary' @click='handleAdd'>++</el-button>
  </div>
</template>

<script>

 export default {
   
     name:'VMain',
   data () {
     return {

     }
   },
   methods:{
       handleAdd(){
           this.$store.dispatch('add',1111)
       }
   }
 }
</script>

<style lang='less' scoped>
   
</style>

