<template>
     <el-menu  
      :background-color='colObj.bgCol' 
      :text-color='colObj.tCol'  
      :active-text-color="colObj.activeCol"
      unique-opened 
      :collapse="$store.state.isCollapse"
      :default-active="activePath"
      router
      class="el-menu-vertical-demo"
     >

       <template v-for="item in menus">
            <el-menu-item v-if='!item.children' :index="item.path">
                <i :class="el-icon-user"></i>
                <span slot="title">{{item.authName}}</span>
            </el-menu-item>

            <el-submenu v-else :index='item.path'>
                <template slot="title">
                    <i :class="iconsObj[item.id]"></i>
                    <span slot="title">{{item.authName}}</span>
                </template>
                <el-menu-item v-for="(obj,i) in item.children" :key='i' :index="obj.path" @click='saveNavState(obj.path)'>
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{obj.authName}}</span>
                </el-menu-item>
          </el-submenu>
       </template>
    </el-menu>
</template>

<script>

 export default {
   name:'NavLeft',
   props:{
     menus:{
       type:Array,
       default(){
         return []
       }
     },
       iconsObj:{
         type:Object,
         default(){
           return {
            '125': 'iconfont el-icon-user',
            '103': 'iconfont el-icon-s-grid',
            '101': 'iconfont el-icon-s-goods',
            '102': 'iconfont el-icon-s-order',
            '145': 'iconfont el-icon-s-data'
           }
          },
       },
     colObj:{
       type:Object,
       default(){
         return {
           bgCol:'#333744',
           activeCol:'#409EFF',
           tCol:'#fff'
         }
       }
     }
   },
  data(){
    return {
      // 被激活的链接地址
      activePath: ''
    }
  },
  created(){
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods:{
    saveNavState(activePath){
       const path = '/'+activePath
       window.sessionStorage.setItem('activePath',path)
       this.activePath = path
    }
  }
   
 }
</script>

<style lang='less'>
  .el-menu{
      border-right: none;
     
  }
  .iconfont {
    margin-right: 10px;
  }
</style>
