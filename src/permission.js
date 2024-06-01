import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

/** 前置守卫 */

const whitelist = ['/login', '/404']
router.beforeEach((to, from, next) => {
  nprogress.start()
  if (store.getters.token) {
    // 存在token
    if (to.path === '/login') {
      // 跳转到主页
      next('/')
      nprogress.done()
    } else {
      next()
    }
  } else {
    // 不存在token
    if (whitelist.includes(to.path)) {
      next()
    } else {
      next('/login')
      nprogress.done()
    }
  }
})

/** 后置守卫 */

router.afterEach(() => {
  console.log('123')
  nprogress.done()
})
