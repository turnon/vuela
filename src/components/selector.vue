<template>
  <div>
    <ul>
      <li v-for="(buckets, field) in aggs">
        <span @click="fold_or_expand(field)" class="fold-button">{{ expand[field] ? "-" : "+" }}</span>
        <span>{{ field }}</span>

        <ul class="value-list picked-list">
          <li v-for="value in selected[field]">
            <span @click="pick_or_drop(field, value.bucket)" :class="value.picked ? 'picked' : 'dropped'">
              {{ value.bucket.key }}({{ value.bucket.doc_count }})
            </span>
          </li>
        </ul>

        <ul class="value-list" v-show="expand[field]">
          <li v-for="b in buckets">
            <span @click="pick_or_drop(field, b)">
              {{ b.key }}({{ b.doc_count }})
            </span>
          </li>
        </ul>

      </li>
    </ul>
  </div>
</template>

<script>
  function make_query_body(selected) {
    let pick = {},
      drop = {}

    for (let field of Object.keys(selected)) {
      for (let value of Object.values(selected[field])) {
        if (value.picked) {
          pick[field] = pick[field] || []
          pick[field].push(value.bucket.key)
        } else {
          drop[field] = drop[field] || []
          drop[field].push(value.bucket.key)
        }
      }
    }

    let must = [],
      must_not = []
    for (let field in pick) {
      let condition = {}
      condition[field + ".keyword"] = pick[field]
      must.push({
        terms: condition
      })
    }
    for (let field in drop) {
      let condition = {}
      condition[field + ".keyword"] = drop[field]
      must_not.push({
        terms: condition
      })
    }

    return {
      bool: {
        filter: [{
          bool: {
            must: must,
            must_not: must_not
          }
        }]
      }
    }
  }

  export default {
    name: 'selector',
    props: ['aggs'],
    data() {
      return {
        expand: {},
        selected: {}
      }
    },
    methods: {
      fold_or_expand(field) {
        this.$set(this.expand, field, !this.expand[field])
      },
      pick_or_drop(field, b) {
        if (!this.selected[field]) {
          this.$set(this.selected, field, {})
        }

        let values = this.selected[field],
          value = values[b.key]

        if (value) {
          if (value.picked) {
            value.picked = false
          } else {
            this.$delete(values, b.key)
          }
        } else {
          this.$set(values, b.key, {
            bucket: b,
            picked: true
          })
        }

        this.$emit("selected", make_query_body(this.selected))
      }
    }
  }
</script>

<style scoped>
  .picked {
    background-color: skyblue;
  }

  .dropped {
    background-color: hotpink;
  }

  ul {
    padding: 0;
    overflow: auto;
  }

  ul.picked-list {
    display: inline-block;
  }

  li {
    list-style-type: none;
  }

  .value-list>li {
    display: inline;
    margin: 1px 2px;
  }
</style>
