---
title: "14. 三角形栅格化（Triangle Rasterzation）"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

# 填充三角形（Triangle Fill）
![iShot_2024-012-07_15.00.40.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227164549907.png?imageSlim)
上节课我们学了将数学上完美的三角形用DDA算法转化成栅格线条。

![iShot_2024-qw-07_14.59.57.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227164443634.png?imageSlim)
填充三角形从顶层设计看是y方向递增的线扫描，从顶部点从上向下一行行扫描，绘制出三角形的栅格。

# 平顶边三角形和平底边三角形填充技术（Flat-Top & Flat-Bottom Fill Technique）

在扫描线算法中，我们将三角形分成以过y方向上的中间点的边为底边和顶边两个三角形。也就是一个平顶边和一个平底边三角形。
![iShot_2024-07-07_16.28.27.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227164643575.png?imageSlim)
一个三角形被划分成连个共边三角形

![iShot_2024-07-07_16.28.41.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227164700226.png?imageSlim)
通过将三角形三个顶点根据y值排序，我们得到这三个顶点的顺序方便获取中间点和进行扫描。

![iShot_2024-07-07_16.29.16.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227164719718.png?imageSlim)


# 找到三角形中点（Midpoint）

![iShot_2024-07-07_16.47.52.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227164746786.png?imageSlim)
利用相似三角形原理求出Mx，还可以用点斜式公式求出Mx

# 编程三角形中点计算

首先是对三角形三个顶点按照y值由小到大排序P0，P1，P2，有点类似于冒泡排序法。

然后对特殊情况特判也就是当P1，P2的y值相等时只用绘制平底边三角形，P0，P1的y值相等时只需要绘制平顶边三角形。

如果是y值都各不相等就得分成两个三角形绘制了，先找到Pm中点的x值，y值：y值为P2的y值，x值用上面根据相似三角形原理推出来的公式计算。

> 那在P0，P1，P2的y值都相等时会发生什么？

```c
void draw_filled_triangle(int x0, int y0, int x1, int y1, int x2, int y2, uint32_t color)
{
    // We need to sort the vertices by y-cooordinate ascending(y0 < y1 < y2)
    if (y0 > y1)
    {
        int_swap(&y0, &y1);
        int_swap(&x0, &x1);
    }
    if (y1 > y2)
    {
        int_swap(&y1, &y2);
        int_swap(&x1, &x2);
    }
    if (y0 > y1)
    {
        int_swap(&y0, &y1);
        int_swap(&x0, &x1);
    }

    if (y1 == y2)
    {
        // We can simply draw the flat-bottom triangle
        fill_flat_bottom_triangle(x0, y0, x1, y1, x2, y2, color);
    }
    else if (y0 == y1)
    {
        // We can simply draw the flat-top triangle
        fill_flat_top_triangle(x0, y0, x1, y1, x2, y2, color);
    }
    else
    {
        // Calculate the new vertex (Mx, My) using triangle similarity
        int My = y1;
        int Mx = ((float)((x2 - x0) * (y1 - y0)) / (float)(y2 - y0)) + x0;

        // Draw flat-bottom triangle
        fill_flat_bottom_triangle(x0, y0, x1, y1, Mx, My, color);

        // Draw flat-top triangle
        fill_flat_top_triangle(x1, y1, Mx, My, x2, y2, color);
    }
```

> 什么是ascll码艺术？

ASCII码艺术（ASCII Art）是一种通过使用ASCII字符（即计算机键盘上的标准字符）创建图像的艺术形式，ASCII艺术常用于代码注释和技术文档中，用于说明和增强可读性。

# 平底边三角的算法（Algorithm）

![iShot_2024-07-07_17.36.15.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227164824696.png?imageSlim)
- 从顶部定点P0(x0,y0)开始
- 计算两条斜边的斜率slope1和slope2
- 循环所有的扫描线从y0到y2（从上到下）：
    1. 根据斜率计算新的x_start和x_end
    2. 绘制线从x_start到x_end
    3. 基于斜率，递增x_start和x_end为了绘制下一条扫描线（根据已知的直线斜率和y递进的单位值计算x值）

# 平底边三角的编程
![iShot_2024-07-07_17.45.10.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227164850036.png?imageSlim)
- 计算顶点两条邻边的斜率
- 从P0(x0,y0)开始
- 循环迭代，知道等于y值大于y2停止
    - 从x_start到x_end扫描线（先画线，再递增）
    - x_start递增此条边上一个单位斜率
    - x_end递增此条边上一个单位斜率

```c
void fill_flat_bottom_triangle(int x0, int y0, int x1, int y1, int x2, int y2, uint32_t color)
{
    // Find the two slopes (two triangle legs)
    float inv_slope_1 = (float)(x1 - x0) / (y1 - y0);
    float inv_slope_2 = (float)(x2 - x0) / (y2 - y0);

    // Start x_start and x_end from the top vertex (x0,y0)
    float x_start = x0;
    float x_end = x0;

    // Loop all the scanlines from top to bottom
    for (int y = y0; y <= y2; y++)
    {
        draw_line(x_start, y, x_end, y, color);
        x_start += inv_slope_1;
        x_end += inv_slope_2;
    }
}
```

# 平顶边三角的算法
![iShot_2024-07-07_18.01.51.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227164916210.png?imageSlim)
- 从底部顶点P2(x2,y2)开始
- 计算斜率slop1和slope2
- 循环从y2到y1的所有扫描线（从下到上）：
    1. 根据斜率计算新的x_start和x_end
    2. 绘制从x_start到x_end的线
    3. 基于斜率值，递减x_start和x_end为了绘制下一条扫描线

# 平顶边三角的编程

- 计算顶点两条邻边的反斜率（因为扫描线需要从下往上走）
- 从P0(x2,y2)开始
- 循环迭代，知道等于y值小于于y2停止
    - 从x_start到x_end扫描线（先画线，再递增）
    - x_start递减此条边上一个单位斜率
    - x_end递减此条边上一个单位斜率

```c
void fill_flat_top_triangle(int x0, int y0, int x1, int y1, int x2, int y2, uint32_t color)
{
    // Find the two slopes (two triangle legs)
    float inv_slope_1 = (float)(x2 - x0) / (y2 - y0);
    float inv_slope_2 = (float)(x2 - x1) / (y2 - y1);

    // Start x_start and x_end from the bottom vertex (x2,y2)
    float x_start = x2;
    float x_end = x2;

    // Loop all the scanlines from top to bottom
    for (int y = y2; y >= y0; y--)
    {
        draw_line(x_start, y, x_end, y, color);
        x_start -= inv_slope_1;
        x_end -= inv_slope_2;
    }
}
```

# 避免除0

```c
......
   // Find the two slopes (two triangle legs)
    float inv_slope_1 = (float)(x2 - x0) / (y2 - y0);
    float inv_slope_2 = (float)(x2 - x1) / (y2 - y1);
......
```

```c
......	
    // Find the two slopes (two triangle legs)
    float inv_slope_1 = (float)(x1 - x0) / (y1 - y0);
    float inv_slope_2 = (float)(x2 - x0) / (y2 - y0);
......
```

为了避免函数中的值除0，也就是在以下情况中：

- y1 = y2
    ![iShot_2024-07-07_18.37.24.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227165012421.png?imageSlim)
- y0 = y1
    ![iShot_2024-07-07_18.37.51.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227165045587.png?imageSlim)
- y0 = y2
这种情况下只会在y0=y1=y2时出现，也就是在一条直线上

```c
    if (y1 == y2)
    {
        // We can simply draw the flat-bottom triangle
        fill_flat_bottom_triangle(x0, y0, x1, y1, x2, y2, color);
    }
    else if (y0 == y1)
    {
        // We can simply draw the flat-top triangle
        fill_flat_top_triangle(x0, y0, x1, y1, x2, y2, color);
    }
    else
    {
				......
    }
```

# 不同渲染设置的解决方法

大致思路是通过枚举变量来检测当前选中的选项

- 声明cull_methd和render_method两种枚举变量类型
- 实例化枚举变量类型
- 检测按键匹配其对应的变量值
- 根据枚举变量的变量值判断需要执行的渲染内容

```c
enum cull_method{
    CULL_NONE,
    CULL_BACKFACE
} cull_method;

enum render_method{
    RENDER_WIRE,
    RENDER_WIRE_VERTEX,
    RENDER_FILL_TRIANGLE,
    RENDER_FILL_TRIANGLE_WIRE
} render_method;
```

```c
void setup(void){
    // Initialize render mode and triangle culling method
    render_method = RENDER_WIRE;
    cull_method = CULL_BACKFACE;
    ......
    }
```

```c
void process_input(void){
    SDL_Event event;
    SDL_PollEvent(&event);

    switch(event.type) {
        case SDL_QUIT:
            is_running = false;
            break;
        case SDL_KEYDOWN:
            if ( event.key.keysym.sym == SDLK_ESCAPE)
                is_running = false;
            if (event.key.keysym.sym == SDLK_1)
                render_method = RENDER_WIRE_VERTEX;
						......
            break;      
    }
}
```

```c
        // Draw unfilled points
        if (render_method == RENDER_WIRE || render_method == RENDER_WIRE_VERTEX || render_method == RENDER_FILL_TRIANGLE_WIRE)
        {
            draw_triangle(
                triangle.points[0].x,
                triangle.points[0].y,
                triangle.points[1].x,
                triangle.points[1].y,
                triangle.points[2].x,
                triangle.points[2].y,
                0xFFFFFFFF
            );
        }
```

# 赋予三角面颜色

这部分主要学习如何添加模型的属性，以助于以后添加如uv，vertexcolor等信息。

- 先在硬编码的cube_faces中添加颜色信息
- 在需要接受cube信息的结构体face_t和triangle_t中添加颜色变量
- 注意在传递模型信息时注意将颜色信息也加入

```c
face_t cube_faces[N_CUBE_FACES] = {
    // front
    {.a = 1, .b = 2, .c = 3, .color = 0xFFFF0000},
    {.a = 1, .b = 3, .c = 4, .color = 0xFFFF0000}, 
		.......
};
```

```c
typedef struct 
{
    int a;
    int b;
    int c;
    uint32_t color;
} face_t;
```

```c
typedef struct 
{
    vec2_t points[3];
    uint32_t color;
    float avg_depth;
} triangle_t;
```

```c
    triangle_t projected_triangle = {
        .points = {
            { projected_points[0].x, projected_points[0].y },
            { projected_points[1].x, projected_points[1].y },
            { projected_points[2].x, projected_points[2].y }
        },
        .color = mesh_face.color,
        .avg_depth = avg_depth
    };
```

```c
        // Draw filled points
        if (render_method == RENDER_FILL_TRIANGLE || render_method == RENDER_FILL_TRIANGLE_WIRE)
        {
            draw_filled_triangle(
                triangle.points[0].x,
                triangle.points[0].y,
                triangle.points[1].x,
                triangle.points[1].y,
                triangle.points[2].x,
                triangle.points[2].y,
                triangle.color
            );           
        }
```

# 补充

## Enum报错

有些编译器可能会对enum报错，我们可以将enum声明到main.c
![下载.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227165219966.png?imageSlim)

## 颜色类型

定义一个颜色类型color_t可以让代码看起来更有可读性
![下载 (2).png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227165246721.png?imageSlim)
![下载 (22).png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227165327339.png?imageSlim)


## 关于面数与性能

在一款在Nintendo 64平台上的游戏GoldenEye 007，玩家在速通的过程中，发现将头朝下会让速度更快。
![下载1.gif](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227165611141.gif?imageSlim)

