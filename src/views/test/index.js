// 引入html模板, 会被作为字符串引入
import template from './index.html'
// import 'bootstrap/dist/js/bootstrap.min.js' 
// import 'bootstrap/dist/css/bootstrap.min.css'

// 引入css, 会生成<style>块插入到<head>头中
import './style.less'

// 导出类
export default class {
  mount(container) {
    document.title = 'test'
    container.innerHTML = template 
  }
}