---
title: "Set up EKS with Terraform"
date: "2021-11-22"
draft: false
path: "/blog/eks-terraform"
---

## Summary

I received a task like that:

- set up EKS with terraform
- deploy example application to EKS
- setting CI CD to deploy application

So in this post I will share How I set up EKS with terraform and deploy example application to EKS

## Getting Started

Make sure your local machine already set up some tool

- aws-cli
- aws-iam-authenticator
- terraform
- kubectl
- helm
- eks-ctl

## Solution

- Set up EKS with terraform

Refer the [document](https://learn.hashicorp.com/tutorials/terraform/eks) you can custom your cluster

In this post I will be use worker_group to set up worker node like that

```bash
worker_groups = [
  {
    name                 = "eks-terraform-worker"
    instance_type        = "t2.small"
    asg_desired_capacity = 3
  },
]
```

after set up terraform we will apply and we will receive our cluster

```bash
# Init terraform
terraform init

# Run terraform to set up EKS
terraform apply

# Get kube config to access cluster
terraform output -raw kubectl_config > ~/.kube/config
```

after receive kube config, we can verify by run command

```bash
kubectl cluster-info
```

- Deploy Ingress Controller

as you know with K8S to expose HTTP/HTTPS service we will use Ingress. Refer the [document](https://kubernetes.io/docs/concepts/services-networking/ingress/)

So we need to set up Ingress Controller to EKS.

I will use [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.3/) to deploy Ingress Controller to our cluster. In this post, the version of AWS Load Balancer Controller is v2.3

to set up AWS Load Balancer Controller we will follow 2 steps:

1. Set up IAM permission to K8S ServiceAccount
2. Deploy via helm chart

```bash
# create IAM OIDC provider
eksctl utils associate-iam-oidc-provider --cluster $(terraform output --raw cluster_name) --approve

# get iam-policy
curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.3.0/docs/install/iam_policy.json

# create policy. can ignore this step if the policy already in your AWS 
aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam-policy.json

# create Service Account
eksctl create iamserviceaccount --cluster=$(terraform output --raw cluster_name) --namespace=kube-system --name=aws-load-balancer-controller --attach-policy-arn=arn:aws:iam::${AWS_ACCOUNT_ID}:policy/AWSLoadBalancerControllerIAMPolicy --override-existing-serviceaccounts --approve

# add eks chart
helm repo add eks https://aws.github.io/eks-charts

# install via helm
helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=$(terraform output --raw cluster_name) --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller
```

After deploy Ingress Controller, we can verify:

```bash
watch kubectl get all -n kube-system
```

- Deploy an example app

describe example application helloworld under helloworld.yaml

```yaml
---

apiVersion: v1
kind: Namespace
metadata:
  name: test

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: helloworld
  namespace: test
spec:
  selector:
    matchLabels:
      app: helloworld
  replicas: 1
  template:
    metadata:
      labels:
        app: helloworld
    spec:
      containers:
      - image: vad1mo/hello-world-rest
        imagePullPolicy: Always
        name: helloworld
        ports:
        - containerPort: 5050
        resources: {}

---

apiVersion: v1
kind: Service
metadata:
  name: helloworld
  namespace: test
spec:
  ports:
    - port: 5050
      targetPort: 5050
      protocol: TCP
  # type: NodePort
  selector:
    app: helloworld

---

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: helloworld
  namespace: test
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/tags: Environment=dev,Team=test
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/group.name: test
spec:
  rules:
    - host: test.example.com
      http:
        paths:
          - path: /foo/bar
            pathType: Prefix
            backend:
              service:
                name: helloworld
                port:
                  number: 5050
...
```

```bash
kubectl apply -f ./helloworld.yaml
```

after run this command AWS will create an ELB

you should set up domain test.example.com will redirect to this load balancer

In your local you can use nslookup to receive IP from ELB host

```bash
nslookup ${ELB_HOST}
```

Override in /etc/hosts

```bash
ELB_IP  test.example.com
```

after setting this you can verify from your machine

```bash
curl test.example.com/foo/bar
```
