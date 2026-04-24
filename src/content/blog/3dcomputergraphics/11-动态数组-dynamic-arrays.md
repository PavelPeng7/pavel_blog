---
title: "11. 动态数组（Dynamic Arrays）"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

# 1. 动态数组

[GitHub - gustavopezzi/dynamicarray: A simple dynamic array implementation in C](https://github.com/gustavopezzi/dynamicarray/tree/master)

array_push: 用于将一个新元素添加到动态数组中。如果数组容量不足以容纳新元素，则需要扩展数组。

array_hold:用于确保数组具有足够的容量来容纳至少指定数量的新元素。如果数组容量不足，则扩展数组。

array_length:用于获取数组中当前已占用的元素数量。

array_free:用于释放动态数组的内存。

```c
//Array of triangles that should be rendered frame by frame
triangle_t* triangles_to_render = NULL;

```

triangles_to_render 是一个指向 triangle_t 类型的指针，这意味着它可以指向一个或多个 triangle_t 结构体的连续内存块（即数组）

# 2. 动态加载模型顶点和面

除了加载硬编码的立方体数据，我们还需要加载导入的模型。

```c
//Define a struct for dynamic size meshes,with array of vertices and faces
typedef struct{
    vec3_t* vertices; // dynamic array of vertices
    face_t* faces;    // dynamic array of faces
    vec3_t rotation;  // rotation with x, y, and z values
} mesh_t;
extern mesh_t mesh;
```

在mesh.h中写一个mesh_t类型的结构体包含mesh的顶点信息，面信息，旋转信息。

> 为什么vec3_t后面加一个*？

在C语言中，使用指针可以动态管理数组或内存。vec3_t* vertices 中的星号（*）表示 vertices 是一个指向 vec3_t 结构体的指针，这意味着它可以指向一个或多个 vec3_t 结构体的连续内存块（即数组）。

> **为什么 vec3_t 是一个指针？**

1. **动态内存分配**：

• 使用指针可以动态分配内存，这使得程序可以在运行时根据需要调整数组的大小，而不是在编译时固定大小。

2. **灵活性**：

• 动态数组提供了灵活性，可以根据需要添加或删除元素，而不需要预先知道数组的大小。

• 动态数组可以适应不同的网格复杂度，无论是简单的几何形状还是复杂的3D模型。

3. **高效的内存使用**：

• 动态分配内存只分配实际需要的空间，这比静态分配大量预留空间更高效。

• 当需要更多空间时，可以重新分配内存而不是从头开始分配新的数组。

```c
void update(void){
	......
	//Initialize the arry of triangles to render
	triangles_to_renderer = NULL;
	
	int num_faces = array_length(mesh.faces);
	for (int i = 0; i < num_faces; i++)
	{ 
		......
		// Save the projected triangle in the array of triangles to render
		array_push(triangles_to_renderer, projected_triangle);
	}
}

```

初始化用于三角形渲染的数组，遍历所有的三角面数量，将投影后的三角面数据推入数组中。
