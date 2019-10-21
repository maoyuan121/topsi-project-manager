import DBManager from "../../../core/DBManager";

import Notifications from '../../../core/Notifications'

// 里程碑数据结构
class Milestone {
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }
}

const state = {
    // 里程碑集合
    milestones: null,
};

const getters = {
    /**
     * 获取一个项目的所有里程碑
     * @param id ID of the project to retrieve the milestones for.
     */
    milestones(state) {
        return state.milestones;
    }
}

const mutations = {
    /**
     * 创建一个里程碑，并保存在数据库中
     * 会检查 data 
     * @param {*State} state State of MilestoneStore
     * @param {*Milestone} data Contains the data about the milestone to create.
     */
    CreateMilestone(state, data) {
        // Check if the data is valid.
        if (data.projectId == null || data.name == null) {
            Notifications.Error('CreateMilestone', 'A valid data attribute is required');
        }

        const projectDB = DBManager.GetDB(data.projectId);
        // Create the new milestone object
        const milestone = new Milestone(projectDB.GetId('milestones_id'), data.name);

        // Store the new milestone object in the database.
        projectDB.Write('milestones', milestone);

        // 更新 milestones
        mutations.UpdateMilestones(state, data);
    },

    // 更新当前项目打开的里程碑 id
    UpdateProjectMilestoneId(state, data) {
        // Check if the data is valid.
        if (data.projectId == null || data.milestoneId == null) {
            Notifications.Error('UpdateProjectMilestoneId', 'Cannot set invalid milestone data to project.');
        }

        const projectDB = DBManager.GetDB(data.projectId);
        const projectInfo = projectDB.GetValue('info');

        projectInfo.opened_milestone_id = data.milestoneId;

        projectDB.SetValue('info', projectInfo);
        DBManager.GetAppDB().Update('projects', {
            id: projectInfo.id
        }, projectInfo);
    },

    /**
     * 从当前项目的数据库中获取所有里程碑
     */
    UpdateMilestones(state, data) {
        if (data.projectId == null) {
            throw new Error('UpdateMilestones: Project id required.');
        }

        state.milestones = DBManager.GetDB(data.projectId).GetAll('milestones', 'id');
    }
}

export default {
    state,
    getters,
    mutations