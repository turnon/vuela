class Query {
  constructor() {
    this.conditions = {}
  }

  put_condition(id, cond) {
    this.conditions[id] = cond
    console.log(JSON.stringify(this.conditions))
  }

  to_json() {
    let must = Object.values(this.conditions).reduce((arr, cond) => {
      cond = Array.isArray(cond) ? cond : [cond];
      return arr.concat(cond)
    }, [])

    return {
      bool: {
        filter: [{
          bool: {
            must: must
          }
        }]
      }
    }
  }

}

export default Query
