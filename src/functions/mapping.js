import axios from "axios"
import Es from "./es.js"

async function load_mappings() {
  let indexes = {}
  await axios.get("/_mapping").then(res => {
    for (let index in res.data) {
      let mappings = res.data[index]['mappings']
      for (let type in mappings) {
        let props = mappings[type]['properties']
        delete props["id"]
        let es = new Es(index, type, props)
        indexes[es.index_type] = es
      }
    }
  })

  return indexes
}

export default load_mappings
