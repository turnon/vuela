import axios from "axios"

let aggs_maker = {
  make_aggs(props) {
    let type_fields = this.group_by_type(props),
      aggs = {}

    for (let type of Object.keys(type_fields)) {
      this.make(aggs, type, type_fields[type])
    }

    return aggs
  },
  group_by_type(props) {
    let fields = {}
    for (let field in props) {
      let type = props[field]["type"]
      fields[type] = fields[type] || []
      fields[type].push(field)
    }
    return fields
  },
  make(aggs, type, fields) {
    let fn = this[type]
    if (!fn) {
      return
    }
    for (let field of fields) {
      fn(aggs, field)
    }
  },
  keyword(aggs, field) {
    aggs[field] = {
      "terms": {
        "field": field,
        "size": 1000
      }
    }
  }
}

class Idx {
  constructor(index, type, props) {
    this.index = index
    this.type = type
    this.index_type = this.index + "/" + this.type
    this.props = props
  }

  aggs_body() {
    if (!this._aggs_body) {
      this._aggs_body = aggs_maker.make_aggs(this.props)
    }
    return this._aggs_body
  }

  async aggs_result() {
    let result = await this.basic_search()

    let new_aggs = [],
      aggs = result.data["aggregations"]

    for (let field in aggs) {
      let values = aggs[field]["buckets"].map(b => {
        b["value"] = {
          field: field,
          value: b["key"]
        }
        b["label"] = b["key"] + "(" + b["doc_count"] + ")"
        return b
      })
      new_aggs.push({
        label: field,
        children: values
      })
    }

    return new_aggs
  }

  async search(query) {
    return await this.basic_search({
      query
    })
  }

  async basic_search(more) {
    let q = {
      aggs: this.aggs_body()
    }
    if (more) {
      Object.assign(q, more)
    }
    return await axios.post("/" + this.index_type + "/_search", q)
  }
}

export default Idx
