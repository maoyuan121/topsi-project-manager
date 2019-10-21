import DBManager from "../../../core/DBManager";
import Notifications from '../../../core/Notifications'

/**
 * Note 的数据结构
 */
class Note {
    constructor(project_id, title, description, category, color, milestone_id, tags) {
        this.id = -1;
        this.project_id = project_id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.color = color;
        this.milestone_id = milestone_id;
        this.tags = tags || [];
        this.order = 0;
        this.tasks = [];
    }
}

const state = {
    // Flag to show or hide a menu for items
    menu: {
        show: false,
        x: 0,
        y: 0,
        note: null
    },

    // 要更新的 note 
    updatedNote: null,

    // 打开的 note
    openedNote: null,

    // 当前项目的所有 note
    notes: null,

    // 当前打开项目的 id
    projectId: -1,

    // 里程碑
    milestoneId: 0,

    // 是否显示 task
    displayTasks: DBManager.GetAppDB().GetValue('display_tasks', true),
}

const getters = {
    // 当前项目的所有 note
    notes(state) {
        return state.notes;
    },

    // 是否显示 task
    isDisplayTasks(state) {
        return state.displayTasks;
    }
}

const mutations = {
    /**
     * 创建 Note，并保存到数据库
     * and store it in the database. 
     * @param {*State} state NotesStore state.
     * @param {*Note} data Contains the note's project id, title, description and category.
     */
    CreateNote(state, data) {
        // Make sure the note's data is valid.
        if (data.project_id == null || data.title == null || data.description == null || data.category == null || data.milestoneId == null) {
            Notifications.Error('CreateNote', "Cannot create a note with invalid data " + data);
        }

        // Create the new note to store.
        let note = new Note(data.project_id, data.title, data.description, data.category, data.color, data.milestoneId, data.tags)

        const database = DBManager.GetDB(data.project_id);

        // 设置 note 的排序号
        note.order = state.notes.filter(note => note.category == data.category).length;

        // Getting the new ID for the note.
        note.id = database.GetId('notes_id');

        // Store the note in the database.
        database.Write('notes', note);
    },

    /**
     * 更新 note 的排序号和分类
     * @param {*} data Contains the HTMLElement of the note in @param data.note, the receiving tag in * @param data.tag and the old and new indices in @param data.newIndex and @param data.oldIndex
     * respectively.
     */
    UpdateNotesOrder(state, data) {
        if (data.note == null || data.tag == null || data.oldIndex == null || data.newIndex == null) {
            throw new Error('UpdateNotesOrder: All or some data attributes missing.');
        }

        // Function to sanitize the HTMLElement ID of a note. 
        const SanitizeNoteId = (id) => {
            return id.substr(id.indexOf('-') + 1, id.length - 1);
        }

        const db = DBManager.GetDB(state.projectId);

        // 获取当前项目于的所有 note
        const projectNotes = db.GetAll('notes');
        // 获取当前项目指定里程碑的 note
        const currentNotes = projectNotes.filter(note => note.milestone_id == state.milestoneId);

        // Getting the note that has been moved.
        const note = currentNotes.filter(n => n.id == SanitizeNoteId(data.note.id))[0];

        // 获取同一个分类下的 note 
        const sourceNotes = currentNotes.filter(n => n.category == note.category);
        sourceNotes.splice(data.oldIndex, 1);

        // Adding the note to the new category/
        let destNotes = null


        // If the note stays in the same category, then the source and destinatimn array are the same.
        if (note.category == data.tag)
            destNotes = sourceNotes
        else
            destNotes = currentNotes.filter(n => n.category == data.tag);

        // 插入新的 note 到合适的位置
        destNotes.splice(data.newIndex, 0, note);

        // This update the new note of the receiving category with the new order.
        for (let i = 0; i < destNotes.length; i++) destNotes[i].order = i;

        note.category = data.tag;

        // Save the new order in the database.
        db.SetValue('notes', projectNotes);
    },

    /**
     * 设置要更新的 note
     * @param {*State} state NotesStore state.
     * @param {*Note} data Contains the note to update.
     */
    SetUpdatedNote(state, note) {
        if (note == null) {
            throw new Error("SetUpdatedNote: note parameter required.")
        }

        state.updatedNote = note;
    },

    /**
     * 更新 note，保存到数据库
     * @param {*State} state NotesStore state.
     * @param {*Note} data Contains the note's project id, title, description and category.
     */
    UpdateNote(state, data) {
        // 数据验证
        if (data.id == null || data.project_id == null || data.title == null || data.description == null || data.category == null || data.milestone_id == null) {
            throw new Error("Cannot update a note with invalid data ", data);
        }

        // 更新时间戳
        data.updated_timestamp = Date.now();

        const database = DBManager.GetDB(data.project_id);

        // 保存到数据库
        database.Update('notes', {
            id: data.id
        }, data);
    },


    /**
     * 设置打开的 note 
     * @param {*State} state NotesStore state.
     * @param {*Note} data Contains the note to visualize.
     */
    SetOpenedNote(state, note) {
        if (note == null) {
            throw new Error("SetOpenedNote: note parameter required.")
        }
        state.openedNote = note;
    },

    SetShowMenu(state, value) {
        state.menu.show = value;
    },

    SetMenuX(state, value) {
        state.menu.x = value;
    },

    SetMenuY(state, value) {
        state.menu.y = value;
    },

    SetMenuData(state, data) {
        state.menu.show = data.show;
        state.menu.x = data.x;
        state.menu.y = data.y;
        state.menu.note = data.note;
    },

    /**
     * 更新 notes 数组
     * @param {Object} state Current state of the Application.
     * @param {Object} data Contains the data about the project to retrieve the notes for.
     */
    UpdateNotes(state, data) {
        state.projectId = data.projectId;
        state.milestoneId = data.milestoneId;
        state.notes = DBManager.GetDB(data.projectId).GetAll('notes', 'order', [{
            milestone_id: data.milestoneId
        }]);
    },

    /**
     * 删除 note 
     * @param {Object} state Current state of the Application.
     * @param {Object} note Note to delete.
     */
    DeleteNote(state, note) {
        DBManager.GetDB(note.project_id).Remove('notes', {
            id: note.id
        });
    },

    /**
     * 添加一个 task 到当前打开的 note
     * @param {Object} state Current state of the Application.
     * @param {String} task Content of the task to add.
     */
    AddTask(state, data) {
        if (state.openedNote == null || data.task == null || data.task.length <= 0 || data.projectId < 0 || data.projectId == null) {
            Notifications.Error('Add task', `Cannot add task ${data.task}`);
        }

        const projectDB = DBManager.GetDB(data.projectId);
        state.openedNote.tasks = state.openedNote.tasks || [];
        state.openedNote.tasks.push({
            id: projectDB.GetId('tasks_id'),
            content: data.task,
            done: false
        });

        projectDB.Update('notes', {
            id: state.openedNote.id
        }, state.openedNote);
    },

    /**
     * toggle 一个 task 的完成中台
     * @param {Object} state Current state of the Application.
     * @param {Object} task Task to update. 
     */
    ToggleTask(state, data) {
        if (state.openedNote == null || data.task.id == null || data.projectId < 0 || data.projectId == null || state.openedNote.tasks == null) {
            Notifications.Error('Add task', `Cannot add task ${data.task}`);
        }

        const projectDB = DBManager.GetDB(data.projectId);
        const task = state.openedNote.tasks.filter(task => task.id == data.task.id)[0];
        task.done = !task.done;
        projectDB.Update('notes', {
            id: state.openedNote.id
        }, state.openedNote);
    },

    // toggle 是否显示 tasks
    ToggleDisplayTasks(state) {
        state.displayTasks = !state.displayTasks;
        DBManager.GetAppDB().SetValue('display_tasks', state.displayTasks);
    },

    // 更新 task 的排序
    ReorderTasks(state, data) {
        if (state.openedNote == null || data.newIndex == null || data.oldIndex < 0) {
            Notifications.Error('Redorder Task', `Cannot reorder task ${data.task}`);
        }

        const newIndex = data.newIndex;
        const oldIndex = data.oldIndex;

        const projectDB = DBManager.GetDB(state.projectId);
        // const task = state.openedNote.tasks.filter(task => task.id == data.task.id)[0];
        // task.done = !task.done;
        const tmp = state.openedNote.tasks[oldIndex];
        state.openedNote.tasks[oldIndex] = state.openedNote.tasks[newIndex];
        state.openedNote.tasks[newIndex] = tmp;

        projectDB.Update('notes', {
            id: state.openedNote.id
        }, state.openedNote);
    },

    // 更新 note 所属分类
    UpdateNotesCategory(state, data) {
        if (data.projectId == null || data.category == null || data.newTitle == null) {
            Notifications.Error('UpdateNotesCategory', `Cannot update note's category. ${data}`);
        }

        const projectDB = DBManager.GetDB(data.projectId);

        const category = data.newTitle.replace(/ /g, '_').toLowerCase();

        // Update the categories
        state.notes.forEach(note => {
            if (note.category == data.category.tag) {
                note.category = category;
            }
        })

        projectDB.SetValue('notes', state.notes);
    }
}

const actions = {
    CreateNote(context, data) {
        context.commit('CreateNote', data);

        // Update the state
        context.commit('UpdateNotes', {
            projectId: data.project_id,
            milestoneId: data.milestoneId
        });
    },

    UpdateNote(context, data) {
        context.commit('UpdateNote', data);

        // Retrieve the new values as saved from the database. 
        context.commit('UpdateNotes', {
            projectId: state.projectId,
            milestoneId: state.milestoneId
        });
    },

    DeleteNote(context, note) {
        context.commit('DeleteNote', note);

        // Retrieve the new values as saved from the database. 
        context.commit('UpdateNotes', {
            projectId: state.projectId,
            milestoneId: state.milestoneId
        });
    },

    UpdateNotesOrder(context, data) {
        context.commit('UpdateNotesOrder', data);

        // Retrieve the new values as saved from the database. 
        context.commit('UpdateNotes', {
            projectId: state.projectId,
            milestoneId: state.milestoneId
        })
    },

    EditNote(context, note) {
        context.commit('SetUpdatedNote', note);
        context.commit('UpdateNoteDialog');
    },

    VisualizeNote(context, note) {
        context.commit('SetOpenedNote', note);
        context.commit('OpenNoteDialog');
    },

    AddTask(context, task) {
        context.commit('AddTask', {
            projectId: context.getters.openedProjectId,
            task: task
        });
    },

    ToggleTask(context, task) {
        context.commit('ToggleTask', {
            projectId: context.getters.openedProjectId,
            task: task
        })
    },

    ToggleDisplayTasks(context) {
        context.commit('ToggleDisplayTasks');
    },

    ReorderTasks(context, data) {
        context.commit('ReorderTasks', data);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}