import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        info:null,
        count:1,
        isCollapse:true ,//控制导航是否折叠
    },
    getters:{},
    mutations:{
       setinfo(state,info){
         state.info = info
       },
       setcollapse(state,bol){
           state.isCollapse=bol
       }
    },
    actions:{
        setinfo(context,info){
            context.commit('setinfo',info)
        },
        setcollapse(context,bol){
            context.commit('setcollapse',bol)
        },
        add(context,num){
            console.log(num)
            context.commit('add',num)
        }
    },
    modules:{}
})

export default store