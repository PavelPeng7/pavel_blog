---
title: "12. OBJ文件（OBJ Files）"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

# 1. OBJ Files

[Wavefront .obj file](https://en.wikipedia.org/wiki/Wavefront_.obj_file)

![iShot_2024-06-15_22.38.57.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227154719309.png?imageSlim)
![iShot_2024-06-15_22.57.12.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227154730929.png?imageSlim)



在导出模型时需要将面转化成三角面。


![iShot_2024-06-15_22.57.12.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227154730929.png?imageSlim)
顶点信息列表

![iShot_2024-06-15_23.00.10.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227154743714.png?imageSlim)
三角面索引列表

# 2. Loading OBJ File Content

```c

void load_obj_file_data(char* filename){
    FILE* file;
    file = fopen(filename, "r");   // 打开文件进行读取

    char line[4096];  // 定义字符串缓冲区，用于存储从文件中读取的一行

    while (fgets(line, 4096, file))
    {
        // Vertex information
        if (strncmp(line, "v ", 2) == 0)
        {
            vec3_t vertex;
            sscanf(line, "v %f %f %f", &vertex.x, &vertex.y, &vertex.z);
            array_push(mesh.vertices, vertex);
        }

        // Face information
        if (strncmp(line, "f ", 2) == 0) {
            int vertex_indices[3];
            int texture_indices[3];
            int normal_indices[3];
            sscanf(
            line, "f %d/%d/%d %d/%d/%d %d/%d/%d",
            &vertex_indices[0], &texture_indices[0], &normal_indices[0],
            &vertex_indices[1], &texture_indices[1], &normal_indices[1],
            &vertex_indices[2], &texture_indices[2], &normal_indices[2]
            );
        

        face_t face = {
            .a = vertex_indices[0],
            .b = vertex_indices[1],
            .c = vertex_indices[2]
        };
        array_push(mesh.faces, face);
    }
}
}
```

> fopen中的”r“是什么？

fopen(filename, "r")中的 "r" 是一个模式字符串，表示以只读模式（read mode）打开文件。这意味着：文件必须存在，否则打开操作将失败，fopen 将返回 NULL。以这种模式打开的文件只能读取，不能写入。

**常用的文件打开模式**

• "r"：只读模式。打开一个存在的文件进行读取。如果文件不存在，fopen 会返回 NULL。

• "w"：写入模式。打开一个文件用于写入。如果文件不存在，会创建一个新的文件。如果文件存在，会将其内容清空。

• "a"：追加模式。打开一个文件用于追加。如果文件不存在，会创建一个新的文件。如果文件存在，写入的数据会被追加到文件的末尾。

• "r+"：读写模式。打开一个文件进行读写。如果文件不存在，fopen 会返回 NULL。

• "w+"：读写模式。打开一个文件进行读写。如果文件不存在，会创建一个新的文件。如果文件存在，会将其内容清空。

• "a+"：读写追加模式。打开一个文件进行读写。如果文件不存在，会创建一个新的文件。如果文件存在，写入的数据会被追加到文件的末尾。

> fgets()是什么?

fgets 是C标准库中的一个函数，全称“file get string”，用于从文件中读取一行数据。它的原型在头文件 <stdio.h> 中定义：
```c
char *fgets(char *str, int n, FILE *stream);
```

> strncmp()是什么？

strncmp 是C标准库中的一个函数，全称”string compare n“，用于比较两个字符串的前n个字符。它的原型在头文件 <string.h> 中定义：

```c
int strncmp(const char *str1, const char *str2, size_t n);
```

**参数说明**
• const char str1：指向要比较的第一个字符串。
• const char str2：指向要比较的第二个字符串。
• size_t n：要比较的字符数。

**返回值**
• 0：如果前n个字符相等。
• <0：如果 str1 在前n个字符中小于 str2。
• >0：如果 str1 在前n个字符中大于 str2。

> sscanf()是什么？

sscanf 是 C 标准库中的一个函数，用于从字符串中读取格式化输入。它的全称是 “string scan formatted”，表示从字符串中扫描并提取格式化的数据。

```c
int sscanf(const char *str, const char *format, ...);
```
**参数说明**
• const char *str：这是输入字符串，包含要读取的数据。
• const char *format：这是格式控制字符串，指定如何解析输入字符串中的数据。
• ...：这是一个可变参数列表，用于存储从输入字符串中提取的数据。

**返回值**
• 成功提取并赋值的参数个数。
• 如果没有成功匹配和赋值，返回值为 EOF（通常为 -1）。
**格式控制字符串**
sscanf 的格式控制字符串与 printf 和 scanf 的格式控制字符串类似，包括以下常用的格式说明符：
• %d：匹配一个整数。
• %f：匹配一个浮点数。
• %s：匹配一个字符串（直到下一个空白字符）。
• %c：匹配一个字符。
在main.c中setup阶段读取模型数据
```c

void setup(void){
		......
    load_obj_file_data("./assets/Monkey.obj");
    }
```