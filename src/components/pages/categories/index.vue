<template>
 <div>
   <!-- 面包屑 -->
     <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type='primary' >添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 商品分类列表  -->

         <!-- 商品分类分页  -->
    </el-card>
 </div>
</template>

<script>

 export default {
     name:'Categories',
   data () {
     return {
       // 商品分类列表
        cateList:[],
       // 商品分页
       catequery:{
         type:3,
         pagenum:1,
         pagesize:5
       },
       //保存商品分类总条数
       total:0,
     }
   },
   methods:{
    async getCateList(){
     const {data:res} = await this.$http.get('categories',{params:this.catequery})
     if(res.meta.status!==200){
        return this.$message.error('获取商品分类列表失败!')
     }
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(res)
    }
   },

   mounted(){
    this.getCateList()
   }

 }
</script>

<style lang='less' scoped>

 
</style>
