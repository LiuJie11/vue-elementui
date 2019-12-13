<template>
 <div class='login-wrap'>
    <div class='ms-login'>
        <h3 class='ms-title'>后台管理系统</h3>
        <el-form :model="userForm"  ref="userForm"  class="sm-form">
            <el-form-item prop="username" :rules="[
                {required:true,message:'用户名不能为空'}
            ]">
                <el-input type="text" v-model="userForm.username" >
                    <el-button slot="prepend" icon="el-icon-user"></el-button>
                </el-input>
                
            </el-form-item>

            <el-form-item prop="password" :rules="[
                {required:true,message:'密码不能为空',trigger:'blur'}
            ]">
                <el-input type="password" v-model="userForm.password" >
                    <el-button slot="prepend" icon="el-icon-goods"></el-button>
                </el-input>
            </el-form-item>

             <el-form-item >
                <el-button type='primary' class='login-btn' @click='submitLogin'>登录</el-button>
            </el-form-item>
        </el-form>
    </div>
 </div>
</template>

<script>
 export default {
    name:'Login',
   data () {
     return {
           userForm: {
               username:'',
               password:''
            },
     }
   },
  methods:{
      submitLogin(){
        this.$refs.userForm.validate(async vali=>{
            if(!vali) return
            let {data:res} = await this.$http.post('login',this.userForm)
            console.log(res.data)
            if(res.meta.status!==200) return this.$message.error('登录失败')
            this.$message.success('登录成功')
            window.sessionStorage.setItem('token',res.data.token)
            window.sessionStorage.setItem('username',res.data.username)
            this.$store.dispatch('setinfo',res.data)
            this.$router.replace({name:'home'})
        })
      }
  }
 }
</script>

<style lang='less'>
    .login-wrap{
        width: 100%;
        height: 100%;
        background-image: url(~assets/img/login-bg.jpg);
        background-size: 100%;
        position: relative;
        .ms-login{
            width: 350px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 5px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform:translate(-50%,-50%);
            .ms-title{
                color:#fff;
                font-size: 20px;
                text-align: center;
                line-height: 50px;
                
            }
            .sm-form{
                padding:20px 30px;
                border-top: 1px solid #fff;
                .el-input__inner{
                    border: 1px solid  #dcdfe6;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                }
               
            }
            .login-btn{
                width: 100%;
            }
        }
    }
</style>
