---
title: "5. 向量和点（Vectors and Points）"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

![iShot_2024-06-02_19.37.54.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227145718013.png?imageSlim)
# 向量


```c
typedef struct 
{
    float x;
    float y;
} vec2_t;

typedef struct
{
    float x;
    float y;
    float z;
} vec3_t;
```

# 点云

```c
//Declare an array of vectors/points
const int N_POINTS = 9 * 9 * 9;
vec3_t cube_points[N_POINTS]; // 9x9x9 cube
vec2_t projected_points[N_POINTS];
```

定义点的数量，三维空间的立方体点云数据，被投影到屏幕空间的点云数据。

```c
    int point_count = 0;
    //Start loading my array of vectors
    //From -1 to 1 (in this 9x9x9 cube)
    for (float x = -1; x < 1; x+=0.25)
    {
        for (float y = -1; y < 1; y+=0.25)
        {
            for (float z = -1; z < 1; z+=0.25)
            {
                vec3_t new_point = {.x = x, .y = y, .z = z};
                cube_points[point_count++] = new_point;
            }
        }
    }
```

在向x,y,z方向上分别进行步长为0.25的迭代写入3d顶点。

```c
for (int i = 0; i < N_POINTS; i++)
{
    vec3_t point = cube_points[i];

    //Project the current point
    vec2_t projected_point = project(point);
    //Save the projected 2D vector in the array of projected points
    projected_points[i] = projected_point;
}
```

在Update中对每一个点投影到2d屏幕空间上

```c
    //Loop all projected points and render them
    for (int i = 0; i < N_POINTS; i++)
    {
        vec2_t projected_point = projected_points[i];
        draw_rect(
            projected_point.x + window_width / 2,
            projected_point.y + window_height / 2,
            4,
            4,
            0xFFFFFF00
        );
    }
```

将这些点通过draw_rect方法绘制到屏幕上。