---
title: "23. 纹理OBJ文件（Textured OBJ Files）"
description: "3D Computer Graphics Programming"
pubDate: 2025-01-21
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

在加入uv信息读取的代码之前我们先看一下一个cube中的uv信息的组成：

- 平面二维uv参数
- 三角面中顶点队uv参数的索引
![iShot_2024-07-20_16.41.02.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250121184637807.png?imageSlim)

```c
void load_obj_file_data(char* filename){
		......

    while (fgets(line, 4096, file))
    {
		    ......
        // Texture coordinate information
        if (strncmp(line, "vt ", 3) == 0)
        {
            tex2_t texcoord;
            sscanf(line, "vt %f %f", &texcoord.u, &texcoord.v);
            array_push(texcoords, texcoord);
        }
        ......

        face_t face = {
            .a = vertex_indices[0] - 1,
            .b = vertex_indices[1] - 1,
            .c = vertex_indices[2] - 1,
            .a_uv = texcoords[texture_indices[0] - 1],
            .b_uv = texcoords[texture_indices[1] - 1],
            .c_uv = texcoords[texture_indices[2] - 1],
            .color = 0xFFFFFFFF
        };
        array_push(mesh.faces, face);
    }
}
array_free(texcoords);
}
```

由于三角面的顶点索引值是从1开始的而数组中的数据是从0开始的所以对索引值减1才能获得正确的值。

记得最后释放texcoords数组缓存

## 翻转纹理坐标
![iShot_2024-06-18_13.00.59.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250121184703855.png?imageSlim)
![iShot_2024-06-18_13.01.22.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250121184727911.png?imageSlim)
![iShot_2024-06-18_12.59.32.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250121184744572.png?imageSlim)
![iShot_2024-06-17_11.00.39.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250121184802752.png?imageSlim)
![iShot_2024-06-18_16.04.25.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250121184815801.png?imageSlim)

```c
    // Flip the V component to account for inverted UV-coordinates (v grows downwards)
    v0 = 1.0 - v0;
    v1 = 1.0 - v1;
    v2 = 1.0 - v2;
```

> 是什么造成了需要翻转uv的v方向？

模型的uv系统和SDL2的图像存取系统的差异导致的

- **模型的UV坐标系统**：你的模型使用的UV坐标系统是从下到上，即V坐标在左下角为原点，向上增长，从0到1。
- **SDL2的图像存储和访问系统**：SDL2加载和显示的图像数据是从上到下，即V坐标在左上角为原点，向下增长，从0到1。

补充：

- openGL：原点左下角
- Directx11：原点左上角
- Vulkan：原点左上角

# 防止纹理缓冲区溢出

![iShot_2024-06-18_16.04.25.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3f2fbaed-deef-4470-9c55-f54a154bb4bd/c013fbb3-dd29-4a13-b497-a1109278b84c/iShot_2024-06-18_16.04.25.png)

> 为什么会出现纹理缓冲区溢出现象？

我们绘制在显示屏上的三角形是离散的整数数组构成的三角形像素，而计算三角形权重插值时是对完美的理论三角形。不可避免的会出现这种情况，如上图所示的绿点所在的三角形像素理论上它在三角形外面，这可能导致α，β，γ呈负值，导致插值uv也是负值，进而超出纹理缓存数组的范围导致bug。

> 如何解决纹理缓冲区溢出问题？

对计算后的纹理像素索引xy值分别除以纹理的宽和高取余：

- 纹理像素索引xy小于于纹理宽高，则xy值作为余数能被保留
- 纹理像素索引xy大于纹理宽高，则舍掉整数倍部分，被重映射到[0,w&h)范围内
- 纹理像素索引xy是负数的情况下，则还是会返回一个正值，范围在[0,w&h)范围内

取余操作同样也是Reapeat采样模式的做法

取余操作的数学性质：

给定任意整数 x 和正整数 n，取余操作 x % n 的结果范围是 0 到 n-1。这是因为：

- 当 x 是正数且小于 n 时，x % n 直接是 x。
- 当 x 是正数且大于 n 时，x % n 会去掉 x 中的完整的 n 倍数部分，只保留剩余部分。
- 当 x 是负数时，x % n 会返回一个非负数，范围也是 0 到 n-1

```c
///////////////////////////////////////////////////////////////////////////////  
// Function to draw the textured pixel aat position x and y using unterpolation
//////////////////////////////////////////////////////////////////////////////
void draw_texel(
    int x, int y, uint32_t* texture,
    vec4_t point_a, vec4_t point_b, vec4_t point_c,
    tex2_t a_uv, tex2_t b_uv, tex2_t c_uv)
{
		......
    // Map the UV coordinates
    int tex_x = abs((int)(interpolated_u * texture_width)) % texture_width;
    int tex_y = abs((int)(interpolated_v * texture_height)) % texture_height;

    draw_pixel(x, y, texture[(texture_width * tex_y) + tex_x]);
}
```

# 欣赏纹理着色后的模型

我们可以解释每一个像素，每一个三角形发生了什么，我们怎么得到的，如何去插值这些东西，顶点，投影，矩阵，世界矩阵投影。