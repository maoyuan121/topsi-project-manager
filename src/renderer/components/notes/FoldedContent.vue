<template>
	<div style="height:100%;width:100%" class="pa-2" @click="Unfold">
		<v-card class="px-2 elevation-3" style="cursor:pointer;">
			<v-btn icon style="width:0px;" @click="Unfold">
				<v-icon small class="pr-2">
					add
				</v-icon>
			</v-btn>
			<strong>{{category.title.toUpperCase()}}</strong>
		</v-card>
	</div>
</template>
<script>

// 一个折叠了的分类泳道
export default {
	name: 'FoldedContent',
	props: {
		projectId: Number, // 项目 id
		category: Object // 分类
	},
	methods: {
		// 取消折叠
		Unfold() {
			this.$store.dispatch('ToggleFoldCategory', {
				projectId: this.projectId,
				category: this.category
			});
		}
	},
}
</script>

<style scoped>

</style>