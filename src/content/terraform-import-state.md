---
title: "Một case terraform import state hơi lạ mình đã gặp"
date: "2023-05-14"
draft: false
path: "/blog/terraform-import-state"
---

## Tổng quan

Như một ngày bình thường mình nhận task từ leader. Nhiệm vụ của mình là import 1 AWS cognito user được tạo bằng tay trên AWS console vào terraform để quản lý bằng IAC.

Ban đầu mình nghĩ nó cũng chỉ là 1 case import khá là bình thường và mình vào [docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user) của terraform `aws_cognito_user` để xem.

Sau khi viết tf code mình thực hiện import state

Cú pháp import rất đơn giản:

```bash
terraform import aws_cognito_user.user user_pool_id/name
```

Mình apply ngay với case của mình:

```bash
terraform import aws_cognito_user.org_user user_pool_id/org/name
```

Thì tuyệt vời lỗi đập ngay vào mặt mình

```bash
error importing Cognito User. Must specify user_pool_id/username
```

Câu chuyện bắt đầu

## Solutions

Mình nhận thấy user của mình hơi đặc biệt 1 chút. User name là: `org/name` có 1 dấu `/` dẫn tới khi import cú pháp của mình có 2 dấu `/`.

Mình đoán rằng terraform nó không tách biệt được user_pool_id và user_name để thực hiện import.

Mình mò vào github và search đoạn code import của terraform.

Quả nhiên điều mình đoán đã đúng. Code hiện tại của terraform-provider-aws không support để import user có dấu `/`.

Mình quyết định tìm hướng giải quyết khác:

- tạo pull request để support case này vào [terraform-provider-aws](https://github.com/hashicorp/terraform-provider-aws/tree/a13a04f72ec61be611145b079c1017c1d4f0d119)
- kéo terraform state từ s3 về local, sửa lại và push force lên S3

Sau khi căn nhắc mình quyết định giải quyết theo solution 2. Lý do là mình lười =)) và không biết nếu tạo PR thì bao giờ code của mình được merge, lúc đó lại phát sinh các vấn đề về update version của aws provider.

Và dưới đây là script mình đã viết để handle issue trên:

```bash
#!/bin/bash
teraform state pull > current.tfstate

jq '.resources[.resources| length] |= . + {
    "mode": "managed",
    "type": "aws_cognito_user",
    "name": "cognito_user",
    "provider": "provider[\"registry.terraform.io/hashicorp/aws\"]",
    "instances": [
      {
        "schema_version": 0,
        "attributes": {
          "enabled": true,
          "force_alias_creation": null,
          "id": "user_pool_id/org/name",
          "status": "FORCE_CHANGE_PASSWORD",
          "sub": "1f152319-4321-4507-b315-54e34ba4cded",
          "temporary_password": null,
          "user_pool_id": "user_pool_id",
          "username": "org/name",
          "validation_data": null
        },
        "sensitive_attributes": [],
        "private": "bnVsbA==",
        "dependencies": []
      }
    ]
  }' current.tfstate > new.tfstate

terraform state push -force new.tfstate
```

Đến đây mình chạy lại `terraform apply` để cho các attributes của nó được match với terraform state.

Vậy là xong cho 1 ticket ngày hôm nay...
