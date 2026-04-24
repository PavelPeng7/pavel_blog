---
title: "9. 三角形和顶点（Triangles and Vertices）"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

![iShot_2024-06-02_00.15.41.gif](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227153056525.gif?imageSlim)

# 三角面索引结构体

存储绘制三角面需要的三角形顶点索引值。

```c
typedef struct 
{
    int a;
    int b;
    int c;
} face_t;
```
在triangle.h中声明三角面结构体。

# 三角形结构体

存储屏幕空间三角形的三个顶点。

```c
typedef struct 
{
    vec2_t points[3];
} triangle_t;
```

再声明一个三角形结构体存储投影到屏幕上的信息。

# 立方体模型数据

一个立方体由八个顶点六个面组成，接下来我们手动写出这些数据。

```c
#define N_MESH_VERTICES 8
extern vec3_t mesh_vertices[N_MESH_VERTICES];

#define N_MESH_FACES (6 * 2) // 6 cube faces, 2 triangles per frame
extern face_t mesh_faces[N_MESH_FACES];

```
现在mesh.h文件中定义8个定点，6个三角面。

```c
vec3_t mesh_vertices[N_MESH_VERTICES] = {
    { .x = -1, .y = -1, .z = -1}, // 1
    { .x = -1, .y =  1, .z = -1}, // 2
    { .x =  1, .y =  1, .z = -1}, // 3
    { .x =  1, .y = -1, .z = -1}, // 4
    { .x =  1, .y =  1, .z =  1}, // 5
    { .x =  1, .y = -1, .z =  1}, // 6
    { .x = -1, .y =  1, .z =  1}, // 7
    { .x = -1, .y = -1, .z =  1}, // 8
};

face_t mesh_faces[N_MESH_FACES] = {
    // front
    {.a = 1, .b = 2, .c = 3},
    {.a = 1, .b = 3, .c = 4},

    //right
    {.a = 4, .b = 3, .c = 5},
    {.a = 4, .b = 5, .c = 6},

    //back
    {.a = 6, .b = 5, .c = 7},
    {.a = 6, .b = 7, .c = 8},

    //left
    {.a = 8, .b = 7, .c = 2},
    {.a = 8, .b = 2, .c = 1},

    //top
    {.a = 2, .b = 7, .c = 5},
    {.a = 2, .b = 5, .c = 3},

    //bottom
    {.a = 6, .b = 8, .c = 1},
    {.a = 6, .b = 1, .c = 4},
};
```
在mesh.c中写入立方体的具体信息。

# 立方体模型应用旋转并从模型空间转换到相机空间再转到屏幕空间

```c
cube_rotation.x += 0.01;
cube_rotation.y += 0.01;
cube_rotation.z += 0.01;

for (int i = 0; i < N_MESH_FACES; i++)
{
    face_t mesh_face = mesh_faces[i];

    vec3_t face_vertices[3];
    face_vertices[0] = mesh_vertices[mesh_face.a - 1];
    face_vertices[1] = mesh_vertices[mesh_face.b - 1];
    face_vertices[2] = mesh_vertices[mesh_face.c - 1];

    triangle_t projected_triangle;

    // Loop all three vertices of this current face and apply transformations
    for (int j = 0; j < 3; j++)
    {
        vec3_t transformed_vertex = face_vertices[j];

        transformed_vertex = vec3_rotate_x(transformed_vertex, cube_rotation.x);
        transformed_vertex = vec3_rotate_y(transformed_vertex, cube_rotation.y);
        transformed_vertex = vec3_rotate_z(transformed_vertex, cube_rotation.z);
        
        // Translate the vertex away from the camera
        transformed_vertex.z -= camera_position.z;

        // Project the current vertex
        vec2_t projected_point = project(transformed_vertex);

        // Scale and translate the projected points to the middle of the screen
        projected_point.x += (window_width / 2);
        projected_point.y += (window_height / 2);

        projected_triangle.points[j] = projected_point;
    }

    // Save the projected triangle in the array of triangles to render
    triangles_to_renderer[i] = projected_triangle;
}
```
遍历每一个三角面，取出他们的三个顶点对每一个顶点进行旋转，投影到摄像机空间，转换到屏幕空间，变换到屏幕中间。