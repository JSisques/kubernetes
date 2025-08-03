# Kubernetes ReplicaSet Cheat Sheet

## What is a ReplicaSet?

A **ReplicaSet** is a Kubernetes resource that ensures a specified number of pod replicas are running at any given time. It's designed to maintain a stable set of replica pods running at any given time.

### Key Characteristics:

- **Pod management**: ReplicaSets create and manage multiple pods
- **Scaling**: Automatically scales the number of pods up or down
- **Self-healing**: Replaces pods that fail, are deleted, or are terminated
- **Selector-based**: Uses label selectors to identify which pods to manage
- **Declarative**: You specify the desired state, and ReplicaSet makes it so

## ReplicaSet vs Deployment

| Feature        | ReplicaSet             | Deployment                 |
| -------------- | ---------------------- | -------------------------- |
| **Updates**    | No rolling updates     | Supports rolling updates   |
| **Rollbacks**  | No rollback capability | Supports rollbacks         |
| **Use case**   | Simple pod replication | Production applications    |
| **Direct use** | Rarely used directly   | Primary way to deploy apps |

## ReplicaSet Structure

```
ReplicaSet
├── Desired Replicas (3)
├── Current Replicas (3)
├── Ready Replicas (3)
├── Available Replicas (3)
└── Pod Template
    └── Pod Spec
        ├── Container 1
        ├── Container 2
        └── Shared Resources
```

## ReplicaSet Lifecycle

### ReplicaSet States:

- **Desired**: The number of replicas you want running
- **Current**: The number of replicas currently running
- **Ready**: The number of replicas that are ready to serve traffic
- **Available**: The number of replicas that have been available for at least minReadySeconds

## Basic ReplicaSet Commands

### Viewing ReplicaSets

```bash
# List all replicasets in the current namespace
kubectl get replicasets

# List all replicasets in all namespaces
kubectl get replicasets --all-namespaces

# List replicasets with more details
kubectl get replicasets -o wide

# List replicasets with custom output format
kubectl get replicasets -o custom-columns=NAME:.metadata.name,DESIRED:.spec.replicas,CURRENT:.status.replicas,READY:.status.readyReplicas,AGE:.metadata.creationTimestamp

# Get replicaset information in YAML format
kubectl get replicaset <replicaset-name> -o yaml

# Get replicaset information in JSON format
kubectl get replicaset <replicaset-name> -o json
```

### Getting ReplicaSet Information

```bash
# Get detailed information about a specific replicaset
kubectl describe replicaset <replicaset-name>

# Get replicaset information in YAML format
kubectl get replicaset <replicaset-name> -o yaml

# Get replicaset information in JSON format
kubectl get replicaset <replicaset-name> -o json
```

### Creating ReplicaSets

```bash
# Create a replicaset from a YAML file
kubectl create -f <replicaset-definition.yaml>

# Create a replicaset from a URL
kubectl create -f https://raw.githubusercontent.com/example/replicaset.yaml

# Create a replicaset using imperative command
kubectl create replicaset <replicaset-name> --image=<image-name> --replicas=3

# Create a replicaset with specific namespace
kubectl create -f <replicaset-definition.yaml> -n <namespace>
```

### Managing ReplicaSets

```bash
# Delete a replicaset (and all its pods)
kubectl delete replicaset <replicaset-name>

# Delete a replicaset forcefully
kubectl delete replicaset <replicaset-name> --force --grace-period=0

# Delete all replicasets in a namespace
kubectl delete replicasets --all

# Delete replicasets matching a label
kubectl delete replicasets -l app=<label-value>

# Edit a replicaset (opens in default editor)
kubectl edit replicaset <replicaset-name>
```

### Scaling ReplicaSets

```bash
# Scale a replicaset to a specific number of replicas
kubectl scale replicaset <replicaset-name> --replicas=5

# Scale a replicaset to 0 (stop all pods)
kubectl scale replicaset <replicaset-name> --replicas=0

# Scale a replicaset to 1
kubectl scale replicaset <replicaset-name> --replicas=1

# Scale replicasets matching a label
kubectl scale replicaset -l app=<label-value> --replicas=3
```

### ReplicaSet Updates

```bash
# Update a replicaset's image
kubectl set image replicaset/<replicaset-name> <container-name>=<new-image>

# Update a replicaset's image using patch
kubectl patch replicaset <replicaset-name> -p '{"spec":{"template":{"spec":{"containers":[{"name":"<container-name>","image":"<new-image>"}]}}}}'

# Update replicaset with new YAML
kubectl apply -f <updated-replicaset.yaml>
```

## ReplicaSet Configuration Examples

### Basic ReplicaSet YAML

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: my-replicaset
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

### ReplicaSet with Multiple Containers

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: multi-container-replicaset
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

### ReplicaSet with Environment Variables

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: env-replicaset
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

### ReplicaSet with Volume Mounts

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: volume-replicaset
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

### ReplicaSet with Resource Limits

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: resource-replicaset
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

## Common ReplicaSet Issues and Debugging

### Troubleshooting Commands

```bash
# Check replicaset events
kubectl describe replicaset <replicaset-name>

# Check replicaset status
kubectl get replicasets -o wide

# Check replicaset resource usage
kubectl top replicaset <replicaset-name>

# Check replicaset resource requests/limits
kubectl describe replicaset <replicaset-name> | grep -A 10 "Containers:"

# Check if replicaset can be scheduled
kubectl get events --sort-by='.lastTimestamp'

# Check pods managed by replicaset
kubectl get pods -l app=<label-value>

# Check replicaset logs
kubectl logs replicaset/<replicaset-name>
```

### Common ReplicaSet States and Solutions

| State             | Description                            | Common Solutions                           |
| ----------------- | -------------------------------------- | ------------------------------------------ |
| Desired > Current | Not enough pods running                | Check node resources, image pull issues    |
| Ready < Current   | Pods not ready to serve traffic        | Check container health, readiness probes   |
| Available < Ready | Pods not available for minReadySeconds | Check liveness probes, container crashes   |
| 0 Available       | All pods failed                        | Check logs, resource limits, configuration |

### Debugging Pod Issues in ReplicaSets

```bash
# Get pods managed by replicaset
kubectl get pods -l app=<label-value>

# Describe pods to see issues
kubectl describe pods -l app=<label-value>

# Check logs from all pods in replicaset
kubectl logs -l app=<label-value>

# Check logs from specific pod
kubectl logs <pod-name>

# Execute command in pod
kubectl exec -it <pod-name> -- /bin/bash
```

## Best Practices

### ReplicaSet Design

- **Use Deployments instead**: ReplicaSets are rarely used directly; prefer Deployments
- **Label everything**: Use consistent labeling strategy
- **Resource limits**: Always set resource requests and limits
- **Health checks**: Use liveness and readiness probes
- **Security**: Run containers as non-root when possible

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

## When to Use ReplicaSets

### Use ReplicaSets when:

- You need simple pod replication without rolling updates
- You're building custom controllers
- You need fine-grained control over pod lifecycle
- You're learning Kubernetes concepts

### Use Deployments instead when:

- You need rolling updates and rollbacks
- You're deploying production applications
- You want declarative updates
- You need to manage application state

## Quick Reference

### Essential Commands

```bash
# Get replicasets
kubectl get replicasets

# Describe replicaset
kubectl describe replicaset <name>

# Scale replicaset
kubectl scale replicaset <name> --replicas=3

# Delete replicaset
kubectl delete replicaset <name>

# Create from file
kubectl create -f <file.yaml>

# Update image
kubectl set image replicaset/<name> <container>=<image>
```

### Common Flags

- `-n <namespace>`: Specify namespace
- `-o wide`: Show additional details
- `--all-namespaces`: All namespaces
- `-l <label>`: Filter by label
- `--replicas=N`: Set number of replicas
- `--force`: Force deletion

### Important Fields

- `spec.replicas`: Number of desired replicas
- `spec.selector`: How to identify managed pods
- `spec.template`: Pod template specification
- `status.replicas`: Current number of replicas
- `status.readyReplicas`: Number of ready replicas
- `status.availableReplicas`: Number of available replicas
