# Kubernetes Deployment Cheat Sheet

## What is a Deployment?

A **Deployment** is a Kubernetes resource that provides declarative updates for Pods and ReplicaSets. It's the primary way to deploy and manage applications in Kubernetes, offering features like rolling updates, rollbacks, and scaling.

### Key Characteristics:

- **Declarative updates**: You describe the desired state, and Deployment makes it so
- **Rolling updates**: Updates pods gradually without downtime
- **Rollbacks**: Can easily rollback to previous versions
- **Scaling**: Automatically scales the number of pods up or down
- **Self-healing**: Replaces pods that fail, are deleted, or are terminated
- **Revision history**: Maintains history of deployments for rollbacks

## Deployment vs ReplicaSet

| Feature              | Deployment                   | ReplicaSet             |
| -------------------- | ---------------------------- | ---------------------- |
| **Updates**          | Rolling updates supported    | No rolling updates     |
| **Rollbacks**        | Supports rollbacks           | No rollback capability |
| **Use case**         | Production applications      | Simple pod replication |
| **Direct use**       | Primary way to deploy apps   | Rarely used directly   |
| **Revision history** | Maintains deployment history | No revision tracking   |

## Deployment Structure

```
Deployment
├── Desired Replicas (3)
├── Current Replicas (3)
├── Updated Replicas (3)
├── Available Replicas (3)
├── Ready Replicas (3)
├── ReplicaSet (v1)
│   └── Pod Template
│       └── Pod Spec
└── ReplicaSet (v2) [Previous version]
    └── Pod Template
        └── Pod Spec
```

## Deployment Lifecycle

### Deployment States:

- **Desired**: The number of replicas you want running
- **Current**: The number of replicas currently running
- **Updated**: The number of replicas that have been updated to the latest template
- **Available**: The number of replicas that have been available for at least minReadySeconds
- **Ready**: The number of replicas that are ready to serve traffic

### Update Strategies:

- **RollingUpdate** (default): Gradually replaces old pods with new ones
- **Recreate**: Terminates all old pods before creating new ones

## Basic Deployment Commands

### Viewing Deployments

```bash
# List all deployments in the current namespace
kubectl get deployments

# List all deployments in all namespaces
kubectl get deployments --all-namespaces

# List deployments with more details
kubectl get deployments -o wide

# List deployments with custom output format
kubectl get deployments -o custom-columns=NAME:.metadata.name,DESIRED:.spec.replicas,CURRENT:.status.replicas,UPDATED:.status.updatedReplicas,AVAILABLE:.status.availableReplicas,AGE:.metadata.creationTimestamp

# Get deployment information in YAML format
kubectl get deployment <deployment-name> -o yaml

# Get deployment information in JSON format
kubectl get deployment <deployment-name> -o json
```

### Getting Deployment Information

```bash
# Get detailed information about a specific deployment
kubectl describe deployment <deployment-name>

# Get deployment information in YAML format
kubectl get deployment <deployment-name> -o yaml

# Get deployment information in JSON format
kubectl get deployment <deployment-name> -o json

# Show deployment status
kubectl rollout status deployment/<deployment-name>
```

### Creating Deployments

```bash
# Create a deployment from a YAML file
kubectl create -f <deployment-definition.yaml>

# Create a deployment from a URL
kubectl create -f https://raw.githubusercontent.com/example/deployment.yaml

# Create a deployment using imperative command
kubectl create deployment <deployment-name> --image=<image-name>

# Create a deployment with specific namespace
kubectl create -f <deployment-definition.yaml> -n <namespace>

# Create deployment with multiple containers
kubectl create deployment <deployment-name> --image=<image-name> --dry-run=client -o yaml > deployment.yaml
```

### Managing Deployments

```bash
# Delete a deployment (and all its pods)
kubectl delete deployment <deployment-name>

# Delete a deployment forcefully
kubectl delete deployment <deployment-name> --force --grace-period=0

# Delete all deployments in a namespace
kubectl delete deployments --all

# Delete deployments matching a label
kubectl delete deployments -l app=<label-value>

# Edit a deployment (opens in default editor)
kubectl edit deployment <deployment-name>
```

### Scaling Deployments

```bash
# Scale a deployment to a specific number of replicas
kubectl scale deployment <deployment-name> --replicas=5

# Scale a deployment to 0 (stop all pods)
kubectl scale deployment <deployment-name> --replicas=0

# Scale a deployment to 1
kubectl scale deployment <deployment-name> --replicas=1

# Scale deployments matching a label
kubectl scale deployment -l app=<label-value> --replicas=3

# Scale deployment with autoscaling
kubectl autoscale deployment <deployment-name> --min=2 --max=10 --cpu-percent=80
```

### Deployment Updates

```bash
# Update a deployment's image
kubectl set image deployment/<deployment-name> <container-name>=<new-image>

# Update deployment with new YAML
kubectl apply -f <updated-deployment.yaml>

# Update deployment using patch
kubectl patch deployment <deployment-name> -p '{"spec":{"template":{"spec":{"containers":[{"name":"<container-name>","image":"<new-image>"}]}}}}'

# Update deployment with specific revision
kubectl rollout restart deployment/<deployment-name>
```

### Deployment Rollouts

```bash
# Check rollout status
kubectl rollout status deployment/<deployment-name>

# Pause a rollout
kubectl rollout pause deployment/<deployment-name>

# Resume a rollout
kubectl rollout resume deployment/<deployment-name>

# Rollback to previous version
kubectl rollout undo deployment/<deployment-name>

# Rollback to specific revision
kubectl rollout undo deployment/<deployment-name> --to-revision=2

# View rollout history
kubectl rollout history deployment/<deployment-name>

# View specific revision details
kubectl rollout history deployment/<deployment-name> --revision=2
```

## Deployment Configuration Examples

### Basic Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
  labels:
    app: my-app
    tier: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-container
          image: nginx:latest
          ports:
            - containerPort: 80
```

### Deployment with Rolling Update Strategy

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rolling-deployment
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: rolling-app
  template:
    metadata:
      labels:
        app: rolling-app
    spec:
      containers:
        - name: my-container
          image: my-app:latest
          ports:
            - containerPort: 8080
```

### Deployment with Multiple Containers

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: multi-container-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: multi-app
  template:
    metadata:
      labels:
        app: multi-app
    spec:
      containers:
        - name: main-app
          image: my-app:latest
          ports:
            - containerPort: 8080
        - name: sidecar
          image: logging-sidecar:latest
```

### Deployment with Environment Variables

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: env-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: env-app
  template:
    metadata:
      labels:
        app: env-app
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

### Deployment with Volume Mounts

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: volume-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: volume-app
  template:
    metadata:
      labels:
        app: volume-app
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

### Deployment with Resource Limits

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: resource-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: resource-app
  template:
    metadata:
      labels:
        app: resource-app
    spec:
      containers:
        - name: my-container
          image: my-app:latest
          resources:
            requests:
              memory: "64Mi"
              cpu: "250m"
            limits:
              memory: "128Mi"
              cpu: "500m"
```

### Deployment with Health Checks

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: health-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: health-app
  template:
    metadata:
      labels:
        app: health-app
    spec:
      containers:
        - name: my-container
          image: my-app:latest
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

## Common Deployment Issues and Debugging

### Troubleshooting Commands

```bash
# Check deployment events
kubectl describe deployment <deployment-name>

# Check deployment status
kubectl get deployments -o wide

# Check deployment resource usage
kubectl top deployment <deployment-name>

# Check deployment resource requests/limits
kubectl describe deployment <deployment-name> | grep -A 10 "Containers:"

# Check if deployment can be scheduled
kubectl get events --sort-by='.lastTimestamp'

# Check pods managed by deployment
kubectl get pods -l app=<label-value>

# Check deployment logs
kubectl logs deployment/<deployment-name>

# Check rollout status
kubectl rollout status deployment/<deployment-name>

# Check rollout history
kubectl rollout history deployment/<deployment-name>
```

### Common Deployment States and Solutions

| State               | Description                            | Common Solutions                           |
| ------------------- | -------------------------------------- | ------------------------------------------ |
| Desired > Current   | Not enough pods running                | Check node resources, image pull issues    |
| Updated < Current   | Rolling update in progress             | Wait for rollout to complete               |
| Available < Updated | Pods not available for minReadySeconds | Check liveness probes, container crashes   |
| 0 Available         | All pods failed                        | Check logs, resource limits, configuration |
| Rollout stuck       | Update strategy issues                 | Check maxSurge, maxUnavailable settings    |

### Debugging Pod Issues in Deployments

```bash
# Get pods managed by deployment
kubectl get pods -l app=<label-value>

# Describe pods to see issues
kubectl describe pods -l app=<label-value>

# Check logs from all pods in deployment
kubectl logs -l app=<label-value>

# Check logs from specific pod
kubectl logs <pod-name>

# Execute command in pod
kubectl exec -it <pod-name> -- /bin/bash

# Check replicasets created by deployment
kubectl get replicasets -l app=<label-value>
```

## Best Practices

### Deployment Design

- **Use Deployments for production**: Deployments are the primary way to deploy applications
- **Set resource limits**: Always set resource requests and limits
- **Use health checks**: Implement liveness and readiness probes
- **Label everything**: Use consistent labeling strategy
- **Security**: Run containers as non-root when possible

### Update Strategies

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1 # Maximum pods above desired count
      maxUnavailable: 1 # Maximum pods unavailable during update
```

### Resource Management

```yaml
spec:
  template:
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
  template:
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

### Labeling Strategy

```yaml
metadata:
  labels:
    app: my-app
    version: v1.0.0
    environment: production
    tier: frontend
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
        version: v1.0.0
        environment: production
        tier: frontend
```

## When to Use Deployments

### Use Deployments when:

- You need rolling updates and rollbacks
- You're deploying production applications
- You want declarative updates
- You need to manage application state
- You want to scale applications easily

### Use other resources when:

- **Pods**: For one-off tasks, debugging, or testing
- **ReplicaSets**: For simple pod replication without updates
- **StatefulSets**: For stateful applications with stable identities
- **DaemonSets**: For node-level services (logging, monitoring)

## Quick Reference

### Essential Commands

```bash
# Get deployments
kubectl get deployments

# Describe deployment
kubectl describe deployment <name>

# Scale deployment
kubectl scale deployment <name> --replicas=3

# Update image
kubectl set image deployment/<name> <container>=<image>

# Check rollout status
kubectl rollout status deployment/<name>

# Rollback deployment
kubectl rollout undo deployment/<name>

# Delete deployment
kubectl delete deployment <name>

# Create from file
kubectl create -f <file.yaml>
```

### Common Flags

- `-n <namespace>`: Specify namespace
- `-o wide`: Show additional details
- `--all-namespaces`: All namespaces
- `-l <label>`: Filter by label
- `--replicas=N`: Set number of replicas
- `--force`: Force deletion
- `--to-revision=N`: Rollback to specific revision

### Important Fields

- `spec.replicas`: Number of desired replicas
- `spec.selector`: How to identify managed pods
- `spec.template`: Pod template specification
- `spec.strategy`: Update strategy configuration
- `status.replicas`: Current number of replicas
- `status.updatedReplicas`: Number of updated replicas
- `status.availableReplicas`: Number of available replicas
- `status.readyReplicas`: Number of ready replicas
