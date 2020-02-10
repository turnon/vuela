import axios from "axios"

class AggsMaker {
  constructor(options) {
    this.options = options
  }

  make_aggs(props) {
    let type_fields = this.group_by_type(props),
      aggs = {}

    for (let type of Object.keys(type_fields)) {
      this.make(aggs, type, type_fields[type])
    }

    return aggs
  }

  group_by_type(props) {
    let fields = {}
    for (let field in props) {
      let type = props[field]["type"]
      fields[type] = fields[type] || []
      fields[type].push(field)
    }
    return fields
  }

  make(aggs, type, fields) {
    let fn = this[type]
    if (!fn) {
      return
    }
    fn = fn.bind(this)
    for (let field of fields) {
      fn(aggs, field)
    }
  }

  keyword(aggs, field) {
    let size = this.options.aggs_keyword_size || 10
    aggs[field] = {
      "terms": {
        "field": field,
        "size": size
      }
    }
  }

}

class Idx {
  constructor(index, type, props, options) {
    this.index = index
    this.type = type
    this.index_type = this.index + "/" + this.type
    this.props = props
    this.options = options || {}
    this.aggs_maker = new AggsMaker(this.options)
  }

  aggs_body() {
    if (!this._aggs_body) {
      this._aggs_body = this.aggs_maker.make_aggs(this.props)
    }
    return this._aggs_body
  }

  hits() {
    return this.resp.hits
  }

  aggs_result() {
    let new_aggs = [],
      aggs = this.resp.aggregations

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
    let path = `/${this.index_type}/_search`
    path = this.options.namespace ? `/${this.options.namespace}${path}` : path
    let resp = await axios.post(path, q)
    this.resp = resp.data
    return Promise.resolve(this)
  }
}

export default Idx
