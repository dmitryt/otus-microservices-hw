# Working with idempotency

## Task

1) Take the app from previous HWs, as the basis and make order's creation idempotent.
2) Describe the selected pattern for adding idempotency.
3) Implement the Postman tests and add the command for running them.

## Solution

**It's supposed, there are Helm3, Minikube installed on your machine.**

### Usage
#### Run Application
1. Add rights for executing *.sh file
```bash
chmod +x hw07-k8s-service.sh
```
2. Start Application
```bash
./hw07-k8s-service.sh start
```
3. Run tests (It's supposed, Newman is installed on your machine.). Tests work with `arch.homework` URL.
Please, update your `/etc/hosts` file before running tests. To get the external IP, please run the command `minikube service -n hw07 ingress-nginx-controller`

As nginx-ingress Api Gateway is used, but /etc/hosts doesn't support port notation, we need to replace
`arch.homework` domain with required IP adress(should be adjusted to work under Linux):

```bash
sed -i '' -e 's/arch.homework/192.168.64.15:32080/g' Users_API.postman_collection.json
```

To run tests:

```bash
./hw07-k8s-service.sh test
```

#### Stop Application
```bash
./hw07-k8s-service.sh stop
```
