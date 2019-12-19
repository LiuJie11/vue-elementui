<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center :closable="false" show-icon></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex-0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
     <el-form :model="addGoodForm" :rules="addGoodRules" ref="addGoodRef" label-width="100px" label-position="top"> 
        <el-tabs 
          v-model="activeIndex"
          tab-position="left" 
          :before-leave='beforeLeave'
          @tab-click='tabClick'
        >
            <el-tab-pane label="基本信息" name='0'>
                <el-form-item
                  label="基本信息"
                  prop="goods_name"
                >
                    <el-input v-model="addGoodForm.goods_name"></el-input>
                </el-form-item>

                 <el-form-item
                  label="商品价格"
                  prop="goods_price"
                >
                    <el-input type='number' v-model="addGoodForm.goods_price"></el-input>
                </el-form-item>

                <el-form-item
                  label="商品重量"
                  prop="goods_weight"
                >
                    <el-input type='number' v-model="addGoodForm.goods_weight"></el-input>
                </el-form-item>

                <el-form-item
                  label="商品数量"
                  prop="goods_number"
                >
                    <el-input type='number' v-model="addGoodForm.goods_number"></el-input>
                </el-form-item>

                <el-form-item
                  label="商品分类"
                  prop='goods_cat'
                >
                     <el-cascader
                      v-model="addGoodForm.goods_cat"
                      :options="cateList"
                      :props="cascader"
                      @change="handleChange">
                    </el-cascader>
                </el-form-item>

            </el-tab-pane>

            <el-tab-pane label="商品参数" name='1'>
                <!-- 渲染表单的item项 -->
                <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key='item.attr_id'>
                    <el-checkbox-group v-model="item.attr_vals">
                      <el-checkbox v-for="(cd,i) in item.attr_vals" :key='i' :label="cd" border></el-checkbox>
                   </el-checkbox-group>
                </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品属性" name='2'>
                <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key='item.attr_id'>
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品图片" name='3'>
                <el-upload
                  :action="uploadURL"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  list-type="picture"
                  :headers="headerObj"
                  :on-success='handleSuccess'
                  >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-tab-pane>

            <el-tab-pane label="商品内容" name='4'>
              <!-- 富文本编辑器组件 -->
               <quill-editor v-model="addGoodForm.goods_introduce">

               </quill-editor>
               <!-- 添加商品的按钮 -->
               <el-button type='primary' class='btnAdd' @click='addGood'>添加商品</el-button>
            </el-tab-pane>
        </el-tabs>
     </el-form>

    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewPath" alt="" class='previewImg'>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AddGood",
  data() {
    return {
      //控制步骤条的步骤
      activeIndex:'0',
      //保存添加删除对象
      addGoodForm:{
         goods_name:'',
         goods_price:0,
         goods_weight:0,
         goods_number:0,
         //商品所属的分类数组
         goods_cat:[],
         // 商品的图片数组
         pics:[],
          // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      //添加商品验证规则对象
      addGoodRules:{
        goods_name:[
           {required:true,message:'请输入商品名称',trigger:'blur'}
         ],
         goods_price:[
           {required:true,message:'请输入商品价格',trigger:'blur'}
         ],
         goods_weight:[
           {required:true,message:'请输入商品重量',trigger:'blur'}
         ],
         goods_number:[
           {required:true,message:'请输入商品数量',trigger:'blur'}
         ],
         goods_cat:[
           {required:true,message:'请选择商品分类',trigger:'blur'}
         ]
      },
      // 商品分类列表
      cateList:[],
      // 商品分类级联配置对象
      cascader:{
        expandTrigger: 'hover',
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      //商品静态属性
      onlyTableData:[],
      // 上传图片的后台地址
      uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      // 保存预览图片地址
      previewPath:'',
      // 控制预览图片对话框的展示
      previewVisible:false

    };
  },

  methods: {
    // 获取所有商品分类数据
   async getCateList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status!==200){
        return this.$message.error('商品分类数据获取失败！')
      }
      this.cateList = res.data
    },
    // 级联选中项发生改变触发函数
    handleChange(){
      //控制级联选择器只能选择三级分类
      if(this.addGoodForm.goods_cat.length!==3){
        this.addGoodForm.goods_cat = []
      }
    },
    // 监听tab栏是否可以用切换
    beforeLeave(activeName,oldActiveName){
      //  console.log('即将离开的标签页名字是：' + oldActiveName)
      // console.log('即将进入的标签页名字是：' + activeName)
      if(oldActiveName==='0' && this.addGoodForm.goods_cat.length!==3){
          this.$message.warning('请先选择商品分类！')
          return false
      }
    },
    // 监听tab栏的点击事件
    async tabClick(){
      // 商品参数
      if(this.activeIndex==='1'){
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        }
        res.data.forEach(item=>{
          item.attr_vals = item.attr_vals.length===0?[]:item.attr_vals.split(' ')
        })
        this.manyTableData = res.data

      }else if (this.activeIndex === '2') {
        // 商品属性
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败！')
        }
        this.onlyTableData = res.data
      }
    },

    // 处理图片的预览效果
    handlePreview(file){
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file){
        // 获取将要移除图片的临时路径
        const filePath = file.response.data.tmp_path
        // 从pics中找到这个图片对应的索引
        const i = this.addGoodForm.pics.findIndex(x=>x.pic===filePath)
        // 调用数组的splice方法 把图片信息对象从pics数组中移除
        this.addGoodForm.pics.splice(i,1)
    },

    // 监听图片上传成功触发的事件
    handleSuccess(response){
      const picInof = {pic:response.data.tmp_path}
      this.addGoodForm.pics.push(picInof)
    },
    //添加商品富文本下面的按钮
    addGood(){
     //进行表单预验证
     this.$refs.addGoodRef.validate(async valid=>{
       if(!valid) return this.$message.error('请填写必要的表单项！')
       // 执行添加的业务逻辑
       const form = {...this.addGoodForm}
       form.goods_cat = form.goods_cat.join(',')
       // 处理动态参数
       this.manyTableData.forEach(item=>{
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          form.attrs.push(newInfo)
       })
       // 处理静态属性
       this.onlyTableData.forEach(item=>{
         const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          form.attrs.push(newInfo)
       })
       // 添加商品请求
        const {data:res} = await this.$http.post('goods',form)
        if(res.meta.status!==201){
          return this.$message.error('添加商品失败!')
        }
        this.$message.success('添加商品成功!')
        this.$router.go(-1)
     })
    }

  },

  computed:{
    // 商品id
    cateId(){
      if(this.addGoodForm.goods_cat.length===3){
        return this.addGoodForm.goods_cat[2]
      }
      return null
    }
  },

  mounted(){
    this.getCateList()
  }

};
</script>

<style lang='less' scoped>
  .el-checkbox{
    margin: 0 10px 0 0 !important;
  }
  .previewImg{
    width: 100%;
    height: 100%;
  }
  .btnAdd{
    margin-top: 15px;
  }
</style>
