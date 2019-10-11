class EventManager {
	// 订阅一个事件
	Subscribe(event, callback) {
		document.querySelector('body').addEventListener(event, callback);
	}

	// 触发一个事件
	Emit(event) {
		document.querySelector('body').dispatchEvent(new Event(event));
	}
}

export default new EventManager();