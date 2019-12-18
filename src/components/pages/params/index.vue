<template>
 <div>
   <!-- 面包屑 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
       <!-- 警告区域 -->
       <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          type="warning"
          :closable="false"
          show-icon>
       </el-alert>
       <!-- 选择商品分类区域 -->
       <el-row class='cat_opt'>
          <el-col>
             <span>选择商品分类: </span>
              <el-cascader
                v-model="selectedCateKeys"
                :options="cateList"
                :props="cascaderProps"
                @change="selectCateChange">
            </el-cascader>
          </el-col>
       </el-row>
       <!-- tab 页签区域 -->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <!-- 动态参数区域 -->
          <el-tab-pane label="动态参数" name="many">
              <el-button type='primary' size='mini' :disabled="isBtnDisabled" @click="showAddCateDialog">添加参数</el-button>
              <!-- 动态参数列表 -->
              <el-table :data='manyTableData' border stripe="">
                  <!-- 展开行 -->
                  <el-table-column type="expand">
                      <template slot-scope="scope">
                          <!-- 循环渲染tab标签 -->
                          <el-tag closable v-for="(item ,index) in scope.row.attr_vals" :key='index' @close='handleClose(index,scope.row)'>{{item}}</el-tag>
                          <!-- 输入的文本框 -->
                          <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <!-- 添加按钮 -->
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                      </template>
                  </el-table-column>

                  <el-table-column type='index' label="序号"></el-table-column>

                  <el-table-column label="参数名称" prop='attr_name'>
                  </el-table-column>

                  <el-table-column label="操作">
                      <template slot-scope="scope">
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click='showEditCateDialog(scope.row.attr_id)'>编辑</el-button>

                          <el-button  type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.attr_id)">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </el-tab-pane>
          <!-- 静态属性区域 -->
          <el-tab-pane label="静态属性" name="only">
              <el-button type='primary' size='mini' :disabled="isBtnDisabled"  @click="showAddCateDialog">添加属性</el-button>
              <!-- 静态参数列表 -->
               <el-table :data='onlyTableData' border stripe="">
                  <el-table-column type="expand">
                      <template slot-scope="scope">
                          <!-- 循环渲染tab标签 -->
                          <el-tag closable v-for="(item ,index) in scope.row.attr_vals" :key='index' @close='handleClose(index,scope.row)'>{{item}}</el-tag>
                          <!-- 输入的文本框 -->
                          <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <!-- 添加按钮 -->
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                      </template>
                  </el-table-column>

                  <el-table-column type='index' label="序号"></el-table-column>

                  <el-table-column label="参数名称" prop='attr_name' >
                  </el-table-column>

                  <el-table-column label="操作">
                      <template slot-scope="scope">
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click='showEditCateDialog(scope.row.attr_id)'>编辑</el-button>

                          <el-button  type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.attr_id)">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框  -->
    <el-dialog :title="'添加'+TitleText" :visible.sync='addCateDialogVisible' width="50%" @close='addCateDialogClose'>
       <el-form :model="addCateForm" :rules="addCateFormRules" ref='addCateFormRef' label-width="100px">
        <el-form-item :label='TitleText' prop='attr_name'>
          <el-input v-model="addCateForm.attr_name"></el-input>
        </el-form-item>
        
       </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框  -->
    <el-dialog :title="'修改'+TitleText" :visible.sync='editCateDialogVisible' width="50%" @close='editCateDialogClose'>
       <el-form :model="editCateForm" :rules="editCateFormRules" ref='editCateFormRef' label-width="100px">
        <el-form-item :label='TitleText' prop='attr_name'>
          <el-input v-model="editCateForm.attr_name" clearable></el-input>
        </el-form-item>
        
       </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>

 </div>
</template>

<script>
 export default {
   name:'Params',
   data () {
     return {
       //保存商品分类列表
        cateList:[],
        // 级联选择框的配置对象
        cascaderProps:{
          expandTrigger: 'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children'
        },
        // 级联选择框双向数据绑定数组
        selectedCateKeys:[],
        // 页签默认选中值
        activeName:'many',
        //保存动态参数列表
        manyTableData:[],
        //保存静态属性列表
        onlyTableData:[],
        // 添加
        //控制添加动态参数对话框和静态属性对话框的展示
        addCateDialogVisible:false,
        // 保存添加对话框对象
        addCateForm:{},
        // 添加对象的规则验证对象
        addCateFormRules:{
          attr_name:[
            {required:true,message:'请输入参数名称',trigger:'blur'}
          ]
        },
        // 修改
        //控制修改动态参数对话框和静态属性对话框的展示
        editCateDialogVisible:false,
        // 保存修改对话框对象
        editCateForm:{
          attr_name:'',
        },
        // 修改对象的规则验证对象
        editCateFormRules:{
          attr_name:[
            {required:true,message:'请输入参数名称',trigger:'blur'}
          ]
        },
        
     }
   },
   methods:{
     // 获取商品分类列表
    async getCateList(){
       const {data:res} = await this.$http.get('categories')
       if(res.meta.status!==200){
         return this.$message.error('获取商品分类数据失败！')
       }
       this.cateList = res.data
     },
     // 级联选择框选择项发送变化 触发次函数
      selectCateChange(){
        this.getParamsData()
     },

    // 获取参数信息
    async getParamsData(){
        if(this.selectedCateKeys.length!==3){
           this.selectedCateKeys = []
           this.manyTableData = []
           this.onlyTableData = []
           return
        }
          //根据id和不同的面板查询数据
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:this.activeName}
        })
        if(res.meta.status!==200){
          return this.$message.error('获取参数信息失败！')
        }
        res.data.forEach(item=>{
          item.attr_vals = item.attr_vals? item.attr_vals.split(' '):[]
          // 添加布尔值控制文本框的显示隐藏
          item.inputVisible = false
          // 添加文本框输入的值
          item.inputValue =''
        })
        if(this.activeName==='many'){
          //动态参数
          this.manyTableData = res.data 
        }else{
          //静态属性
          this.onlyTableData = res.data 
        }
     },

     //tab 页签点击事件
     handleTabClick(){
         this.getParamsData()
     },
     // 添加
     //添加参数和添加属性事件  显示对话框
     showAddCateDialog(){
       this.addCateDialogVisible = true
     },
    // 触发添加对话框确认按钮
    addCateDialogConfirm(){
      this.$refs.addCateFormRef.validate(async valid=>{
        if(!valid) return
      const {data:res} = await  this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.addCateForm.attr_name,
          attr_sel:this.activeName
        })  
        if(res.meta.status!==201){
         return this.$message.error(`添加${this.TitleText}失败!`)
        }
        this.$message.success(`添加${this.TitleText}成功！`)
        this.getParamsData()
        this.addCateDialogVisible = false
      })
      
    },
    //  监听添加对话框关闭事件
    addCateDialogClose(){
      this.$refs.addCateFormRef.resetFields()
    },

    //修改
    //修改参数和修改属性事件  显示对话框
     async showEditCateDialog(id){
      const  {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{
         params:{attr_sel:this.activeName}
       })
       if(res.meta.status!==200){
         return this.$message.error(`获取${this.TitleText}失败!`)
       }
        this.editCateForm = res.data
        this.editCateDialogVisible = true
     },
    // 触发修改对话框确认按钮
    editCateDialogConfirm(){
      this.$refs.editCateFormRef.validate(async valid=>{
        if(!valid) return
      const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editCateForm.attr_id}`,{
          attr_name:this.editCateForm.attr_name,
          attr_sel:this.activeName
        })  
        if(res.meta.status!==200){
         return this.$message.error(`更新${this.TitleText}失败!`)
        }
        this.$message.success(`更新${this.TitleText}成功！`)
        this.getParamsData()
        this.editCateDialogVisible = false
      })
      
    },
    //  监听修改对话框关闭事件
    editCateDialogClose(){
      this.$refs.editCateFormRef.resetFields()
    },

    // 触发删除按钮事件
    async removeCate(id){
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
      if(confirmResult!=='confirm'){
        return this.$message.error('删除失败！')
      } 
      const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`) 
      if(res.meta.status!==200){
         return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getParamsData()
    },
    // 文本框失去了焦点或 摁下了 enter键都会触发此方法
    handleInputConfirm(row){
      if(row.inputValue.trim().length===0){
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals(row){
       const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
      {
        attr_name: row.attr_name,
        attr_sel:this.activeName,
        attr_vals:row.attr_vals.join(' ')
      })
      if(res.meta.status!==200){
        return this.$message.error('添加失败！')
      }
        this.$message.success('添加成功')
    },
    // 点击按钮，展示文本输入框
    showInput(row){
      row.inputVisible = true
      // this.$nextTick方法作用 就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除对应的tag列表项
    handleClose(i,row){
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)
    },

   },
   computed:{
     // 如果按钮需要被禁用 返回 true 否则返回false
     isBtnDisabled(){
       if(this.selectedCateKeys.length!==3){
         return true
       }
       return false
     },
     // 当前选中的三级id
     cateId(){
       if(this.selectedCateKeys.length===3){
         return this.selectedCateKeys[2]
       }
       return null
     },
     // 动态设置标题
     TitleText(){
       if(this.activeName==='many'){
         return '动态参数'
       }
        return '静态属性'
     }
   },

  mounted(){
    this.getCateList()
  }

 }
</script>

<style lang='less' scoped>
  .cat_opt{
    margin: 15px 0;
  }
  .el-tag{
    margin: 10px;
  }
  .input-new-tag {
    width: 120px;
  }
</style>
