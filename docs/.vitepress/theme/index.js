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
                        path: '/live2d/接头5.model3.json',
                        position: [100,500]
                    }
                ],
                menus: {
                    items: []
                },
                initialStatus: "sleep",
                dockedPosition: "right",
                transitionTime: 3000,
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
        }
    }
};