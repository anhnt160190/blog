---
title: "My Ansible Note"
date: "2021-11-11"
draft: false
path: "/blog/my-ansible-note"
---

## Summary

I'm writing this post when I started to study Ansible. This post will help me to save every my knowledge with ansible.

Can refer full course in [repo](https://github.com/spurin/diveintoansible)

Ansible is a toolset, comprising of many tools, modules. Ansible is also an extensible framework

The Ansible core components:

1. modules
2. ansible executable
3. ansible-playbook executable
4. inventory

Some type of target to use Ansible

1. Hosts
2. Network Switches
3. Containers
4. Storage Arrays

## Getting started

- Install Ansible

Refer the [docs](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-with-pip)

Make sure your machine has python and pip

```bash
pip install ansible
```

- Setting Ansible lab

```bash
# clone repo
git clone https://github.com/spurin/diveintoansible-lab

# edit & verify env
cat .env

# start ansible-lab
docker-compose up -d
```

after start ansible lab. you can verify lab by access [http://localhost:1000/](http://localhost:1000/)

- Copy ssh-key from client to server

```bash
ssh-copy-id -o StrictHostKeyChecking=no ${USER}@${HOST}
```

## Ansible Inventories

```bash
.
├── ansible.cfg
├── hosts
├── hosts.yaml
```

```bash
# ansible.cfg
[default]
inventory = hosts
# inventory = hosts.yaml
host_key_checking = False
```

```bash
# hosts
[centos]
centos1 ansible_user=root ansible_port=22
centos2 ansible_user=root
centos3 ansible_user=root

[centos:vars]
ansible_user=root
ansible_port=2222

[ubuntu]
ubuntu1
ubuntu2
ubuntu3 ansible_become=true ansible_become_pass=password

[ubuntu:vars]
ansible_become=true
ansible_become_pass=password
```

```yaml
centos:
  hosts:
    centos1:
    centos2:
    centos3:
  vars:
    ansible_user: root
    ansible_port: 2222

ubuntu:
  hosts:
    ubuntu1:
    ubuntu2:
    ubuntu3:
  vars:
    ansible_become: true
    ansible_become_pass: password
```

## Ansible Modules

Here is some modules of ansible

- setup: report remote hosts information. Refer the [docs](https://docs.ansible.com/ansible/2.9/modules/setup_module.html#setup-module)

- copy: copy file from local to remote hosts. Refer the [docs](https://docs.ansible.com/ansible/2.9/modules/copy_module.html#copy-module)

## Ansible Playbook

```yaml
---
# YAML documents begin with the document separator ---



# Three dots indicate the end of a YAML document
...
```
