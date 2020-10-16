const state = {
  分词: {},
  去停用词: {
    stopwordsListSelect: ''
  },
  词性标注: {},
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
