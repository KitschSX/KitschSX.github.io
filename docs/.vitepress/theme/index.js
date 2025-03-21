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
                dockedPosition: "right"
            });
        }
    }
};