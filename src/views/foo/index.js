// 引入router
import router from '../../router'

// 引入html模板, 会被作为字符串引入
import template from './index.html'

// 引入css, 会生成<style>块插入到<head>头中
import './style.less'

// 导出类
export default class {
  mount(container) {
    document.title = 'foo'
    container.innerHTML = template
    container.querySelector('.foo__gobar').addEventListener('click', () => {
      // 调用router.go方法加载 /bar 页面
      router.go('/bar')
    })

    container.querySelector('.foo__goTest').addEventListener('click', () => {
      // 调用router.go方法加载 /bar 页面
      router.go('/test')
    }) 
  }
}