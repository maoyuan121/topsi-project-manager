import LangData from './Lang'

class Language {
    install(Vue, options) {
        Vue.prototype.$lang = {
            context: null,
            lang: 'en',

            /**
             * 根据键获取对应的翻译文字
             * @param {*String}} key 键 
             */
            Get(key) {
                return LangData[this.lang][key];
            },

            /**
             * 设置当前使用的语种
             * @param {*String} lang 语种 
             */
            SetCurrentLang(lang) {
                this.lang = lang;
            },

            /**
             * 获取支持的语种列表
             */
            GetLanguages() {
                return Object.keys(LangData);
            }
        }
    }
}

export default new Language();