// 快捷键
export class KeyData {
	constructor(key, ctrlPress = false, altPress = false) {
		// 按键
		this.key = key;
		// 是否需要按住 ctrl 键
		this.ctrlPress = ctrlPress;
		// 是否需要按住 alt 键
		this.altPress = altPress;
	}
}

// 工具类
class Utils {
	/**
	 * 如果在 element 元素外点击，执行 callback
	 * @param {HTMLElement} element 在这个元素外点击
	 * @param {Function} callback 执行函数
	 */
	ClickOutside(element, callback) {
		let firstTime = true;
		const onclick = (event) => {
			if (firstTime) {
				firstTime = false;
				return;
			}
			if (!element.contains(event.target)) {
				callback(event);
				window.removeEventListener('click', onclick);
			}
		}
		window.addEventListener('click', onclick);
	}

	/**
	 * 和 @function ClickOutside 类似，但是额外监听了快捷键
	 * @param {HTMLElement} element 在这个元素外点击
	 * @param {Function} callback 执行函数
	 * @param {KeyData} keyData 监听的快捷键
	 */
	ClickOutsideOrKeyPress(element, callback, keyData) {
		const events = {
			onclick: null,
			keyup: null,
		}

		let firstTime = true;
		events.onclick = (event) => {
			if (firstTime) {
				firstTime = false;
				return;
			}
			if (!element.contains(event.target)) {
				callback(event, 'click');
				window.removeEventListener('click', events.onclick);
				window.removeEventListener('keyup', events.keyup);
			}
		}
		events.keyup = (event) => {
			if (event.key === keyData.key) {
				callback(event, 'keyup');
				window.removeEventListener('click', events.onclick);
				window.removeEventListener('keyup', events.keyup);
			}
		}

		window.addEventListener('click', events.onclick);
		window.addEventListener('keyup', events.keyup);
	}

	/**
	 * 将光标聚焦在文本输入框
	 * @param {HTMLElement} textField 要聚焦的文本输入框
	 */
	FocusTextField(textField) {
		setTimeout(() => {
			textField.getElementsByTagName('input')[0].focus()
		}, 100);
	}
}

export default new Utils();