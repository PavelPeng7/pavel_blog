---
title: "17. 3D空间变换矩阵（3D Matrix Transformations）"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

# 1. 单位矩阵（Identity Matrix）

![iShot_2024-12-27_22.43.02.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227224319988.png?imageSlim)


单位矩阵特征是对角线为1，其他位置为0的矩阵。

单位矩阵相当于矩阵中的1，任何矩阵乘以单位矩阵等于这个矩阵。

# 2. 缩放矩阵(3DScale Matrix)

![iShot_2024-12-27_17.59.58.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227180231244.png?imageSlim)

```c
mat4_t mat4_make_scale(float sx, float sy, float sz){
    // | sx  0  0  0 |
    // |  0 sy  0  0 |
    // |  0  0 sz  0 |
    // |  0  0  0  1 |
    mat4_t m = mat4_identity();
    m.m[0][0] = sx;
    m.m[1][1] = sy;
    m.m[2][2] = sz;
    return m;
}
```

放缩矩阵的特点是对角线上分别放x，y，z方向上的缩放值。

> 为什么3d变换时用四维矩阵而不是三维矩阵？

为了兼容齐次坐标系（**Homogeneous Coordinates**），通过矩阵乘法统一处理缩放，旋转，平移。

并且3x3矩阵无法处理平移操作。

> 齐次坐标系中多出来的1是什么？

1. 允许表示平移变换，统一变换矩阵。
2. 投影变换，w存储深度。
3. 处理点和向量，w值为1是为点，w值为0时为向量，因为向量是方向没有起始点。

# 3. 旋转矩阵(3D Rotation Matrices)

## 3.1 绕x轴旋转
![iShot_2024-12-27_18.00.06.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227180307273.png?imageSlim)
```c
mat4_t mat4_make_rotation_x(float angle)
{
    float c = cos(angle);
    float s = sin(angle);
    // |  1  0  0  0  |
    // |  0  c  -s 0  |
    // |  0  s  c  0  |
    // |  0  0  0  0  |
    mat4_t m = mat4_identity();
    m.m[1][1] = c;
    m.m[1][2] = -s;
    m.m[2][1] = s;
    m.m[2][2] = c;
    return m;
}
```

## 3.2 绕z轴旋转
![iShot_2024-12-27_18.00.10.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227180324778.png?imageSlim)

```c
mat4_t mat4_make_rotation_z(float angle)
{
    float c = cos(angle);
    float s = sin(angle);
    // |  c -s  0  0  |
    // |  s  c  0  0  |
    // |  0  0  1  0  |
    // |  0  0  0  0  |
    mat4_t m = mat4_identity();
    m.m[0][0] = c;
    m.m[0][1] = -s;
    m.m[1][0] = s;
    m.m[1][1] = c;
    return m;
}
```

## 3.3 绕y轴旋转
![iShot_2024-12-27_18.00.15.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227180340306.png?imageSlim)
```c
mat4_t mat4_make_rotation_y(float angle)
{
    float c = cos(angle);
    float s = sin(angle);
    // |  c  0  s  0  |
    // |  0  1  0  0  |
    // | -s  0  c  0  |
    // |  0  0  0  0  |
    mat4_t m = mat4_identity();
    m.m[0][0] = c;
    m.m[0][2] = s;
    m.m[2][0] = -s;
    m.m[2][2] = c;
    return m;
}
```

> 为什么在绕y轴旋转时sin(α)和-sin(α)互换了?
![20241209-230845.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175728858.jpeg?imageSlim)



在y轴朝上的左手坐标系的环境下，以y轴为旋转轴时旋转，旋转方向为顺时针，也就是z轴的负方向导致最后x乘以负的Sin(β)。

## 3. 4 平移矩阵(3DTransition Matrix)
![iShot_2024-12-27_18.00.22.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227180359203.png?imageSlim)
```c
mat4_t mat4_make_translation(float tx, float ty, float tz){
    // |  1  0  0  tx |
    // |  0  1  0  ty |
    // |  0  0  1  tz |
    // |  0  0  0  1  |
    mat4_t m = mat4_identity();
    m.m[0][3] = tx;
    m.m[1][3] = ty;
    m.m[2][3] = tz;
    return m;
}
```

# 4. 组成世界矩阵
![iShot_2024-12-27_18.00.29.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227180419926.png?imageSlim)
```c
        // Create a World Matrix combining scale, rotation, and translation matrices
        mat4_t world_matrix = mat4_identity();
        world_matrix = mat4_mul_mat4(scale_matrix, world_matrix);
        world_matrix = mat4_mul_mat4(rotation_matrix_z, world_matrix);
        world_matrix = mat4_mul_mat4(rotation_matrix_y, world_matrix);
        world_matrix = mat4_mul_mat4(rotation_matrix_x, world_matrix);
        world_matrix = mat4_mul_mat4(translation_matrix, world_matrix);
```
通过将这些变换矩阵组合在一起，得到一个完整的世界矩阵W。
这个矩阵的作用是将物体从本地坐标系转换到世界坐标系。

> 为什么运算的公式是TxRxS而不是SxRxT？

因为矩阵的运算顺序是从右到左，所以最终变换的顺序还是缩放，旋转，平移。

# 5. 变换顺序(Order of Transformations)

正确的变换顺序为缩放，旋转，平移。

> 为什么是先缩放后旋转，而不是先旋转再缩放？

先旋转，再在旋转后进行缩放实际在未选转的模型空间的轴上镜像的。

- 如下图所示左图先旋转，然后旋转后的顶点沿着模型空间的未旋转的轴缩放所以缩放的结果不正确。
- 右图中会沿着模型空间的y轴缩放后再进行旋转。
![iShot_2024-06-09_22.34.08.gif](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175830032.gif?imageSlim)
先旋转再缩放

![iShot_2024-06-09_22.32.34.gif](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227175850904.gif?imageSlim)
先缩放在旋转

> 为什么最后是平移？

因为缩放和旋转不会改变世界空间的原点位置，平移会改变原点的位置，再进行缩放和旋转会导致不正确的效果。

# 6. 平移变换不是线性变换（Translation is Not a Linear Transformation）

> 线性变换是什么？