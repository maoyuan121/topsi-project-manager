// 默认通知显示多少 ms
const DEFAULT_TIME = 5000;

// 通知对象
export class NotificationEntry {
    /**
     * 
     * @param {String} title 标题 
     * @param {String} description 描述
     * @param {Number} timeout 默认通知展示多少 ms
     * @param {String} color css 类 
     */
    constructor(title, description, timeout, color) {
        this.title = title;
        this.description = description;
        this.timeout = timeout;
        this.color = color;
    }
}

// 通知管理器
// 里面放了一个队列数组，提供方法往队列里面插入通知通知数据， 每隔 150 ms 从队列里面取出数据，弹出通知
class Notifications {
    constructor() {
        // 包含所有要显示的通知
        this.queue = [];

        // 是否准备显示了
        this.ready = true;

        // Loop and display the notifications in the queues
        const queuId = setInterval(() => {
            if (this.ready && this.queue.length > 0) {
                this.ready = false;
                this.Notify(this.queue.pop());
            }
        }, 150);
    }

    /**
     * 	添加一个信息提示通知
     * @param {String} title 标题
     * @param {String} description 内容
     * @param {Number} timout 展示多少 ms
     */
    Info(title, description = '', timeout = DEFAULT_TIME) {
        this.queue.push(new NotificationEntry(title, description, timeout, 'primary white--text'));
    }

    /**
     * 	添加一个错误提示通知
     * @param {String} title 标题
     * @param {String} description 内容
     * @param {Number} timout 展示多少 ms
     */
    Error(title, description = '', timeout = DEFAULT_TIME) {
        this.queue.push(new NotificationEntry(title, description, timeout, 'error white--text'));
        throw new Error(`${title} ${description}`);
    }


    /**
     * 	添加一个警告提示通知
     * @param {String} title 标题
     * @param {String} description 内容
     * @param {Number} timout 展示多少 ms
     */
    Warning(title, description = '', timeout = DEFAULT_TIME) {
        this.queue.push(new NotificationEntry(title, description, timeout, 'warning white--text'));
    }


    /**
     * 	添加一个成功提示通知
     * @param {String} title 标题
     * @param {String} description 内容
     * @param {Number} timout 展示多少 ms
     */
    Success(title, description = '', timeout = DEFAULT_TIME) {
        this.queue.push(new NotificationEntry(title, description, timeout, 'success white--text'));
    }


    /**
     * 通知
     * @param {NotificationEntry} entry Contains the info about the notification.
     */
    Notify(entry) {
        const nElement = document.createElement('div');
        document.querySelector('body').appendChild(nElement);

        // 通知层的样式设置
        const color = entry.color;
        const left = window.innerWidth - 260;
        nElement.className = color + ' notification-card';
        nElement.style.position = 'fixed';
        nElement.style.width = '250px';
        nElement.style.left = left + 'px';

        // 通知层的标题和内容
        const eTitle = document.createElement('div');
        eTitle.className = 'v-card__title title pa-2';
        eTitle.innerHTML = entry.title;
        const eDesc = document.createElement('div');
        eDesc.className = 'v-card__text subheading px-2';
        eDesc.innerHTML = (entry.description) ? entry.description : '';
        nElement.appendChild(eTitle);
        nElement.appendChild(eDesc);

        // 计算高度
        const height = nElement.clientHeight;
        const totalHeight = height + 10;

        // When a new notification is added, make sure to move all the other.
        const nots = document.getElementsByClassName('notification-card');
        for (let i = 0; i < nots.length; i++) {
            const item = nots.item(i);
            const rect = item.getBoundingClientRect();

            let moveTop = 0;
            const moveId = setInterval(() => {
                moveTop += 6;
                item.style.top = rect.top - moveTop + 'px';
                if (moveTop >= totalHeight) {
                    item.style.top = rect.top - totalHeight + 'px';
                    clearInterval(moveId);
                }
            })
        }

        // Entering animation.
        let enterTop = 0;
        const enterId = setInterval(() => {
            enterTop += 6;
            nElement.style.top = window.innerHeight - enterTop + 'px';
            if (enterTop >= totalHeight) {
                nElement.style.top = window.innerHeight - totalHeight + 'px';
                this.ready = true;
                clearInterval(enterId);
            }
        })
        nElement.style.top = window.innerHeight - totalHeight + 'px';

        // Exiting animation.
        setTimeout(() => {
            let outLeft = left;
            const outId = setInterval(() => {
                outLeft += 6;
                nElement.style.left = outLeft + 'px';
                if (outLeft > window.innerWidth) {
                    document.querySelector('body').removeChild(nElement);
                    clearInterval(outId);
                }
            })

        }, entry.timeout ? entry.timeout : DEFAULT_TIME);
    }
}


export default new Notifications();