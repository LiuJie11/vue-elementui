import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入element ui引入的库
import './components/common/element/element.js'

// 引入第三方插件库table
import TreeTable from 'vue-table-with-tree-grid'
// 引入第三方富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'




Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

//请求
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//添加拦截器
axios.interceptors.request.use(config=>{
  store.dispatch('setloading',true)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 添加响应拦截
axios.interceptors.response.use(config=>{
  store.dispatch('setloading',false)
  return config
})

Vue.prototype.$http = axios


//全局过滤器
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+1+'').padStart(2,'0')
  const hh = (dt.getHours()+1+'').padStart(2,'0')
  const mm = (dt.getMinutes()+1+'').padStart(2,'0')
  const ss = (dt.getSeconds()+1+'').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  router,
  store 
}).$mount('#app')
