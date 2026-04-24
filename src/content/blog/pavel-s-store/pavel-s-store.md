---
title: "Pavel's Store"
description: "Unity Plugins,Models,VFX"
pubDate: 2025-01-10
heroImage: "/img/post-bg-toy-story-clutter.png"
tags: ["专辑", "商店", "Pavel's Store"]
---

Welcome to the store of Pavel.

<div class="iframe-container">
  <iframe id="iframe1" frameborder="0" src="https://itch.io/embed-upload/12498996?color=19181e" allowfullscreen="" width="960" height="540">
      <a href="https://pavelpeng.itch.io/unity-dynamic-stylized-sky">Play Unity Dynamic Stylized Sky on itch.io</a>
  </iframe>
</div>

<div class="iframe-container">
  <iframe id="iframe2" frameborder="0" src="https://itch.io/embed/3238945" width="552" height="167">
      <a href="https://pavelpeng.itch.io/unity-dynamic-stylized-sky">Unity Dynamic Stylized Sky by Pavel</a>
  </iframe>
</div>

<script>
  function adjustIframeSize() {
    // 获取第一个 iframe
    var iframe1 = document.getElementById('iframe1');
    // 获取第二个 iframe
    var iframe2 = document.getElementById('iframe2');
    
    // 定义缩放比例
    var widthThreshold1 = 768;
    var widthThreshold2 = 384;

    if (iframe1) {
      let scale = 1;
      if (window.innerWidth <= widthThreshold2) {
        scale = 0.4; // 小屏幕
      } else if (window.innerWidth <= widthThreshold1) {
        scale = 0.7; // 中等屏幕
      } else {
        scale = 1; // 大屏幕
      }
      iframe1.style.transform = `scale(${scale})`;
      iframe1.style.transformOrigin = 'top left'; // 以左上角为缩放基点
      iframe1.parentElement.style.width = `${960 * scale}px`; // 更新容器宽度
      iframe1.parentElement.style.height = `${540 * scale}px`; // 更新容器高度
    }

    if (iframe2) {
      let scale = 1;
      if (window.innerWidth <= widthThreshold2) {
        scale = 0.5; // 小屏幕
      } else if (window.innerWidth <= widthThreshold1) {
        scale = 0.8; // 中等屏幕
      } else {
        scale = 1; // 大屏幕
      }
      iframe2.style.transform = `scale(${scale})`;
      iframe2.style.transformOrigin = 'top left'; // 以左上角为缩放基点
      iframe2.parentElement.style.width = `${552 * scale}px`; // 更新容器宽度
      iframe2.parentElement.style.height = `${167 * scale}px`; // 更新容器高度
    }
  }

  // 页面加载时调整尺寸
  document.addEventListener('DOMContentLoaded', adjustIframeSize);

  // 窗口尺寸变化时调整尺寸
  window.addEventListener('resize', adjustIframeSize);
</script>

<style>
  .iframe-container {
    position: relative;
    overflow: hidden;
  }

  iframe {
    display: block;
  }
</style>