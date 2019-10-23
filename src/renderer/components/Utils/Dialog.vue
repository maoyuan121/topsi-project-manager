<template>
    <v-card id="project-dialog" class="elevation-20" :class="color" :height="height">
        <slot></slot>
        <v-card-actions ref="card_actions" style="bottom:0px;right:0px;">
            <v-spacer></v-spacer>
            <v-btn v-if="!disableCancel" :flat="!cancelRaised" class="ma-0" :color="(cancelColor)?cancelColor:''" @click="Close">{{(cancelText)?cancelText:this.$lang.Get('cancel')}}</v-btn>

            <v-btn v-if="!disableAccept" :flat="!acceptRaised" class="ma-0" :color="(acceptColor)?acceptColor:'primary'" @click="Accept">{{(acceptText)?acceptText:this.$lang.Get('save')}}</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    name: "Dialog",
    props: {
        width: String, // 宽度
        height: String, // 高度
        cancelText: String, // 取消按钮的文本
        acceptText: String, // 确定按钮的文本
        disableAccept: Boolean, // 是否隐藏确定按钮
        disableCancel: Boolean, // 是否隐藏取消按钮
        acceptColor: String, //  确定按钮的颜色
        cancelColor: String, // 取消按钮的颜色
        acceptRaised: Boolean, // 确定按钮是否突出
        cancelRaised: Boolean // 取消按钮是否突出
    },
    data() {
        return {
            // 标题栏的高度
            top: 30
        };
    },
    methods: {
        /**
         * 点击关闭按钮触发
         */
        Close(event) {
            this.RollUp(() => this.$emit("close", event));
        },

        /**
         * 点击接受按钮触发
         */
        Accept(event) {
            this.RollUp(() => this.$emit("accept", event));
        },

        /**
         * 像上卷起对话框，但是不要关闭
         */
        RollUp(callback) {
            const element = document.getElementById("project-dialog");
			const height = element.getBoundingClientRect().height;
			
			element.classList.remove('dialog--reveal__animation');
			element.classList.add('dialog--hide__animation');

			// 在动画结束后执行 callback，避免闪烁
			setTimeout(callback, 190);
        }
    },
    computed: {
        // 颜色演示
        color() {
            return !this.$store.getters.isDarkMode ? "grey lighten-2" : "";
        }
    },
    mounted() {
        // dialog 最高占页面的九成
        const maxHeightRatio = 0.9;
        const actionsOffset = 0;
        const element = document.getElementById("project-dialog");

        const width = this.width;
        const offsetTop = this.top;
        const height = element.getBoundingClientRect().height;
        const minHeight = height;
        const maxHeight = window.innerHeight * maxHeightRatio;
        element.style.position = "fixed";
        element.style.left = window.innerWidth / 2 - width / 2 + "px";
        element.style.maxHeight = maxHeight + "px";

        element.style.width = width + "px";
        element.style.zIndex = 1;

        if (height >= maxHeight) {
            this.$refs.card_actions.style.position = "relative";
        }
        else {
            this.$refs.card_actions.style.position = "absolute";
        }

        if (minHeight < window.innerHeight)
            element.style.minHeight = minHeight + "px";

        window.addEventListener("resize", () => {
            const maxHeight = window.innerHeight * maxHeightRatio;
            element.style.left = window.innerWidth / 2 - width / 2 + "px";
            element.style.maxHeight = maxHeight + "px";
		});

		element.classList.remove('dialog--hide__animation');
		element.classList.add('dialog--reveal__animation');

        // Adjust the top if it's mac
        if (this.$store.getters.isMac) {
            this.top = 0;
        }
    }
};
</script>

<style lang="scss" scoped>
#project-dialog {
    position: fixed;
    border-radius: 0;
    overflow-y: auto;
}

#project-dialog button {
    border-radius: 0;
}

.dialog--reveal__animation{
	animation: 200ms ease reveal;
}

.dialog--hide__animation{
	animation: 200ms ease hide;
}

@keyframes reveal {
	0%{
		top: - 100%;
	}
	100%{
		top: 0;
	}
}

@keyframes hide {
	0%{
		top: 0;
	}

	100%{
		top: - 100%;
	}
}
</style>
