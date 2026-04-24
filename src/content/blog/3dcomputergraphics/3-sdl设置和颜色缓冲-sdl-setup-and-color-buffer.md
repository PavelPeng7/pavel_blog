---
title: "3. SDL设置和颜色缓冲（SDL Setup and Color Buffer）"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

# 1.Creating an SDL Window

## MacOS中无法找到SDL2库文件

## 通过pkg-config解决

安装pkg-config

```c
brew install pkg-config
```

在macos使用pkg-config来获取SDL2的编译和链接选项

```c
gcc -Wall -std=c99 $(pkg-config --cflags sdl2) -o renderer main.c $(pkg-config --libs sdl2)
```

# 2. Rendering an SDL Window

初始化SDL窗口和渲染器。

1. 初始化SDL库

```c
if (SDL_Init(SDL_INIT_EVERYTHING) != 0){
    fprintf(stderr, "Error initializing SDL.\\n");
    return false;
}
```

使用SDL_Init初始化SDL库，传入SDL_INIT_EVERYTHING以初始化所有的SDL子系统。如果初始化失败，打印错误信息并返回false。

1. 查询显示模式

```c
SDL_DisplayMode display_mode;
SDL_GetCurrentDisplayMode(0, &display_mode);

window_width = display_mode.w;
window_height = display_mode.h;
```

使用SDL_GetCurrentDisplayMode查询当前设备的分辨率。获取屏幕的宽度和高度，并将其存储在window_width和window_height变量中。

1. 创建SDL窗口

```c
window = SDL_CreateWindow(
    NULL, 
    SDL_WINDOWPOS_CENTERED,
    SDL_WINDOWPOS_CENTERED,
    window_width,
    window_height,
    SDL_WINDOW_BORDERLESS
);
if(!window){
    fprintf(stderr, "Error creating SDL window");
    return false;
}
```

使用SDL_CreatWindow创建一个SDL窗口。窗口的大小设置为全屏的宽度和高度，窗口位置居中，窗口无边框。如果窗口创建失败，打印错误信息并返回false。

1. 创建SDL渲染器

```c
renderer = SDL_CreateRenderer(window, -1, 0);
if(!renderer){
    fprintf(stderr, "Error creating SDL renderer.\\n");
    return false;
}
```

使用SDL_CreateRenderer创建一个SDL渲染器，关联到之前创建的窗口。如果渲染器创建失败，打印错误信息并返回false。

1. 设置窗口为全屏显示

```c
SDL_SetWindowFullscreen(window, SDL_WINDOW_FULLSCREEN);
```

使用SDL_SetWindowFullscreen将窗口设置为全屏模式。

# 3. Declaring a color buffer

1. 为颜色缓冲区分配内存

```c
color_buffer = (uint32_t*)malloc(sizeof(uint32_t) * window_width * window_height);
```

在setup阶段中，使用malloc函数分配内存。分配的内存大小为window_width * window_height个uint32_t（每个uint32_t通常表示一个像素的颜色值，32位）。

color_buffer是一个指向uint32_t类型的指针，用于存储屏幕上每个像素的颜色。

> 指针是什么？

指针式编程中存储内存地址的变量，他允许直接操作内存实现高效的内存管理和数据访问。在以上代码中color_buffer是一个指向uint32_t类型无符号32位整数（8888）的内存地址用来存储颜色数据的缓冲区。

# 4. Allocating Memory and Freeing Resources

```c
void destroy_window(void){
    free(color_buffer);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
}
```

在退出时正确释放所有资源，防止资源泄露，确保系统资源在程序退出时得到正确回收。

- 颜色缓冲区的动态内存
- SDL渲染器
- SDL窗口
- 关闭SDL库

# 5. SDL Texture

```c
color_buffer_texture = SDL_CreateTexture(
    renderer,
    SDL_PIXELFORMAT_ARGB8888,
    SDL_TEXTUREACCESS_STREAMING,
    window_width,
    window_height
);
```

在setup阶段中，创建一个与窗口尺寸相同的SDL纹理，用于显示颜色缓冲区中的内容。

renderer：指向之前创建的SDL渲染器。

SDL_PIXELFORMAT_ARGB8888：指定纹理的像素格式为32位ARGB（Alpha, Red, Green, Blue，每个分量8位）。

SDL_TEXTUREACCESS_STREAMING：指定纹理的访问方式为流式访问，这允许你锁定纹理并直接访问其像素数据。

window_width和window_height：指定纹理的宽度和高度，应该与窗口的宽度和高度一致。

# 6.Full Screen Window

# 7. Exercise Drawing a Background Grid