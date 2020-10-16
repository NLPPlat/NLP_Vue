/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/data-manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'DataManage',
  meta: {
    title: '数据管理',
    icon: 'documentation'
  },
  children: [
    {
      path: 'data-venation/:datasetid',
      component: () => import('@/views/data-manage/data-venation/index'),
      name: 'data-venation',
      meta: { title: '数据脉络' }
    }, {
      path: 'operation-manage',
      component: () => import('@/views/data-manage/operation-manage/index'),
      name: 'operation-manage',
      meta: { title: '算子管理' }
    }, {
      path: 'model-manage',
      component: () => import('@/views/data-manage/model-manage/index'),
      name: 'model-manage',
      meta: { title: '模型管理' }
    }
  ]
}

export default componentsRouter
