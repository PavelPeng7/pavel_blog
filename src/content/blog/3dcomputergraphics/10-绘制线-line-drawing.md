---
title: "10. 绘制线(Line Drawing)"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

![iShot_2024-06-02_00.00.30.gif](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227154052136.gif?imageSlim)



在上一章节中我们写好了立方体的顶点数据和三角面数据，在这章中将探索如何绘制线条。

# 绘制线条的方法

在计算机图形学中主要有两种方法绘制线条。

1. DDA算法（Digital Different Analyzer Algorithm）

原理：是一种增量算法，通过计算直线在x方向或y方向上的增量，逐步绘制线段上的像素。根据直线的斜率决定是以x还是y方向为增量单位。

1. Bresenham算法

原理：是一种整数算法，通过判断误差值的符号来决定像素点的位置，避免了浮点运算，提高了效率和精度。

Bresenham采用整数计算会比DDA算法更加精确效率高，但是算法相对复杂。我们首先采用DDA算法实现画线。

# DDA方法绘制线条

```c
// DDA
void draw_line(int x0, int y0, int x1, int y1, uint32_t color)
{
    //计算线条在x，y方向上的差值
    int delta_x = (x1 - x0);
    int delta_y = (y1 - y0);

    //根据那条边长来决定长的那边来进行迭代
    int longest_side_Length = (abs(delta_x) >= abs(delta_y)) ? abs(delta_x) : abs(delta_y);

    //计算x，y方向上单位增量
    float x_inc = delta_x / (float)longest_side_Length;
    float y_inc = delta_y / (float)longest_side_Length;

    //初始化绘制的当前位置为直线开始点
    float current_x = x0;
    float current_y = y0;

    //迭代绘制直线的像素，总步长小于长边长度
    for (int i = 0; i <= longest_side_Length; i++)
    {
        draw_pixel(round(current_x), round(current_y), color);
        current_x += x_inc;
        current_y += y_inc;
    } 
}
```
在display.c和diplay.h中写出绘制线条的函数。
![iShot_2024-012-02_15.49.22.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227154306741.png?imageSlim)


```c
    draw_line(100,50,1000,200,0xFFFFFF00);

```

我们绘制一条直线来测试函数是否能正常运行。

# 绘制立方体线框

```c
void draw_triangle(int x0, int y0, int x1, int y1, int x2, int y2, uint32_t color)
{
    draw_line(x0, y0, x1, y1, color);
    draw_line(x1, y1, x2, y2, color);
    draw_line(x2, y2, x0, y0, color);
}
```
先写一个绘制三角形边框的方法

```c
    //Loop all projected triangles and render than
    for (int i = 0; i < N_MESH_FACES; i++)
    {
        
        triangle_t triangle = triangles_to_renderer[i];

        draw_rect(triangle.points[0].x, triangle.points[0].y, 3, 3, 0xFFFFFF00);
        draw_rect(triangle.points[1].x, triangle.points[1].y, 3, 3, 0xFFFFFF00);
        draw_rect(triangle.points[2].x, triangle.points[2].y, 3, 3, 0xFFFFFF00);

        draw_triangle(
            triangle.points[0].x,
            triangle.points[0].y,
            triangle.points[1].x,
            triangle.points[1].y,
            triangle.points[2].x,
            triangle.points[2].y,
            0xFF00FF00
        );
    }
```

先用draw_rect绘制出三角形的三个顶点，再调用draw_trianle绘制出三角形。

# 补充Bresenham方法

[How Your Computer Draws Lines](https://www.youtube.com/watch?v=8gIhNSAXYcQ)
![Untitled.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227154204191.png?imageSlim)

## Bresenham算法

```c
//Bresenham2
void draw_line(int x0, int y0, int x1, int y1, uint32_t color)
{
		
    int dx = abs(x1 - x0);
    int dy = abs(y1 - y0);
    int sx = (x0 < x1) ? 1 : -1;  //误差超过0.5时，x0<x1时x步进单位改为1,否则改为-1
    int sy = (y0 < y1) ? 1 : -1;  //误差超过0.5时，y0<y1时x步进单位改为1,否则改为-1
    int err = dx - dy;            

    while (1)
    {
        draw_pixel(x0, y0, color);

        if (x0 == x1 && y0 == y1) break;

        int e2 = 2 * err;    

				// 2dx-2dy > -dy => 2dx-dy > 0 => 2dx/dy > 1 => dx/dy > 1/2
				// 4dx-6dy > -dy => 4dx-6dy > 0 => (2/3)dx/dy > 1 => dx/dy > 3/2
				// 8dx-14dy > -dy => 8dx-14dy > 0 => (8/14)dx/dy >1 => dx/dy > 7/4
				// ...... => dx/dy > n*0.5
				// 通过反推公式可得，变化量在x方向上大于0.5时向x方向绘制一个单位像素,误差每次累增0.5
        if (e2 > -dy)     
        {
            err -= dy;
            x0 += sx;
        }
        
				// 2dx-2dy < dx => dx-2dy < 0 => 1 - 2dy/dx < 0 => dy/dx > 1/2
				// 在y方向上变化量大于0.5时向y方向绘制一个单位像素，误差每次类增0.5
        if (e2 < dx)
        {
            err += dx;
            y0 += sy;
        }
    }
}
```

## Bresenham改进算法

```c

// Bresenham1
void draw_line(int x0, int y0, int x1, int y1, uint32_t color) {
    // 判断是否需要进行交换
    int steep = abs(y1 - y0) > abs(x1 - x0);

    if (steep) {
        // 如果是陡峭的，则交换x和y的值
        int_swap(&x0, &y0);
        int_swap(&x1, &y1);
    }

    if (x0 > x1) {
        // 确保从左到右绘制线条
        int_swap(&x0, &x1);
        int_swap(&y0, &y1);
    }

    int deltax = x1 - x0;
    int deltay = abs(y1 - y0);
    int error = deltax / 2;
    int ystep;
    int y = y0;

    if (y0 < y1) {
        ystep = 1;
    } else {
        ystep = -1;
    }

    for (int x = x0; x <= x1; x++) {
        if (steep) {
            draw_pixel(y, x, color); // 如果是陡峭的，则绘制(y, x)
        } else {
            draw_pixel(x, y, color); // 否则绘制(x, y)
        }

        error = error - deltay;  
        //deltax/2 -delty < 0 => deltay/deltax > 0.5
        
        
        if (error < 0) {
            y = y + ystep;
            error = error + deltax;
        }
    }
```

