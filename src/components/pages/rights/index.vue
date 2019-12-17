<template>
 <div class='rights_container'>
   <!-- 面包屑 -->
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data='rightsList' border stripe>
         <el-table-column
            label="序号"
            type='index'
          >
          </el-table-column>

          <el-table-column
            label="权限名称"
            prop="authName"
          >
          </el-table-column>

          <el-table-column
            label="路径"
            prop="path"
          >
          </el-table-column>

          <el-table-column
            label="权限等级"
          >
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level==='0'">一级</el-tag>
                <el-tag v-if="scope.row.level==='1'" type="success">二级</el-tag>
                <el-tag v-if="scope.row.level==='2'" type="warning">三级</el-tag>
            </template>
          </el-table-column>
      </el-table>
    </el-card>
 </div>
</template>

<script>
 export default {
     name:'Rights',
   data () {
     return {
       // 权限列表数据
       rightsList:[],
     }
   },
   methods:{
     // 获取权限列表
     async getRightsList(){
       const {data:res} = await this.$http.get('rights/list')
       if(res.meta.status!==200){
         return this.$message.error('获取权限列表失败!')
       }
       this.rightsList = res.data
     }
   },
   mounted(){
     this.getRightsList();
   }
 }
</script>

<style lang='less' scoped>
  .rights_container{
    height: calc(100% - 100px);
     .el-card{
      height: 100%;
      overflow-y:scroll;
     }
     .el-card::-webkit-scrollbar{
       display: none
     } 
  }
 
 
</style>
