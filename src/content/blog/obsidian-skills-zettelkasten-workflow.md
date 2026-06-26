---
title: "卡片笔记流程中 Obsidian Skills 的运用"
description: "如何在 Zettelkasten 工作流中结合使用各种 Obsidian Skills 提升知识管理效率"
pubDate: 2026-04-28
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["Obsidian", "Zettelkasten", "Skills", "知识管理", "OpenClaw"]
---

# 卡片笔记流程中 Obsidian Skills 的运用

卡片笔记法（Zettelkasten）的核心是**三类笔记**的明确分工：闪念笔记、文献笔记、永久笔记。

根据卡片笔记法的核心原则：**永久笔记必须基于自己的理解与思考独立撰写**。因此，Skills 的自动化能力主要适用于前两类笔记的处理流程，而在永久笔记阶段，则应使用可视化类 Skills 来增强思想的呈现。

---

## 一、闪念笔记阶段适用的 Skills

闪念笔记是知识的"临时停靠站"，用于快速捕获外部信息，等待后续加工。

### 1. defuddle
用于抓取网页内容并转换为纯净的 Markdown 文档。

先将网页内容暂存在闪念笔记中，待有时间消化学习时，再提炼转移到文献笔记，并将思考沉淀为永久笔记。

### 2. tutor-skills & scholar-skills
这两个 Skills 用于将已有资料（文档、代码库、论文）转换为结构化的学习模式。

在知识尚未经过大脑内化处理前，这类自动生成的结构化笔记仍应归属于闪念笔记范畴，等待后续的深度学习与内化。

---

## 二、文献笔记阶段适用的 Skills

### obsidian-cli
Obsidian 的核心命令行工具，能够完成 Obsidian 的基础操作。

它的核心价值在于：实现从**永久笔记**反向链接到**文献笔记**的索引建立，构建知识网络的双向连接。

---

## 三、永久笔记阶段适用的 Skills

永久笔记是知识沉淀的最终形态，每张卡片都承载着我们的所思所想与经验总结。为了让其中的流程和逻辑更清晰地呈现，需要借助可视化工具。

### 1. mermaid-visualizer
适合**逻辑性强的流程**可视化呈现。

![mermaid-visualizer](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/blog/obsidian-skills/mermaid-visualizer.png?imageSlim)

### 2. obsidian-canvas-creator
适合制作**思维导图、树状图**等发散性思维的可视化。

![obsidian-canvas-creator](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/blog/obsidian-skills/canvas-creator.png?imageSlim)

---

## 四、图片管理相关的 Skills

图片管理是 Obsidian 知识库的长期痛点。

推荐的管理方案：在每个主题文件夹下建立独立的 `assets` 文件夹存储本地图片，云端则使用 `tencent-cos-skill` 自动上传到腾讯云图床进行备份管理。

![cos-image-management](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/blog/obsidian-skills/cos-image-management.png?imageSlim)

---

## 附录：Obsidian Skills 完整清单

| 作者 | Skill名称 | 功能描述 | 状态 |
| :--- | :--- | :--- | :---: |
| **Obsidian CEO @kepano**<br>GitHub: `kepano/obsidian-skills` | `defuddle` | 网页内容清洗工具，专门用来把杂乱的网页转换成纯净的 Markdown 格式，通过剔除广告和导航栏来帮你节省 AI 调用时的 Token 消耗。 | ✅ |
| | `obsidian-cli` | 让 AI Agent 能够直接调用 Obsidian 官方的命令行工具，从而实现对笔记、任务、属性的增删改查，以及对插件开发环境的调试与管理。 | ✅ |
| | `obsidian-bases` | 让 AI 能够创建和维护 `.base` 格式的配置文件，从而在 Obsidian 里生成类似 Notion 数据库的动态视图，实现对笔记的过滤、计算和结构化展示。 | ✅ |
| | `obsidian-markdown` | 让 AI 能够编写和编辑符合 Obsidian 官方规范的增强版 Markdown 文档，实现双向链接、内容嵌入、提示框以及结构化属性的深度集成。 | ⚠️ |
| | `json-canvas` | 让 AI 能够创建和编辑 Obsidian 的 `.canvas` 白板文件，通过 JSON 结构实现节点（文本、文件、链接、组）的布局以及它们之间的连线逻辑。 | ❌ |
| **Axton, 著名博主@回到Axton**<br>GitHub: `axtonliu/axton-obsidian-visual-skills` | `obsidian-canvas-creator` | 加强版的 json canvas skill，解决了节点重叠和空间分布不均的问题。 | ✅ |
| | `mermaid-visualizer` | 将文本逻辑转化为专业的 Mermaid 架构图或流程图，并内置了针对 Obsidian 渲染引擎的语法纠错机制。 | ✅ |
| | `excalidraw-diagram` | 将文本逻辑转化为手绘风格的 Excalidraw 图表 | ✅ |
| **OpenClaw官方GitHub**<br>GitHub: `openclaw/openclaw/skills/obsidian` | `obsidian-skill` | 直接操作系统文件，也就是文件I/O，非常消耗 Token，在官方已经发布Obsidian-cli的情况下，没有理由继续使用这个过时的方式。 | ❌ |
| **Choi Wontak**<br>GitHub: `RoundTable02/tutor-skills` | `tutor-skills` | 两个 Skill (`tutor-setup` 和 `tutor`)，构成了一个"输入-内化-检测"的完整闭环：将文档或代码库一键转化为结构化的 Obsidian 知识库，之后通过无提示的交互式测验不断暴露你的知识盲区并记录学习轨迹。 | ✅ |
| **EESJGong**<br>GitHub: `EESJGong/scholar-skill` | `scholar-skill` | 基于 OpenClaw 框架的学术研究skill，通过L1-L3的分级阅读策略在后台长时间静默解析论文，并自动将结构化笔记、核心记忆与知识冲突报告写入你的本地 Obsidian 知识库中。 | ✅ |
