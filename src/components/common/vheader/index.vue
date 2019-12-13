
<template>
 <div class='header'>
    <div class="collapse-btn" @click="collapseChage">
        <i v-if="!$store.state.isCollapse" class="el-icon-s-fold"></i>
        <i v-else class="el-icon-s-unfold"></i>
    </div>
     <h1>后台管理系统</h1>
     <div class='header-right'>
         <div class="user-avatar">
             <img src="~assets/img/img.jpg" alt="">
         </div>
        <el-dropdown trigger='click' @command='handleCommand'>
            <span class="el-dropdown-link">
                {{$store.state.info&&$store.state.info.username||name}}
                <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <a href="https://github.com/LiuJie11/vue-elementui" target="_blank">
                    <el-dropdown-item>git仓库</el-dropdown-item>
                </a>
                <el-dropdown-item divided command='loginout'>退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
     </div>
 </div>
</template>

<script>
 export default {
     name:'VHeader',
   data () {
     return {
         name:''
     }
   },
   methods:{
       //折叠切换
       collapseChage(){
          let bol = !this.$store.state.isCollapse;
          this.$store.dispatch('setcollapse',bol)
       },
       //下拉退出
       handleCommand(command){
           if(command==='loginout'){
               window.sessionStorage.clear()
               this.$router.replace('/login')
               this.$store.dispatch('setinfo',null)
           }
       },
       //从sessionStorage拿用户名
       getUserName(){
           this.name = window.sessionStorage.getItem('username')
       }
   },
   created(){
       this.getUserName()
   }

 }
</script>

<style lang='less' scoped>
    .header{
        display: flex;
        align-items: center;
        .collapse-btn{
            padding: 0 20px;
           
            cursor: pointer;
        }
        .header-right{
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: flex-end;
            .user-avatar{
                display: flex;
                align-items: center;
                 &>img{
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                }
            }
           
            .el-dropdown-link{
                color: #fff;
                padding-left: 10px;
            }
        }
    }
 
</style>
