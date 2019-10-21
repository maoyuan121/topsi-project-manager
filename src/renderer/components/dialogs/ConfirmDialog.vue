<template>
	<v-layout row justify-center>
		<v-dialog value="true" persistent max-width="290">
			<v-card>
				<v-card-title class="headline">{{title}}</v-card-title>
				<v-card-text>{{message}}</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn flat @click.native="Cancel">{{cancelMsg?cancelMsg:$lang.Get('cancel')}}</v-btn>
					<v-btn :color="acceptColor?acceptColor:'primary'" style="border-radius:0;" @click.native="Accept">{{acceptMsg?acceptMsg:$lang.Get('accept')}}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-layout>
</template>
<script>

export default {
	name: 'ConfirmDialog',
	props: {
		title: String, // 标题
		message: String, // 内容
		acceptMsg: String, // 接受按钮的文本
		cancelMsg: String, // 取消按钮的文本
		acceptColor: String // 接受按钮的颜色
	},
	methods: {
		/**
		 * 取消
		 * 触发父的 cancel 方法
		 */
		Cancel() {
			this.$emit('cancel');
		},

		// 触发父的 accept 方法
		Accept() {
			this.$emit('accept');
		}
	}
}
</script>

<style scoped>

</style>