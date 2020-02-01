import Vue from 'vue'
import Vuex from 'vuex'
import Es from './es.js'

Vue.use(Vuex)

function handle_err(err) {
  return err.response || err
}

function make_query_body(selected) {
  let pick = {},
    drop = {}

  for (let field of Object.keys(selected)) {
    for (let value of Object.values(selected[field])) {
      if (value.picked) {
        pick[field] = pick[field] || []
        pick[field].push(value.bucket.key)
      } else {
        drop[field] = drop[field] || []
        drop[field].push(value.bucket.key)
      }
    }
  }

  let must = [],
    must_not = []
  for (let field in pick) {
    let condition = {}
    condition[field] = pick[field]
    must.push({
      terms: condition
    })
  }
  for (let field in drop) {
    let condition = {}
    condition[field] = drop[field]
    must_not.push({
      terms: condition
    })
  }

  return {
    bool: {
      filter: [{
        bool: {
          must: must,
          must_not: must_not
        }
      }]
    }
  }
}

export default new Vuex.Store({
  state: {
    es: null,
    alarm: null,
    selected: {},
    aggs: {},
    result: {}
  },

  getters: {
    has_alarm(state) {
      return state.alarm !== null
    }
  },

  mutations: {
    refresh(state, new_state) {
      for (let key in new_state) {
        state[key] = new_state[key]
      }
    },

    select(state, b) {
      let field = b.field
      if (!state.selected[field]) {
        Vue.set(state.selected, field, {})
      }

      let values = state.selected[field],
        value = values[b.key]

      if (value) {
        if (value.picked) {
          value.picked = false
        } else {
          Vue.delete(values, b.key)
        }
      } else {
        Vue.set(values, b.key, {
          bucket: b,
          picked: true
        })
      }
    }
  },

  actions: {
    change_index(ctx, index) {
      let es = new Es(index)
      ctx.commit('refresh', {
        es: es
      })

      es.aggs_result().then(res => {
        ctx.commit('refresh', {
          aggs: res,
          alarm: null
        })
      }).catch(err => {
        ctx.commit('refresh', {
          aggs: {},
          alarm: handle_err(err)
        })
      })
    },

    submit(ctx) {
      ctx.state.es.search(make_query_body(ctx.state.selected)).then(res => {
        ctx.commit('refresh', {
          result: res,
          alarm: null
        })
      }).catch(err => {
        ctx.commit('refresh', {
          result: {},
          alarm: handle_err(err)
        })
      })
    }
  }
})
