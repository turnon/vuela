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

let index_name_parser = {
  index(index_type) {
    return index_type.replace(/\/.*/, '')
  },
  type(index_type) {
    return index_type.indexOf('/') > 0 ? index_type.replace(/.*\//, '') : "_doc"
  }
}

class Index {
  constructor(index_type) {
    this.index_type = index_type
  }

  async mapping() {
    let index = index_name_parser.index(this.index_type),
      type = index_name_parser.type(this.index_type)

    let m = await axios.get("/" + index + "/_mapping").then(res => {
      let props_of_type = res.data[index]["mappings"][type]
      if (!props_of_type) {
        throw "type " + type + " not found in index " + index
      }

      let properties = props_of_type["properties"]
      delete properties["id"]

      return properties
    })

    return m
  }

  async aggs_body() {
    let properties = await this.mapping(this.index_type)
    return aggs_maker.make_aggs(properties)
  }

  async aggs_result() {
    let aggs_body = await this.aggs_body(this.index_type)

    let result = await axios.post("/" + this.index_type + "/_search", {
      aggs: aggs_body
    })

    let new_aggs = {},
      aggs = result.data["aggregations"]

    for (let field of Object.keys(aggs)) {
      new_aggs[field] = aggs[field]["buckets"]
    }

    return new_aggs
  }
}

export default Index
