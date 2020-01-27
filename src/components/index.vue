<template>
  <div>
    <input @keyup.13="get_mapping" v-model="index_type" />
  </div>
</template>

<script>
  import axios from 'axios'

  function group_by_type(props) {
    let fields = {}
    for (let field in props) {
      let type = props[field]["type"]
      fields[type] = fields[type] || []
      fields[type].push(field)
    }
    return fields
  }

  let aggs_maker = {
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

  function make_aggs(props) {
    let type_fields = group_by_type(props),
      aggs = {}

    for (let type of Object.keys(type_fields)) {
      aggs_maker.make(aggs, type, type_fields[type])
    }

    return aggs
  }

  export default {
    name: 'index',
    data() {
      return {
        index_type: ""
      }
    },
    computed: {
      index() {
        return this.index_type.replace(/\/.*/, '')
      },
      type() {
        return this.index_type.indexOf('/') > 0 ? this.index_type.replace(/.*\//, '') : "_doc"
      }
    },
    methods: {
      get_mapping() {
        axios.get("/" + this.index + "/_mapping").then(res => {
          let props_of_type = res.data[this.index]["mappings"][this.type]
          if (!props_of_type) {
            this.$emit("alarm", "type " + this.type + " not found in index " + this.index)
            return
          }

          let properties = props_of_type["properties"]
          delete properties["id"]

          let aggs = make_aggs(properties)
          return axios.post("/" + this.index + "/_search", {
            aggs: aggs
          })
        }).catch(err => {
          this.$emit("alarm", err.response)
        }).then(res => {
          let new_aggs = {},
            aggs = res.data["aggregations"]

          for (let field of Object.keys(aggs)) {
            new_aggs[field] = aggs[field]["buckets"]
          }

          this.$emit("refresh-aggs", new_aggs)
        })
      }
    }
  }
</script>

<style>
</style>
