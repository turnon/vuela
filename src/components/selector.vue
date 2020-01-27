<template>
  <div>
    <ul v-for="(buckets, field) in aggs">
      <li>
        {{ field }}
        <ul v-for="b in buckets">
          <li>{{ b.key }}({{ b.doc_count }})</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'selector',
    props: ['aggs']
  }
</script>

<style>
</style>
