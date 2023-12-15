# Deploying a Website on Kubernetes NGINX

## Overview

This tutorial guides you through deploying a website with both frontend and backend components on a Kubernetes cluster. We use k8s, and NGINX as an Ingress Controller to manage traffic to and from the website.

## Prerequisites

- A server or a local machine for k8s installation.
- SSH access to the server.
- Basic familiarity with Kubernetes concepts. (You should realy watch this [video](https://www.youtube.com/watch?v=wXuSqFJVNQA) if you are not familiar with Kubernetes)

## Step 1: Install k8s on Your Server

### Selecting a Server

- Choose a server or use a local machine for k8s installation. This can be a virtual machine in the cloud or any physical machine that meets the system requirements. (Keep in mind that this tutorial is for a linux machine, and that all the commands assume that you are inside a linux terminal (for a server you will be using ssh))

### Installation Process

- SSH into your chosen server.

#### Option 1

- Install the latest version for the Go language, it is needed for the instalation of kind
- Install kind on your server, the documentation and process can be found [here](https://kind.sigs.k8s.io/)

  ```bash
  kind create cluster --name nginx-ingress --image kindest/node:v1.23.5
  ```

#### Option 2

- Or you could execute the basic k8s installation script:

  ```bash
  curl -sfL https://get.k8s.io | sh -
  ```

  This command downloads and executes the script to install k8s and start the server.

#### Option 3

- In case of lack of server resources you can try using a k3s installation scrip:
  ```bash
  curl -sfL https://get.k3s.io | sh -
  ```

## Step 2: Configure k8s Cluster

### Verify Cluster Setup

- Confirm that k8s is operational:

  ```bash
  k8s kubectl get node
  ```

  This command lists the nodes in your cluster, indicating a successful setup.
  At this stage you should see the control-plane,master node, if not, see the KUBERNETES_TROUBLESHOOT_CHEATSHEET

### Set Up kubectl (only if the kubernetes install is k3s)

- Install `kubectl` on your local machine to manage your Kubernetes cluster.
- Securely transfer the kubeconfig file from your server to your local machine:

  ```bash
  scp root@your_server_ip:/etc/rancher/k3s/k3s.yaml ~/.kube/config
  ```

- Adjust the `k3s.yaml` file by replacing the server's IP address with the correct one.

### Verify Kubeconfig File (only if the kubernetes install is k3s)

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

## Step 3: Set Up NGINX Ingress Controller

### Preparing for NGINX Installation

Before installing NGINX, ensure Helm, a package manager for Kubernetes, is installed:

- Check if Helm is installed:

  ```bash
  helm version
  ```

- If Helm is not installed, execute the following command to install it:

  ```bash
  curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
  ```

  This script fetches and runs the latest version of Helm 3 installation script.

### NGINX Ingress Controller

Before satrting the install, prease read the [documentation here](https://kubernetes.github.io/ingress-nginx/)

First thing we do is check the compatibility matrix to ensure we are deploying a compatible version of NGINX Ingress on our Kubernetes cluster </br>

The Documentation also has a link to the [GitHub Repo](https://github.com/kubernetes/ingress-nginx/) which has a compatibility matrix </br>

From the compatibility matrix, find the latest version of NGINX that mathes with that your kubernetes install.

From our container we can do this:

```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm search repo ingress-nginx --versions
```

This will install and dispaly all the vertions of nginx on helm.

Store the chosen app vertion and chart vertion as environment variables.

```
CHART_VERSION="4.4.0"
APP_VERSION="1.5.1"
```

Now we will create a manifest file to let helm install the chosen version ngnix on our server.

```
mkdir ./kubernetes/ingress/controller/nginx/manifests/

helm template ingress-nginx ingress-nginx \
--repo https://kubernetes.github.io/ingress-nginx \
--version ${CHART_VERSION} \
--namespace ingress-nginx \
> ./kubernetes/ingress/controller/nginx/manifests/nginx-ingress.${APP_VERSION}.yaml
```

### Deploy the NGINX Ingress controller

create a namespace

```
kubectl create namespace ingress-nginx
```

appy the yaml configuration file

```
kubectl apply -f ./kubernetes/ingress/controller/nginx/manifests/nginx-ingress.${APP_VERSION}.yaml
```

### Check the installation

```
kubectl -n ingress-nginx get pods
```

The traffic for our cluster will come in over the Ingress service </br>
Note that we dont have load balancer capability in `kind` by default, so our `LoadBalancer` is pending:

To expose our ingress manager to the ouside we will port forward it to port 443 (hhtps)

```
kubectl -n ingress-nginx port-forward svc/ingress-nginx-controller 443
```

We can reach our controller on the server ip now, as we don't have a services yet, we should se a 404 page

## Step 4: Containerizing and Deploying Your Website

If you only want to test the deployment and you will be using the provided kubernetes_manifests to deploy the mock_website, you can skip this step because the deployment files are already configured to use the images that are pushed to my dockerhub. Keep in mind that if you want to use your own images, you will need to follow the steps below to containerize and push your images to dockerhub. You will also need to update the deployment files to use your images.

Before deploying your website to k8s, it's essential to containerize both the frontend and backend components and prepare your Kubernetes deployment and service configuration.

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

## Step 5: Deploy Frontend and Backend on k8s

1. **Deploy Your Frontend**:

   - Deploy the frontend application to your k8s cluster:
     ```bash
     kubectl -n ingress-nginx apply -f frontend-deployment.yaml
     ```
   - Deploy the frontend service to expose the application:
     ```bash
     kubectl -n ingress-nginx apply -f frontend-service.yaml
     ```

2. **Deploy Your Backend**:

   - Deploy the backend application similarly:
     ```bash
     kubectl -n ingress-nginx apply -f backend-deployment.yaml
     ```
   - Expose the backend service:
     ```bash
     kubectl -n ingress-nginx apply -f backend-service.yaml
     ```

3. **Verify Deployments and Services**:
   - Confirm that both frontend and backend deployments are running:
     ```bash
     kubectl -n ingress-nginx get deployments
     ```
   - Ensure the services are correctly set up and accessible:
     ```bash
     kubectl -n ingress-nginx get services
     ```

## Step 6: Integrate with NGINX API Gateway

1. **Configure NGINX for Frontend and Backend**:

   - Define Ingress resources to route traffic through NGINX for both frontend and backend. This ensures efficient management of requests and responses.
   - Apply the Ingress configurations:
     ```bash
     kubectl -n ingress-nginx apply -f frontend-ingress.yaml
     kubectl -n ingress-nginx apply -f backend-ingress.yaml
     ```

2. **Verify NGINX Integration**:
   - Ensure that the Ingress resources are correctly configured and NGINX is routing traffic properly:
     ```bash
     kubectl -n ingress-nginxget ingress
     ```

## Step 7: Integrating with NGINX API Gateway

1. **Configure Routing for Frontend and Backend**:

   - Set up Ingress resources in your k8s cluster to route traffic through NGINX to your frontend and backend services.
   - Apply your Ingress configuration:
     ```bash
     kubectl -n ingress-nginx apply -f frontend-ingress.yaml
     kubectl -n ingress-nginx apply -f backend-ingress.yaml
     ```

2. **Validate the Ingress Configuration**:
   - Ensure that the Ingress resources are correctly configured and active:
     ```bash
     kubectl -n ingress-nginx get ingress
     ```

## Step 8: Testing and Verification

1. **Access the Website**:

   - Use your server's IP address and the ports configured in your service manifests to access the frontend and backend of your website.
   - Verify that the website's frontend is loading correctly and the backend services are responding as expected.

2. **Functional Testing**:

   - Perform functional testing to ensure all parts of your website are interacting correctly.
   - Test API endpoints to verify they are accessible through NGINX API Gateway.

3. **Monitor Services and Logs**:
   - Regularly monitor the status of your deployments and services:
     ```bash
     kubectl -n ingress-nginx get deployments
     kubectl -n ingress-nginx get services
     ```
   - Check logs for any errors or issues:
     ```bash
     kubectl -n ingress-nginx logs [pod-name]
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

With the completion of these steps, your website is now successfully deployed on a Kubernetes cluster using k8s and NGINX API Gateway. This setup provides a robust, scalable platform for your web applications, leveraging the efficiencies of Kubernetes and the power of NGINX for API management.

Keep monitoring your deployments for performance and scalability. Regular updates and backups are essential for maintaining the health and security of your application.

Congratulations on setting up your Kubernetes-powered web application!