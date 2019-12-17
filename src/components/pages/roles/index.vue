<template>
 <div>
   <!-- 面包屑 -->
     <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type='primary' @click='addRole'>添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 角色列表  -->
        <el-table :data='rolesList' border stripe>
          <el-table-column type="expand">
            <!-- 展开列 -->
            <template slot-scope="scope">
                <el-row v-for="(item1,i1) in scope.row.children" :key='item1.id' :class="[i1===0?'bdtop':'','bdbottom','vcenter']">
                    <!-- 渲染一级权限 -->
                    <el-col :span='5'>
                        <el-tag 
                            type='success'
                            closable
                            @close='removeRightById(scope.row,item1.id)'
                        >
                        {{item1.authName}}
                        </el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 渲染二级和三级权限 -->
                    <el-col :span='19' >
                      <!-- 通过for循环嵌套渲染二级权限 -->
                      <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key='item2.id'>
                          <el-col :span="6">
                              <el-tag 
                                type='success'
                                closable
                                @close='removeRightById(scope.row,item2.id)'
                              >
                              {{item2.authName}}
                              </el-tag>
                              <i class="el-icon-caret-right"></i>
                          </el-col>
                          <el-col :span='18'>
                              <el-tag type='warning' v-for="(item3,i3) in item2.children" :key='item3.id'
                              closable
                              @close='removeRightById(scope.row,item3.id)'
                              >
                                {{item3.authName}}
                              </el-tag>
                          </el-col>
                      </el-row>
                    </el-col>
                </el-row>
            </template>
          </el-table-column>
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

                  <el-button @click='removeRole(scope.row,scope.$index)' type="danger" icon="el-icon-delete" size="mini">删除</el-button>

                  <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightDialog(scope.row)">分配权限</el-button>
              </template>
           </el-table-column>
        </el-table>
    </el-card>

    <!-- 添加角色对话框   -->
    <el-dialog  title='添加角色' :visible.sync='addRoleDialogVisible' width='50%' @close='addRoleDialog'>
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>  
       <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>

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


    <!-- 分配权限的对话框 -->
    <el-dialog 
      title="分配权限"         
      :visible.sync='setRightDialogVisible' 
      width="50%"
      @close='setRightDialogClose'
    >
    <!-- 树控件 -->
    <el-tree 
      :data="rightsList"
      :props="treeProps"
      show-checkbox
      node-key='id'
      default-expand-all
      :default-checked-keys='dfKeys'
      ref='treeRef'
     >
    </el-tree>

    <span slot="footer" class="dialog-footer">
      <el-button @click="setRightDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="allotRights">确 定</el-button>
    </span>
    </el-dialog>

 </div>
</template>

<script>
 export default {
     name:'Roles',
   data () {
     return {
        // 角色列表数据
        rolesList:[],
        //分配权限对话框是否展示
        setRightDialogVisible:false,
        //权限树列表
        rightsList:[],
        //树形结构属性绑定对象
        treeProps:{
          label:'authName',
          children:'children'
        },
        // 默认选中的节点id的数组
        dfKeys:[],
        // 将要被分配权限的角色id
        roleId:'',
        // 添加角色对话框
        addRoleDialogVisible:false,
        // 保存添加的角色对象
        addForm:{
          roleName:'',
          roleDesc:''
        },
        //添加角色对象的验证规则对象
        addFormRules:{
          roleName:[
            {required:true,message:'角色名称不能为空',trigger:'blur'},
            {min:1,max:10,message:'角色在3~10个字符之间',trigger:'blur'}
          ],
          roleDesc:[
            {required:true,message:'角色描述不能为空',trigger:'blur'}
          ]
        },
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

     // 根据用户id删除对应的权限
    async removeRightById(role,rightId){
        //弹框提示用户是否删除权限
       const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err=>err)
        if(confirmResult!=='confirm'){
          return this.$message.info('取消了删除！')
        }

       const {data:res} =await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

        if(res.meta.status!==200){
          return this.$message.error('删除权限失败!')
        }

        this.$message.success('删除权限成功')
        role.children = res.data

     },
      //展示分配权限的对话框
    async showRightDialog(role){
      // 保存展示对话框的角色id
      this.roleId = role.id
       // 获取所有权限数据
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status!==200){
       return  this.$message.error('获取权限数据失败！')
      }
       this.rightsList = res.data
       // 递归获取三级节点id
       this.getLeafKeys(role,this.dfKeys)
       this.setRightDialogVisible=true
     },
     //通过递归的形式，获取角色下所有三级权限下的id，并保存到dfKeyS数组中
     getLeafKeys(node,arr){
       if(!node.children){
         return arr.push(node.id)
       }

       node.children.forEach(item=>{
          this.getLeafKeys(item,arr)
       })
     },
     
     //关闭分配权限对话框
    setRightDialogClose(){
      this.dfKeys=[]
     },
     //点击分配权限对话框的确认按钮
     async allotRights(){
        const keys = [
         ...this.$refs.treeRef.getCheckedKeys(),
         ...this.$refs.treeRef.getHalfCheckedKeys(),
       ];

       const idSty = keys.join(',')

       const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idSty})
       if(res.meta.status!==200){
         return this.$message.error('更新权限失败！')
       }

        this.$message.success('更新权限成功！')
        this.getRolesList();
        this.setRightDialogVisible = false
     },
     //显示添加角色对话框
     addRole(){
       this.addRoleDialogVisible = true
     },
     //添加角色对话框的确认
     addRoleConfirm(){
       //对整个表单进行校验
       this.$refs.addFormRef.validate(async valid=>{
         if(!valid) return
          // 发起网络请求
          const  {data:res} = await this.$http.post('roles',this.addForm)
          if(res.meta.status!=201){
           return this.$message.error('添加角色失败！')
          }
          this.$message.success('添加角色成功！')
          this.getRolesList()
          this.addRoleDialogVisible = false
       })
      
     },
     // 关闭添加角色对话框
     addRoleDialog(){
       this.$refs.addFormRef.resetFields()
     },
     // 关闭编辑角色对话框
     editRoleDialog(){
       this.$refs.editFormRef.resetFields()
     },
     //展示编辑角色对话框
    async editRole(role,index){
      // const {data:res} = await this.$http.get(`roles/${role.id}`)
      // if(res.meta.status!==200){
      //   return this.$message.error('获取角色信息失败！')
      // }
      // this.editForm = res.data
      
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

    // 删除角色
   async removeRole(role,index){
      // this.rolesList.splice(index,1)
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', 
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }
        ).catch(err=>err)

        if(confirmResult!=='confirm'){
          return this.$message.error('删除角色失败！')
        }
        // 不调接口删除页面数据  且数据库数据没发生改变
        this.rolesList.splice(index,1)
        this.$message.success('删除用户角色成功！')
        // 调接口删除数据库数据
        const {data:res} =await this.$http.delete('roles/'+role.id)
    }

   },

   mounted(){
     this.getRolesList()
   }

 }
</script>

<style lang='less' scoped>

 
</style>
