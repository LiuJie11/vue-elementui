<template>
 <div>
   <!-- 面包屑 -->
     <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type='primary' @click='addCateDialog'>添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 商品分类列表 使用的第三方table插件 -->
        <tree-table
          :data='cateList'
          :columns='columns'
          show-index
          stripe
          border
          :show-row-hover ='false'
          :expand-type ='false'
          :selection-type='false'
          class='treeTable'
        >
          <template slot='isOk' slot-scope="scope">
               <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
              <i class="el-icon-error" v-else style="color: red;"></i>
          </template>

          <template slot='order' slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
              <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
              <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>

          <template slot='opt' slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click='editCateDialog(scope.row.cat_id)'>编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click='removeCate(scope.row.cat_id)'>删除</el-button>
          </template>

        </tree-table>

         <!-- 商品分类分页  -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="catequery.pagenum"
            :page-size="catequery.pagesize"
            :page-sizes="[3, 5, 10, 15]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync='addCateDialogVisible' width="50%" @close='addCateDialogClose'>
        <el-form :model="addCateForm" :rules="addCateFormRules" ref='addCateFormRef' label-width="100px">
            <el-form-item label="商品分类" prop='cat_name'>
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
             <el-form-item label="父级分类">
                 <el-cascader
                   v-model="selectedKeys"
                  :options="parentCateList"
                  :props="cascaderProps"
                  clearable
                  @change="ParentCateChange">
                </el-cascader>
            </el-form-item>
        </el-form>
        
         <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCateConfirm">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title='修改分类' width='50%' :visible.sync='editCateDialogVisible' @close='editCateDialogClose'>
         <el-form :model="editCateForm" :rules="editCateFormRules" ref='editCateFormRef' label-width="100px">
            <el-form-item label="商品分类" prop='cat_name'>
                <el-input v-model="editCateForm.cat_name"></el-input>
            </el-form-item>
        </el-form>
         <span slot="footer" class="dialog-footer">
            <el-button @click="editCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCateConfirm">确 定</el-button>
        </span>
    </el-dialog>

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
       // 商品分类的列设置
       columns:[
         {
           label:'分类名称',
           prop:'cat_name'
         },
         {
           label:'是否有效',
           type:'template',
           template:'isOk'
         },
         {
           label:'排序',
           type:'template',
           template:'order'
         },
         {
           label:'操作',
           type:'template',
           template:'opt'
         }
       ],
       // 控制添加对话框的展示
       addCateDialogVisible:false,
       // 保存添加的商品分类
       addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      //添加商品分类的验证规则对象
      addCateFormRules:{
        cat_name:[
          {required:true,message:'商品分类名称不能为空',trigger:'blur'}
        ]
      },
      //保存父级分类列表
      parentCateList:[],
      //指定级联选择器的配置对象
      cascaderProps:{ 
        expandTrigger: 'hover' ,
        checkStrictly:true,
         value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectedKeys:[],
      //控制修改对话框的展示
      editCateDialogVisible:false,
      // 修改商品分类对话框数据
      editCateForm:{},
      // 修改商品对话框验证规则对象
      editCateFormRules:{
        cat_name:[
          {required:true,message:'商品分类名称不能为空',trigger:'blur'}
        ]
      },
      

     }
   },
   methods:{
     // 获取分类列表
    async getCateList(){
     const {data:res} = await this.$http.get('categories',{params:this.catequery})
     if(res.meta.status!==200){
        return this.$message.error('获取商品分类列表失败!')
     }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize){
      this.catequery.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage){
      this.catequery.pagenum = newPage
      this.getCateList()
    },
    // 展示添加分类对话框
    addCateDialog(){
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类数据
   async getParentCateList(){
     const {data:res} = await this.$http.get('categories',{params:{type:2}})
     if(res.meta.status!==200){
       return this.$message.error('获取父级分类列表失败!')
     }
     this.parentCateList = res.data
    },

    // 监听添加对话框关闭
    addCateDialogClose(){
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectedKeys= []
    },
    // 级联选中项发送改变触发这个函数
    ParentCateChange(){
      // 根据this.selectedKeys的length属性判断是否选中了父级分类
      console.log(this.selectedKeys)
      if(this.selectedKeys.length>0){
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        this.addCateForm.cat_level = this.selectedKeys.length
      }else{
         this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //添加对话框的确定按钮
    addCateConfirm(){
      this.$refs.addCateFormRef.validate(async valid=>{
        if(!valid) return
       const {data:res} = await this.$http.post('categories',this.addCateForm)
        if(res.meta.status!==201){
          return this.$message.error('添加商品分类失败！')
        }
        this.$message.success('添加商品分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },

    // 修改部分
    // 修改对话框的展示
    async editCateDialog(id){
      // 根据商品id 查询数据
      const {data:res} = await this.$http.get('categories/'+id)
      if(res.meta.status!==200){
        return this.$message.error('获取商品信息失败！')
      }
      this.editCateForm = res.data
      
      this.editCateDialogVisible = true
    },
    // 修改对话框的确认按钮
    async editCateConfirm(){
      const {data:res} = await this.$http.put('categories/'+this.editCateForm.cat_id,{cat_name:this.editCateForm.cat_name}
      )
      if(res.meta.status!==200){
        return this.$message.error('更新商品信息失败！')
      }
      this.$message.success('更新商品信息成功！')
      this.getCateList()
      this.editCateDialogVisible =false
    },
    // 监听修改对话框的关闭事件
    editCateDialogClose(){
      this.editCateForm={}
      this.$refs.editCateFormRef.resetFields()
    },
    // 删除商品分类
    async removeCate(id){
      const confirmResult =await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }
        ).catch(err=>err)

        if(confirmResult!=='confirm'){
         return this.$message.error('商品分类删除失败！')
        }

      const {data:res} = await this.$http.delete('categories/'+id)
      if(res.meta.status!==200){
        return this.$message.error('商品分类删除失败！')
      }
      this.$message.success('商品分类删除成功！')
      this.getCateList()
    }

   },

   mounted(){
    this.getCateList()
   }

 }
</script>

<style lang='less' scoped>
  .treeTable{
    margin-top: 15px;
  }
 
</style>
