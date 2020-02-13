import Vue from 'vue'
import Vuex from 'vuex'
import load_mappings from './mapping.js'

Vue.use(Vuex)

function handle_err(err) {
  console.error(err)
  return err.response ? JSON.stringify(err.response) : err
}

function construct_conditions(options) {
  if (!options) {
    return []
  }

  let group_by_field = options.reduce((group_by_field, node) => {
    let group = group_by_field[node.field] || [];
    group.push(node.value);
    group_by_field[node.field] = group;
    return group_by_field
  }, {})


  let conditions = []
  for (let field in group_by_field) {
    let values = group_by_field[field]
    let condition = {
      terms: {
        [field]: values
      }
    }
    conditions.push(condition)
  }

  return conditions
}

function construct_query_body(cond) {
  let must = construct_conditions(cond.picked.included)
  if (cond.match) must.push(cond.match)
  return {
    bool: {
      filter: [{
        bool: {
          must: must,
          must_not: construct_conditions(cond.picked.excluded)
        }
      }]
    }
  }
}

function scroll(ctx, scroll_fn) {
  scroll_fn(ctx.state.current_index).then(idx => {
    let new_state = {
      hits: idx.hits(),
      alarm: null
    }
    let aggs = idx.aggs_result()
    if (new_state.hits.total > 0 && aggs.length) {
      new_state.aggs = aggs
    }
    ctx.commit('refresh', new_state)
  }).catch(err => {
    ctx.commit('refresh', {
      hits: {},
      alarm: handle_err(err)
    })
  })
}

export default new Vuex.Store({
  state: {
    name_indexes: {},
    current_index: null,
    alarm: null,
    match: null,
    picked: {},
    sort: [],
    aggs: [],
    simple_scroll_id: 0,
    hits: {}
  },

  getters: {
    index_names(state) {
      return Object.keys(state.name_indexes).sort()
    },
    order_options(state) {
      return state.current_index ? state.current_index.order_options() : []
    },
    text_options(state) {
      return state.current_index ? state.current_index.text_options() : []
    },
    has_alarm(state) {
      return state.alarm !== null
    },
    has_aggs(state) {
      return !!state.aggs.length
    }
  },

  mutations: {
    refresh(state, new_state) {
      for (let key in new_state) {
        state[key] = new_state[key]
      }
    },

    pick(state, nodes) {
      state.picked = nodes
    },
  },

  actions: {
    load_indexes(ctx, options) {
      load_mappings(options).then(mappings => {
        ctx.commit('refresh', {
          name_indexes: mappings,
          alarm: null
        })
      }).catch(err => {
        ctx.commit('refresh', {
          name_indexes: {},
          alarm: handle_err(err)
        })
      })
    },

    change_index(ctx, index) {
      let idx = ctx.state.name_indexes[index]
      ctx.commit('refresh', {
        alarm: null,
        picked: {},
        sort: [],
        aggs: [],
        hits: {},
        current_index: idx
      })

      idx.statistic().then(idx => {
        ctx.commit('refresh', {
          aggs: idx.aggs_result(),
          alarm: null
        })
      }).catch(err => {
        ctx.commit('refresh', {
          aggs: [],
          alarm: handle_err(err)
        })
      })
    },

    submit(ctx) {
      let new_simple_scroll_id = ctx.state.simple_scroll_id + 1,
        cond = {
          picked: ctx.state.picked,
          match: ctx.state.match
        },
        body = {
          query: construct_query_body(cond),
          sort: ctx.state.sort
        }

      scroll(ctx, (idx) => {
        ctx.commit('refresh', {
          simple_scroll_id: new_simple_scroll_id
        })
        return idx.scroll_init(body)
      })
    },

    load_more(ctx) {
      scroll(ctx, (idx) => {
        return idx.scroll_next()
      })
    }
  }
})
