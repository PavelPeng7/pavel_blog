---
title: "20. 纹理贴图（Texture Mapping）"
description: "3D Computer Graphics Programming"
pubDate: 2025-01-04
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

# 纹理采样（Texture Mapping）
![20240714-014046.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250104182845683.jpeg?imageSlim)
![20240714-014051.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250104182859307.jpeg?imageSlim)

# 缓存贴图
![20240714-014040.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250104182912664.jpeg?imageSlim)

![20240714-014057.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250104182929912.jpeg?imageSlim)


# 贴图类型定义

## 添加uv信息

```c
typedef struct {
    float u;
    float v;
}tex2_t;
```

texcoord类型二维值(u,v)

```c
typedef struct 
{
		......
    tex2_t a_uv;
    tex2_t b_uv;
    tex2_t c_uv;
    uint32_t color;
} face_t;
```

在面类型中加入三个点的uv属性

```c
typedef struct 
{
    ......
    tex2_t texcoords[3];
		......
} triangle_t;
```

三角形类型中加入长度为3的uv数组类型

```c
    triangle_t projected_triangle = {
				.......
        .texcoords = {
            { mesh_face.a_uv.u, mesh_face.a_uv.v },
            { mesh_face.b_uv.u, mesh_face.b_uv.v },
            { mesh_face.c_uv.u, mesh_face.c_uv.v }
        },
				......
    };
```

将uv信息从mesh_face传递到类型为三角形的被投影后的三角形中。

```
face_t cube_faces[N_CUBE_FACES] = {
    // front
    {.a = 1, .b = 2, .c = 3, .a_uv = { 0, 0 }, .b_uv = { 0, 1 }, .c_uv = { 1, 1 }, .color = 0xFFFFFFFF},
    {.a = 1, .b = 3, .c = 4, .a_uv = { 0, 0 }, .b_uv = { 1, 1 }, .c_uv = { 1, 0 }, .color = 0xFFFFFFFF}, 

    //right
    {.a = 4, .b = 3, .c = 5,  .a_uv = { 0, 0 }, .b_uv = { 0, 1 }, .c_uv = { 1, 1 }, .color = 0xFFFFFFFF},
    {.a = 4, .b = 5, .c = 6,  .a_uv = { 0, 0 }, .b_uv = { 1, 1 }, .c_uv = { 1, 0 }, .color = 0xFFFFFFFF},

    //back
    {.a = 6, .b = 5, .c = 7,  .a_uv = { 0, 0 }, .b_uv = { 0, 1 }, .c_uv = { 1, 1 }, .color = 0xFFFFFFFF},
    {.a = 6, .b = 7, .c = 8,  .a_uv = { 0, 0 }, .b_uv = { 1, 1 }, .c_uv = { 1, 0 }, .color = 0xFFFFFFFF},

    //left
    {.a = 8, .b = 7, .c = 2,  .a_uv = { 0, 0 }, .b_uv = { 0, 1 }, .c_uv = { 1, 1 }, .color = 0xFFFFFFFF},
    {.a = 8, .b = 2, .c = 1,  .a_uv = { 0, 0 }, .b_uv = { 1, 1 }, .c_uv = { 1, 0 }, .color = 0xFFFFFFFF},

    //top
    {.a = 2, .b = 7, .c = 5,  .a_uv = { 0, 0 }, .b_uv = { 0, 1 }, .c_uv = { 1, 1 }, .color = 0xFFFFFFFF},
    {.a = 2, .b = 5, .c = 3,  .a_uv = { 0, 0 }, .b_uv = { 1, 1 }, .c_uv = { 1, 0 }, .color = 0xFFFFFFFF},

    //bottom
    {.a = 6, .b = 8, .c = 1,  .a_uv = { 0, 0 }, .b_uv = { 0, 1 }, .c_uv = { 1, 1 }, .color = 0xFFFFFFFF},
    {.a = 6, .b = 1, .c = 4,  .a_uv = { 0, 0 }, .b_uv = { 1, 1 }, .c_uv = { 1, 0 }, .color = 0xFFFFFFFF},
};
```

```c
        if (render_method == RENDER_TEXTURED || render_method == RENDER_TEXTURED_WIRE)
        {
            draw_textured_triangle(
                triangle.points[0].x, triangle.points[0].y, triangle.texcoords[0].u, triangle.texcoords[0].v,
                triangle.points[1].x, triangle.points[1].y, triangle.texcoords[1].u, triangle.texcoords[1].v,
                triangle.points[2].x, triangle.points[2].y, triangle.texcoords[2].u, triangle.texcoords[2].v,
                mesh_texture
            );
        }
```

# 贴图三角形
![20240714-234754.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250104182950067.jpeg?imageSlim)



# 纹理着色平底三角形

```c
void draw_textured_triangle(
    int x0, int y0, float u0, float v0,
    int x1, int y1, float u1, float v1,
    int x2, int y2, float u2, float v2,
    uint32_t* texture
    ){
       // We need to sort the vertices by y-coordinate ascending (y0 < y2)
    if (y0 > y1)
    {
        int_swap(&y0, &y1);
        int_swap(&x0, &x1);
        float_swap(&u0, &u1);
        float_swap(&v0, &v1);
    }
    if(y1 > y2)
    {
        int_swap(&y1, &y2);
        int_swap(&x1, &x2);
        float_swap(&u1, &u2);
        float_swap(&v1, &v2);
    }
    if (y0 > y1)
    {
        int_swap(&y0, &y1);
        int_swap(&x0, &x1);
        float_swap(&u0, &u1);
        float_swap(&v0, &v1);
    }

    // Create vector points after we sort the vertices
    vec2_t point_a = { x0, y0 };
    vec2_t point_b = { x1, y1 };
    vec2_t point_c = { x2, y2 };

    //////////////////////////////////////////////////////    
    // Render the upper part of the triangle (flat-bottom)
    //////////////////////////////////////////////////////
    float inv_slope_1 = 0;
    float inv_slope_2 = 0;

    if (y1 - y0 != 0) inv_slope_1 = (float)(x1 - x0) / abs(y1 - y0);
    if (y2 - y0 != 0) inv_slope_2 = (float)(x2 - x0) / abs(y2 - y0);
    if(y1 - y0 != 0){
        for (int y = y0; y <= y1; y++)
        {
            int x_start = x1 + (y - y1) * inv_slope_1;
            int x_end = x0 + (y - y0) * inv_slope_2;

            if (x_end < x_start)
            {
                int_swap(&x_start, &x_end); // swap if xstart is to the right of x end
            }
            

            for (int x = x_start; x < x_end; x++)
            {
                draw_texel(x, y, 0xFFFF00FF);
            }
        }
    }

}
```

# 纹理着色平顶三角形

```c
void draw_textured_triangle(
    int x0, int y0, float u0, float v0,
    int x1, int y1, float u1, float v1,
    int x2, int y2, float u2, float v2,
    uint32_t* texture
    ){
    ......
    //////////////////////////////////////////////////////    
    // Render the bottom part of the triangle (flat-top)
    //////////////////////////////////////////////////////   
    inv_slope_1 = 0;
    inv_slope_2 = 0;

    if (y2 - y1 != 0) inv_slope_1 = (float)(x2 - x1) / abs(y2 - y1);
    if (y2 - y0 != 0) inv_slope_2 = (float)(x2 - x0) / abs(y2 - y0);
    if(y2 - y1 != 0){
        for (int y = y1; y <= y2; y++)
        {
            int x_start = x1 + (y - y1) * inv_slope_1;
            int x_end = x0 + (y - y0) * inv_slope_2;

            if (x_end < x_start)
            {
                int_swap(&x_start, &x_end); // swap if xstart is to the right of x end
            }
            

            for (int x = x_start; x < x_end; x++)
            {
                draw_texel(x, y, 0xFFFF00FF);
            }
        }
    }

}
```

# 重心坐标系
![20240714-212337.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250104183110967.jpeg?imageSlim)

![20240714-212341.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250104183214941.jpeg?imageSlim)


# 重心权重（α，β，γ）

## α计算
![20240714-213824.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250104183230416.jpeg?imageSlim)

## β计算![20240714-213829.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250104183257107.jpeg?imageSlim)
![20240714-213816.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250104183305903.jpeg?imageSlim)


## γ计算

![20240714-213811.jpeg](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250104183335559.jpeg?imageSlim)


> 计算α和β时分子为什么不选择其他两条边的组合？

三角形选择哪两条边进行叉积并不重要，只要结果符合预期的面积计算和符号要求即可。即我们也可以在计算β时选择PCxPA作为分子同样有面积的几何意义，并且在左手坐标系下结果方向朝向显示器内部。

# 重心权重函数计算（α，β，γ）

```c
vec3_t barycentric_weight(vec2_t a, vec2_t b, vec2_t c, vec2_t p){
    // Find the vectors between the vertices ABC and point p
    vec2_t ac = vec2_sub(c, a);
    vec2_t ab = vec2_sub(b, a);
    vec2_t ap = vec2_sub(p, a);
    vec2_t pc = vec2_sub(c, p);
    vec2_t pb = vec2_sub(b, p);

    // Compute the area of the full parallegram/triangle ABC using 2D cross product
    float area_parallelogram_abc = (ac.x * ab.y - ac.y * ab.x); // || AC x AB ||

    float alpha = (pc.x * pb.y - pc.y * pb.x) / area_parallelogram_abc;

    float beta = (ac.x * ap.y - ac.y * ap.x) / area_parallelogram_abc;

    float gamma = 1 - alpha - beta;
    vec3_t weights = { alpha, beta, gamma };

    return weights;
}
```

# 可视化纹理着色三角形

```c
///////////////////////////////////////////////////////////////////////////////  
// Function to draw the textured pixel at position x and y using unterpolation
//////////////////////////////////////////////////////////////////////////////
void draw_texel(int x, int y, uint32_t* texture, vec2_t point_a, vec2_t point_b, vec2_t point_c, float u0, float v0, float u1, float v1, float u2, float v2)
{
    vec2_t point_p = { x, y };

    vec3_t weights = barycentric_weight(point_a, point_b, point_c, point_p);

    float alpha = weights.x;
    float beta = weights.y;
    float gamma = weights.z;

    // Perform the interpolation of all U and V values using barycentric weights
    float Interpolated_u = (u0) * alpha + (u1) * beta + (u2) * gamma;
    float Interpolated_v = (v0) * alpha + (v1) * beta + (v2) * gamma;

    // Map the UV coordinates
    int tex_x = abs((int)(Interpolated_u * texture_width));
    int tex_y = abs((int)(Interpolated_v * texture_height));

    draw_pixel(x, y, texture[(texture_width * tex_y) + tex_x]);
}
```

```c

void draw_textured_triangle(
    int x0, int y0, float u0, float v0,
    int x1, int y1, float u1, float v1,
    int x2, int y2, float u2, float v2,
    uint32_t* texture
    ){
       // We need to sort the vertices by y-coordinate ascending (y0 < y2)
    if (y0 > y1)
    {
        int_swap(&y0, &y1);
        int_swap(&x0, &x1);
        float_swap(&u0, &u1);
        float_swap(&v0, &v1);
    }
    if(y1 > y2)
    {
        int_swap(&y1, &y2);
        int_swap(&x1, &x2);
        float_swap(&u1, &u2);
        float_swap(&v1, &v2);
    }
    if (y0 > y1)
    {
        int_swap(&y0, &y1);
        int_swap(&x0, &x1);
        float_swap(&u0, &u1);
        float_swap(&v0, &v1);
    }

    // Create vector points after we sort the vertices
    vec2_t point_a = { x0, y0 };
    vec2_t point_b = { x1, y1 };
    vec2_t point_c = { x2, y2 };

    //////////////////////////////////////////////////////    
    // Render the upper part of the triangle (flat-bottom)
    //////////////////////////////////////////////////////
    float inv_slope_1 = 0;
    float inv_slope_2 = 0;

    if (y1 - y0 != 0) inv_slope_1 = (float)(x1 - x0) / abs(y1 - y0);
    if (y2 - y0 != 0) inv_slope_2 = (float)(x2 - x0) / abs(y2 - y0);
    if(y1 - y0 != 0){
        for (int y = y0; y <= y1; y++)
        {
            int x_start = x1 + (y - y1) * inv_slope_1;
            int x_end = x0 + (y - y0) * inv_slope_2;

            if (x_end < x_start)
            {
                int_swap(&x_start, &x_end); // swap if xstart is to the right of x end
            }
            

            for (int x = x_start; x < x_end; x++)
            {
                draw_texel(x, y, texture, point_a , point_b, point_c, u0, v0, u1, v1, u2, v2);
            }
        }
    }

    //////////////////////////////////////////////////////    
    // Render the upper part of the triangle (flat-top)
    //////////////////////////////////////////////////////   
    inv_slope_1 = 0;
    inv_slope_2 = 0;

    if (y2 - y1 != 0) inv_slope_1 = (float)(x2 - x1) / abs(y2 - y1);
    if (y2 - y0 != 0) inv_slope_2 = (float)(x2 - x0) / abs(y2 - y0);
    if(y2 - y1 != 0){
        for (int y = y1; y <= y2; y++)
        {
            int x_start = x1 + (y - y1) * inv_slope_1;
            int x_end = x0 + (y - y0) * inv_slope_2;

            if (x_end < x_start)
            {
                int_swap(&x_start, &x_end); // swap if xstart is to the right of x end
            }
            

            for (int x = x_start; x < x_end; x++)
            {
                draw_texel(x, y, texture, point_a , point_b, point_c, u0, v0, u1, v1, u2, v2);
            }
        }
    }

```