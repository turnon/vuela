<template>
  <!--  <b-list-group>
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
  </b-list-group> -->

  <el-tree :data="$store.state.aggs" :props="{children: 'children',label: 'label'}" accordion />

</template>

<script>
  export default {
    name: 'selector',
    methods: {
      pick_or_drop(b) {
        this.$store.commit("select", b)
      }
    }
  }
</script>

<style>
</style>
