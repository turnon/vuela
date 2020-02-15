import Query from './query.js'
import Sort from './sort.js'

class ReqBody {
  constructor() {
    this.query = new Query()
    this.sort = new Sort()
  }

  put(cond) {
    this[cond.type].put(cond.id, cond.cond)
  }

  to_json() {
    let json = {}
    for (let attr of ['query', 'sort']) {
      json[attr] = this[attr].to_json()
    }
    return json
  }
}

export default ReqBody
