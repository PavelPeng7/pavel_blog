---
title: "8. 固定时间步长（Fixed Time Step）"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

![iShot_2024-06-02_00.19.58.gif](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227152650123.gif?imageSlim)
# SDL_Delay与Busy-Waiting方法

目的：实现固定时间步长，使每帧的更新时间间隔保持一致。

## **Busy-Waiting（忙等）**

```c
void update(void) {
    while (!SDL_TICKS_PASSED(SDL_GetTicks(), previous_frame_time + FRAME_TARGET_TIME));

    previous_frame_time = SDL_GetTicks();
}
```

Busy-Wating(忙等)的定义：程序通过一个while循环不停地检查当前时间与目标时间的差异，以确定是否达到了帧目标时间。

效率问题：这种方法会占用大量CPU资源，因为它在等待的过程中没有进行任何有用的工作，只是不断地循环检查时间。

## **SDL_Delay**

```c
//Wait some time util the reach the target frame time in milliseconds
int time_to_wait = FRAME_TARGET_TIME - (SDL_GetTicks() - previous_frame_time);

//Only delay execution if we are running too fast
if (time_to_wait > 0 && time_to_wait <= FRAME_TARGET_TIME)
{
    SDL_Delay(time_to_wait);
}

previous_frame_time = SDL_GetTicks();
```

当等待时间大于0且小于等于目标时间，调用SDL_Delay函数进行延迟。这种方法的优势是SDL_Delay会让出CPU的控制权，使得CPU可以执行其他任务而不是在忙等中浪费资源。