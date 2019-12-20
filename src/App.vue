<template>
  <div id="app"  
      v-loading="$store.state.loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
 
}
const obj = {
//                          _oo0oo_
//                         088888880
//                         88" . "88
//                         (| -_- |)
//                         0\  =  /0
//                       ___/'---'\___
//                     .' \\|     |// '.
//                    / \\|||  :  |||// \
//                   / -||||| -:- |||||- \
//                  |   | \\\  -  /// |   |
//                  | \_|  ''\---/''  |_/ |
//                  \  .-\__  '-'  __/-.  /
//                ___'. .'  /--.--\  '. .'___
//             ."" '<  '.___\_<|>_/___.'  >' "".
//            | | :  '- \'.;'\ _ /';.'/ -'  : | |
//            \  \ '_.   \_ __\ /__ _/   ._' /  /
//        ====='-.____'.___ \_____/ ___.'____.-'=====
//                          '=---='
//
//        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//                 佛祖保佑        永无BUG
//
//        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

</script>

<style lang='less'>
  @import 'assets/less/index.less';
  
</style>



