<template>
  <div>
    <ul v-for="(buckets, field) in aggs">
      <li>
        {{ field }} {{ selected[field] }}
        <ul v-for="b in buckets">
          <li @click="pick_or_drop(field, b)">{{ b.key }}({{ b.doc_count }})</li>
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
        selected: {}
      }
    },
    methods: {
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

        console.log(field, b)
      }
    }
  }
</script>

<style>
</style>
