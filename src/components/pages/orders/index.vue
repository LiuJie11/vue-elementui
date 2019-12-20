
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrdersList">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>

        <el-table-column label="订单编号" prop="order_number"></el-table-column>

        <el-table-column label="订单价格" prop="order_price"></el-table-column>

        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            <template>{{scope.row.is_send}}</template>
          </template>
        </el-table-column>

        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>

        <el-table-column label="操作">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click='showAddressDialog'></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click='showProgressDialog'></el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- 分页区域 -->
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
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close='addressDialogClose'
      >
      <el-form :model="addressForm" :rules="addressRules" ref="addressRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
           <el-cascader
              v-model="addressForm.address1"
              :options="ctiyData"
              clearable
              :props="{ expandTrigger: 'hover' }"
            >
           </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度条的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
      >
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
        v-for="(activity, index) in progressInfo"
        :key="index"
        :timestamp="activity.time">
        {{activity.context}}
      </el-timeline-item>
     </el-timeline>
    </el-dialog>

  </div>
</template>

<script>
import ctiyData from './citydata'
export default {
  name: "Orders",
  data() {
    return {
      //订单列表
      ordersList: [],
      //订单查询信息对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      //保存订单总数
      total: 0,
      //控制修改地址对话框的展示
      addressDialogVisible:false,
      //所有地址数据
      ctiyData,
      //保存地址对象
      addressForm:{
        address1:[],//联动id
        address2:'',//详细地址
      },
      //地址验证规则对象
      addressRules:{
        address1:[
          {required:true,message:'请选择省市区/县',trigger:'blur'}
        ],
        address2:[
          {required:true,message:'请输入详细地址',trigger:'blur'}
        ]
      },
      //控制物流进度条对话框的展示
      progressDialogVisible:false,
      // 保存物流进度信息
      progressInfo:[]

    };
  },

  methods: {
    // 获取订单数据列表
    async getOrdersList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取订单列表失败！");
      }
      // console.log(res);
      this.ordersList = res.data.goods;
      this.total = res.data.total;
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // 监听 pagenum 改变
    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum
      this.getOrdersList()
    },
    // 编辑按钮 展示修改地址对话框
    showAddressDialog(){
      this.addressDialogVisible = true
    },
    //关闭修改地址对话框
    addressDialogClose(){
      this.$refs.addressRef.resetFields()
    },
    // 确定修改地址按钮
    addressDialogConfirm(){
      this.$refs.addressRef.validate(valid=>{
        if(!valid) return
        this.$message.success('地址修改成功！')
        this.addressDialogVisible = false
      })
    },
    // 展示物流对话框
   async showProgressDialog(){
      const {data:res} = await this.$http.get('/kuaidi/804909574412544580')
      if(res.meta.status!==200){
        this.$message.error('获取物流进度失败！')
      }
      this.progressInfo = res.data
      this.progressDialogVisible = true
    }


  },

  mounted() {
    this.getOrdersList();
  }
};
</script>

<style lang='less' scoped>
  .el-cascader{
    width: 100%;
  }
</style>
