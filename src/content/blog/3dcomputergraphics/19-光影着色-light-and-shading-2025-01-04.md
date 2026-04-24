---
title: "19. 光影着色(Light and Shading)"
description: "3D Computer Graphics Programming"
pubDate: 2025-01-04
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

![1718085764476-飞书20240611-135907.gif](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250104182619803.gif?imageSlim)
# 平面着色（Flat Shading）
![flat-shading-_shading2.fit_lim.size_1024x.gif](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250104182658403.gif?imageSlim)
平面着色指的是3D模型上每个多边形（通常是三角形）统一地着色。

# 平面着色编程

在light.h中新写一个类型结构体light_t内含一个三维向量表示平行光照方向。

```c
typedef struct
{
    vec3_t direction;
}light_t;
```

引用light.c中的light

```c
extern light_t light;
```

声明光照强度方法

```c
uint32_t light_apply_intensity(uint32_t original_color, float percentage_factor);

```

在light.c中定义光源方向为z轴方向

```c
light_t light = {
    .direction = { 0, 0, 1}
};
```

在light.c中写下计算光照强度的方法内容，通过分别计算r,g,b受光照影响后的参数再通过|符号组成一个32位的颜色值。

```c
// Change color based on a percentage factor to represent light intensity
uint32_t light_apply_intensity(uint32_t original_color, float percentage_factor){
    if (percentage_factor < 0) percentage_factor = 0;
    if (percentage_factor > 1) percentage_factor = 1;
    

    uint32_t a = (original_color & 0xFF000000);
    uint32_t r = (original_color & 0x00FF0000) * percentage_factor;
    uint32_t g = (original_color & 0x0000FF00) * percentage_factor;
    uint32_t b = (original_color & 0x000000FF) * percentage_factor;

    uint32_t new_color = a | (r & 0x00FF0000) | (g & 0x0000FF00) | (b & 0x000000FF);

    return new_color;
}
```

计算法线点乘光方向的结果，再应用之前的函数混合物体本身的颜色。

```c
    // Calculate the shade intensity based on how aliged is the face normal and the light direction
    float light_intensity_factor = -vec3_dot(normal, light.direction);

    // Calculate the triangle color based on the light angle
    uint32_t triangle_color = light_apply_intensity(mesh_face.color, light_intensity_factor);
```

# 翻转屏幕空间坐标

```c
       // invert the y values to account for flipped screen y coordinate
        projected_points[j].y *= -1;
```