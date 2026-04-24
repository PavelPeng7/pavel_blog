---
title: "15. 深度排序(Sorting Faces by Depth)"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

# 画家算法（Painter’s Algorithm）

Painter’s Algorithm（画家算法）是一种计算机图形学中的隐藏面消除算法。它模拟了画家绘画的过程，按照从远到近的顺序绘制物体，使得离观察者近的物体能够覆盖远的物体。该算法尤其适用于简单场景的渲染。

**原理**

Painter’s Algorithm 的基本原理是：

1. 对所有需要绘制的多边形进行排序，使得最远的多边形最先绘制，最近的多边形最后绘制。
2. 按照排序后的顺序依次将多边形绘制到屏幕上。

这种方法类似于画家在画布上绘画：先绘制背景，再绘制中景，最后绘制前景，从而实现正确的覆盖关系。
![iShot_2024-11-30_19.41.20.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175007470.png?imageSlim)


**实现步骤**
1. **排序**：
- 根据多边形的深度（通常是多边形顶点的 z 坐标的平均值或质心 z 坐标）对多边形进行排序。
1. **绘制**：
- 按照排序后的顺序，从远到近依次绘制多边形。
![iShot_2024-07-13_19.41.39.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175042562.png?imageSlim)


在投影到屏幕空间之后计算每个三角形的平均深度

```c
    // Calculate the average depth for each face based on the vertices after transfomation
    float avg_depth = (transformed_vertices[0].z + transformed_vertices[1].z + transformed_vertices[2].z)/3;
```

# 编程排序（sorting）算法

这里使用冒泡算法。
![iShot_2024-07-13_19.42.52.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175109050.png?imageSlim)
```c
    //Sort the triangles to render by their avg_depth
    int num_triangles = array_length(triangles_to_render);
    for (int i = 0; i < num_triangles; i++)
    {
        for (int j = i; j < num_triangles; j++)
        {
            if (triangles_to_render[i].avg_depth < triangles_to_render[j].avg_depth)
            {
                //Swap the triangles positions in the array
                triangle_t temp = triangles_to_render[i];
                triangles_to_render[i] = triangles_to_render[j];
                triangles_to_render[j] = temp;
            }
        }
        
    }
```

## 画家算法的劣势
![iShot_2024-07-13_19.43.18.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175143148.png?imageSlim)
在处理这种互相前后交叉的三角形时，画家算法并不能精确地得出前后关系，这时候得用深度缓冲区来像素级的为三角形像素排序。

## 排序算法

- **冒泡排序**：简单但效率低，适合小规模数据集。
- **快速排序**：高效的分治排序算法，适合大多数情况。
- **归并排序**：稳定的分治排序算法，适合处理大数据集，但需要额外空间。
- **基数排序**：非比较排序算法，适合特定类型的数据，如整数和字符串。

# 补充
## 多边形游戏
采用三角面，四边面制作的多边形游戏。
![下载 (1).gif](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175212792.gif?imageSlim)
Virtua Racing

![下载 (3).gif](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175245278.gif?imageSlim)
StarFox

![下载 (4).png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175317442.png?imageSlim)
Virtua Fighter

## 其他形状图元游戏

[Ecstatica](https://en.wikipedia.org/wiki/Ecstatica)使用椭球体为主要图元创造出圆润的外观。
![下载 (2).gif](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175351628.gif?imageSlim)
![下载 (3).png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175402147.png?imageSlim)
![下载.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175414101.jpeg?imageSlim)
![下载 (1).jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175425770.jpeg?imageSlim)
