
# Kubernetes Troubleshooting Cheat Sheet for Beginners

This cheat sheet is designed for beginners with no prior knowledge of Kubernetes. It covers basic troubleshooting steps and commands that are relevant to the Kubernetes tutorial in this repository.

## Understanding Basic Commands

1. **kubectl get pods**: Lists all pods in the current namespace. Useful for checking if your pods are running.
2. **kubectl get services**: Shows all services, which are Kubernetes objects that let you access pods.
3. **kubectl get deployments**: Lists the deployments, providing a high-level overview of your deployed applications.

## Basic Troubleshooting Steps

### Checking Pod Status

- **Command**: `kubectl get pods`
- **Purpose**: Shows the status of all pods. Look for statuses like 'Running', 'Pending', or 'Error'.

### Viewing Pod Logs

- **Command**: `kubectl logs <pod_name>`
- **Purpose**: Retrieves logs from a specific pod. Essential for understanding why a pod might be failing or misbehaving.

### Describing Pods for More Information

- **Command**: `kubectl describe pod <pod_name>`
- **Purpose**: Provides detailed information about a specific pod, including events and configuration.

### Checking Services

- **Command**: `kubectl get services`
- **Purpose**: Ensures that your services are running and exposes the right ports.

### Understanding Deployments

- **Command**: `kubectl get deployments`
- **Purpose**: Offers an overview of your deployments and their statuses.

## Common Issues and Solutions

### Pod is in 'Pending' Status

- **Potential Causes**: Insufficient resources, image pull errors.
- **Solution**: Check events using `kubectl describe pod <pod_name>` for specific error messages.

### Pod is Continuously Restarting

- **Potential Causes**: Application errors, configuration issues.
- **Solution**: Check the pod logs using `kubectl logs <pod_name>` for error messages.

### Service is Not Accessible

- **Potential Causes**: Misconfigured service or networking issues.
- **Solution**: Ensure the service is correctly configured with `kubectl describe service <service_name>`.

## General Tips

- **Use Tab Completion**: Most shells support tab completion for kubectl commands, which can help you avoid typos.
- **Read Kubernetes Documentation**: The Kubernetes official documentation is a fantastic resource for understanding concepts and troubleshooting.

Remember, Kubernetes can be complex, but starting with these basic steps and commands will help you gain confidence and build a foundation for more advanced troubleshooting in the future.
