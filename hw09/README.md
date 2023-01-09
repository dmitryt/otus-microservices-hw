# Saga Pattern

## Task

1) Take the app from previous HWs, as the basis and make order's creation idempotent.
2) Describe the selected pattern for adding idempotency.
3) Implement the Postman tests and add the command for running them.

## Solution

Solution is based on `transaction_locks` table. When order is created, the fingerprint is generated from payload. Next time, when the same payload comes, it will be skipped.
All 5 minutes old fingerprints will be removed during the next transaction.

**It's supposed, there are Helm3, Minikube installed on your machine.**

### Usage
#### Run Application
1. Add rights for executing *.sh file
```bash
chmod +x hw09-k8s-service.sh
```
2. Start Application
```bash
./hw09-k8s-service.sh start
```
3. Run tests (It's supposed, Newman is installed on your machine.). Tests work with `arch.homework` URL.
Please, update your `/etc/hosts` file before running tests. To get the external IP, please run the command `minikube service -n hw09 ingress-nginx-controller`

As nginx-ingress Api Gateway is used, but /etc/hosts doesn't support port notation, we need to replace
`arch.homework` domain with required IP adress(should be adjusted to work under Linux):

```bash
sed -i '' -e 's/arch.homework/192.168.64.15:32080/g' Users_API.postman_collection.json
```

To run tests:

```bash
./hw09-k8s-service.sh test
```

#### Stop Application
```bash
./hw09-k8s-service.sh stop
```

### Troubleshooting
1. Sometimes I got an error during starting the `nginx-ingress` API Gateway:
```
Error: Internal error occurred: failed calling webhook "validate.nginx.ingress.kubernetes.io": Post "https://ingress-nginx-controller-admission.hw09.svc:443/networking/v1beta1/ingresses?timeout=10s": dial tcp 10.100.233.18:443: connect: connection refused
```

To solve this issue you need to launch
```
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
```
