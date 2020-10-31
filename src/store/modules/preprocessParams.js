const state = {
  preprocessList: [{
    value: '基本预处理',
    label: '基本预处理',
    children: [{
      value: '分词',
      label: '分词'
    }, {
      value: '词性标注',
      label: '词性标注'
    }, {
      value: '去停用词',
      label: '去停用词'
    }, {
      value: '关键词提取',
      label: '关键词提取'
    }]
  }, {
    value: '向量模型',
    label: '向量模型',
    children: [{
      value: 'TFIDF',
      label: 'TFIDF'
    }, {
      value: 'Word2vec',
      label: 'Word2vec'
    }, {
      value: 'Doc2vec',
      label: 'Doc2vec'
    }, {
      value: 'GloVe',
      label: 'GloVe'
    }, {
      value: 'ELMo',
      label: 'ELMo'
    }, {
      value: 'BERT',
      label: 'BERT'
    }]
  }, {
    value: '特征生成',
    label: '特征生成',
    children: [{
      value: 'EmbeddingMatrix',
      label: 'EmbeddingMatrix'
    }]
  }, {
    value: '特征降维',
    label: '特征降维',
    children: [{
      value: 'PCA',
      label: 'PCA'
    }, {
      value: 'LDA',
      label: 'LDA'
    }]
  }, {
    value: '特征选择',
    label: '特征选择',
    children: [{
      value: '方差选择',
      label: '方差选择'
    }, {
      value: '相关系数',
      label: '相关系数'
    }, {
      value: '卡方检验',
      label: '卡方检验'
    }, {
      value: '互信息法',
      label: '互信息法'
    }, {
      value: '递归特征消除',
      label: '递归特征消除'
    }, {
      value: '惩罚项',
      label: '惩罚项'
    }, {
      value: '树模型',
      label: '树模型'
    }]
  }, {
    value: '标签映射',
    label: '标签映射',
    children: [{
      value: '单标签',
      label: '单标签'
    }]
  }],
  分词: {
    tool: 'jieba'
  },
  分词选项: {
    tool: ['jieba', 'SnowNLP', 'THULAC', 'HanLP']
  },
  分词参数说明: {
    tool: '分词工具'
  },
  去停用词: {
    list: '系统默认'
  },
  去停用词参数说明: {
    list: '停用词表'
  },
  词性标注: {
    tool: 'jieba'
  },
  词性标注选项: {
    tool: ['jieba', 'SnowNLP', 'THULAC', 'HanLP']
  },
  词性标注参数说明: {
    tool: '词性标注工具'
  },
  关键词提取: {},
  TFIDF: {},
  Word2vec: {
    size: 100,
    alpha: 0.025,
    window: 5,
    min_count: 5,
    max_vocab_size: 'None',
    sample: 1e-3,
    seed: 1,
    workers: 3,
    min_alpha: 0,
    sg: 0,
    hs: 0,
    negative: 5,
    cbow_mean: 1,
    hashfxn: 'hash',
    iter: 5,
    trim_rule: 'None',
    sorted_vocab: 1,
    batch_words: 10000
  },
  Word2vec参数说明: {
    size: 100,
    alpha: 0.025,
    window: 5,
    min_count: 5,
    max_vocab_size: 'None',
    sample: 1e-3,
    seed: 1,
    workers: 3,
    min_alpha: 0,
    sg: 0,
    hs: 0,
    negative: 5,
    cbow_mean: 1,
    hashfxn: 'hash',
    iter: 5,
    trim_rule: 'None',
    sorted_vocab: 1,
    batch_words: 10000
  },
  Doc2vec: {
    dm: 1,
    dm_mean: 0,
    dm_concat: 0,
    dbow_words: 0,
    size: 100,
    alpha: 0.025,
    window: 5,
    min_count: 5,
    max_vocab_size: 'None',
    sample: 1e-3,
    seed: 1,
    workers: 3,
    min_alpha: 0,
    sg: 0,
    hs: 0,
    negative: 5,
    cbow_mean: 1,
    hashfxn: 'hash',
    iter: 5,
    trim_rule: 'None',
    sorted_vocab: 1,
    batch_words: 10000
  },
  GloVe: {
    MEMORY: 4.0,
    VOCAB_MIN_COUNT: 5,
    VECTOR_SIZE: 50,
    MAX_ITER: 15,
    WINDOW_SIZE: 15,
    NUM_THREADS: 8
  },
  EmbeddingMatrix: {
    method: '向量平均',
    padding: 20
  },
  EmbeddingMatrix选项: {
    method: ['向量平均', '向量求和', 'TFIDF加权']
  },
  EmbeddingMatrix参数说明: {
    method: '生成方式',
    padding: '截取个数'
  }
}

const mutations = {
  SET_WORD2VEC_PARAMS: (state, params) => {
    state.Word2vec = params
  }
}

export default {
  namespaced: true,
  state,
  mutations
}