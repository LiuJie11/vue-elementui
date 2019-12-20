import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        info:null,
        isCollapse:true ,//控制导航是否折叠
        loading:false,//实现页面加载数据效果
    },
    getters:{},
    mutations:{
       setinfo(state,info){
         state.info = info
       },
       setcollapse(state,bol){
           state.isCollapse=bol
       },
       //改变数据加载的loding
       setloading(state,bol){
        state.loading = bol
       }
    },
    actions:{
        setinfo(context,info){
            context.commit('setinfo',info)
        },
        setcollapse(context,bol){
            context.commit('setcollapse',bol)
        },
        setloading(context,bol){
            context.commit('setloading',bol)
        },
    },
    modules:{}
})

export default store