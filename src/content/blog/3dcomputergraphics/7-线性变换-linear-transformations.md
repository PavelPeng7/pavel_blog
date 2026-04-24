---
title: "7. 线性变换（Linear Transformations）"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

![iShot_2024-06-02_00.19.58.gif](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227150801703.gif?imageSlim)
# Sin角度加法和Cos角度加法公式推导

## Sin(α+β)
![20241117-152936.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227150931441.jpeg?imageSlim)

## Cos(α+β)
![20241117-152943.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227151346515.jpeg?imageSlim)


# 2D旋转矩阵推导
![iShot_2024-12-27_15.14.05.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227151733938.png?imageSlim)
![20240602-173443.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227151425036.jpeg?imageSlim)
通过2d旋转矩阵来理解旋转矩阵

# 为立方体添加旋转

```c
vec3_t vec3_rotate_x(vec3_t v, float angle)
{
    vec3_t roatated_vector = {
        .x = v.x,
        .y = v.y * cos(angle) - v.z * sin(angle),
        .z = v.y * sin(angle) + v.z * cos(angle)
    };
    return roatated_vector;
}

vec3_t vec3_rotate_y(vec3_t v, float angle)
{
    vec3_t rotated_vector = {
        .x = v.x * cos(angle) - v.z * sin(angle),
        .y = v.y,
        .z = v.x * sin(angle) + v.z * cos(angle)
    };
    return rotated_vector;
}

vec3_t vec3_rotate_z(vec3_t v, float angle){
    vec3_t rotated_vector = {
        .x = v.x * cos(angle) - v.y * sin(angle),
        .y = v.x * sin(angle) + v.y * cos(angle),
        .z = v.z
    };
    return rotated_vector;
}
```
在vector.c中添加对每个轴旋转的函数。

```c
cube_rotation.x += 0.01;
cube_rotation.y += 0.01;
cube_rotation.z += 0.01;
```
在update函数中增加旋转角度。

```c
for (int i = 0; i < N_POINTS; i++)
{
    vec3_t point = cube_points[i];

    vec3_t transformed_point = vec3_rotate_x(point, cube_rotation.x);
    transformed_point = vec3_rotate_y(transformed_point, cube_rotation.y);
    transformed_point = vec3_rotate_z(transformed_point, cube_rotation.z);

    //Move the points away from the camera
    transformed_point.z -= camera_position.z;
    //Project the current point
    vec2_t projected_point = project(transformed_point);
    //Save the projected 2D vector in the array of projected points
    projected_points[i] = projected_point;
}
```
对每个顶点应用三个轴的旋转。
