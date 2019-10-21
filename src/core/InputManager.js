class InputManager {
    /**
     * 设置快捷键
     * @param {Vue} context Vue context.
     */
    Initialize(context) {
        window.addEventListener('keypress', (event) => {
            if (event.code === 'KeyF') { // F 搜索对话框
                if (event.ctrlKey)
                    context.$store.dispatch('ToggleDialog', 'searchDialog');
            } else if (event.code === 'KeyD') { // D 帮助对话框
                if (event.ctrlKey)
                    context.$store.commit('ToggleShowHelper');
            } else if (event.code === 'KeyL') { // L 里程碑列表对话框
                if (event.ctrlKey)
                    context.$store.dispatch('ToggleDialog', 'milestonesList');
            } else if (event.code === 'KeyN') { // N 创建 Note 对话框
                if (event.ctrlKey)
                    context.$store.commit('CreateNoteDialog');
            }
        });
    }
}

export default new InputManager();