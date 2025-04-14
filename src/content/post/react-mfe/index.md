---
title: "Triển khai micro frontend"
publishDate: "2025-04-11"
description: "Note"
tags: ["React", "Micro Frontend", "FE"]
---

## Vấn đề

Repo web-admin của bọn mình càng ngày càng phình to.
Nó đã to đến mức mà pipeline thường xuyên chạy vài giờ đồng hồ.
Và tần xuất timeout khi build repo càng ngày càng nhiều lên.

Đồng thời repo web-admin là repo share giữa rất nhiều team.
Việc share repo giữa nhiều team dẫn tới conflict code nhiều hơn và đội core web tốn nhiều thời gian để review code hơn.

FE leader đưa ra quyết định ứng dụng micro frontend để giải quyết các vấn đề trên.

Trong bài post này mình chia sẻ về các bước để triển khai micro frontend với Vite/React/TaildwindCSS.

## Triển khai
