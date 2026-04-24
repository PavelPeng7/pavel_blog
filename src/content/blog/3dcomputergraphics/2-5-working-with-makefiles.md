---
title: "2.5 Working with Makefiles"
description: "3D Computer Graphics Programming"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["软光栅", "计算机图形学", "3D Computer Graphics"]
---

```c
build:
	gcc -Wall -std=c99 ./src/*.c -o renderer
run:
	./renderer
clean:
	rm renderer
```

```c
gcc -Wall -std=c99 $(pkg-config --cflags sdl2) -o renderer main.c $(pkg-config --libs sdl2)
```

```c
# 使用 gcc 进行编译
CC = gcc

# 编译选项
CFLAGS = -Wall -std=c99 $(shell pkg-config --cflags sdl2)
LDFLAGS = $(shell pkg-config --libs sdl2)

# 源文件目录
SRCDIR = src

# 目标文件
TARGET = renderer

build:
	$(CC) $(CFLAGS) $(SRCDIR)/*.c -o $(TARGET) $(LDFLAGS)

run:
	./$(TARGET)

clean:
	rm -f $(TARGET)
```