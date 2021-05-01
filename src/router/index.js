// 工程化
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);
import { Message } from 'element-ui'
// 配置
export const router = new VueRouter({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login.vue'),
    },
    {
      name: 'index',
      path: '/index',
      component: () => import('@/views/index.vue'),
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: () => import('@/views/welcome.vue')
        },
        {
          name: 'postList',
          path: 'postList',
          component: () => import('@/views/postList.vue')
        }, {
          name: 'publishPost',
          path: 'publishPost',
          component: () => import('@/views/publishPost.vue')
        },
      ]
    },

  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next()
  } else {
    let token = localStorage.getItem('userManager');
    if (token) {
      next();
    } else {
      Message.warning('请先登录')
      next({ name: 'login' })
    }
  }
})
// 暴露
export default router