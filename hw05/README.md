# Working with Kubernetes

## Task

1) Take the app from previous HWs, as the basis and add authentication/registration flows.
2) Implement scenario of updating the user's profile. Profile should be accessible only for current user.
3) Add the diagram with current architecture.
4) Add instructions how to install the solution(helm or from k8s manifests)
5) Implement the Postman tests and add the command for running them.

The following scenario should be implemented:
1) User1 registration step.
2) User1 shouldn't have an access to his profile without authentication.
3) User1 gets authorised.
4) User1 updates the profile.
5) Check, that profile gets updated.
6) User1 logouts the app(optional).
7) User2 registration step.
8) User2 gets authorised.
9) User2 doesn't have an access to User1 profile.

## Solution

![Diagram](diagram.png?raw=true "Diagram")

**It's supposed, there are Helm3, Minikube installed on your machine.**

### Usage
#### Run Application
1. Add rights for executing *.sh file
```bash
chmod +x hw05-k8s-service.sh
```
2. Install the Database
```bash
./hw05-k8s-service.sh installDB
```
3. Run the application. When application starts, migration Job starts automatically as well and executes migrations, if it's needed.
```bash
./hw05-k8s-service.sh start
4. Start Api Gateway.
```bash
./hw05-k8s-service.sh startApiGateway
```
5. Run tests (It's supposed, Newman is installed on your machine.). Tests work with `arch.homework` URL.
Please, update your `/etc/hosts` file before running tests. To get the external IP, please run the command `minikube service -n hw05 ingress-nginx-controller`
```bash
./hw05-k8s-service.sh test
```

#### Stop Application
1. Stop application.
```bash
./hw05-k8s-service.sh stop
```
2. Uninstall database
```bash
./hw05-k8s-service.sh dropDB
```
