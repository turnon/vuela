<template>
  <b-list-group>
    <b-list-group-item v-for="(buckets, field) in $store.state.aggs">

      <span v-b-toggle="'accordion-' + field">
        <b-icon icon="chevron-right"></b-icon>{{ field }}
      </span>

      <b-badge class="mr-1" :variant="value.picked ? 'success' : 'danger'" @click="pick_or_drop(value.bucket)" v-for="value in $store.state.selected[field]">
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

  export default {
    name: 'selector',
    components: {
      BIcon,
      BIconChevronRight,
      BIconChevronDown
    },
    methods: {
      pick_or_drop(b) {
        this.$store.commit("select", b)
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
