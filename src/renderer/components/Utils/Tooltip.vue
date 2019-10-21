<template>
	<v-tooltip :right="right" :left="left" :top="top" :bottom="bottom">
		<slot slot="activator"></slot>
		<span>{{content}}</span>
	</v-tooltip>
</template>
<script>

// 提示文本
export default {
	name: 'Tooltip',
	props: {
		right: String,
		left: String,
		top: String,
		bottom: String,
		content: String
	},
}
</script>

<style scoped>

</style>