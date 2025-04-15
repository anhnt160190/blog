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

### init web-admin

```bash
# init by vite
npm create vite@latest web-admin -- --template react-ts
cd web-admin
# install dependencies
npm install
# install tailwindcss(V4)
npm install tailwindcss @tailwindcss/vite
# install vite-plugin-federation
npm install @originjs/vite-plugin-federation
# install react-router(V7)
npm install react-router
```

Xem chi tiết init web-admin ở [đây](https://github.com/anhnt160190/mfe-example/commit/ab9a4cd05fb40e5141db341197f5c7035286bf28)

### init remote mfe-web-auth

```bash
# init by vite
npm create vite@latest mfe-web-auth -- --template react-ts
cd mfe-web-auth
# install dependencies
npm install
# install vite-plugin-federation
npm install @originjs/vite-plugin-federation
# install concurrently
npm install -D concurrently
```

Update `package.json` `scripts`

```json
"dev:watch": "vite build --watch",
"serve": "vite preview --port=4001",
"dev": "concurrently \"npm run dev:watch\" \"npm run serve\""
```
