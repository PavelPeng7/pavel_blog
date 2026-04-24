---
title: "6. 点的投影（Projecting Points）"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

![iShot_2024-06-02_00.22.42.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227150010696.png?imageSlim)
投影有两种一种是正交投影一个是透视投影

# 正交投影

```c
vec2_t project_orthographic(vec3_t point){
    vec2_t projected_point = {
        .x = point.x,
        .y = point.y
    };
    return projected_point;
}
```
正交投影不考虑深度对结果的影响，直接将三维的顶点xy值赋给二维投影点。

# 透视投影!

![20240602-181527.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227145914342.jpeg?imageSlim)
透视投影的原理是相似三角形原理。观察点A与顶点P和D构成了大三角形，观察点A与屏幕上的P点的投影C构成了小三角形，视点A到屏幕的距离Pf是FOV的值。

```c
vec2_t project(vec3_t point){
    vec2_t projected_point = {
        .x = (fov_factor * point.x) / point.z,
        .y = (fov_factor * point.y) / point.z
    };
    return projected_point;
}
```

在main.c中写下Project方法，fov_factor就是pf/pz。

也就是相机与屏幕的距离和目标点在相机空间中的与相机的距离的比值为fov_factor。

除以point.z是在进行透视除法，距离相机越远也就是深度值越大，物体就会越小。
