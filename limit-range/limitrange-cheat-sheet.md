# Kubernetes LimitRange Cheat Sheet

## What is a LimitRange?

A **LimitRange** is a Kubernetes resource that enforces constraints on resource requests and limits for Pods and Containers within a namespace. It provides a way to set default resource limits, minimum and maximum resource constraints, and default resource requests.

### Key Characteristics:

- **Resource constraints**: Enforces minimum and maximum resource limits
- **Default values**: Sets default resource requests and limits for containers
- **Namespace scope**: Applies to all pods in a specific namespace
- **Automatic enforcement**: Kubernetes automatically enforces these limits
- **Resource types**: CPU and memory constraints
- **Storage limits**: Can also enforce storage request limits

## LimitRange vs ResourceQuota

| Feature            | LimitRange               | ResourceQuota               |
| ------------------ | ------------------------ | --------------------------- |
| **Scope**          | Pod/Container level      | Namespace level             |
| **Purpose**        | Set resource constraints | Limit total resource usage  |
| **Enforcement**    | Per pod/container        | Per namespace               |
| **Default values** | Yes, can set defaults    | No, only limits total usage |
| **Use case**       | Prevent resource waste   | Prevent namespace overuse   |

## LimitRange Structure

```
LimitRange
├── Resource Constraints
│   ├── CPU Limits
│   │   ├── Min: 100m
│   │   ├── Max: 1000m
│   │   └── Default: 500m
│   └── Memory Limits
│       ├── Min: 64Mi
│       ├── Max: 1Gi
│       └── Default: 256Mi
├── Storage Constraints
│   ├── Min: 1Gi
│   ├── Max: 10Gi
│   └── Default: 5Gi
└── Enforcement Rules
    ├── Pod level
    ├── Container level
    └── PersistentVolumeClaim level
```

## LimitRange Types

### Resource Types:

- **CPU**: Measured in cores (1 = 1000m)
- **Memory**: Measured in bytes (Mi, Gi, etc.)
- **Storage**: For PersistentVolumeClaims

### Constraint Types:

- **Min**: Minimum allowed value
- **Max**: Maximum allowed value
- **Default**: Default value if not specified
- **DefaultRequest**: Default request if not specified

## Basic LimitRange Commands

### Viewing LimitRanges

```bash
# List all limitranges in the current namespace
kubectl get limitranges

# List all limitranges in all namespaces
kubectl get limitranges --all-namespaces

# List limitranges with more details
kubectl get limitranges -o wide

# List limitranges with custom output format
kubectl get limitranges -o custom-columns=NAME:.metadata.name,CPU_MIN:.spec.limits[0].min.cpu,CPU_MAX:.spec.limits[0].max.cpu,MEMORY_MIN:.spec.limits[0].min.memory,MEMORY_MAX:.spec.limits[0].max.memory

# Get limitrange information in YAML format
kubectl get limitrange <limitrange-name> -o yaml

# Get limitrange information in JSON format
kubectl get limitrange <limitrange-name> -o json
```

### Getting LimitRange Information

```bash
# Get detailed information about a specific limitrange
kubectl describe limitrange <limitrange-name>

# Get limitrange information in YAML format
kubectl get limitrange <limitrange-name> -o yaml

# Get limitrange information in JSON format
kubectl get limitrange <limitrange-name> -o json

# Show limitrange details
kubectl explain limitrange
```

### Creating LimitRanges

```bash
# Create a limitrange from a YAML file
kubectl create -f <limitrange-definition.yaml>

# Create a limitrange from a URL
kubectl create -f https://raw.githubusercontent.com/example/limitrange.yaml

# Create a limitrange with specific namespace
kubectl create -f <limitrange-definition.yaml> -n <namespace>

# Create limitrange using imperative command
kubectl create limitrange <limitrange-name> --min=cpu=100m,memory=64Mi --max=cpu=1000m,memory=1Gi --default=cpu=500m,memory=256Mi
```

### Managing LimitRanges

```bash
# Delete a limitrange
kubectl delete limitrange <limitrange-name>

# Delete a limitrange forcefully
kubectl delete limitrange <limitrange-name> --force --grace-period=0

# Delete all limitranges in a namespace
kubectl delete limitranges --all

# Delete limitranges matching a label
kubectl delete limitranges -l app=<label-value>

# Edit a limitrange (opens in default editor)
kubectl edit limitrange <limitrange-name>
```

### Testing LimitRange Enforcement

```bash
# Create a pod that exceeds limits to test enforcement
kubectl run test-pod --image=nginx --requests=cpu=2000m,memory=2Gi --limits=cpu=3000m,memory=3Gi

# Check if pod was created or rejected
kubectl get pods test-pod

# Check pod events for limitrange violations
kubectl describe pod test-pod

# Create a pod without resource specifications to test defaults
kubectl run default-pod --image=nginx

# Check what defaults were applied
kubectl describe pod default-pod
```

## LimitRange Configuration Examples

### Basic LimitRange for CPU and Memory

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: cpu-memory-limits
spec:
  limits:
    - type: Container
      max:
        cpu: "1000m"
        memory: "1Gi"
      min:
        cpu: "100m"
        memory: "64Mi"
      default:
        cpu: "500m"
        memory: "256Mi"
      defaultRequest:
        cpu: "250m"
        memory: "128Mi"
```

### LimitRange for Pod Resources

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: pod-limits
spec:
  limits:
    - type: Pod
      max:
        cpu: "2000m"
        memory: "2Gi"
      min:
        cpu: "200m"
        memory: "128Mi"
```

### LimitRange for Storage

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: storage-limits
spec:
  limits:
    - type: PersistentVolumeClaim
      max:
        storage: "10Gi"
      min:
        storage: "1Gi"
      default:
        storage: "5Gi"
```

### Comprehensive LimitRange

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: comprehensive-limits
spec:
  limits:
    - type: Container
      max:
        cpu: "1000m"
        memory: "1Gi"
      min:
        cpu: "100m"
        memory: "64Mi"
      default:
        cpu: "500m"
        memory: "256Mi"
      defaultRequest:
        cpu: "250m"
        memory: "128Mi"
    - type: Pod
      max:
        cpu: "2000m"
        memory: "2Gi"
      min:
        cpu: "200m"
        memory: "128Mi"
    - type: PersistentVolumeClaim
      max:
        storage: "10Gi"
      min:
        storage: "1Gi"
      default:
        storage: "5Gi"
```

### LimitRange for Development Environment

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: dev-limits
spec:
  limits:
    - type: Container
      max:
        cpu: "500m"
        memory: "512Mi"
      min:
        cpu: "50m"
        memory: "32Mi"
      default:
        cpu: "200m"
        memory: "128Mi"
      defaultRequest:
        cpu: "100m"
        memory: "64Mi"
```

### LimitRange for Production Environment

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: prod-limits
spec:
  limits:
    - type: Container
      max:
        cpu: "2000m"
        memory: "2Gi"
      min:
        cpu: "200m"
        memory: "128Mi"
      default:
        cpu: "1000m"
        memory: "1Gi"
      defaultRequest:
        cpu: "500m"
        memory: "512Mi"
    - type: Pod
      max:
        cpu: "4000m"
        memory: "4Gi"
```

## Common LimitRange Issues and Debugging

### Troubleshooting Commands

```bash
# Check limitrange events
kubectl describe limitrange <limitrange-name>

# Check limitrange status
kubectl get limitranges -o wide

# Check if limitrange is enforced
kubectl get limitranges <limitrange-name> -o yaml

# Check pod resource usage
kubectl top pod <pod-name>

# Check pod resource requests/limits
kubectl describe pod <pod-name> | grep -A 10 "Containers:"

# Check if pod creation was blocked by limitrange
kubectl get events --sort-by='.lastTimestamp' | grep limitrange

# Test limitrange enforcement
kubectl run test-pod --image=nginx --requests=cpu=2000m,memory=2Gi
```

### Common LimitRange States and Solutions

| Issue                      | Description                     | Common Solutions                            |
| -------------------------- | ------------------------------- | ------------------------------------------- |
| Pod creation failed        | Resource requests exceed limits | Reduce resource requests or increase limits |
| Default values not applied | Pod created without defaults    | Check limitrange configuration              |
| Storage limits exceeded    | PVC creation failed             | Reduce storage request or increase limits   |
| Memory limits too low      | Pods getting OOM killed         | Increase memory limits                      |
| CPU limits too low         | Pods getting throttled          | Increase CPU limits                         |

### Debugging Resource Issues

```bash
# Check what limitranges exist in namespace
kubectl get limitranges

# Check limitrange details
kubectl describe limitrange <limitrange-name>

# Check pod resource specifications
kubectl get pod <pod-name> -o yaml | grep -A 10 resources

# Check if pod was created with defaults
kubectl describe pod <pod-name> | grep -A 5 "Containers:"

# Test creating pod without resource specs
kubectl run test-pod --image=nginx

# Check what defaults were applied
kubectl describe pod test-pod

# Check pod events for limitrange violations
kubectl get events --field-selector involvedObject.name=<pod-name>
```

## Best Practices

### LimitRange Design

- **Set reasonable defaults**: Provide sensible default resource values
- **Use namespace-specific limits**: Different limits for different environments
- **Monitor resource usage**: Track actual resource consumption
- **Gradual enforcement**: Start with loose limits and tighten over time
- **Document limits**: Clearly document resource constraints

### Resource Planning

```yaml
# Development environment
spec:
  limits:
    - type: Container
      max:
        cpu: "500m"
        memory: "512Mi"
      default:
        cpu: "200m"
        memory: "128Mi"

# Production environment
spec:
  limits:
    - type: Container
      max:
        cpu: "2000m"
        memory: "2Gi"
      default:
        cpu: "1000m"
        memory: "1Gi"
```

### Monitoring and Alerts

```yaml
# Set up monitoring for resource usage
# Example: Prometheus queries for resource monitoring
# - container_cpu_usage_seconds_total
# - container_memory_usage_bytes
```

### Namespace Organization

```yaml
# Different limitranges for different namespaces
# - dev namespace: Loose limits
# - staging namespace: Medium limits
# - production namespace: Strict limits
```

## When to Use LimitRanges

### Use LimitRanges when:

- You want to enforce resource constraints
- You need to set default resource values
- You want to prevent resource waste
- You need to standardize resource usage
- You want to enforce storage limits

### Use ResourceQuotas when:

- You want to limit total namespace usage
- You need to prevent namespace overuse
- You want to enforce namespace-level limits
- You need to track resource consumption

### Use both when:

- You want comprehensive resource management
- You need both container and namespace limits
- You want to enforce both individual and total limits

## Quick Reference

### Essential Commands

```bash
# Get limitranges
kubectl get limitranges

# Describe limitrange
kubectl describe limitrange <name>

# Create limitrange
kubectl create -f <file.yaml>

# Delete limitrange
kubectl delete limitrange <name>

# Test limitrange enforcement
kubectl run test-pod --image=nginx --requests=cpu=2000m
```

### Common Flags

- `-n <namespace>`: Specify namespace
- `-o wide`: Show additional details
- `--all-namespaces`: All namespaces
- `-l <label>`: Filter by label
- `--force`: Force deletion

### Important Fields

- `spec.limits[].type`: Type of limit (Container, Pod, PersistentVolumeClaim)
- `spec.limits[].max`: Maximum allowed values
- `spec.limits[].min`: Minimum allowed values
- `spec.limits[].default`: Default values
- `spec.limits[].defaultRequest`: Default request values

### Resource Units

- **CPU**: Cores (1 = 1000m)
- **Memory**: Bytes (Mi, Gi, etc.)
- **Storage**: Bytes (Gi, Ti, etc.)

### Common Resource Values

| Resource | Min  | Default | Max   |
| -------- | ---- | ------- | ----- |
| CPU      | 100m | 500m    | 1000m |
| Memory   | 64Mi | 256Mi   | 1Gi   |
| Storage  | 1Gi  | 5Gi     | 10Gi  |
