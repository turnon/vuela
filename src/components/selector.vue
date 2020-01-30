<template>
  <b-list-group>
    <b-list-group-item v-for="(buckets, field) in $store.state.aggs">

      <span v-b-toggle="'accordion-' + field">
        <b-icon icon="chevron-right"></b-icon>{{ field }}
      </span>

      <b-badge class="mr-1" :variant="value.picked ? 'success' : 'danger'" @click="pick_or_drop(value.bucket)" v-for="value in selected[field]">
        {{ value.bucket.key }}({{ value.bucket.doc_count }})
      </b-badge>

      <b-collapse :id="'accordion-' + field" accordion="my-accordion" class="choices">
        <span class="choice mr-3" v-for="b in buckets" @click="pick_or_drop(b)">
          {{ b.key }}({{ b.doc_count }})
        </span>
      </b-collapse>

    </b-list-group-item>
  </b-list-group>
</template>

<script>
  import {
    BIcon,
    BIconChevronRight,
    BIconChevronDown
  } from 'bootstrap-vue'

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
      condition[field] = pick[field]
      must.push({
        terms: condition
      })
    }
    for (let field in drop) {
      let condition = {}
      condition[field] = drop[field]
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
        selected: {}
      }
    },
    components: {
      BIcon,
      BIconChevronRight,
      BIconChevronDown
    },
    methods: {
      pick_or_drop(b) {
        let field = b.field
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
  .choices {
    max-height: calc(30vh);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .choice {
    word-break: keep-all;
  }
</style>
