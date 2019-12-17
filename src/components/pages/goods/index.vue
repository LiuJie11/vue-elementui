<template>
 <div>
   <!-- 面包屑 -->
     <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type='primary' >添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 角色列表  -->
        <el-table :data='rolesList' border stripe>
           <el-table-column
            type='index'
            label="序号"
           >
           </el-table-column>
          <el-table-column
            label="角色名称"
            prop="roleName"
           >
           </el-table-column>
          <el-table-column
            label="角色描述"
            prop="roleDesc"
           >
           </el-table-column>
           <el-table-column
            label="操作"
            width='300px'
           >
              <template slot-scope='scope'>
                  <el-button @click='editRole(scope.row,scope.$index)' type="primary" icon="el-icon-edit" size="mini">编辑</el-button>

                  <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>

                  <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
              </template>
           </el-table-column>
        </el-table>
    </el-card>

  

    <!-- 编辑角色对话框 -->

    <el-dialog  title='编辑角色' :visible.sync='editRoleDialogVisible' width='50%' @close='editRoleDialog'>
        <el-form :model="editRoleForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>  
       <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>


    

 </div>
</template>

<script>
import { get } from 'http'
 export default {
     name:'Goods',
   data () {
     return {
        // 角色列表数据
        rolesList:[],
        
        // 编辑角色对话框是否展示
        editRoleDialogVisible:false,
        // 编辑角色对话框的信息
        editRoleForm:{},
        //编辑角色对象的验证规则对象
        editFormRules:{
          roleName:[
            {required:true,message:'角色名称不能为空',trigger:'blur'},
            {min:1,max:10,message:'角色在3~10个字符之间',trigger:'blur'}
          ],
          roleDesc:[
            {required:true,message:'角色描述不能为空',trigger:'blur'}
          ]
        },
     }
   },
   methods:{
     // 获取角色列表
    async getRolesList(){
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status!==200){
          return this.$message.error('获取角色列表失败！')
        }
        this.rolesList = res.data
     },

     // 关闭编辑角色对话框
     editRoleDialog(){
       this.$refs.editFormRef.resetFields()
     },
     //展示编辑角色对话框
    async editRole(role,index){
      
       console.log(role)
       this.editRoleForm = role
      this.editRoleDialogVisible =true
    },
    //编辑角色对话框的确认按钮
    editRoleConfirm(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        //发送网络请求改变角色信息
       const {data:res} = await this.$http.put('roles/'+this.editForm.roleId,{
         roleName:this.editForm.roleName,
         roleDesc:this.editForm.roleDesc
       })
       if(res.meta.status!==200){
         return this.$message.error('更新角色信息失败！')
       }
       console.log(this.editForm.roleId,'33333')
        this.$message.success('更新角色信息成功！')
        this.getRolesList()
        this.editRoleDialogVisible = false
      })
      
    },


   },

   mounted(){
     this.getRolesList()
   }

 }
</script>

<style lang='less' scoped>

 
</style>
