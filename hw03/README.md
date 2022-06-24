# Fetching Metrics with Prometheus/Grafana

## Task
Based on application from previous hw, add the screenshots with following metrics:
1) Create Grafana Dashboard with API methods range:
 - Latency (response time) with the following quantiles: 0.5, 0.95, 0.99, max
 - RPS
 - Error Rate - count of 5xx errors
2) Create Grafana Dashboard taken from nginx-ingress-controller:
 - Latency (response time) with the following quantiles: 0.5, 0.95, 0.99, max
 - RPS
 - Error Rate - count of 5xx errors
3) Additional task: using existing Kubernetes system metrics, add dashboard with CPU/Mem usage at pods