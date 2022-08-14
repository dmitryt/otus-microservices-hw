#!/usr/bin/env bash

RELEASE_NAME="prod"
PG_RELEASE_NAME="pg"
RABBIT_RELEASE_NAME="rabbit"
NAMESPACE="hw06"
CHART_DIR="k8s/charts/hw06-k8s-service"

function usage {
    echo "Usage: hw06-k8s-service {start|stop|installDB|dropDB|test}"
    exit 1
}

function installDB {
    echo "Installing and starting Postgres...."
    helm upgrade --install $PG_RELEASE_NAME --namespace $NAMESPACE bitnami/postgresql -f $CHART_DIR/db-values.yaml
    echo "Installing and starting Postgres....Done"
}

function dropDB {
    echo "Dropping Postgres...."
    helm uninstall --namespace $NAMESPACE $PG_RELEASE_NAME
    echo "Dropping Postgres....Done"
}

function installRabbitMq {
    echo "Installing Namespace...."
    kubectl create namespace $NAMESPACE
    echo "Installing and starting RabbitMQ...."
    helm upgrade --install $RABBIT_RELEASE_NAME --namespace $NAMESPACE bitnami/rabbitmq -f $CHART_DIR/rabbit-mq-values.yaml
    echo "Installing and starting RabbitMQ....Done"
}

function dropRabbitMq {
    echo "Dropping RabbitMQ...."
    helm uninstall --namespace $NAMESPACE $RABBIT_RELEASE_NAME
    echo "Dropping RabbitMQ....Done"
}

function startService {
    echo "Installing Namespace...."
    kubectl create namespace $NAMESPACE
    installDB
    echo "Starting service...."
    helm upgrade --install --namespace $NAMESPACE $RELEASE_NAME $CHART_DIR
    echo "Starting service....Done"
}

function startApiGateway {
    echo "Installing ApiGateway...."
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm upgrade --install --version "3.35.0" --namespace $NAMESPACE -f $CHART_DIR/nginx.yaml \
      ingress-nginx ingress-nginx/ingress-nginx
    echo "Installing ApiGateway....Done"
}

function stopApiGateway {
    echo "Stopping ApiGateway...."
    helm uninstall --namespace $NAMESPACE -f $CHART_DIR/nginx.yaml \
      ingress-nginx ingress-nginx/ingress-nginx
    echo "Stopping ApiGateway....Done"
}

function stopService {
    echo "Stopping service...."
    dropDB
    helm uninstall --namespace $NAMESPACE $RELEASE_NAME
    echo "Stopping service....Done"
}

function portForward {
    echo "Set port forward...."
    kubectl port-forward service/prod-hw06-k8s-service 8001:8000 --namespace $NAMESPACE &
    echo "Set port forward....Done"
}

function runTests {
  newman run Users_API.postman_collection.json
}

case $1 in
  installDB) installDB ;;
  dropDB) dropDB ;;
  start) startService ;;
  stop) stopService ;;
  test) runTests ;;
  portForward) portForward ;;
  startApiGateway) startApiGateway ;;
  stopApiGateway) stopApiGateway ;;
  installRabbitMq) installRabbitMq ;;
  dropRabbitMq) dropRabbitMq ;;
  *) usage ;;
esac
