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

class Index {
  constructor(index_type) {
    this.index = index_type.replace(/\/.*/, '')
    this.type = index_type.indexOf('/') > 0 ? index_type.replace(/.*\//, '') : "_doc"
    this.index_type = this.index + "/" + this.type
  }

  async mapping() {
    let m = await axios.get("/" + this.index + "/_mapping").then(res => {
      let props_of_type = res.data[this.index]["mappings"][this.type]
      if (!props_of_type) {
        throw "type " + type + " not found in index " + this.index
      }

      let properties = props_of_type["properties"]
      delete properties["id"]

      return properties
    })

    return m
  }

  async aggs_body() {
    if (!this._aggs_body) {
      let properties = await this.mapping()
      this._aggs_body = aggs_maker.make_aggs(properties)
    }
    return this._aggs_body
  }

  async aggs_result() {
    let aggs_body = await this.aggs_body()

    let result = await axios.post("/" + this.index_type + "/_search", {
      aggs: aggs_body
    })

    let new_aggs = {},
      aggs = result.data["aggregations"]

    for (let field of Object.keys(aggs)) {
      new_aggs[field] = aggs[field]["buckets"].map(b => {
        b["field"] = field
        return b
      })
    }

    return new_aggs
  }

  async search(query_body) {
    let aggs_body = await this.aggs_body()
    let result = await axios.post("/" + this.index_type + "/_search", {
      query: query_body,
      aggs: aggs_body
    })
    return result.data
  }
}

export default Index
