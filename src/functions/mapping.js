import axios from "axios"
import Idx from "./idx.js"

async function load_mappings(options) {
  let indexes = {}
  let path = options.namespace ? `/${options.namespace}/_mapping` : "/_mapping"
  await axios.get(path).then(res => {
    for (let index in res.data) {
      let mappings = res.data[index]['mappings']
      for (let type in mappings) {
        let props = mappings[type]['properties']
        delete props["id"]
        let idx = new Idx(index, type, props, options)
        indexes[idx.index_type] = idx
      }
    }
  })

  return indexes
}

export default load_mappings
