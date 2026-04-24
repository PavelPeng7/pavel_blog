---
title: "22. 解码PNG文件（Decoding PNG Files）"
description: "3D Computer Graphics Programming"
pubDate: 2025-01-21
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

与动态数组类似的，站在巨人的肩膀上，我们需要引用这个解码png的工程
https://github.com/elanthis/upng
![cube.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250121184152837.png?imageSlim)
![iShot_2024-06-17_10.48.06.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250121184208266.png?imageSlim)

最初上的贴图颜色并没有对应上
![iShot_2024-06-17_10.51.53.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250121184230704.png?imageSlim)
查看解码贴图的工程说明，支持的是RGBA格式

```c
    //Creating a SDL texture that is used to display the color buffer
    color_buffer_texture = SDL_CreateTexture(
        renderer,
        SDL_PIXELFORMAT_ARGB8888,
        SDL_TEXTUREACCESS_STREAMING,
        window_width,
        window_height
    );
```

而我们写的颜色缓冲问题支持的是ARGB格式

[SDL2/SDL_PixelFormatEnum](https://wiki.libsdl.org/SDL2/SDL_PixelFormatEnum)

通过文档查看sdl支持的RGBA格式纹理，选择RGBA32作为颜色缓冲纹理的格式。
![iShot_2024-06-17_11.00.39.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250121184310480.png?imageSlim)
![iShot_2024-07-20_16.10.18.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20250121184413766.png?imageSlim)
根据作者提供的用法，我们得先声明一个upng_t类型指针，读取文件存到这个指针的内存中，在通过库中的方法去读取贴图存到uint32_t类型的数组缓冲区，再获得贴图的宽和高。

```c
void load_png_texture_data(char* filename){
    png_texture = upng_new_from_file(filename);
    if(png_texture != NULL){
        upng_decode(png_texture);
        if (upng_get_error(png_texture) == UPNG_EOK)
        {
            mesh_texture = (uint32_t*)upng_get_buffer(png_texture);
            texture_width = upng_get_width(png_texture);
            texture_height = upng_get_height(png_texture);
        }
    }
}
```

# 释放贴图内存

```c
void free_resources(void){
		......
    upng_free(png_texture);
		......
}
```