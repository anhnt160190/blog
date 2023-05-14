---
title: "Set up 3 VMs ubuntu with vagrant"
date: "2021-10-27"
draft: true
path: "/blog/setup-vm-with-vagrant"
---

## Summary
In this post I will show you how we can set up 3 VMs with vagrant

## Getting started

Setting dependencies
- [Vagrant](https://www.vagrantup.com/downloads)
- [Virtual Box](https://www.virtualbox.org/wiki/Downloads)

Verify vagrant

```bash
$ vagrant -v
```

In this post version of grant is ```Vagrant 2.2.18``` and Virtual Box is ```6.1.26```

## Solution

1. Go to working directory

  ```bash
  $ cd ~/ && mkdir ubuntu-vm && cd ubuntu-vm
  ```

2. Init Vagrant config
   
  ```bash
  $ vagrant init
  ```

3. Update Vagrant config

  Because I will set up 3 VMs ubuntu so you can follow the config file like that:

  ```
  Vagrant.configure("2") do |config|
    config.vm.provision "shell", inline: <<-SHELL
      apt-get update
    SHELL

    (1..3).each do |i|
      config.vm.define "machine#{i}" do |machine|
        machine.vm.box = "hashicorp/bionic64"
        machine.vm.box_version = "1.0.282"
        machine.vm.network "private_network", ip: "192.168.0.10#{i}"
        machine.vm.provider "virtualbox" do |vb|
          vb.memory = "1024"
          vb.cpus = 1
        end
      end
    end
  end
  ```

  You can read more [vagrant docs](https://www.vagrantup.com/docs) and some [tips and tricks](https://www.vagrantup.com/docs/vagrantfile/tips)

4. Start VM with vagrant cli

  ```bash
  $ vagrant up
  ```

5. Verify
  
  After vagrant up you can verify by access to VM. default user and password to access VM are ```vagrant```

  ```bash
  $ ssh vagrant@192.168.0.101
  $ ssh vagrant@192.168.0.102
  $ ssh vagrant@192.168.0.103
  ```
