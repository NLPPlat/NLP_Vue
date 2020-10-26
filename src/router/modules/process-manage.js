/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/process-manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ProcessManage',
  meta: {
    title: '过程管理',
    icon: 'component'
  },
  children: [
    {
      path: 'data-upload',
      component: () => import('@/views/process-manage/data-upload/index'),
      name: 'data-upload',
      meta: { title: '数据接入' }
    }, {
      path: 'data-set',
      component: () => import('@/views/process-manage/data-set/data-set/index'),
      name: 'data-set',
      meta: { title: '数据集' }
    }, {
      path: 'data-set/data-detail/:id',
      component: () => import('@/views/process-manage/data-set/data-detail/index'),
      name: 'data-set-data-detail',
      hidden: true,
      meta: { title: '数据详情' }
    }, {
      path: 'annotation',
      component: () => import('@/views/process-manage/annotation/annotation/index'),
      name: 'annotation',
      meta: { title: '数据标注' }
    }, {
      path: 'annotation/data-detail/:id',
      component: () => import('@/views/process-manage/annotation/data-detail/index'),
      name: 'annotation-data-detail',
      hidden: true,
      meta: { title: '数据详情' }
    }, {
      path: 'annotation/vector-detail/:datasetid/:id',
      component: () => import('@/views/process-manage/annotation/vector-detail/index'),
      name: 'annotation-vector-detail',
      hidden: true,
      meta: { title: '标注详情' }
    }, {
      path: 'pre-process',
      component: () => import('@/views/process-manage/pre-process/pre-process/index'),
      name: 'pre-process',
      meta: { title: '预处理' }
    }, {
      path: 'pre-process/pre-process-manage/:datasetid',
      component: () => import('@/views/process-manage/pre-process/pre-process-manage/index'),
      name: 'pre-process-manage',
      hidden: true,
      meta: { title: '预处理过程' }
    }, {
      path: 'pre-process/data-detail/:datasetid/:preprocessid',
      component: () => import('@/views/process-manage/pre-process/data-detail/index'),
      name: 'pre-process-data-detail',
      hidden: true,
      meta: { title: '数据详情' }
    }, {
      path: 'model-train',
      component: () => import('@/views/process-manage/model-train/index'),
      name: 'model-train',
      meta: { title: '模型训练' }
    }, {
      path: 'batch-process',
      component: () => import('@/views/process-manage/batch-process/index'),
      name: 'batch-process',
      meta: { title: '批处理' }
    }, {
      path: 'task-manage',
      component: () => import('@/views/process-manage/model-train/index'),
      name: 'task-manage',
      meta: { title: '任务管理' }
    }
  ]
}

export default componentsRouter
