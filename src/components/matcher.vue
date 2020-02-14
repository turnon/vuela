<template>
  <el-input placeholder="phrase" v-model="phrase" @change="change">
    <el-select v-model="field" slot="prepend" :style="{width: field_selector_width}" @change="change">
      <el-option v-for="text_field in $store.getters.text_options" :key="text_field" :label="text_field" :value="text_field" />
    </el-select>
  </el-input>
</template>

<script>
  export default {
    data() {
      return {
        field: "",
        phrase: null
      }
    },
    computed: {
      field_selector_width() {
        let len = this.field.length ? (this.field.length + 1) : 2.7
        return `${len}em`
      }
    },
    methods: {
      change() {
        this.$emit("change_cond", {
          match_phrase: {
            [this.field]: this.phrase
          }
        })
      }
    }
  }
</script>

<style>
</style>
