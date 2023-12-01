# Integrating GitHub OAuth with Kubernetes

This document provides a comprehensive guide on integrating GitHub OAuth with your Kubernetes cluster, enabling the use of GitHub as an Identity Provider (IdP) for authentication.

## Prerequisites
- **Kubernetes Cluster**: Administrative access to the Kubernetes cluster is required.
- **GitHub Account**: A GitHub account with privileges to create OAuth applications is necessary.

## Step 1: Register OAuth Application on GitHub
1. **Access GitHub Settings**:
   - Log into your GitHub account.
   - Navigate to `Settings > Developer settings > OAuth Apps`.
2. **Create New OAuth App**:
   - Click on `New OAuth App`.
   - **Fill in Application Details**:
     - `Application Name`: Choose a name reflective of your cluster or service.
     - `Homepage URL`: Use your main website or a placeholder URL.
     - `Application Description` (Optional): Briefly describe the application.
     - `Authorization callback URL`: Crucial for Kubernetes integration. Typically, it's `https://[K3s_API_Server]/callback`. Replace `[K3s_API_Server]` with your Kubernetes API server address.
   - Click `Register application`.
3. **Credentials**:
   - Note the provided `Client ID` and `Client Secret`. Keep these confidential.

## Step 2: Configure Kubernetes API Server
To integrate GitHub as an IdP, configure your Kubernetes API server with OpenID Connect (OIDC) flags:

1. **Edit API Server Configuration**:
   - This process varies (e.g., kubeadm, minikube, cloud provider managed).
   - Generally, edit the API server manifest, often at `/etc/kubernetes/manifests/kube-apiserver.yaml`.
2. **Add OIDC Flags**:
   - Append the following flags in the API server's command section:
     - `--oidc-issuer-url=https://github.com/login/oauth/authorize`: GitHub's authorization endpoint.
     - `--oidc-client-id=[ClientID]`: Your GitHub Client ID.
     - `--oidc-client-secret=[ClientSecret]`: Your GitHub Client Secret.
     - `--oidc-username-claim=email`: Uses email as the username claim.
     - `--oidc-groups-claim=groups`: For mapping GitHub teams to Kubernetes groups (optional).
3. **Restart API Server**:
   - The server should restart automatically after editing. If not, restart manually.

## Step 3: Set Up kubectl for OIDC
Configure kubectl to authenticate via OIDC:

1. **Update Credentials**:
   ```cli
   kubectl config set-credentials [USER_NAME] \
   --auth-provider=oidc \
   --auth-provider-arg=idp-issuer-url=https://github.com/login/oauth/authorize \
   --auth-provider-arg=client-id=[ClientID] \
   --auth-provider-arg=client-secret=[ClientSecret] \
   --auth-provider-arg=refresh-token=[YourOAuthToken] \
   --auth-provider-arg=idp-certificate-authority=[CAPath] \
   --auth-provider-arg=id-token=[YourIDToken]
   ```
   Replace placeholders with actual values. `[YourOAuthToken]` and `[YourIDToken]` are obtained from GitHub after authentication.
2. **Update kubectl Context**:
   ```cli
   kubectl config set-context [CONTEXT_NAME] --cluster=[CLUSTER_NAME] --user=[USER_NAME]
   ```

## Step 4: Test Your Configuration
Validate the integration:

1. **Access Cluster with kubectl**:
   ```cli
   kubectl get pods
   ```
   If configured correctly, you should access cluster resources without authentication errors.
2. **Troubleshooting**:
   - Check Kubernetes API server logs for issues.

**Note**: This guide assumes familiarity with Kubernetes and GitHub. Tailor the steps to fit your specific cluster environment and GitHub configurations.