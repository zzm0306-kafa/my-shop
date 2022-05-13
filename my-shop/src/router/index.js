import { createRouter, createWebHashHistory } from 'vue-router'
// 配置路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    // 通过路由懒加载进行定位
    component: () => import('@/view/login/index.vue')
  },
  {
    path: '/',
    name: 'home',
    // 通过路由懒加载进行定位
    component: () => import('@/view/home/index.vue')
  },
  {
    path: '/user',
    name: 'user',
    // 通过路由懒加载进行定位
    component: () => import('@/view/user/index.vue')
  },
  {
    path: '/product:productId',
    name: 'product',
    // 通过路由懒加载进行定位
    component: () => import('@/view/product/index.vue'),
    props: true
  },
  {
    path: '/comment:productId',
    name: 'comment',
    // 通过路由懒加载进行定位
    component: () => import('@/view/comment/index.vue'),
    props: true
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('@/view/category/index.vue')
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: () => import('@/view/recommend/index.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    // 通过路由懒加载进行定位
    component: () => import('@/view/cart/index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    // 通过路由懒加载进行定位
    component: () => import('@/view/not-found/index.vue')
  }
]
// 创建router实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router