// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme';

export default {
    ...DefaultTheme,
    async enhanceApp() {
        if (!import.meta.env.SSR) {
            const { loadOml2d } = await import('oh-my-live2d');
            loadOml2d({
                models: [
                    {
                        path: '/live2d/拷贝形象.model3.json',
                        position: [50,250],
                        scale: 0.05
                    }
                ],
                menus: {
                    items: []
                },
                dockedPosition: "right",
                transitionTime: 1000,
                tips: {
                    style: {
                        top: "450px",
                        left: "298px",
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        color: "#036261", // 文字颜色
                        border: "none"
                    }
                },

                statusBar: {
                    disable: true,
                }
            });
            // 等待 Live2D 模型加载后手动给 oml2d-stage 添加动画
            setTimeout(() => {
                const stage = document.querySelector('#oml2d-stage');
                console.log("滑入")
                if (stage) {
                    stage.style.animationName = "oml2d-stage-slide-in";
                    stage.style.animationDuration = "1000ms";
                    stage.style.animationFillMode = "forwards";
                }
            }, 1000); // 延迟等待 DOM 渲染
        }
    }
};