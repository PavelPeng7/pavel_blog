---
title: "GPUInstance+Hi-z Map Occlusion Culling+FrustumeCulling绘制草（上）"
description: "草的实例化生成和裁剪部分详解"
pubDate: 2024-12-27
heroImage: "/img/post-bg-star-kribi.jpg"
tags: ["Unity", "GPUInstance", "性能优化"]
---

![Snipaste_2024-12-26_23-35-45.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227125852952.png?imageSlim)
裁剪结果

![Snipaste_2024-12-26_21-35-02.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227125910629.png?imageSlim)
裁剪前

![Snipaste_2024-12-26_21-34-06.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227125934560.png?imageSlim)
裁剪后

这篇文章主要总结GPUInstance读取草的数据，处理剔除，实例化生成。

# 收集场景中的Prefab草和Terrain绘制的草的数据写入json

想要绘制草那先得有每颗草的一些基本信息，位置，大小，旋转以及根据草密度计算的ao值。

对于Prefab直接放置在场景中的草很容易收集它们的这些信息，在场景中遍历那些使用草预制体的对象。而Terrain Detail中生成的草就稍微麻烦一点。

## 获取TerrainData中草数据

这一步的主要目标是通过DetailLayer中存储的xz方向的位置找到其对应的高度坐标。

首先先认识一下地形的数据：
![Snipaste_2024-11-03_21-09-38.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227130351871.png?imageSlim)

在这个案例中各个地形参数对生成草的影响如下
![iShot_2024-12-27_13.02.02.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227130219118.png?imageSlim)

- 在这个绘制方法下DetailResolution与HeightMapResolution最好相同

```csharp
        detailLayer = terrainData.GetDetailLayer(0, 0, terrainData.detailWidth, terrainData.detailHeight,0);
        heightLayer = terrainData.GetHeights(0, 0, terrainData.heightmapResolution, terrainData.heightmapResolution);
        
```

[Unity - Scripting API: TerrainData.GetDetailLayer](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/TerrainData.GetDetailLayer.html)

[Unity - Scripting API: TerrainData.GetHeights](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/TerrainData.GetHeights.html)

```csharp
        for (int y = 0; y < terrainData.detailHeight; y++) {
            for (int x = 0; x < terrainData.detailWidth; x++) {
                if (detailLayer[x, y] > 0) 
                {
											......
                }
                }
```

采样detailLayer在有绘制草的地方计算写入json的草的相关信息。

## 计算密度AO
![Snipaste_2024-11-08_23-16-54.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227130320688.png?imageSlim)
输出密度值

这中间还有根据密度计算ao，目前只支持地形草通过采样detailLayer一定范围内草的数量除以这个范围的面积的到密度，然后转换成ao，效果也就是越密的地方越暗。

```csharp
        for (int y = 0; y < terrainData.detailHeight; y++)
        {
            for (int x = 0; x < terrainData.detailWidth; x++)
            {
                if (detailLayer[x, y] > 0)
                {
										......

                    float nx = (float)x / (float)terrainData.detailWidth;
                    float ny = (float)y / (float)terrainData.detailHeight;

										......
                    int AORadius = 3;
                    int dx = AORadius;
                    int dy = AORadius;

                    float TotalAOCount = (dx * 2 + 1) * (dy * 2 + 1);
                    float aoCount = 0;

                    ......

                    for (int i = -dx; i <= dx; i++)
                    {
                        for (int j = -dy; j <= dy; j++)
                        {
                            int x_sample = x + i;
                            int y_sample = y + j;

                            if (x_sample >= 0 && x_sample < terrainData.detailWidth && y_sample >= 0 &&
                                y_sample < terrainData.detailHeight)
                            {
                                if (detailLayer[x_sample, y_sample] != 0)
                                {
                                    aoCount++;
                                    ......
                                }
                            }
                        }
                    }

                    ......

                    float ao = aoCount / TotalAOCount;
                    AOList.Add(ao);
                }
            }
        }
```

## 计算平均法线

承接上文找到采样范围内的所有草并且将其法线（地形法线）相加然后归一化，写入中心草的平滑法线。

```jsx
        for (int y = 0; y < terrainData.detailHeight; y++)
        {
            for (int x = 0; x < terrainData.detailWidth; x++)
            {
                if (detailLayer[x, y] > 0)
                {
										......

                    float nx = (float)x / (float)terrainData.detailWidth;
                    float ny = (float)y / (float)terrainData.detailHeight;

                    // Vector3 TerrainNormal = terrainData.GetInterpolatedNormal(ny, nx);
                    GrassNormals.Add(terrainData.GetInterpolatedNormal(ny, nx)); //
										......
                    Vector3 SmoothNormal = Vector3.zero;

                    for (int i = -dx; i <= dx; i++)
                    {
                        for (int j = -dy; j <= dy; j++)
                        {
                            int x_sample = x + i;
                            int y_sample = y + j;

                            if (x_sample >= 0 && x_sample < terrainData.detailWidth && y_sample >= 0 &&
                                y_sample < terrainData.detailHeight)
                            {
                                if (detailLayer[x_sample, y_sample] != 0)
                                {
                                    ......
                                    SmoothNormal += terrainData.GetInterpolatedNormal(x_sample, y_sample);
                                }
                            }
                        }
                    }

                    GrassSmoothNormals.Add(SmoothNormal.normalized);
										......
                  
                }
            }
        }
```

# 剔除

## 视锥体剔除

原理是向ComputeShader传入一个buffer包含草的位置信息等，以这个位置做剔除测试，通过则写入另外一个剔除后最终绘制的buffer。

```csharp
    float3 pos = cullingInput[id.x].PositionAndSize.xyz;
    pos.y += 1;
```

在ComputeShader中对于草应该计算一个aabb包围盒，但是为了优化性能可以将检测目标调整为trick为草顶部位置（选择底部位置测试会导致草顶还在视口内却突然被剔除了）。

```csharp
    float4 posWS = float4(pos,1);
    float4 posCS = mul(VP,posWS);
```

转换到裁剪空间方便检测

> 为什么转换到裁剪空间，相机空间不行吗？

因为对于视锥体剔除来说，在裁剪空间和相机空间都行，但是相机空间就需要定义裁剪视锥体的六个面，而在裁剪空间中只需要跟标准NDC空间做判断，更简单效率高。并且人家叫裁剪空间目的就是裁剪。



```csharp
    if(posCS.w > MaxViewDistance)
        return;
```

首先是最大距离剔除，深度大于设定最大深度的草将不会写入返回的buffer中。

> 为什么是用w值进行深度检测？

因为经过VP矩阵（View and Projection）转换位置被转换到了裁剪空间中，z值被写到了w值中。原始的z位置已经被压缩到裁剪视锥体空间中。这时候的z值已经不能代表相机空间的深度了，使用它会导致误差。

![iShot_2024-12-27_13.07.57.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227130931977.png?imageSlim)
投影矩阵

这里涉及到投影的原理可前往[投影矩阵](https://pavelpeng7.github.io/2024/12/27/%E8%AF%BE18.-%E6%8A%95%E5%BD%B1%E7%9F%A9%E9%98%B5-Projection-Matrix/)复习

```csharp
    float size = 1.2;
    if(!(posCS.x<size&&posCS.x>-size  &&  posCS.z<size&&posCS.z>0  &&  posCS.y<size&&posCS.y>-size))
        return;
```

然后就是视锥体裁剪的执行了在x，y，z方向上跟1，-1作比较在其中的继续，不在其中的舍去。

> 为什么size设置为1.2？

扩大剔除保留的范围，留点出血线。

## Hi-z map Occlusion Culling

```csharp
float scSize = 0.2 / (tan(cmrHalfFov * 3.1415926 / 360)* posCS.w) * 1024;
```

首先计算草的世界空间中的高度0.2转换到屏幕空间中，并且应用透视除法。乘以1024是对应到Hi-z map中的像素大小

![iShot_2024-12-27_13.04.36.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227131000005.png?imageSlim)


投影中视角的计算公式

```csharp
uint mips = (uint)clamp(log2(scWid), 0, 7);
```

这行代码基于上一步计算的屏幕宽度，使用对数函数 log2 确定最合适的 MIP 映射级别。clamp 函数确保这个值在 0 到 7 的范围内。

> 为什么通过log2函数确定MIP映射的级别？

首先了解MIP映射：

MIP 映射是一种纹理技术，用于处理物体距离观察者不同距离时的纹理显示问题。随着距离的增加，物体表面上的纹理需要更少的细节，因此使用较低分辨率的纹理可以节省处理资源并减少走样现象。MIP 映射基本上是预先计算并存储多级纹理图像，每一级纹理的分辨率是前一级的一半，即每个维度上的像素数减半。

所以举例来说近处的草假设有16个像素即2的4次幂，log2计算后对应的mip级别是4，远处的草有4像素对应的mip级别是2。这样就能计算出这根草在进行遮挡剔除时需要与缩放级别多大的深度图作比较，远处的草需要高精度的比较，而近处的草需要低精度的比较。

```csharp
uint texScale = 1 << mips;
```

通过移位操作计算出基于MIP级别的纹理缩放比例。如：

- mips = 0， 1 << 0 结果是1，纹理尺寸不变
- mips = 2， 1 << 2结果是4，纹理尺寸是原始尺寸的1/4
- mips = 4， 1 << 4结果是16，纹理尺寸是原始尺寸的1/16

```csharp
uint2 uv = uint2(posCS.xy * (1024 / texScale));
```

这里使用裁剪空间坐标的 x 和 y 值（posCS.xy），根据纹理尺度调整后计算出纹理坐标。

```csharp
float minD = min(min(HZB_Depth.mips[mips][uv.xy + uint2(0, 0)].r,
                    HZB_Depth.mips[mips][uv.xy + uint2(0, 1)].r),
                min(HZB_Depth.mips[mips][uv.xy + uint2(1, 0)].r,
                    HZB_Depth.mips[mips][uv.xy + uint2(1, 1)].r));
```

从深度纹理的MIP级别中获取四个相邻深度值，并找出最小值。这用于深度测试，以确定片段是否被遮挡。

```csharp
if (minD > posCS.z)
    return;
```

如果计算得到的最小深度值（从HZB纹理）大于当前片段的深度值（posCS.z），则该片段被认为是被遮挡的，因此被裁剪掉。

```csharp
cullresult.Append(cullingInput[id.x]);
```

最后将通过视锥体裁剪，和Hi-z Culling的草从输入buffer转到需要输出渲染的buffer中

[补充阅读图解Hi-z Map Occlusion原理](https://www.notion.so/Hi-z-Map-Occlusion-16889943c9a7804a890ce2a131eb9b53?pvs=21)

## Hi-z map Generation

原理是将unity深度图通过循环每次降RT一半大小，然后通过shader处理将上一次的结果映射到缩小一半后RT,将每次的结果复制回RT的各级mip上。

```csharp
        while (h > 8)
        {
            hzbMat.SetVector(ID_InvSize, new Vector4(1.0f / w, 1.0f / h, 0, 0));

            tempRT = RenderTexture.GetTemporary(w, h, 0, hzbDepth.format);
            tempRT.filterMode = FilterMode.Point;
            if (lastRt == null)
            {
                //Copy Unity的深度图 
                Graphics.Blit(Shader.GetGlobalTexture(ID_CameraDepthTexture), tempRT);
            }
            else
            {
                hzbMat.SetTexture(ID_DepthTexture, lastRt);
                Graphics.Blit(null, tempRT, hzbMat);//mip op
                RenderTexture.ReleaseTemporary(lastRt);
            }
            
            //将 各级RT 复制到 Depth的Mip
            Graphics.CopyTexture(tempRT, 0, 0, hzbDepth, 0, level);
            lastRt = tempRT;

            w /= 2;
            h /= 2;
            level++;
        }
```

*注意tempRT的过滤模式为Point

```csharp
                float2 invSize = _InvSize.xy;
                float2 inUV = input.uv;

                float depth = HizDepth(_DepthTexture, inUV, invSize);
```

```csharp
            float HizDepth(sampler2D depthTex, float2 inUV, float2 invSize)
            {
                float4 depth;
                float2 uv0 = inUV + float2(-0.25f, -0.25f) * invSize;
                float2 uv1 = inUV + float2(0.25f, -0.25f) * invSize;
                float2 uv2 = inUV + float2(-0.25f, 0.25f) * invSize;
                float2 uv3 = inUV + float2(0.25f, 0.25f) * invSize;

                depth.x = tex2D(depthTex, uv0);
                depth.y = tex2D(depthTex, uv1);
                depth.z = tex2D(depthTex, uv2);
                depth.w = tex2D(depthTex, uv3);
                #if defined(UNITY_REVERSED_Z)
                    return min(min(depth.x, depth.y), min(depth.z, depth.w));//1->0
                #else
								    return max(max(depth.x, depth.y), max(depth.z, depth.w));//0->1
                #endif
            }
```

> 为什么偏移量是0.25？

因为每次缩放是0.5倍，相当于要将上一个RT的2x2的像素范围压缩到中间一个像素。

从一个纹理中取样时，通常想要从接近四个像素中心的位置取样，这样可以在减小纹理尺寸时获得代表周围区域的平均或最小/最大深度值。因此，通过将 UV 坐标偏移 ±0.25 * 纹理尺寸的倒数（invSize），可以确保从四个像素的中心附近取样。

> 为什么最后返回最小深度？

在使用层次化深度缓冲时，每一级深度图代表了更大区域的深度信息的汇总。选择最小深度值作为这一区域的代表是为了保守估计哪些像素可能被遮挡： • 如果一个查询的深度值（即尝试渲染的物体的深度）大于Hi-Z缓冲中的最小深度值，那么可以安全地认为该查询像素是被遮挡的，因为至少有一个更靠近观察者的像素已经占据了这个空间。

# 执行绘制

```csharp
        // Update starting position buffer
        if (cachedMaxDetailInstanceCount != DetailMaxInstanceCount || cachedDetailMeshIndex != subDetailMeshIndex)
            UpdateDetailDataBuffer();
```

在执行绘制之前确保DetailMaxInstanceCount和subDetailMeshIndex是否已被应用，没有的话就说明关于草绘制的设置有些修改需要更新草的buffer。

```csharp
    void UpdateDetailDataBuffer() {
		    // 准备用于剔除的所有草信息的ComputeBuffer
		    // 设置GPU绘制需要的Indirect Args
    }
```

如上所示UpdateDetailDataBuffer就干两件事，且一件与DetailMaxInstanceCount有关决定Buffer大小，一件与subDetailMeshIndex有关决定绘制哪个subMesh。

```csharp
        // 设置Indirect Args
        // Indirect DetailArgs
        if (instanceDetailMesh) {
            DetailArgs[0] = (uint)instanceDetailMesh.GetIndexCount(subDetailMeshIndex);
            // DetailArgs[1] = (uint) DetailMaxInstanceCount; 渲染数量在裁剪之后在设置
            DetailArgs[2] = (uint)instanceDetailMesh.GetIndexStart(subDetailMeshIndex);
            DetailArgs[3] = (uint)instanceDetailMesh.GetBaseVertex(subDetailMeshIndex);
        }
        else {
            DetailArgs[0] = DetailArgs[1] = DetailArgs[2] = DetailArgs[3] = 0;
        }

        DetailArgsBuffer.SetData(DetailArgs);
```

请注意在设置DetailArgs[1]时也就是绘制数量先空着，这个等到裁剪后的Buffer结果中取出来。

```csharp
        //初始化 Compute Shader 
        FrustumCullingComputeShader.SetBuffer(kernel, input_ID, DetailMeshPropertyBuffer);
        DetailMeshPropertyBufferCulling.SetCounterValue(0);
        FrustumCullingComputeShader.SetBuffer(kernel, cullresult_ID, DetailMeshPropertyBufferCulling);
        FrustumCullingComputeShader.SetInt(instanceCount_ID, DetailMaxInstanceCount);

        //获取 VP矩阵 并传入 Compute Shader
        var V = mainCamera.worldToCameraMatrix;
        var P = GL.GetGPUProjectionMatrix(mainCamera.projectionMatrix, false);
        var VP = P * V;
        Shader.SetGlobalMatrix(VP_ID, VP);

        Shader.SetGlobalFloat(MaxViewDistance_ID, MaxViewDistance);

        if (HZB_Depth != null) {
            FrustumCullingComputeShader.SetTexture(kernel, HZB_Depth_ID, HZB_Depth);
        }

        FrustumCullingComputeShader.SetBool(DoNotCulling_ID, DoNotCulling);
        FrustumCullingComputeShader.SetVector(cmrPos_ID, Camera.main.transform.position);
        FrustumCullingComputeShader.SetVector(cmrDir_ID, Camera.main.transform.forward);
        FrustumCullingComputeShader.SetFloat(cmrHalfFov_ID, Camera.main.fieldOfView / 2);

```

初始化ComputeShader中的变量：

- DetailMeshPropertyBuffer
- DetailMeshPropertyBufferCulling
- DetailMaxInstanceCount
- VP
- MaxViewDistance
- DoNotCulling
- Camera.main.transform.position
- Camera.main.transform.forward
- Camera.main.fieldOfView / 2

```csharp
        //Compute Shader 开始工作
        FrustumCullingComputeShader.Dispatch(kernel, 1 + (DetailMaxInstanceCount / 640), 1, 1);
```

执行ComputeShader

> 这里线程组的数量为什么是1 + (DetailMaxInstanceCount / 640)？

640是一个线程组中线程的数量，+1是为了避免整数除法向下取整导致最后一组实例（如果不是640的整数倍）没有被完全覆盖。如：1285/640等于2余5，但是整数除法中就得2，为了处理多出来的5个实例就需要加一个线程组。

```csharp
        if (updateCulling) {
            // 裁剪后计算出的结果 传入Shader
            instanceDetailMaterial.SetBuffer(DetailMeshPropertyBufferID, DetailMeshPropertyBufferCulling);
        }
        else {
            instanceDetailMaterial.SetBuffer(DetailMeshPropertyBufferID, DetailMeshPropertyBuffer);
        }
```

将裁减后的结果传入到实例材质的Buffer中。

```csharp
        //获取实际要渲染的数量
        ComputeBuffer.CopyCount(DetailMeshPropertyBufferCulling, DetailArgsBuffer, sizeof(uint)); //argus数组中 第二个参数是 渲染数量
```

复制裁剪后buffer的数量到ArgsBuffer中。

```csharp
        Vector3 terrainSize = terrainObject.terrainData.size;
        Vector3 terrainPosition = terrainObject.GetPosition();
        Vector3 boundsCenter = terrainPosition + new Vector3(terrainSize.x / 2, terrainSize.y / 2, terrainSize.z / 2);
        boundsCenter = new Vector3(0, 0, 0);
        
            Graphics.DrawMeshInstancedIndirect(instanceDetailMesh, subDetailMeshIndex, instanceDetailMaterial,
            new Bounds(boundsCenter, terrainSize * 2),
            DetailArgsBuffer, 0, null, ShadowCastingMode.On, true);
```

以terrain的原点为中心计算一个能包围到整个Terrain的包围盒。然后调用DrawMeshInstancedIndirect绘制。

![Snipaste_2024-11-09_00-50-09.png](https://pavelblog-images-1333471781.cos.ap-shanghai.myqcloud.com/undefined20241227130548872.png?imageSlim)
包围盒覆盖整个地形