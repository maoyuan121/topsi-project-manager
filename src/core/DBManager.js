import { DBUtils } from './database'

const EXTENSION = '.json';

class DBManager {
	constructor() {
		this.appDB = new DBUtils('database.json');
		this.databases = [];
		this.defaultFolder = this.appDB.GetValue('default_databases_folder', '') || null;

		this.appDB.GetAll('projects', 'id').forEach(project => this.Load(project.id, project.customPath || this.defaultFolder));
	}

	/**
	 * 获取主数据库
	 */
	GetAppDB() {
		return this.appDB;
	}

	/**
	 * 加载 1 个数据库到内存中
	 * @param {Number} id 数据库项目的 id
	 */
	Load(id, defaultFolder) {
		this.databases[id + EXTENSION] = new DBUtils(id + EXTENSION, defaultFolder);
	}

	Move(id, path) {
		const state = this.GetDB(id).context.getState();
		this.Load(id, path);
		this.GetDB(id).context.setState(state);
	}

	/**
	 * 根据给定的数据库 @param id 获取数据库
	 * @param {String} id ID of the project.
	 */
	GetDB(id) {
		return this.databases[id + EXTENSION];
	}

	/**
	 * 为项目创建 1 个新的数据库
	 * @param path 数据的路径
	 * @return 用于创建数据库的项目 id
	 */
	CreateDB(path) {
		const id = this.appDB.GetId('projects_id');
		const dbName = id + EXTENSION;
		this.databases[dbName] = new DBUtils(dbName, path);
		return id;
	}
}

export default new DBManager();