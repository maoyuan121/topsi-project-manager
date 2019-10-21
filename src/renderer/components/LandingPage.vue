<template>
    <div id="container">
        <div id="side" :class="this.$store.getters.appColor">
            <Drawer />
        </div>
        <div id="content">
            <SearchBar v-if="showSearch" />
            <Helper v-if="showHelper" />
            <FirstUse v-if="firstTimeUse"></FirstUse>
            <Projects v-else-if="displayProjects" />
            <Notes v-else />
        </div>
        <!-- The titlebar needs to be on top of the other divs, so it's the last one to be rendered. -->
        <Titlebar v-if="!macos" />
    </div>

</template>

<script>
import Helper from "./Helper.vue";
import AppManager from "../../core/ApplicationManager";
import InputManager from "../../core/InputManager";

import Titlebar from "./Titlebar.vue";
import Notes from "./notes/Notes.vue";
import Drawer from "./drawer/Drawer.vue";
import Projects from "./projects/Projects.vue";
import FirstUse from "./Temp/FirstUse.vue";
import SearchBar from "./SearchBar.vue";

export default {
    name: "landing-page",
    components: {
        Titlebar,
        FirstUse,
        Projects,
        Notes,
        Drawer,
        SearchBar,
        Helper
    },
    computed: {
        // 是否显示所有项目
        // 如果当前没有打开某一个项目的话就显示所有项目
        displayProjects() {
            return !this.$store.getters.isProjectOpened;
        },

        // 是否是第一次使用
        firstTimeUse() {
            return this.$store.getters.isFirstTimeUse;
        },

        // 是否显示搜索框
        showSearch() {
            return this.$store.getters.isShowSearch;
        },

        // 是否显示帮助
        showHelper() {
            return this.$store.getters.isShowHelper;
        },

        // 是否是 macos
        macos() {
            return this.$store.getters.isMac;
        }
    },
    methods: {
        KeyUp(event) {}
    },
    mounted() {
        // 设置 landing page 的布局
        AppManager.SetupLandingPage(
            this.macos ? 0 : 30,
            "container",
            "side",
            "content"
        );
        
        // 设置快捷键
        InputManager.Initialize(this);
    }
};
</script>

<style>
#side {
    overflow-y: auto;
    overflow-x: hidden;
}

#content {
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
