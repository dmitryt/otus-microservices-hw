# Working with Kubernetes

## Task

1) Create RESTful CRUD for working with users. API example https://app.swaggerhub.com/apis/otus55/users/1.0.0
2) Add Database. All configuration should be put into ConfigsMap/Secrets
3) Add Job for applying migrations(if it's needed). Ingress should process 'http://arch.homework' address
4) Use Helm to launch the DB
5) Add Postman tests for this API.

**It's supposed, there are Helm3, Minikube installed on your machine.**

### Usage
1. Add rights for executing *.sh file
```bash
chmod +x hw02-k8s-service.sh
```
2. Install the Database
```bash
./hw02-k8s-service.sh installDB
```
3. Run the application(it can ask for admin permissions, because it updates `/etc/hosts` file).
   <br/> When application starts, migration Job starts automatically as well and executes migrations, if it's needed.
```bash
./hw02-k8s-service.sh start
```
4. Run tests (It's supposed, Newman is installed on your machine.)
```bash
./hw02-k8s-service.sh test
```
5. Stop application. It will update `/etc/hosts` file
```bash
./hw02-k8s-service.sh stop
```
6. Uninstall database
```bash
./hw02-k8s-service.sh dropDB
```
