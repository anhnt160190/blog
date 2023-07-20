---
title: "Mình đã set up K8S Cluster với Kubespray như thế nào"
date: "2023-07-10"
draft: false
path: "/blog/k8s-kubespray"
---

## Set up K8S Cluster vs kubespray

servers:

- 10.2.15.163
- 10.2.15.164
- 10.2.15.165

1. ssh to server create user that can sudo without password

```bash
sudo adduser kubespray
sudo visudo
```

add `kubespray ALL=(ALL) NOPASSWD: ALL` to end of file

2. add public_key to .ssh/authorized_keys

```bash
mkdir .ssh
chmod 700 .ssh
touch .ssh/authorized_keys
chmod 600 .ssh/authorized_keys
```

3. clone kubespray

```bash
git clone git@github.com:kubernetes-sigs/kubespray.git
git checkout 38ce02c6106b1fcd7a043c0bb0358881a1883c83
```

4. install dependencies

```bash
pip3 install -r requirements.txt
```

5. create inventory

```bash
declare -a IPS=(10.2.15.163 10.2.15.164 10.2.15.165)
CONFIG_FILE=inventory/sotalab_dev/hosts.yaml python3 contrib/inventory_builder/inventory.py ${IPS[@]}
```

6. modify hosts.yaml

```yaml
all:
  hosts:
    node1:
      ansible_host: 10.2.15.163
      ip: 10.2.15.163
      access_ip: 10.2.15.163
      ansible_user: kubespray
    node2:
      ansible_host: 10.2.15.164
      ip: 10.2.15.164
      access_ip: 10.2.15.164
      ansible_user: kubespray
    node3:
      ansible_host: 10.2.15.165
      ip: 10.2.15.165
      access_ip: 10.2.15.165
      ansible_user: kubespray
  children:
    kube_control_plane:
      hosts:
        node1:
        node2:
        node3:
    kube_node:
      hosts:
        node1:
        node2:
        node3:
    etcd:
      hosts:
        node1:
        node2:
        node3:
    k8s_cluster:
      children:
        kube_control_plane:
        kube_node:
    calico_rr:
      hosts: {}
```

7. run kubespray

```
ansible-playbook -i inventory/sotalab_dev/hosts.yaml --become --become-user=root cluster.yml
```

8. lấy kube_config file về local để access k8s cluster

file kube_config duoc luu o `/etc/kubernetes/admin.conf`

update `https://localhost:6443` thành `kubernetes.default.svc.cluster.local`

update /etc/hosts để resolve domain `kubernetes.default.svc.cluster.local` thành private_ip của các node

## Phân quyền

Mình sẽ tạo 1 user dành cho nhóm developer
Nhóm này sẽ chỉ có quyền truy cập vào namespace dev/staging và không có quyền access vào các namespace khác(nơi sẽ triển khai các init-services của cluster)

1. create token

```bash
kubectl create token shared-dev -n dev
```

9. list up init-services

- nginx-ingress
- vault
- dexidp
- argocd
