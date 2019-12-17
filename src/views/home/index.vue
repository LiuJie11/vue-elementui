<template>
 <el-container class='home-comtainer'>
    <el-header>
        <v-header/>
    </el-header>

    <el-container>
      <el-aside :width="$store.state.isCollapse? '64px': '200px'">
          <nav-left :menus='menus'/>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
  </el-container>
</el-container>
</template>

<script>
import VHeader from 'components/common/vheader'  
import VMain from 'views/main'
import NavLeft from 'components/common/navleft'


 export default {
   name:'Home',  
   components:{
       VHeader,
        VMain,
        NavLeft
   },
   data () {
     return {
       menus:[]
     }
   },
   methods:{
    async getMenus(){
      const { data: res } = await this.$http.get('menus')
      if(res.meta.status!==200) return this.$message.error(res.meta.msg)
      this.menus=res.data
     }
   },
   mounted(){
     this.getMenus()
   },
 }
</script>

<style lang='less' scoped>
  .home-comtainer{
      height: 100%;
      .el-header{
         width: 100%;
         background: #242f42;
         height: 70px !important;
         line-height: 70px;
         font-size: 22px;
         color: #fff;
      }
      .el-aside{
        background: #242f42;
      }
      .el-main{
        background: #F8F8F8;
        height: 100vh;
      }
  }
 
</style>
