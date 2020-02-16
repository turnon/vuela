class Sort {
  constructor() {
    this.sortors = {}
    this.seq = []
    this.antis = {}
  }

  put(id, sortor) {
    this.sortors[id] = sortor
    this.seq.push(id)
    console.log(JSON.stringify(this.to_json()))
  }

  anti(id) {
    this.antis[id] = !this.antis[id]
  }

  del(id) {
    delete this.sortors[id]
  }

  to_json() {
    let arr = this.seq.reduce((result, id) => {
      let sortor = this.sortors[id]
      if (!sortor) return result
      if (this.antis[id]) sortor = {
        [sortor]: "desc"
      }
      result.push(sortor)
      return result
    }, [])
    if (!arr.length) arr.push("_doc")
    return arr
  }
}

export default Sort
