<template>
	<div class="content">
		<div class="top pa-3 title">
			<div class="content-category-title">
				<v-toolbar height="30" color="transparent" flat>
					<div v-show="!editTitle" @dblclick="EditTitle">
						{{title}}
					</div>
					<div v-show="editTitle" ref="edit" class="pt-3 mt-1" style="width:100px">
						<v-text-field v-model="editedTitle" :value="title" @keyup.enter.native="UpdateTitle" autofocus></v-text-field>
					</div>
					<v-btn icon fab small style="width:20px;height:20px;" class="ml-1 mt-2" @click="Fold">
						<v-icon>
							unfold_less
						</v-icon>
					</v-btn>
				</v-toolbar>
			</div>
		</div>
		<div class="bottom" :id="id">
			<Note v-for="(note) in notes" :key="note.id" :note="note" class="mx-4" />
		</div>
		<div class="vline grey"></div>
	</div>
</template>
<script>
import Note from './Note.vue'
import Sortable from 'sortablejs'
import Utils from '../../../core/Utils'

// 一个 note 泳道
export default {
	name: 'Content',
	components: {
		Note
	},
	props: {
		id: String, // id 标识
		projectId: Number, // 项目 id
		category: Object // 分类
	},
	data() {
		return {
			editTitle: false, // 是否处在编辑标题状态中
			editedTitle: '' // 编辑的 title 名
		}
	},
	computed: {
		title: {			
			get() {
				return this.category.title;
			},

			set(value) {
				if (value == this.category.title) return;
				this.$store.dispatch('UpdateCategory', {
					category: this.category,
					projectId: this.projectId,
					newTitle: value
				})
			}
		},

		notes() {
			return this.$store.getters.notes.filter(note => {
				if (note.category != this.category.tag) {
					return false;
				}

				const searchContent = this.searchContent;
				return note.title.toLowerCase().includes(searchContent) || note.tags.some(tag => tag.tag.toLowerCase().includes(searchContent));
			});
		},

		searchContent() {
			return this.$store.getters.searchContent.toLowerCase();
		}
	},
	methods: {
		/**
		 * 折叠
		 */
		Fold() {
			this.$store.dispatch('ToggleFoldCategory', {
				projectId: this.projectId,
				category: this.category
			});
		},

		/**
		 * 双击标题要触发的编辑标题状态
		 * 按 ESC 按键，或在文本框外点击便退出编辑状态
		 */
		EditTitle() {
			this.editTitle = true;
			this.editedTitle = this.title;
			Utils.ClickOutsideOrKeyPress(this.$refs.edit, (event, type) => {
				this.editTitle = false;
				if (type == 'click') {
					this.title = this.editedTitle;
				}
			}, { key: 'Escape' })
		},

		/**
		 * 更新标题
		 */
		UpdateTitle() {
			this.editTitle = false;
			this.title = this.editedTitle;
		}
	},
	mounted() {
		const element = document.getElementById(this.id);
		const sortable = Sortable.create(element, {
			group: {
				name: "Notes",
			},
			onEnd: (event) => {
				this.$store.dispatch('UpdateNotesOrder', {
					notes: document.getElementsByClassName('note'),
					note: event.item,
					tag: event.to.id.substr(0, event.to.id.indexOf('-')),
					oldIndex: event.oldIndex,
					newIndex: event.newIndex
				})
			},

			onMove: (event) => {
				// console.log(event.dragged)
			},
			animation: 100
		});
	}
}
</script>

<style scoped>

.content{
	display: grid;
	grid-template-columns: 1fr 1px;
	grid-template-rows: 48px 1fr;
	height: 100%;
}

/* 第一列第一行 */
.top{
	grid-column: 1 / 2;
	grid-row: 1 / 2;
}

/* 第一列第二行 */
.bottom{
	grid-column: 1 / 2;
	grid-row: 2 / 3;
}

.bottom {
	overflow-y: scroll;
	overflow-x: hidden;
	margin-right:3px;
	background-color: rgba(0,0,0,0);
	-webkit-background-clip: text;
	transition: background-color .2s;
}
.bottom:hover {
	background-color: rgba(102, 102, 102, 0.5);  
}
.bottom::-webkit-scrollbar-thumb {
	background-color: inherit;
}

/* 第二列 所有行 */
.vline{
	grid-column: 2 /3;
	grid-row: 1 /3
}

.title_card{
	border-radius: 0;
}

</style>

<style>


.content-category-title .content-category-icon{
	opacity: 0;
	transition: 0.2s!important;
}
.content-category-title:hover .content-category-icon{
	opacity: 1;
}
</style>
