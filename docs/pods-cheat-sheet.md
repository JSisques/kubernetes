# Kubernetes Pods Cheat Sheet

## What is a Pod?

A **Pod** is the smallest and simplest unit in the Kubernetes object model. It represents a single instance of a running process in your cluster and contains one or more containers that are tightly coupled and share resources.

### Key Characteristics:

- **Atomic unit**: Pods are the basic building blocks of Kubernetes applications
- **Shared network**: All containers in a pod share the same network namespace
- **Shared storage**: Containers in a pod can share volumes
- **Lifecycle**: Pods are ephemeral - they can be created, destroyed, and recreated

## Pod Structure

```
Pod
├── Container 1 (Main application)
├── Container 2 (Sidecar - logging, monitoring)
├── Container 3 (Init container - setup)
└── Shared Resources
    ├── Network (same IP, port space)
    ├── Storage (volumes)
    └── IPC (inter-process communication)
```

## Pod Lifecycle

### Pod States:

- **Pending**: Pod has been accepted by the system, but one or more containers have not been set up
- **Running**: Pod has been bound to a node, and all containers have been created
- **Succeeded**: All containers in the pod have terminated in success
- **Failed**: All containers in the pod have terminated, and at least one has failed
- **Unknown**: The state of the pod could not be obtained

## Basic Pod Commands

### Viewing Pods

```bash
# List all pods in the current namespace
kubectl get pods

# List all pods in all namespaces
kubectl get pods --all-namespaces

# List pods with more details
kubectl get pods -o wide

# List pods with custom output format
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase,AGE:.metadata.creationTimestamp
```

### Getting Pod Information

```bash
# Get detailed information about a specific pod
kubectl describe pod <pod-name>

# Get pod information in YAML format
kubectl get pod <pod-name> -o yaml

# Get pod information in JSON format
kubectl get pod <pod-name> -o json
```

### Pod Logs

```bash
# View logs from a pod
kubectl logs <pod-name>

# Follow logs in real-time
kubectl logs -f <pod-name>

# View logs from a specific container in a multi-container pod
kubectl logs <pod-name> -c <container-name>

# View logs with timestamps
kubectl logs <pod-name> --timestamps

# View logs from the last N lines
kubectl logs <pod-name> --tail=100
```

### Creating Pods

```bash
# Create a pod from a YAML file
kubectl create -f <pod-definition.yaml>

# Create a pod from a URL
kubectl create -f https://raw.githubusercontent.com/example/pod.yaml

# Create a pod using imperative command
kubectl run <pod-name> --image=<image-name>

# Create a pod with specific namespace
kubectl create -f <pod-definition.yaml> -n <namespace>
```

### Managing Pods

```bash
# Delete a pod
kubectl delete pod <pod-name>

# Delete a pod forcefully
kubectl delete pod <pod-name> --force --grace-period=0

# Delete all pods in a namespace
kubectl delete pods --all

# Delete pods matching a label
kubectl delete pods -l app=<label-value>

# Edit a pod (opens in default editor)
kubectl edit pod <pod-name>
```

### Pod Execution

```bash
# Execute a command in a pod
kubectl exec <pod-name> -- <command>

# Open an interactive shell in a pod
kubectl exec -it <pod-name> -- /bin/bash

# Execute command in a specific container
kubectl exec -it <pod-name> -c <container-name> -- /bin/bash

# Copy files to/from a pod
kubectl cp <pod-name>:/path/to/file /local/path
kubectl cp /local/file <pod-name>:/path/to/destination
```

### Pod Scaling and Updates

```bash
# Scale a deployment (which manages pods)
kubectl scale deployment <deployment-name> --replicas=3

# Scale a replica set
kubectl scale replicaset <replicaset-name> --replicas=5

# Update a pod's image
kubectl set image deployment/<deployment-name> <container-name>=<new-image>

# Rollback a deployment
kubectl rollout undo deployment/<deployment-name>
```

## Pod Configuration Examples

### Basic Pod YAML

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  labels:
    app: my-app
spec:
  containers:
    - name: my-container
      image: nginx:latest
      ports:
        - containerPort: 80
```

### Multi-Container Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: multi-container-pod
spec:
  containers:
    - name: main-app
      image: my-app:latest
      ports:
        - containerPort: 8080
    - name: sidecar
      image: logging-sidecar:latest
```

### Pod with Environment Variables

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: env-pod
spec:
  containers:
    - name: my-container
      image: my-app:latest
      env:
        - name: DATABASE_URL
          value: "postgresql://localhost:5432/mydb"
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: my-secret
              key: api-key
```

### Pod with Volume Mounts

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-pod
spec:
  containers:
    - name: my-container
      image: my-app:latest
      volumeMounts:
        - name: config-volume
          mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: my-config
```

## Common Pod Issues and Debugging

### Troubleshooting Commands

```bash
# Check pod events
kubectl describe pod <pod-name>

# Check pod status
kubectl get pods -o wide

# Check pod resource usage
kubectl top pod <pod-name>

# Check pod resource requests/limits
kubectl describe pod <pod-name> | grep -A 10 "Containers:"

# Check if pod can be scheduled
kubectl get events --sort-by='.lastTimestamp'
```

### Common Pod States and Solutions

| State             | Description                           | Common Solutions                           |
| ----------------- | ------------------------------------- | ------------------------------------------ |
| Pending           | Pod is waiting to be scheduled        | Check node resources, taints, tolerations  |
| ContainerCreating | Pod is scheduled, containers starting | Check image pull, volume mounts            |
| Running           | Pod is running normally               | -                                          |
| CrashLoopBackOff  | Container keeps crashing              | Check logs, resource limits, configuration |
| ImagePullBackOff  | Cannot pull container image           | Check image name, registry credentials     |

## Best Practices

### Pod Design

- **Single responsibility**: Each pod should have a single, well-defined purpose
- **Resource limits**: Always set resource requests and limits
- **Health checks**: Use liveness and readiness probes
- **Security**: Run containers as non-root when possible

### Resource Management

```yaml
spec:
  containers:
    - name: my-container
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
```

### Health Checks

```yaml
spec:
  containers:
    - name: my-container
      livenessProbe:
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 30
        periodSeconds: 10
      readinessProbe:
        httpGet:
          path: /ready
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 5
```

## Quick Reference

### Essential Commands

```bash
# Get pods
kubectl get pods

# Describe pod
kubectl describe pod <name>

# Pod logs
kubectl logs <name>

# Execute in pod
kubectl exec -it <name> -- /bin/bash

# Delete pod
kubectl delete pod <name>

# Create from file
kubectl create -f <file.yaml>
```

### Common Flags

- `-n <namespace>`: Specify namespace
- `-o wide`: Show additional details
- `-f`: Follow logs
- `--all-namespaces`: All namespaces
- `-l <label>`: Filter by label
- `--tail=N`: Last N lines of logs
