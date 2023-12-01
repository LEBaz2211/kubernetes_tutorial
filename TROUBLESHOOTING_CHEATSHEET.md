# Troubleshooting Cheat Sheet for Docker and Kubernetes

## 🐳 Docker Troubleshooting

### 🚫 Container Won't Start

```bash
# Check logs:
docker logs <container_id>

# Verify Dockerfile configurations
```

### 🏗️ Failed to Build Image

```bash
# Review build error messages
# Ensure dependencies and file paths are correct
```

### 🌐 Network Issues

```bash
# List networks
docker network ls

# Inspect network
docker network inspect <network_name>
```

### 📦 Image Not Found

```bash
# Confirm image name and tag
# Pull image from registry
docker pull <image_name>
```

### 🔒 Permission Denied

```bash
# Review file permissions in Dockerfile
# Adjust permissions
chmod [permissions] [file]
```

## ⚙️ Kubernetes Troubleshooting

### 🚫 Pods Not Running

```bash
# Get pod status
kubectl get pods

# Describe pod for detailed info
kubectl describe pod <pod_name>

# View pod logs
kubectl logs <pod_name>
```

### 🚧 Services Not Accessible

```bash
# Check service configuration
kubectl get svc

# Verify port mappings and selectors
```

### 🚀 Deployment Issues

```bash
# Check deployment status
kubectl rollout status deployment/<deployment_name>

# Review resource limits and requests
```

### 🌐 Ingress/Routing Problems

```bash
# Verify Ingress configuration
kubectl get ingress

# Check for correct hostnames and paths
```

### 💾 Resource Quotas and Limits

```bash
# Describe node for resource usage
kubectl describe node

# Adjust quotas and limits as necessary
```

### 💽 PVC Issues

```bash
# Check PVC status
kubectl get pvc

# Ensure corresponding PV and storage classes are correct
```

## 📚 General Troubleshooting Tips

1. **🔍 Careful Log Analysis**:

   - Logs often provide crucial clues.

2. **📄 Configuration Validation**:

   - Double-check files for errors or misconfigurations.

3. **🌐 Networking Checks**:

   - Resolve port conflicts or improper network setups.

4. **💻 Resource Availability**:

   - Ensure adequate CPU, memory, and storage.

5. **🔄 Version Compatibility**:

   - Confirm software versions are compatible.

6. **📖 Kubernetes Resource Explainer**:

   ```bash
   # Use to get detailed information about a resource
   kubectl explain <resource>
   ```

7. **📚 Consult Official Documentation**:
   - Docker and Kubernetes documentation are valuable resources.
