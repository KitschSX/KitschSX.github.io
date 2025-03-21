<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as PIXI from "pixi.js";

const canvasContainer = ref(null);
const basePath = import.meta.env.BASE_URL;
let app = null;
let model = null;

// ✅ 核心修复点：增强Ticker初始化
async function initializeTickerSystem() {
  // 确保Ticker系统存在
  if (!PIXI.Ticker.shared) {
    PIXI.Ticker.shared = new PIXI.Ticker();
    PIXI.Ticker.shared.autoStart = true;
    PIXI.Ticker.shared.start();
  }
}

async function loadLive2DModel() {
  try {
    // ✅ 第一步：初始化PIXI应用
    app = new PIXI.Application({
      width: 300,
      height: 300,
      backgroundAlpha: 0,
      antialias: true
    });
    canvasContainer.value.appendChild(app.view);

    // ✅ 第二步：强制初始化Ticker系统
    await initializeTickerSystem();

    // ✅ 第三步：加载Live2D核心库
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${basePath}live2dcubismcore.min.js`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    // ✅ 第四步：动态加载显示模块并注册Ticker
    const {Live2DModel} = await import("pixi-live2d-display/cubism4");
    Live2DModel.registerTicker(PIXI.Ticker.shared);

    // ✅ 第五步：加载模型（关键修复点）
    model = await Live2DModel.from(`${basePath}live2d/接头5.model3.json`, {
      autoUpdate: true, // 必须显式启用自动更新
      _checkWebGL: false // 禁用内部WebGL检查（已由PIXI处理）
    });

    // ✅ 模型配置
    model.scale.set(0.15);
    model.anchor.set(0.5, 0.5);
    model.position.set(app.screen.width / 2, app.screen.height / 2);
    model.interactive = true;

    // ✅ 交互事件处理
    model.on('pointerdown', () => {
      model.motion('Tap');
    });

    app.stage.addChild(model);
  } catch (err) {
    console.error("❌ 加载失败:", err);
    showError(err);
  }
}

function showError(err) {
  canvasContainer.value.innerHTML = `
    <div class="error">
      <p>Live2D初始化失败：${err.message}</p>
      ${err.message.includes('add') ?
      '<p>提示：请检查Ticker系统是否正常初始化</p>' : ''}
    </div>
  `;
}

onMounted(() => {
  canvasContainer.value.innerHTML = '<div class="loading">加载中...</div>';
  setTimeout(loadLive2DModel, 100);
});

onUnmounted(() => {
  if (app) {
    app.destroy(true);
    app = null;
  }
  if (model) {
    model.destroy();
    model = null;
  }
});
</script>

<template>
  <div ref="canvasContainer" class="live2d-container"></div>
</template>

<style scoped>
.live2d-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  height: 300px;
  z-index: 9999;
}

.loading {
  animation: pulse 1.5s infinite;
  color: #666;
  padding: 1rem;
  text-align: center;
}

.error {
  padding: 1rem;
  background: #ffe6e6;
  border: 1px solid #ff4444;
  color: #ff4444;
  border-radius: 4px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>