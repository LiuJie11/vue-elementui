import Vue from 'vue'

import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path:'*',
        redirect:'/login'
    },
    {
        path:'/login',
        component:()=>import('views/login')
    },
    {
        path:'/home',
        name:'home',
        component:()=>import('views/home'),
        children:[
            {
                path:'',
                redirect:'/users'
            },
            {
                path:'/users',
                name:'users',
                component:()=>import('components/pages/users')
            },
            {
                path:'/rights',
                name:'rights',
                component:()=>import('components/pages/rights')
            },
            {
                path:'/roles',
                name:'roles',
                component:()=>import('components/pages/roles')
            },
            {
                path:'/goods',
                name:'goods',
                component:()=>import('components/pages/goods')
            },
            {
                path:'/params',
                name:'params',
                component:()=>import('components/pages/params')
            },
            {
                path:'/categories',
                name:'categories',
                component:()=>import('components/pages/categories')
            },
            {
                path:'/orders',
                name:'orders',
                component:()=>import('components/pages/orders')
            },
            {
                path:'/reports',
                name:'reports',
                component:()=>import('components/pages/reports')
            }
        ]
    }
]


// { path: '/users', component: Users },
// { path: '/rights', component: Rights },
// { path: '/roles', component: Roles },
// { path: '/categories', component: Cate },
// { path: '/params', component: Params },
// { path: '/goods', component: GoodsList },
// { path: '/goods/add', component: Add },
// { path: '/orders', component: Order },
// { path: '/reports', component: Report }

const router = new VueRouter({
    routes,
    mode:'history'
})

//路由守卫
router.beforeEach((to,from,next)=>{
    if(to.path==='/login') return next() 
    let tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr)return  next('/login') 
    next()
})

export default router