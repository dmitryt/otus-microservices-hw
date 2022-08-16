# Working with Event Driven Architecture

1. Create `orders`, `billing`, `notifications` services
2. User should be able to create an order(via `orders` service), should be charged via the `billing` service and should receive notification/email via the `notifications` service
3. Prepare the architecture and choose the acceptable architecture pattern in this case.

## Task

1) Take the app from previous HWs, as the basis and add billing, orders and notifications services.
2) Implement scenario of creating the order and charging the user's balance.
3) Add the diagram with current architecture.
4) Add instructions how to install the solution(helm or from k8s manifests)
5) Implement the Postman tests and add the command for running them.

The following scenario should be implemented:
1) User registration step, billing account should be created as well.
2) Add money to user's account.
3) Create an order, which is possible to buy(user should have enough money to pay for it)
4) Check, that user was charged.
5) Check notification service, correspondent notification should be sent.
6) Create another order, user shouldn't have enough money for it.
7) Check, that user was not charged.
8) Check notification service, correspondent notification should be sent.

## Solution

![Diagram](sequence_diagram.png?raw=true "Diagram")

### SQL Schema
![SQL Schema](sql_diagram.png?raw=true "SQL Schema")

**It's supposed, there are Helm3, Minikube installed on your machine.**

### Usage
#### Run Application
1. Add rights for executing *.sh file
```bash
chmod +x hw06-k8s-service.sh
```
2. Start Application
```bash
./hw06-k8s-service.sh start
```
3. Run tests (It's supposed, Newman is installed on your machine.). Tests work with `arch.homework` URL.
Please, update your `/etc/hosts` file before running tests. To get the external IP, please run the command `minikube service -n hw06 ingress-nginx-controller`

As nginx-ingress Api Gateway is used, but /etc/hosts doesn't support port notation, we need to replace
`arch.homework` domain with required IP adress(should be adjusted to work under Linux):

```bash
sed -i '' -e 's/arch.homework/192.168.64.15:32080/g' Users_API.postman_collection.json
```

To run tests:

```bash
./hw06-k8s-service.sh test
```

#### Stop Application
```bash
./hw06-k8s-service.sh stop
```
