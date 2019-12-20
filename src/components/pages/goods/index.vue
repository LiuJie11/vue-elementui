<template>
 <div>
   <!-- 面包屑 -->
     <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-row :gutter="20">
            <el-col :span="8">
              <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getGoodsList'>
                  <el-button slot="append" icon="el-icon-search" @click='getGoodsList'></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type='primary' @click='goAddGoodPage'>添加商品</el-button>
            </el-col>
        </el-row>
        <!-- 商品列表  -->
        <el-table :data='goodsList' border stripe>
           <el-table-column
            type='index'
            label="序号"
           >
           </el-table-column>

          <el-table-column
            label="商品名称"
            prop="goods_name"
           >
           </el-table-column>

          <el-table-column
            label="商品价格(元)"
            prop="goods_price"
            width="90px"
           >
           </el-table-column>

            <el-table-column
            label="商品重量"
            prop="goods_weight"
            width="70px"
           >
           </el-table-column>

            <el-table-column
            label="创建时间"
            prop="add_time"
            width="150px"
           >
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
           </el-table-column>

           <el-table-column
            label="操作"
            width='130px'
           >
              <template slot-scope='scope'>
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoods"></el-button>

                  <el-button type="danger" icon="el-icon-delete" size="mini" @click='removeGoods(scope.row.goods_id)'></el-button>
              </template>
           </el-table-column>
        </el-table>
        <!-- 商品分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          >
        </el-pagination>
    </el-card>
 </div>
</template>

<script>
 export default {
   name:'Goods',
   data () {
     return {
       // 获取商品列表
       goodsList:[],
       //查询参数对象
       queryInfo:{
         query:'',
         pagenum:1,
         pagesize:10
       },
       //保存商品总数
       total:0
     }
   },
   methods:{
     // 获取商品列表
    async getGoodsList(){
      const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
      if(res.meta.status!==200){
        return this.$message.error('获取商品失败！')
      }
      // this.$message.success('获取商品成功！')
      this.goodsList = res.data.goods
      this.total = res.data.total
     },
     // 监听 pagesize 改变
     handleSizeChange(newSize){
       this.queryInfo.pagesize = newSize
       this.getGoodsList()
     },
     // 监听 pagenum 改变
     handleCurrentChange(newPage){
       this.queryInfo.pagenum = newPage
       this.getGoodsList()
     },
      // 删除商品触发事件
     async removeGoods(id){
       const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)

        if(confirmResult!=='confirm'){
          return this.$message.info('取消了删除操作！')
        }

        const {data:res} = await this.$http.delete('goods/'+id)
        if(res.meta.status!==200){
          return this.$message.error('删除商品失败！')
        }

        this.$message.success('删除商品成功')

        this.getGoodsList()

     },
      // 添加商品按钮  跳转到添加商品组件
      goAddGoodPage(){
        this.$router.push('/goods/addgood')
      },
      // 修改商品信息
      editGoods(){
        this.$message.warning('此功能未完成！')
      }

   },

   mounted(){
     this.getGoodsList()
   }

 }
</script>

<style lang='less' scoped>

 
</style>
