# Deploying a Website on Kubernetes Using k3s and Kong API Gateway

## Overview

This tutorial guides you through deploying a website with both frontend and backend components on a Kubernetes cluster. We use k3s, a lightweight Kubernetes distribution, and Kong API Gateway for efficient routing and management.

## Prerequisites

- A server or a local machine for k3s installation.
- SSH access to the server.
- Basic familiarity with Kubernetes concepts. (You should realy watch this [video](https://www.youtube.com/watch?v=wXuSqFJVNQA) if you are not familiar with Kubernetes)

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

- Confirm that k3s is operational:

  ```bash
  k3s kubectl get node
  ```

  This command lists the nodes in your cluster, indicating a successful setup.

### Set Up kubectl

- Install `kubectl` on your local machine to manage your Kubernetes cluster.
- Securely transfer the kubeconfig file from your server to your local machine:

  ```bash
  scp root@your_server_ip:/etc/rancher/k3s/k3s.yaml ~/.kube/config
  ```

- Adjust the `k3s.yaml` file by replacing the server's IP address with the correct one.

### Verify Kubeconfig File

- Ensure that your server's `KUBECONFIG` environment variable correctly references the kubeconfig file:

  - Check the current value of `KUBECONFIG`:

    ```bash
    echo $KUBECONFIG
    ```

  - If it's not set, or if it's incorrect, set it to the proper kubeconfig file path:

    ```bash
    export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
    ```

    This step ensures that your Kubernetes tools on the server, like `kubectl`, have the correct configuration to communicate with your k3s cluster.

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

## Step 4: Containerizing and Deploying Your Website

If you only want to test the deployment and you will be using the provided k3s_manifests to deploy the mock_website, you can skip this step because the deployment files are already configured to use the images that are pushed to my dockerhub. Keep in mind that if you want to use your own images, you will need to follow the steps below to containerize and push your images to dockerhub. You will also need to update the deployment files to use your images.

Before deploying your website to k3s, it's essential to containerize both the frontend and backend components and prepare your Kubernetes deployment and service configuration.

### Docker Steps for Containerization

1. **Writing Dockerfiles**

   - **Frontend Dockerfile**:

     - This is for a static site (HTML/CSS/JavaScript) using Node.js as a server.
     - Example Dockerfile:
       ```Dockerfile
       FROM node:alpine
       WORKDIR /usr/src/app
       COPY package*.json ./
       RUN npm install
       COPY . .
       EXPOSE 80
       CMD ["node", "server.js"]
       ```
     - `server.js` is your Node.js server file serving the static files.

   - **Backend Dockerfile**:
     - For a Node.js/Express API.
     - Example Dockerfile:
       ```Dockerfile
       FROM node:14
       WORKDIR /usr/src/app
       COPY package*.json ./
       RUN npm install
       COPY . .
       EXPOSE 3000
       CMD ["node", "app.js"]
       ```
     - Replace `app.js` with your main server file.

2. **Building and Pushing Docker Images**

   - Navigate to the respective directories and build the images:
     ```bash
     docker build -t yourusername/frontend:v1 .
     docker build -t yourusername/backend:v1 .
     ```
   - Push the images to a Docker registry:
     ```bash
     docker login
     docker push yourusername/frontend:v1
     docker push yourusername/backend:v1
     ```

### Preparing Kubernetes YAML Files

1. **Deployment YAML**

   - Frontend and backend deployment YAML files define how your applications are deployed in the Kubernetes cluster.
   - Example for Frontend:
     ```yaml
     apiVersion: apps/v1
     kind: Deployment
     metadata:
       name: frontend-deployment
     spec:
       replicas: 2
       selector:
         matchLabels:
           app: frontend
       template:
         metadata:
           labels:
             app: frontend
         spec:
           containers:
             - name: frontend
               image: yourusername/frontend:v1
               ports:
                 - containerPort: 80
     ```
   - Similarly, create a deployment YAML for the backend.

2. **Service YAML**

   - Service YAML files define how your applications are exposed within the Kubernetes cluster.
   - Example for Frontend:
     ```yaml
     apiVersion: v1
     kind: Service
     metadata:
       name: frontend-service
     spec:
       type: ClusterIP
       selector:
         app: frontend
       ports:
         - protocol: TCP
           port: 80
           targetPort: 80
     ```
   - Similarly, create a service YAML for the backend.

## Step 5: Deploy Frontend and Backend on k3s

1. **Deploy Your Frontend**:

   - Deploy the frontend application to your k3s cluster:
     ```bash
     kubectl apply -f frontend-deployment.yaml
     ```
   - Deploy the frontend service to expose the application:
     ```bash
     kubectl apply -f frontend-service.yaml
     ```

2. **Deploy Your Backend**:

   - Deploy the backend application similarly:
     ```bash
     kubectl apply -f backend-deployment.yaml
     ```
   - Expose the backend service:
     ```bash
     kubectl apply -f backend-service.yaml
     ```

3. **Verify Deployments and Services**:
   - Confirm that both frontend and backend deployments are running:
     ```bash
     kubectl get deployments
     ```
   - Ensure the services are correctly set up and accessible:
     ```bash
     kubectl get services
     ```

## Step 6: Integrate with Kong API Gateway

1. **Configure Kong for Frontend and Backend**:

   - Define Ingress resources to route traffic through Kong for both frontend and backend. This ensures efficient management of requests and responses.
   - Apply the Ingress configurations:
     ```bash
     kubectl apply -f frontend-ingress.yaml
     kubectl apply -f backend-ingress.yaml
     ```

2. **Verify Kong Integration**:
   - Ensure that the Ingress resources are correctly configured and Kong is routing traffic properly:
     ```bash
     kubectl get ingress
     ```

## Step 7: Integrating with Kong API Gateway

1. **Configure Routing for Frontend and Backend**:

   - Set up Ingress resources in your k3s cluster to route traffic through Kong to your frontend and backend services.
   - Apply your Ingress configuration:
     ```bash
     kubectl apply -f frontend-ingress.yaml
     kubectl apply -f backend-ingress.yaml
     ```

2. **Validate the Ingress Configuration**:
   - Ensure that the Ingress resources are correctly configured and active:
     ```bash
     kubectl get ingress
     ```

## Step 8: Testing and Verification

1. **Access the Website**:

   - Use your server's IP address and the ports configured in your service manifests to access the frontend and backend of your website.
   - Verify that the website's frontend is loading correctly and the backend services are responding as expected.

2. **Functional Testing**:

   - Perform functional testing to ensure all parts of your website are interacting correctly.
   - Test API endpoints to verify they are accessible through Kong API Gateway.

3. **Monitor Services and Logs**:
   - Regularly monitor the status of your deployments and services:
     ```bash
     kubectl get deployments
     kubectl get services
     ```
   - Check logs for any errors or issues:
     ```bash
     kubectl logs [pod-name]
     ```

## Step 9: Maintenance and Updates

1. **Updating Services**:

   - When updating your frontend or backend applications, rebuild your Docker images and update your Kubernetes deployments with the new images.

2. **Monitoring and Scaling**:

   - Continuously monitor your application's performance.
   - Scale your deployments as needed to handle increased traffic or workload.

3. **Backup and Recovery**:
   - Regularly backup your Kubernetes configuration and data.
   - Have a recovery plan in place in case of service interruption or data loss.

## Conclusion

With the completion of these steps, your website is now successfully deployed on a Kubernetes cluster using k3s and Kong API Gateway. This setup provides a robust, scalable platform for your web applications, leveraging the efficiencies of Kubernetes and the power of Kong for API management.

Keep monitoring your deployments for performance and scalability. Regular updates and backups are essential for maintaining the health and security of your application.

Congratulations on setting up your Kubernetes-powered web application!