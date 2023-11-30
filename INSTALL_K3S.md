# Deploying a Website on Kubernetes Using k3s and Kong API Gateway

## Overview

This tutorial guides you through deploying a website with both frontend and backend components on a Kubernetes cluster. We use k3s, a lightweight Kubernetes distribution, and Kong API Gateway for efficient routing and management.

## Prerequisites

- A server or a local machine for k3s installation.
- SSH access to the server.
- Basic familiarity with Kubernetes concepts.

## Step 1: Install k3s on Your Server

### Selecting a Server

- Choose a server or use a local machine for k3s installation. This can be a virtual machine in the cloud or any physical machine that meets the system requirements.

### Installation Process

- SSH into your chosen server.
- Execute the k3s installation script:

  ```bash
  curl -sfL https://get.k3s.io | sh -
  ```

  This command downloads and executes the script to install k3s and start the server.

## Step 2: Configure k3s Cluster

### Verify Cluster Setup

- Check the running status of k3s:

  ```bash
  k3s kubectl get node
  ```

  This command should list the nodes in your cluster, confirming a successful setup.

### Set Up kubectl

- Install `kubectl` on your local machine, a command-line tool for Kubernetes cluster management.
- Securely copy the kubeconfig file from your server to your local machine:

  ```bash
  scp root@your_server_ip:/etc/rancher/k3s/k3s.yaml ~/.kube/config
  ```

- Modify the copied `k3s.yaml`, replacing the server's IP with the correct one to ensure seamless cluster management from your local machine.

## Step 3: Set Up Kong API Gateway

### Preparing for Kong Installation

Before installing Kong, ensure Helm, a package manager for Kubernetes, is installed:

- Check if Helm is installed:

  ```bash
  helm version
  ```

- If Helm is not installed, execute the following command to install it:

  ```bash
  curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
  ```

  This script fetches and runs the latest version of Helm 3 installation script.

### Installation of Kong

Now that Helm is set up, proceed to install Kong in your k3s cluster:

- Add the Kong repository to Helm:

  ```bash
  helm repo add kong https://charts.konghq.com
  helm repo update
  ```

- Install Kong with the following command:

  ```bash
  helm install kong/kong --generate-name --set ingressController.installCRDs=false
  ```

This process deploys Kong API Gateway in your Kubernetes cluster, enabling efficient management and routing for your website's backend and frontend services.

## Troubleshooting Permissions Issue

If you encounter a permissions error like `permission denied` when accessing `k3s.yaml`, follow these steps:

1. **Adjust File Permissions**:

   - On your server, change the permissions of the kubeconfig file to make it globally readable:

     ```bash
     sudo chmod 644 /etc/rancher/k3s/k3s.yaml
     ```

2. **Alternative Method**:

   - If you prefer more restricted access, copy the file to your user's directory and set user-specific permissions:

     ```bash
     sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
     sudo chown $(whoami) ~/.kube/config
     sudo chmod 600 ~/.kube/config
     ```

After resolving the permissions issue, retry accessing the cluster using `k3s kubectl get node`.
