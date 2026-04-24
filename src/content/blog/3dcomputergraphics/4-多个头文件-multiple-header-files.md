---
title: "4. 多个头文件（Multiple Header Files）"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

![Snipaste_2024-11-17_16-26-29.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227145434861.png?imageSlim)
目录和内容

预处理指令保证文件只被包含一次。

# .h文件

头文件通常用于**声明**，而不是定义。相当于目录。

- 声明函数，变量和数据结构
- 包含公共依赖
- 避免重复定义（#ifndef和#define）

# .c文件

实现文件用于定义函数和实现逻辑

- 实现头文件中声明的内容
- 模块内部的逻辑实现
- 控制模块的编译范围

# 为什么离.h和.c文件

1. 模块化设计，使代码更易维护，调试和调用
2. 提高代码可读性，头文件就包含了模块所有内容
3. 避免重复代码，可以在多个.c文件中使用同一头文件的函数和变量
4. 支持分开编译，.c文件单独编译陈哥目标文件(.o)，最终连接成可执行文件

> 分开编译使怎么运行的？

- 预处理阶段：
    
    #include指令会将头文件的内容插入使用它的.c文件中
    
- 编译阶段：
    
    编译器将每个.c文件单独编译为独立的目标文件(.o)
    
- 链接阶段：
    
    连接器将所有目标文件和库文件连接到一起生成可执行文件
    

![Snipaste_2024-11-17_16-33-13.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227145527638.png?imageSlim)
编译时编译器只关注函数原型与标题匹配，.c文件执行被看做是黑盒。

