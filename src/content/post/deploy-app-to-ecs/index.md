---
title: "Triển khai hệ thống của bạn lên AWS ECS"
description: "Note"
publishDate: "2025-04-07"
Tags: ["AWS", "ECS", "Terraform"]
---

## Vấn đề

Gần đây mình nhận kha khá yêu cầu về việc triển khai 1 số lượng services/applications lên môi trường production với AWS. Số lượng services lại không đủ nhiều để dùng đến mấy con hàng xịn sò như K8S. Nhưng yêu cầu là dễ dàng scale. Cân nhắc thì mình thấy ECS khá là phù hợp. Triển khai nhanh gọn với docker image. Quản lý version cũng dễ, scale cũng đơn giản. Thế nên trong bài post này mình chia sẻ lại quá trình mình triển khai 1 hệ thống lên AWS ECS.

## Tổng quan

![system-architecture](./architecture.png)

Bạn có thể tham khảo chi tiết hoặc chỉnh sửa lại với [draw.io](https://drive.google.com/file/d/1HMUh1GcFb7kLKzcrpXw5GpCoIx_3XE-O/view?usp=sharing)

Về cơ bản thì các applications/databases mình sẽ triển khai ở private subnets. Để expose applications, mình khởi tạo 1 load balancer ở public subnets.
Với các trường hợp cần access vào databases ở private subnets, mình triển khai thêm 1 bastion host ở public subnet. Để tối ưu chi phí thì với bastion host này mình sẽ dùng spot instance và chỉ bật lên khi sử dụng.

Vì bên mình sử dụng Mongo Atlas để host MongoDB. Mình sẽ khởi tạo 1 VPC peer connection từ AWS đến mongodb atlas để khởi tạo secure connection.
Đồng thời sử dụng IamRole để cho phép access vào MongoDB.

Với các trường hợp bạn dùng SQL database, bạn có thể sử dụng RDS của AWS luôn.

## Triển khai

Terraform folder structure:

`modules`: share các terraform base modules

`envs`: khởi tạo base cho từng môi trường

`svc`: định nghĩa cho từng application/service

Bạn có thể xem chi tiết ở [đây](https://github.com/anhnt160190/ecs-terraform-example)

Để quản lý terraform state. Trước tiên ta cần khởi tạo 1 s3 bucket để lưu trữ terraform state.
Bước này không thể làm với terraform. Bạn có thể tạo trực tiếp trên console hoặc dùng cloudformation

với folder `envs`: đây là folder để khởi tạo các base services.

cấu trúc folder gồm có:

- .terraform-version: quản lý terraform version
- {index}-service.tf: mình dùng prefix index trước các service để đánh dấu thứ tự release ở lần release đầu tiên
- locals.tf: quản lý các local variable cho từng môi trường
- main.tf: khai báo provider và terraform backend

với folder `svc`: đây là folder để khởi tạo các application/service trong hệ thống

Cấu trúc folder gồm có

- base: khởi tạo các phần chung giống nhau giữa các môi trường
- dev/staging/prod: extends từ base và mở rộng theo môi trường

Tiếp theo ta sẽ chạy các command terraform để khởi tạo

```bash
cd envs/dev
terraform init
terraform plan -out=dev.tfplan -target="module.vpc" -target="module.base_vpc_endpoint"
terraform apply dev.tfplan
```

`-target="module.vpc" -target="module.base_vpc_endpoint"` được lấy từ file `0-vpc.tf`

tương tự với `1-acm.tf`, `2-alb.tf`, `3-ecs.tf` ta có:

```bash
# 1-acm.tf
terraform plan -out=dev.tfplan -target="module.acm" -target="module.acm_ue1"
terraform apply dev.tfplan
```

Sau khi ACM được khởi tạo ta cần verify domain owner trước khi khởi tạo ALB

```bash
# 2-alb.tf
terraform plan -out=dev.tfplan -target="module.alb"
terraform apply dev.tfplan

# 3-ecs.tf
terraform plan -out=dev.tfplan -target="module.ecs_cluster" -target="aws_security_group.ecs_service_sg"
terraform apply dev.tfplan
```

Sau khi các base services được khởi tạo ta làm tương tự với các svc/<applicaitons> để initiaze các applicaitons

## Tổng kết

Bài viết chia sẻ các bước để xây dựng/triển khai các applications lên AWS ECS với terraform
