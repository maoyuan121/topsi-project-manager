import lowdb from 'lowdb'
import path from 'path'
import fs from 'fs'
import os from 'os'

// Adapter
const FileSync = require('lowdb/adapters/FileSync');


// 包含所有数据库读写的函数
export class DBUtils {
	/**
	 * 
	 * @param {string} name  数据库文件名
	 * @param {string} defaultPath 路径
	 */
	constructor(name, defaultPath) {
		// 路径
		const dir = process.platform == 'darwin' ? path.join(os.homedir(), '.topsi') : path.resolve('.');
		if (defaultPath == null || defaultPath.length <= 0) {
			this.dataPath = path.join(dir, 'data/');
		} else {
			this.dataPath = defaultPath;
		}
		const dbFilePath = path.join(this.dataPath, name);

		// 确保数据库文件夹存在
		if (!fs.existsSync(this.dataPath)){
			if(process.platform == 'darwin' && !fs.existsSync(dir)) fs.mkdirSync(dir);
			fs.mkdirSync(this.dataPath);
		}
		const adapter = new FileSync(dbFilePath);
		this.context = new lowdb(adapter);
	}

	/**
	 * 写
	 * @param {*string} key 键
	 * @param {*any} value 值
	 */
	SetValue(key, value) {
		this.context.set(key, value).write();
	}

	/**
	 * 获取一个新的数据库 id，自增的
	 * @param {*string} key 获取 id 的键
	 */
	GetId(key) {
		const id = this.GetValue(key, 0);
		this.SetValue(key, id + 1);
		return id;
	}


	//Get a value form the database.
	//@param key Key of the value to fetch.
	//@param defaultValue [optional] Default value to set if the value is not found.
	GetValue(key, defaultValue = '') {
		let value = this.context.get(key).value();
		if (value == null) {
			this.SetValue(key, defaultValue);
			return this.GetValue(key, defaultValue);
		}
		return value;
	}

	//Write and object in the Database and save it.
	//@param table Table to store the object into.
	//@object Object to store.
	Write(table, object) {
		// Create table if not set
		if (this.context.get(table).value() == null)
			this.SetValue(table, []);

		// Adding timestamp.
		object.timestamp = Date.now();

		// Writing the object
		this.context.get(table).push(object).write();
	}

	/**
	 * This function delete entries from the Database if found.
	 * @param {*string} table Table of the entries to delete. 
	 * @param {*object} condition Condition to test each entry with before deleting.
	 */
	Remove(table, condition) {
		this.context.get(table).remove(condition).write();
	}

	/**
	 * 保存当前状态
	 */
	Save() {
		this.context.write();
	}

	// 获取一个表中的所有 entity
	//@param table 表
	//@orderBy [optional] 用那个字段排序
	GetAll(table, orderBy = null, filters = null) {
		let result = this.context.get(table);

		// Order the result if specified
		if (orderBy != null)
			result = result.orderBy(orderBy);

		// Filter the query if required.
		if (filters != null)
			for (var i = 0; i < filters.length; i++)
				result = result.filter(filters[i]);

		return result.value();
	}

	// 从数据库中获取一个 entity
	// @param table 表
	// @param id entity 的主键
	GetById(table, id) {
		return this.context.get(table).filter({
			id: id
		}).first().value();
	}

	// 按过滤条件从数据库中获取一个 entity
	// @param table 表
	// @param filter 过滤条件
	GetBy(table, filter) {
		return this.context.get(table).filter(filter).first().value();
	}

	/**
	 * 更新
	 * @param {*string} table 表
	 * @param {*int} key 键
	 * @param {*object} data 值
	 */
	Update(table, key, data) {
		// 时间戳
		data.timestamp = Date.now();

		// 更新数据
		const t = this.context.get(table);
		if (key != null) t.find(key).assign(data).write();
		else t.assign(data).write();
	}

	/**
	 * 获取数据库文件的绝对路径
	 * @return {*string} 数据库的路径
	 */
	GetPath() {
		return dbFilePath;
	}
}