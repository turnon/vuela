<template>
	<div>
		<input @keyup.13="get_mapping" v-model="index" />
	</div>
</template>

<script>
	import axios from 'axios'

	function group_by_type(props) {
		let fields = {}
		for (let field in props) {
			let type = props[field]["type"]
			fields[type] = fields[type] || []
			fields[type].push(field)
		}
		return fields
	}
	
	export default {
		name: 'index',
		data() {
			return {
				index: ""
			}
		},
		methods: {
			get_mapping() {
				axios.get("/" + this.index + "/_mapping").then(res => {
					// debugger
					let properties = res.data[this.index]["mappings"]["_doc"]["properties"]
					console.log(group_by_type(properties))
				})
			}
		}
	}
</script>
</style>
