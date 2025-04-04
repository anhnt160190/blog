---
title: "save quick set up nfs"
publishDate: "2023-07-18"
description: "Note"
tags: ["NFS"]
---

server_ip: 10.2.15.149
client_ip: 10.2.15.148

## cài nfs-server

```bash
sudo apt update -y
sudo apt install nfs-kernel-server -y
sudo mkdir /nfs
sudo chown nobody:nogroup /nfs
vi /etc/exports
/nfs	10.2.15.0/24(rw,sync,no_subtree_check)
sudo systemctl restart nfs-kernel-server
```

## nfs-client

```bash
vi /etc/exports
sudo apt update -y
sudo apt install nfs-common
sudo mkdir /nfs-mount
sudo mount -t /nfs -o nfsvers=3 10.2.15.149:/nfs /nfs-mount
# verify
df -h
```