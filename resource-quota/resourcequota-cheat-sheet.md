# Kubernetes ResourceQuota Cheat Sheet

## What is a ResourceQuota?

A **ResourceQuota** is a Kubernetes resource that provides constraints that limit resource consumption per namespace. It allows cluster administrators to limit the total amount of resources that can be consumed by objects in a namespace, preventing resource exhaustion and ensuring fair resource distribution.

### Key Characteristics:

- **Namespace scope**: Applies to all resources within a specific namespace
- **Resource limits**: Limits total resource consumption (CPU, memory, storage)
- **Object limits**: Limits the number of objects (pods, services, etc.)
- **Automatic enforcement**: Kubernetes automatically enforces these limits
- **Resource types**: CPU, memory, storage, and object counts
- **Hard limits**: Cannot be exceeded, requests are rejected if they would exceed quota

## ResourceQuota vs LimitRange

| Feature            | ResourceQuota               | LimitRange               |
| ------------------ | --------------------------- | ------------------------ |
| **Scope**          | Namespace level             | Pod/Container level      |
| **Purpose**        | Limit total resource usage  | Set resource constraints |
| **Enforcement**    | Per namespace               | Per pod/container        |
| **Default values** | No, only limits total usage | Yes, can set defaults    |
| **Use case**       | Prevent namespace overuse   | Prevent resource waste   |

## ResourceQuota Structure

```
ResourceQuota
├── Resource Limits
│   ├── CPU Limits
│   │   ├── Requests: 4 cores
│   │   └── Limits: 8 cores
│   └── Memory Limits
│       ├── Requests: 8Gi
│       └── Limits: 16Gi
├── Storage Limits
│   ├── Requests: 100Gi
│   └── Limits: 200Gi
├── Object Count Limits
│   ├── Pods: 10
│   ├── Services: 5
│   ├── PersistentVolumeClaims: 20
│   └── ConfigMaps: 50
└── Enforcement Rules
    ├── Hard limits (cannot exceed)
    └── Soft limits (can exceed with warnings)
```

## ResourceQuota Types

### Resource Types:

- **CPU**: Measured in cores (1 = 1000m)
- **Memory**: Measured in bytes (Mi, Gi, etc.)
- **Storage**: For PersistentVolumeClaims
- **Ephemeral storage**: Temporary storage used by containers

### Object Types:

- **Pods**: Number of pods in namespace
- **Services**: Number of services
- **PersistentVolumeClaims**: Number of PVCs
- **ConfigMaps**: Number of ConfigMaps
- **Secrets**: Number of Secrets
- **ReplicationControllers**: Number of RCs
- **ResourceQuotas**: Number of ResourceQuotas
- **Services.loadbalancers**: Number of LoadBalancer services
- **Services.nodeports**: Number of NodePort services

## Basic ResourceQuota Commands

### Viewing ResourceQuotas

```bash
# List all resourcequotas in the current namespace
kubectl get resourcequotas

# List all resourcequotas in all namespaces
kubectl get resourcequotas --all-namespaces

# List resourcequotas with more details
kubectl get resourcequotas -o wide

# List resourcequotas with custom output format
kubectl get resourcequotas -o custom-columns=NAME:.metadata.name,CPU_REQUESTS:.status.used.cpu,CPU_LIMITS:.status.used.limits.cpu,MEMORY_REQUESTS:.status.used.memory,MEMORY_LIMITS:.status.used.limits.memory

# Get resourcequota information in YAML format
kubectl get resourcequota <resourcequota-name> -o yaml

# Get resourcequota information in JSON format
kubectl get resourcequota <resourcequota-name> -o json
```

### Getting ResourceQuota Information

```bash
# Get detailed information about a specific resourcequota
kubectl describe resourcequota <resourcequota-name>

# Get resourcequota information in YAML format
kubectl get resourcequota <resourcequota-name> -o yaml

# Get resourcequota information in JSON format
kubectl get resourcequota <resourcequota-name> -o json

# Show resourcequota details
kubectl explain resourcequota
```

### Creating ResourceQuotas

```bash
# Create a resourcequota from a YAML file
kubectl create -f <resourcequota-definition.yaml>

# Create a resourcequota from a URL
kubectl create -f https://raw.githubusercontent.com/example/resourcequota.yaml

# Create a resourcequota with specific namespace
kubectl create -f <resourcequota-definition.yaml> -n <namespace>

# Create resourcequota using imperative command
kubectl create quota <resourcequota-name> --hard=cpu=4,memory=8Gi,pods=10,services=5
```

### Managing ResourceQuotas

```bash
# Delete a resourcequota
kubectl delete resourcequota <resourcequota-name>

# Delete a resourcequota forcefully
kubectl delete resourcequota <resourcequota-name> --force --grace-period=0

# Delete all resourcequotas in a namespace
kubectl delete resourcequotas --all

# Delete resourcequotas matching a label
kubectl delete resourcequotas -l app=<label-value>

# Edit a resourcequota (opens in default editor)
kubectl edit resourcequota <resourcequota-name>
```

### Testing ResourceQuota Enforcement

```bash
# Create a pod that would exceed quota to test enforcement
kubectl run test-pod --image=nginx --requests=cpu=5,memory=10Gi --limits=cpu=6,memory=12Gi

# Check if pod was created or rejected
kubectl get pods test-pod

# Check pod events for resourcequota violations
kubectl describe pod test-pod

# Check resourcequota status
kubectl describe resourcequota <resourcequota-name>

# Check current resource usage
kubectl get resourcequota <resourcequota-name> -o yaml
```

## ResourceQuota Configuration Examples

### Basic ResourceQuota for CPU and Memory

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
spec:
  hard:
    requests.cpu: "4"
    requests.memory: "8Gi"
    limits.cpu: "8"
    limits.memory: "16Gi"
```

### ResourceQuota for Object Counts

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-counts
spec:
  hard:
    pods: "10"
    services: "5"
    persistentvolumeclaims: "20"
    configmaps: "50"
    secrets: "20"
```

### ResourceQuota for Storage

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: storage-quota
spec:
  hard:
    requests.storage: "100Gi"
    persistentvolumeclaims: "20"
```

### Comprehensive ResourceQuota

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: comprehensive-quota
spec:
  hard:
    # Compute resources
    requests.cpu: "4"
    requests.memory: "8Gi"
    limits.cpu: "8"
    limits.memory: "16Gi"

    # Storage resources
    requests.storage: "100Gi"
    persistentvolumeclaims: "20"

    # Object counts
    pods: "10"
    services: "5"
    configmaps: "50"
    secrets: "20"
    replicationcontrollers: "5"
    resourcequotas: "1"
    services.loadbalancers: "2"
    services.nodeports: "5"
```

### ResourceQuota for Development Environment

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: dev-quota
spec:
  hard:
    requests.cpu: "2"
    requests.memory: "4Gi"
    limits.cpu: "4"
    limits.memory: "8Gi"
    pods: "20"
    services: "10"
    persistentvolumeclaims: "10"
```

### ResourceQuota for Production Environment

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: prod-quota
spec:
  hard:
    requests.cpu: "16"
    requests.memory: "32Gi"
    limits.cpu: "32"
    limits.memory: "64Gi"
    pods: "50"
    services: "20"
    persistentvolumeclaims: "50"
    configmaps: "100"
    secrets: "50"
```

### ResourceQuota with Scopes

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: scoped-quota
spec:
  scopes:
    - BestEffort
    - NotBestEffort
  hard:
    requests.cpu: "4"
    requests.memory: "8Gi"
    limits.cpu: "8"
    limits.memory: "16Gi"
```

## Common ResourceQuota Issues and Debugging

### Troubleshooting Commands

```bash
# Check resourcequota events
kubectl describe resourcequota <resourcequota-name>

# Check resourcequota status
kubectl get resourcequotas -o wide

# Check current resource usage
kubectl get resourcequota <resourcequota-name> -o yaml

# Check if resourcequota is enforced
kubectl get resourcequota <resourcequota-name> -o jsonpath='{.status.used}'

# Check pod creation failures due to quota
kubectl get events --sort-by='.lastTimestamp' | grep resourcequota

# Test resourcequota enforcement
kubectl run test-pod --image=nginx --requests=cpu=5,memory=10Gi

# Check namespace resource usage
kubectl top pods --all-namespaces
```

### Common ResourceQuota States and Solutions

| Issue                   | Description                        | Common Solutions                           |
| ----------------------- | ---------------------------------- | ------------------------------------------ |
| Pod creation failed     | Resource requests exceed quota     | Reduce resource requests or increase quota |
| Service creation failed | Object count limit reached         | Delete unused objects or increase limit    |
| PVC creation failed     | Storage quota exceeded             | Reduce storage request or increase quota   |
| Quota not enforced      | ResourceQuota not created properly | Check ResourceQuota configuration          |
| Quota too restrictive   | Normal operations blocked          | Adjust quota limits                        |

### Debugging Resource Issues

```bash
# Check what resourcequotas exist in namespace
kubectl get resourcequotas

# Check resourcequota details
kubectl describe resourcequota <resourcequota-name>

# Check current resource usage
kubectl get resourcequota <resourcequota-name> -o yaml

# Check if pod creation was blocked by quota
kubectl get events --field-selector involvedObject.name=<pod-name>

# Test creating resource that would exceed quota
kubectl run test-pod --image=nginx --requests=cpu=5,memory=10Gi

# Check resource usage across namespace
kubectl top pods

# Check resource requests/limits for all pods
kubectl get pods -o custom-columns=NAME:.metadata.name,CPU_REQ:.spec.containers[0].resources.requests.cpu,CPU_LIMIT:.spec.containers[0].resources.limits.cpu,MEMORY_REQ:.spec.containers[0].resources.requests.memory,MEMORY_LIMIT:.spec.containers[0].resources.limits.memory
```

## Best Practices

### ResourceQuota Design

- **Start with generous limits**: Begin with loose quotas and tighten over time
- **Monitor resource usage**: Track actual resource consumption
- **Use namespace organization**: Different quotas for different environments
- **Document quotas**: Clearly document resource limits and policies
- **Regular reviews**: Periodically review and adjust quotas

### Resource Planning

```yaml
# Development namespace
spec:
  hard:
    requests.cpu: "2"
    requests.memory: "4Gi"
    pods: "20"

# Production namespace
spec:
  hard:
    requests.cpu: "16"
    requests.memory: "32Gi"
    pods: "50"
```

### Monitoring and Alerts

```yaml
# Set up monitoring for quota usage
# Example: Prometheus queries for quota monitoring
# - kube_resourcequota_created
# - kube_resourcequota_modified
# - kube_resourcequota_status_used
```

### Namespace Organization

```yaml
# Different resourcequotas for different namespaces
# - dev namespace: Loose quotas for development
# - staging namespace: Medium quotas for testing
# - production namespace: Strict quotas for production
```

## When to Use ResourceQuotas

### Use ResourceQuotas when:

- You want to limit total namespace resource usage
- You need to prevent namespace overuse
- You want to enforce namespace-level limits
- You need to track resource consumption
- You want to ensure fair resource distribution

### Use LimitRanges when:

- You want to enforce resource constraints per pod/container
- You need to set default resource values
- You want to prevent resource waste at container level
- You need to standardize resource usage per container

### Use both when:

- You want comprehensive resource management
- You need both namespace and container limits
- You want to enforce both total and individual limits

## Quick Reference

### Essential Commands

```bash
# Get resourcequotas
kubectl get resourcequotas

# Describe resourcequota
kubectl describe resourcequota <name>

# Create resourcequota
kubectl create -f <file.yaml>

# Delete resourcequota
kubectl delete resourcequota <name>

# Test quota enforcement
kubectl run test-pod --image=nginx --requests=cpu=5,memory=10Gi
```

### Common Flags

- `-n <namespace>`: Specify namespace
- `-o wide`: Show additional details
- `--all-namespaces`: All namespaces
- `-l <label>`: Filter by label
- `--force`: Force deletion

### Important Fields

- `spec.hard`: Hard limits that cannot be exceeded
- `spec.scopes`: Scopes for quota application
- `status.used`: Current resource usage
- `status.hard`: Hard limits set
- `status.used`: Current usage

### Resource Units

- **CPU**: Cores (1 = 1000m)
- **Memory**: Bytes (Mi, Gi, etc.)
- **Storage**: Bytes (Gi, Ti, etc.)

### Common Resource Values

| Environment | CPU Requests | Memory Requests | Pods | Services |
| ----------- | ------------ | --------------- | ---- | -------- |
| Development | 2 cores      | 4Gi             | 20   | 10       |
| Staging     | 8 cores      | 16Gi            | 30   | 15       |
| Production  | 16 cores     | 32Gi            | 50   | 20       |

### Scopes

- **BestEffort**: Pods that do not have resource requirements
- **NotBestEffort**: Pods that have resource requirements
- **Terminating**: Pods that are terminating
- **NotTerminating**: Pods that are not terminating
