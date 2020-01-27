<template>
  <div>
    <ul>
      <li v-for="(buckets, field) in aggs">
        <span>{{ field }}</span>
        <span @click="fold_or_expand(field)" class="fold-button">{{ fold[field] ? "+" : "-" }}</span>

        <ul class="value-list picked-list">
          <li v-for="value in selected[field]">
            <span @click="pick_or_drop(field, value.bucket)" :class="value.picked ? 'picked' : 'dropped'">
              {{ value.bucket.key }}({{ value.bucket.doc_count }})
            </span>
          </li>
        </ul>

        <ul class="value-list" v-show="!fold[field]">
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
  export default {
    name: 'selector',
    props: ['aggs'],
    data() {
      return {
        fold: {},
        selected: {}
      }
    },
    mounted() {
      for (let field of Object.keys(this.aggs)) {
        this.$set(this.fold, field, true)
      }
    },
    methods: {
      fold_or_expand(field) {
        this.$set(this.fold, field, !this.fold[field])
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
