import Query from './query.js'
import Sort from './sort.js'

class ReqBody {
  constructor() {
    this.conditions = []
    this.antis = {}
    this.query = new Query()
    this.sort = new Sort()
  }

  add(cond_type) {
    this.conditions.push({
      id: Date.now().toString(),
      operator: cond_type
    })
  }

  del(id) {
    this.conditions = this.conditions.filter(cond => {
      return cond.id !== id
    })
    this.each_sub_body((_, body) => {
      body.del(id)
    })
  }

  anti(id) {
    this.antis[id] = !this.antis[id]
    this.each_sub_body((_, body) => {
      body.anti(id)
    })
  }

  put(cond) {
    this[cond.type].put(cond.id, cond.cond)
  }

  to_json() {
    let json = {}
    this.each_sub_body((attr, body) => {
      json[attr] = body.to_json()
    })
    return json
  }

  each_sub_body(fn) {
    for (let attr of ['query', 'sort']) {
      fn(attr, this[attr])
    }
  }
}

export default ReqBody
