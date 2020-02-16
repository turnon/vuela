<template>
  <div class="vuela-options">

    <div v-for="cond in $store.getters.conditions" :key="cond.id" style="margin-top: .25rem; position: relative;">
      <component :is="cond.operator" @change_cond="change_cond('put', {id: cond.id, ...$event})" :style="{width: 'calc(100% - 79px)'}" />

      <div class="vuela-rm-buttons">
        <el-button type="info" plain :icon="$store.getters.anti_icon(cond)" @click="change_cond('anti', cond.id)" />
        <el-button type="info" plain icon="el-icon-delete" @click="change_cond('del', cond.id)" />
      </div>
    </div>

    <el-dropdown class="add-condition" placement="bottom-start" @command="change_cond('add', $event)">
      <el-button type="primary" plain>
        add condition <i class="el-icon-plus el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="cond in ['match_phrase', 'terms', 'sort',]" :command="cond">
          {{ cond }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </div>
</template>

<script>
  import terms from './terms.vue'
  import match_phrase from './match_phrase.vue'
  import sort from './sort.vue'

  export default {
    components: {
      match_phrase,
      terms,
      sort
    },
    methods: {
      change_cond(change, ...args) {
        this.$store.state.req_body[change](...args)
      },
    }
  }
</script>

<style>
  .vuela-options input.el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .add-condition {
    width: 100%;
    margin-top: .25rem
  }

  .add-condition .el-button {
    width: 100%;
  }

  .vuela-rm-buttons {
    display: inline-block;
    margin-left: -4px;
    position: absolute;
    top: 0;
    bottom: 0
  }

  .vuela-rm-buttons button {
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0px;
    height: 100%;
    width: 25px;
  }

  .vuela-rm-buttons button:nth-child(1) {
    margin-left: -1px;
    border-bottom-right-radius: 0px;
    border-top-right-radius: 0px;
  }

  .vuela-rm-buttons button:nth-child(2) {
    margin-left: -1px;
  }

  .vuela-rm-buttons button i {
    margin-left: -8px;
  }
</style>
