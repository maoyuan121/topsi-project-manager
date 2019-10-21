<template>
	<div id="notes_container" :class="color" class="pa-0">
		<CreateNoteDialog v-if="createDialog" />
		<VisualizeNoteDialog v-if="visualizeDialog"></VisualizeNoteDialog>
		<UpdateNoteDialog v-if="updateDialog" />
		<UpdateProjectDialog v-if="updateProject" />
		<div v-for="(category, index) in categories" :key="category+index" :id="category.tag+'-container'" class="category-container">
			<Content :projectId="projectId" v-if="!category.folded" :id="category.tag+'-content'" :category="category" />
			<FoldedContent v-else :projectId="projectId" :category="category" />
		</div>
		<MilestonesList />
	</div>
</template>
<script>
import EventManager from '../../../core/EventManager.js';
import AppManager from '../../../core/ApplicationManager';


import MilestonesList from './MilestonesList.vue'
import FoldedContent from './FoldedContent.vue'
import AddNoteButton from './AddNoteButton.vue'
import CreateNoteDialog from '../dialogs/CreateNoteDialog.vue'
import VisualizeNoteDialog from '../dialogs/VisualizeNoteDialog.vue'
import UpdateNoteDialog from '../dialogs/UpdateNoteDialog.vue'
import UpdateProjectDialog from '../dialogs/UpdateProjectDialog.vue'
import Content from './Content.vue'

// 整个 note 模块
export default {
	name: 'Notes',
	components: {
		CreateNoteDialog,
		UpdateNoteDialog,
		VisualizeNoteDialog,
		UpdateProjectDialog,
		Content,
		FoldedContent,
		MilestonesList
	},
	computed: {
		/**
		 * 打开的项目于 id 
		 */
		projectId() {
			return this.$store.state.AppStore.openedProjectId;
		},

		/**
		 * 打开的项目
		 */
		project() {
			const id = this.projectId;
			return this.$store.getters.getProjectById(id);
		},

		// 项目的所有分类
		// 一个分类一个泳道
		categories() {
			return this.project.categories;
		},

		// 是否显示创建 note 对话框
		createDialog() {
			return this.$store.state.AppStore.dialogs.createNote
		},

		// 是否显示编辑 note 对话框
		updateDialog() {
			return this.$store.state.AppStore.dialogs.updateNote
		},

		visualizeDialog() {
			return this.$store.state.AppStore.dialogs.visualizeDialog;
		},

		updateProject() {
			return this.$store.getters.isUpdateProject;
		},

		// 颜色 css class
		color() {
			if (this.$store.getters.isDarkMode)
				return '';
			else return 'grey lighten-2'
		},

		/**
		 * 是否是 macos
		 */
		macos() {
			return this.$store.getters.isMac;
		}
	},
	mounted() {
		// 设置页面布局
		AppManager.SetupNotesPage((this.macos ? 0 : 30), 'notes_container', 'container', this.categories.filter(category => !category.folded).map(category => category.tag), this.categories.filter(category => category.folded).map(category => category.tag));
		
		EventManager.Subscribe('update-notes-component', () => {
			this.$nextTick(() => {
				AppManager.SetupNotesPage((this.macos ? 0 : 30), 'notes_container', 'container', this.categories.filter(category => !category.folded).map(category => category.tag), this.categories.filter(category => category.folded).map(category => category.tag), false);
			});
		});
	}
}
</script>

<style >

.category-container{
	overflow-y: auto;
}

</style>