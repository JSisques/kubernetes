# Kubernetes Service Cheat Sheet

## What is a Service?

A **Service** is a Kubernetes resource that provides a stable network endpoint for a set of pods. It acts as an abstraction layer that enables network access to a set of pods, providing load balancing and service discovery.

### Key Characteristics:

- **Stable IP address**: Services have a stable IP address that doesn't change
- **Load balancing**: Automatically distributes traffic across multiple pods
- **Service discovery**: Enables pods to find and communicate with each other
- **Port mapping**: Maps external ports to container ports
- **Health checking**: Can perform health checks on backend pods
- **Session affinity**: Can maintain client connections to the same pod

## Service Types

| Type             | Description                             | Use Case                       |
| ---------------- | --------------------------------------- | ------------------------------ |
| **ClusterIP**    | Internal access only (default)          | Internal service communication |
| **NodePort**     | External access via node IP             | Development and testing        |
| **LoadBalancer** | External access via cloud load balancer | Production external access     |
| **ExternalName** | Maps service to external DNS name       | External service integration   |

## Service Structure

```
Service
├── Cluster IP (10.96.1.1)
├── Port Mapping
│   ├── Port (80) → TargetPort (8080)
│   └── Port (443) → TargetPort (8443)
├── Endpoints
│   ├── Pod 1 (10.244.1.1:8080)
│   ├── Pod 2 (10.244.1.2:8080)
│   └── Pod 3 (10.244.1.3:8080)
└── Load Balancer
    └── Traffic Distribution
```

## Service Lifecycle

### Service States:

- **Pending**: Service is being created
- **Active**: Service is running and ready to accept traffic
- **Failed**: Service creation failed
- **Terminating**: Service is being deleted

### Endpoint States:

- **Ready**: Endpoint is healthy and ready to receive traffic
- **NotReady**: Endpoint is unhealthy or not ready
- **Pending**: Endpoint is being created

## Basic Service Commands

### Viewing Services

```bash
# List all services in the current namespace
kubectl get services

# List all services in all namespaces
kubectl get services --all-namespaces

# List services with more details
kubectl get services -o wide

# List services with custom output format
kubectl get services -o custom-columns=NAME:.metadata.name,TYPE:.spec.type,CLUSTER-IP:.spec.clusterIP,EXTERNAL-IP:.status.loadBalancer.ingress[0].ip,PORT:.spec.ports[0].port,AGE:.metadata.creationTimestamp

# Get service information in YAML format
kubectl get service <service-name> -o yaml

# Get service information in JSON format
kubectl get service <service-name> -o json
```

### Getting Service Information

```bash
# Get detailed information about a specific service
kubectl describe service <service-name>

# Get service information in YAML format
kubectl get service <service-name> -o yaml

# Get service information in JSON format
kubectl get service <service-name> -o json

# Show service endpoints
kubectl get endpoints <service-name>

# Describe service endpoints
kubectl describe endpoints <service-name>
```

### Creating Services

```bash
# Create a service from a YAML file
kubectl create -f <service-definition.yaml>

# Create a service from a URL
kubectl create -f https://raw.githubusercontent.com/example/service.yaml

# Create a service using imperative command
kubectl expose deployment <deployment-name> --port=80 --target-port=8080

# Create a service with specific namespace
kubectl create -f <service-definition.yaml> -n <namespace>

# Create a service for a pod
kubectl expose pod <pod-name> --port=80 --target-port=8080

# Create a service for a replicaset
kubectl expose replicaset <replicaset-name> --port=80 --target-port=8080
```

### Managing Services

```bash
# Delete a service
kubectl delete service <service-name>

# Delete a service forcefully
kubectl delete service <service-name> --force --grace-period=0

# Delete all services in a namespace
kubectl delete services --all

# Delete services matching a label
kubectl delete services -l app=<label-value>

# Edit a service (opens in default editor)
kubectl edit service <service-name>
```

### Service Testing and Debugging

```bash
# Test service connectivity from within cluster
kubectl run test-pod --image=busybox --rm -it --restart=Never -- nslookup <service-name>

# Test service connectivity using curl
kubectl run test-pod --image=curlimages/curl --rm -it --restart=Never -- curl <service-name>:<port>

# Port forward to service for local testing
kubectl port-forward service/<service-name> 8080:80

# Get service logs (if applicable)
kubectl logs service/<service-name>

# Check service DNS resolution
kubectl run test-pod --image=busybox --rm -it --restart=Never -- nslookup <service-name>.<namespace>.svc.cluster.local
```

## Service Configuration Examples

### ClusterIP Service (Default)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  labels:
    app: my-app
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

### NodePort Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nodeport-service
  labels:
    app: my-app
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
      nodePort: 30080
```

### LoadBalancer Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-loadbalancer-service
  labels:
    app: my-app
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  externalTrafficPolicy: Local
```

### ExternalName Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-external-service
spec:
  type: ExternalName
  externalName: api.example.com
```

### Service with Multiple Ports

```yaml
apiVersion: v1
kind: Service
metadata:
  name: multi-port-service
  labels:
    app: my-app
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 8080
    - name: https
      protocol: TCP
      port: 443
      targetPort: 8443
```

### Service with Session Affinity

```yaml
apiVersion: v1
kind: Service
metadata:
  name: session-affinity-service
  labels:
    app: my-app
spec:
  type: ClusterIP
  selector:
    app: my-app
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 3600
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

### Service with External IPs

```yaml
apiVersion: v1
kind: Service
metadata:
  name: external-ip-service
  labels:
    app: my-app
spec:
  type: ClusterIP
  externalIPs:
    - 192.168.1.100
    - 192.168.1.101
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

## Common Service Issues and Debugging

### Troubleshooting Commands

```bash
# Check service events
kubectl describe service <service-name>

# Check service status
kubectl get services -o wide

# Check service endpoints
kubectl get endpoints <service-name>

# Check if pods are ready for service
kubectl get pods -l app=<label-value>

# Check service DNS resolution
kubectl run test-pod --image=busybox --rm -it --restart=Never -- nslookup <service-name>

# Test service connectivity
kubectl run test-pod --image=curlimages/curl --rm -it --restart=Never -- curl <service-name>:<port>

# Check service logs (if applicable)
kubectl logs service/<service-name>

# Check if service can reach pods
kubectl exec -it <pod-name> -- curl <service-name>:<port>
```

### Common Service States and Solutions

| State                 | Description                         | Common Solutions                         |
| --------------------- | ----------------------------------- | ---------------------------------------- |
| Pending               | Service is being created            | Wait for service creation to complete    |
| Active                | Service is running normally         | -                                        |
| Failed                | Service creation failed             | Check YAML syntax, resource limits       |
| No endpoints          | No pods match service selector      | Check pod labels, selector configuration |
| Endpoints not ready   | Pods are not ready to serve traffic | Check pod health, readiness probes       |
| DNS resolution failed | Service DNS not working             | Check CoreDNS, network policies          |

### Debugging Service Connectivity

```bash
# Check if service has endpoints
kubectl get endpoints <service-name>

# Check if pods are running and ready
kubectl get pods -l app=<label-value>

# Test service from within cluster
kubectl run test-pod --image=busybox --rm -it --restart=Never -- nslookup <service-name>

# Test service connectivity
kubectl run test-pod --image=curlimages/curl --rm -it --restart=Never -- curl <service-name>:<port>

# Check service DNS in specific namespace
kubectl run test-pod --image=busybox --rm -it --restart=Never -- nslookup <service-name>.<namespace>.svc.cluster.local

# Port forward for local testing
kubectl port-forward service/<service-name> 8080:80
```

## Best Practices

### Service Design

- **Use descriptive names**: Service names should clearly indicate their purpose
- **Label everything**: Use consistent labeling strategy
- **Health checks**: Implement readiness probes in pods
- **Security**: Use network policies to restrict traffic
- **Monitoring**: Monitor service endpoints and connectivity

### Service Discovery

```yaml
# Use DNS for service discovery
# Format: <service-name>.<namespace>.svc.cluster.local
# Example: my-service.default.svc.cluster.local
```

### Load Balancing

```yaml
spec:
  sessionAffinity: ClientIP # For session persistence
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 3600
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

### Health Checking

```yaml
# In pod template
spec:
  containers:
    - name: my-container
      readinessProbe:
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 5
```

### Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-service-traffic
spec:
  podSelector:
    matchLabels:
      app: my-app
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: frontend
      ports:
        - protocol: TCP
          port: 80
```

## When to Use Different Service Types

### Use ClusterIP when:

- You need internal service communication
- Pods need to communicate with each other
- You're using an Ingress controller
- You want to expose services internally only

### Use NodePort when:

- You need external access for development/testing
- You don't have a cloud load balancer
- You want to access services directly from nodes
- You're in a local development environment

### Use LoadBalancer when:

- You need external access in production
- You have cloud provider support
- You want automatic load balancing
- You need high availability

### Use ExternalName when:

- You want to point to external services
- You need to abstract external DNS names
- You want to switch external endpoints easily
- You're integrating with external APIs

## Quick Reference

### Essential Commands

```bash
# Get services
kubectl get services

# Describe service
kubectl describe service <name>

# Create service from deployment
kubectl expose deployment <name> --port=80 --target-port=8080

# Delete service
kubectl delete service <name>

# Port forward to service
kubectl port-forward service/<name> 8080:80

# Test service connectivity
kubectl run test-pod --image=curlimages/curl --rm -it --restart=Never -- curl <service-name>:<port>
```

### Common Flags

- `-n <namespace>`: Specify namespace
- `-o wide`: Show additional details
- `--all-namespaces`: All namespaces
- `-l <label>`: Filter by label
- `--port`: Service port
- `--target-port`: Container port
- `--type`: Service type (ClusterIP, NodePort, LoadBalancer)

### Important Fields

- `spec.type`: Service type (ClusterIP, NodePort, LoadBalancer, ExternalName)
- `spec.selector`: How to identify target pods
- `spec.ports`: Port mapping configuration
- `spec.clusterIP`: Internal IP address
- `spec.externalIPs`: External IP addresses
- `spec.externalName`: External DNS name (for ExternalName type)
- `status.loadBalancer.ingress`: Load balancer IP addresses
