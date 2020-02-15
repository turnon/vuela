class Query {
  constructor() {
    this.conditions = {}
    this.antis = {}
  }

  del(id) {
    delete this.conditions[id]
  }

  anti(id) {
    this.antis[id] = !this.antis[id]
  }

  put(id, cond) {
    this.conditions[id] = cond
  }

  to_json() {
    let must = [],
      must_not = []

    for (let id in this.conditions) {
      let arr = this.antis[id] ? must_not : must
      arr.push(this.conditions[id])
    }

    return {
      bool: {
        filter: [{
          bool: {
            must: this.concat_filters(must),
            must_not: this.concat_filters(must_not)
          }
        }]
      }
    }
  }

  concat_filters(filters) {
    return filters.reduce((arr, cond) => {
      cond = Array.isArray(cond) ? cond : [cond];
      return arr.concat(cond)
    }, [])
  }

}

export default Query
