<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入搜索关键字" clearable @clear="getUserList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>

        <el-table-column label="电话" prop="create_time"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>

            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="新增用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" label-width="70px" ref="addFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="text" v-model="addForm.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input type="text" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户信息"        :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" label-width="70px" ref="editFormRef">
          <el-form-item label="用户名">
            <el-input type="text" v-model="editForm.username" disabled></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input type="text" v-model="editForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input type="text" v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title='分配角色' :visible.sync="setRoleDialogVisible" width="50%" @close='setRoleDialogClosed'>
       <div>
         <p>当前的用户: {{userInfo.username}}</p>
         <p>当前的角色: {{userInfo.role_name}}</p>
         <p>分配新角色: 
           <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
       </div>
       <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="savaRoleInfo">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };
    // 验证手机的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法手机"));
    };
    return {
      //获取用户列表参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [], //用户列表
      total: 0, //数据总数
      dialogVisible: false, // 添加用户对话框的控制
      //添加用户对象
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户对象的校验规则
      addFormRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度为3~10个之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "用户名长度为6~16个之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },

          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },

      //修改用户对话框
      editDialogVisible: false,
      //需要修改的对象
      editForm: {},
      //修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },

          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //分配角色的对话框是否展示
      setRoleDialogVisible:false,
      //需要分配角色的信息
      userInfo:{},
      // 保存所有角色列表
      rolesList:[],
      // 已选中的角色id值
      selectedRoleId:'',
    };
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },

    // 监听页码值改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    // 监听switch开关的状态改变
    async userStateChange(userInfo) {
      //  console.log(userInfo)
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error(res.meta.msg);
      }
      this.$message.success("更新用户状态成功");
    },

    //监听添加用户对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    //点击确定按钮进行表单校验
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        // 发起添加用户的网络请求
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status == 201) {
          this.$message.success("添加用户成功");
        } else {
          this.$message.error("添加用户失败");
        }
        this.dialogVisible = false;
        this.getUserList();
      });
    },

    //修改用户信息
    async showEditDialog(id) {
      // 根据用户id发送网络请求
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户信息失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },

    //监听关闭修改用户对话框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 修改表单信息提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        // 发送修改用户信息的网络请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }

        this.editDialogVisible = false;
        this.getUserList();

        this.$message.success("更新用户信息成功");
      });
    },

    //根据用户id删除对应的用户信息
    async removeUserById(id) {
      // console.log(id)
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败!");
      }
      this.$message.success("删除用户成功!");
      this.getUserList();
    },

    // 分配角色对话框的展示
  async setRole(userInfo){
        this.userInfo = userInfo
        // 获取所有角色数据
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status!==200){
          return this.$message.error('获取角色列表失败！')
        }
        this.rolesList = res.data
        this.setRoleDialogVisible = true
    },
    //分配角色对话框确认按钮
    async savaRoleInfo(){
      if(!this.selectedRoleId){
        return this.$message.error('请选择要分配的角色！')
      }
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
        rid:this.selectedRoleId
      })
      if(res.meta.status!==200){
        return this.$message.error('更新角色失败！')
      }
      
      this.$message.success('更新角色成合！')
      this.getUserList()
      this.setRoleDialogVisible = false
    },

    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed(){
      this.selectedRoleId=''
      this.userInfo = {}
    }

  },
  mounted() {
    this.getUserList();
  }
};
</script>

<style lang='less' scoped>
</style>
