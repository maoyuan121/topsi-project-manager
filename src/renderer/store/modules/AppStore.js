import DBManager from '../../../core/DBManager';

import Notifications from '../../../core/Notifications'

const state = {
	// 包含所有对话框的 flag
	dialogs: {
		createProject: false,
		createNote: false,
		showSettings: false,
		updateNote: false,
		visualizeDialog: false,
		exportProject: false,
		updateProject: false,
		milestonesList: false,
		searchDialog: false,
	},

	// 目前打开项目的 ID
	openedProjectId: -1,

	// 当前里程碑的 ID
	currentMilestoneId: 0,

	// 主 drawer 的宽度Width of the main drawer
	drawerWidth: 200,

	// 是否是暗黑模式
	darkMode: DBManager.GetAppDB().GetValue('dark_mode', false),

	// 应用的基本颜色
	baseColor: DBManager.GetAppDB().GetValue('application_color', 'indigo'),

	// 是否是暗黑工具栏
	darkenToolbar: DBManager.GetAppDB().GetValue('darken_toolbar', false),

	// github profile 信息
	gitUserInfo: DBManager.GetAppDB().GetValue('git_user_info', {}),

	// 是否是第一次打开应用
	firstTimeUse: DBManager.GetAppDB().GetValue('first_time_use', true),

	// 搜索内容
	searchContent: '',

	// 是否显示帮助页面
	showHelper: false,

	// 当前打开项目的名字
	projectName: '',

	// 当前选择的语言
	selectedLanguage: DBManager.GetAppDB().GetValue('lang', 'en'),
}

const mutations = {
	// 打开创建项目对话框
	CreateProjDialog(state) {
		mutations.OpenDialog(state, 'createProject');
	},

	// 打开创建 Note 对话框
	CreateNoteDialog(state) {
		mutations.OpenDialog(state, 'createNote');
	},

	// 打开编辑 Note 对话框
	UpdateNoteDialog(state) {
		mutations.OpenDialog(state, 'updateNote');
	},

	// 打开 Note 对话框
	OpenNoteDialog(state) {
		mutations.OpenDialog(state, 'visualizeDialog');
	},

	// 打开项目
	OpenProject(state, id) {
		state.openedProjectId = id;
		// Set the default milestone when opening a project.
		if (id >= 0) {
			const info = DBManager.GetDB(id).GetValue('info')
			state.projectName = info.title;

			state.currentMilestoneId = info.opened_milestone_id;
		} else {
			state.projectName = '';
		}
		state.searchContent = ''; // Clear the search content, searches are different from project to notes.	
	},

	// 设置是否使用暗黑模式
	SetDarkMode(state, value) {
		state.darkMode = value;
		DBManager.GetAppDB().SetValue('dark_mode', value);
	},

	// 显示配置
	ShowSettings(state, value) {
		mutations.OpenDialog(state, 'showSettings');
	},

	// 设置用户名
	SetUsername(state, username) {
		state.gitUserInfo.username = username;
		DBManager.GetDB().SetValue('git_user_info', state.gitUserInfo);
	},

	// 设置 toekn
	SetToken(state, token) {
		state.gitUserInfo.repository_token = token;
		DBManager.GetDB().SetValue('git_user_info', state.gitUserInfo);
	},

	// 设置 gistId
	SetGistId(state, gistId) {
		state.gitUserInfo.gist_id = gistId;
		DBManager.GetDB().SetValue('git_user_info', state.gitUserInfo);
	},

	// 设置里程碑 Id
	SetCurrentMilestoneId(state, id) {
		state.currentMilestoneId = id;
	},

	// 设置应用的基本颜色
	SetAppColor(state, color) {
		state.baseColor = color;
		DBManager.GetAppDB().SetValue('application_color', color);
	},

	// 切换工具栏是否为暗黑模式
	ToggleDarkenToolbar(state) {
		state.darkenToolbar = !state.darkenToolbar;
		DBManager.GetAppDB().SetValue('darken_toolbar', state.darkenToolbar);
	},

	// 打开导出项目对话框
	ExportProjDialog(state) {
		mutations.OpenDialog(state, 'exportProject');
	},

	// 设置为不是第一次使用
	DisableFirstTimeUse(state) {
		DBManager.GetAppDB().SetValue('first_time_use', false);
		state.firstTimeUse = false;
	},

	// 安装应用
	SetupApplication(state, data) {
		if (data.defaultFolder == null) {
			Notifications.Error('SetupApplication', 'A valid data parameter required :' + data);
		}
		DBManager.GetAppDB().SetValue('default_databases_folder', data.defaultFolder);
	},

	// 添加标签
	// todo 貌似没判断标签是否重复被添加呀
	AddTag(state, tag) {
		if (tag == null || tag.tag.length <= 0) {
			Notifications.Error('AddTag', `tag "${tag}" is invalid`);
		}
		if (state.openedProjectId < 0) {
			Notifications.Error('AddTag', 'A project must be opened to add a tag');
		}
		const db = DBManager.GetDB(state.openedProjectId);
		const tags = db.GetValue('tags', []);
		tags.push(tag);
		db.SetValue('tags', tags);
	},

	// 删除标签
	RemoveTag(state, tag) {
		if (tag == null || tag.tag.length <= 0) {
			Notifications.Error('RemoveTag', `tag "${tag}" is invalid`);
		}
		if (state.openedProjectId < 0) {
			Notifications.Error('RemoveTag', 'A project must be opened to add a tag');
		}
		const db = DBManager.GetDB(state.openedProjectId);
		let tags = db.GetValue('tags', []);

		let index = -1;
		for (let i = 0; i < tags.length; i++)
			if (tags[i].tag == tag.tag) {
				index = i;
				break;
			}
		if (index == -1) {
			Notifications.Error('RemoveTag', 'Could not find tag ' + tag);
		}
		
		tags.splice(index, 1);
		db.SetValue('tags', tags);
	},

	// 打开/关闭编辑项目对话框
	ToggleUpdateProject(state) {
		mutations.OpenDialog(state, 'updateProject');
	},

	// 设置搜索内容
	SetSearchContent(state, value) {
		state.searchContent = value;
	},

	// 打开/关闭里程碑列表对话框
	ToggleMilestonesList(state, value) {
		mutations.OpenDialog(state, 'milestonesList', value);
	},

	// 打开/关闭帮助对话框
	ToggleShowHelper(state, value) {
		if (value != null)  {
			state.showHelper = value;
		}
		else {
			state.showHelper = !state.showHelper;
		}
	},

	/**
	 * 打开对话框
	 * @param {*} state 
	 * @param {*} dialog 对话框类型
	 * @param {*} value 
	 */
	OpenDialog(state, dialog, value) {
		for (let property in state.dialogs) {
			(property == dialog) ? state.dialogs[property] = value || !state.dialogs[property] : state.dialogs[property] = false;
		}
	},

	/**
	 * 设置当前语言
	 * @param {*} state 
	 * @param {*} language 
	 */
	SetCurrentLanguage(state, language) {
		if (language == null || language.length <= 0) Notifications.Error('Set Language', 'Cannot set language with invalid data');
		DBManager.GetAppDB().SetValue('lang', language);
		state.selectedLanguage = language;
	}
}

const getters = {
	/**
	 * 是否是苹果电脑
	 */
	isMac() {
		return DBManager.GetAppDB().GetValue('isMac', false);
	},

	/**
	 * 是都打开了一个项目
	 * @param {*State} state 
	 */
	isProjectOpened(state) {
		return state.openedProjectId != -1;
	},

	/**
	 * 应用的基本颜色
	 */
	appColor(state) {
		return state.baseColor;
	},

	/**
	 * 工具栏是否是暗黑模式
	 * @param {*State} state 
	 */
	darkenToolbar(state) {
		return state.darkenToolbar;
	},

	/**
	 * 应用是否是暗黑模式
	 * @param {*State} state 
	 */
	isDarkMode(state) {
		return state.darkMode;
	},

	/**
	 * 主 Drawer 的宽度
	 * @param {*State} state 
	 */
	drawerWidth(state) {
		return state.drawerWidth;
	},

	/**
	 * 是否是第一次使用
	 * @param {*State} state 
	 */
	isFirstTimeUse(state) {
		return state.firstTimeUse;
	},

	/**
	 * 获取打开项目的所有标签
	 * @param {*State} state 
	 */
	projectTags(state) {
		if (state.openedProjectId < 0) Notifications.Error('projectTags', 'A project must be opened to get its tags');
		return DBManager.GetDB(state.openedProjectId).GetValue('tags', []);
	},

	isShowSearch(state) {
		return state.dialogs.searchDialog;
	},

	isUpdateProject(state) {
		return state.dialogs.updateProject;
	},

	/**
	 * 获取当前项目
	 */
	currentProject(state) {
		return (context) => context.$store.getters.getProjectById(state.openedProjectId);
	},

	/**
	 * 搜索内容
	 * @param {*State} state 
	 */
	searchContent(state) {
		return state.searchContent;
	},

	/**
	 * 当前项目 ID
	 * @param {*State} state 
	 */
	openedProjectId(state) {
		return state.openedProjectId;
	},

	defaultPath(state) {
		return DBManager.GetAppDB().GetValue('default_databases_folder', '');
	},

	isMilestonesList(state) {
		return state.dialogs.milestonesList;
	},

	/**
	 * 当前项目的所有里程碑
	 * @param {*State} state 
	 */
	currentProjectMilestones(state) {
		return () => DBManager.GetDB(state.openedProjectId).GetAll('milestones', 'id');
	},

	/**
	 * 当前里程碑的 ID
	 * @param {*State} state 
	 */
	currentMilestoneId(state) {
		return state.currentMilestoneId;
	},

	isShowHelper(state) {
		return state.showHelper;
	},

	/**
	 * 项目名
	 * @param {*State} state 
	 */
	projectName(state) {
		return state.projectName;
	},

	/**
	 * 选择的语言
	 * @param {*State} state 
	 */
	selectedLanguage(state) {
		return state.selectedLanguage;
	}
}

const actions = {
	ToggleDialog(context, dialogName) {
		context.commit('OpenDialog', dialogName);
	},

	RemoveTag(context, tag) {
		context.commit('RemoveTag', tag);
	},

	AddTag(context, tag) {
		context.commit('AddTag', tag);
	},

	SetProjectMilestone(context, data) {
		context.commit('UpdateProjectMilestoneId', data);
		context.commit('SetCurrentMilestoneId', data.milestoneId);
		context.commit('UpdateNotes', data)
	},

	CreateMilestone(context, data) {
		context.commit('CreateMilestone', data);
	},

	SetupApplication(context, data) {
		context.commit('SetupApplication', data)
		context.commit('DisableFirstTimeUse');
	},

	SetCurrentLanguage(context, language) {
		context.commit('SetCurrentLanguage', language);
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}