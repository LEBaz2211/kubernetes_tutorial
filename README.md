# Kubernetes Deployment Tutorial

Welcome to this Kubernetes Deployment Tutorial! This repository is a practical guide for deploying a mock website on a Linux server using Kubernetes. It's tailored for those looking to apply Kubernetes concepts in real-world scenarios, specifically on Linux environments.

## Repository Structure

- **mock_website**: Contains the source code for the mock website, including a basic frontend and backend. These components are pre-hosted on DockerHub for ease of deployment.
- **kubernetes_manifests**: Holds all the YAML files for deploying the mock website on a Kubernetes cluster.

## Included Documentation

1. **DEPLOYMENT_TUTORIAL.md**: A step-by-step guide to deploying the mock website using k3s and Kong API Gateway.
2. **KUBERNETES_TROUBLESHOOT_CHEATSHEET.md**: A beginner-friendly cheat sheet that provides essential commands and basic troubleshooting steps for Kubernetes. This guide is specifically designed for those new to Kubernetes, focusing on fundamental aspects and common issues relevant to the deployment tutorial in this repository.
3. **OPEN_CONNECT_ID.md** (Optional): Instructions on integrating GitHub OAuth with your Kubernetes cluster for authentication.
4. **ROLES_WITH_GITHUB.md** (Optional): Learn to integrate GitHub user management with Kubernetes RBAC.
5. **SELF_SIGNING_SSL.md** (Optional): A guide on generating self-signed certificates for Kubernetes.

## Getting Started

To get started with this tutorial, you'll need:

- A Linux server (no pre-existing Kubernetes cluster is required, as this tutorial covers setting it up).
- Basic knowledge of Docker and Kubernetes concepts.
- DockerHub account (for pulling the pre-hosted images of the mock website).
- GitHub account (for optional OAuth and RBAC integration guides).

## Usage

To use this repository effectively:

1. Begin with **DEPLOYMENT_TUTORIAL.md** to learn how to deploy the mock website on a Linux server using Kubernetes.
2. Optionally, follow **OPEN_CONNECT_ID.md** and **SELF_SIGNING_SSL.md** for advanced Kubernetes configurations.
3. Consult **TROUBLESHOOTING_CHEATSHEET.md** for resolving common deployment issues in Kubernetes.
