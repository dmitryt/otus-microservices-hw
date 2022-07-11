#!/usr/bin/env bash

RELEASE_NAME="prod"
PG_RELEASE_NAME="pg"
NAMESPACE="monitoring"
CHART_DIR="k8s/charts/hw02-k8s-service"
MONITORING_NAMESPACE="monitoring"
MONITORING_CHART_DIR="k8s/charts/monitoring"

function usage {
    echo "Usage: hw02-k8s-service {start|stop|installDB|dropDB|test}"
    exit 1
}

function installDB {
    echo "Installing Namespace...."
    kubectl create namespace $NAMESPACE
    echo "Installing and starting Postgres...."
    helm upgrade --install $PG_RELEASE_NAME --namespace $NAMESPACE bitnami/postgresql -f $CHART_DIR/db-values.yaml
    echo "Installing and starting Postgres....Done"
}

function dropDB {
    echo "Dropping Postgres...."
    helm uninstall --namespace $NAMESPACE $PG_RELEASE_NAME
    echo "Dropping Postgres....Done"
}

function startService {
    echo "Installing Namespace...."
    kubectl create namespace $NAMESPACE
    echo "Starting service...."
    helm upgrade --install --namespace $NAMESPACE $RELEASE_NAME $CHART_DIR
    echo "Starting service....Done"
}

function stopService {
    echo "Stopping service...."
    helm uninstall --namespace $NAMESPACE $RELEASE_NAME
    echo "Stopping service....Done"
}

function startMonitoring {
    echo "Install monitoring stack...."
    minikube addons enable ingress
    kubectl create namespace $MONITORING_NAMESPACE
    kubectl config set-context --current --namespace=$MONITORING_NAMESPACE
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo add stable https://charts.helm.sh/stable
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    helm install prom prometheus-community/kube-prometheus-stack -f $MONITORING_CHART_DIR/templates/prometheus.yaml --atomic
    helm install nginx ingress-nginx/ingress-nginx -f $MONITORING_CHART_DIR/templates/nginx-ingress.yaml --atomic
    echo "Install monitoring stack....Done"
}

function monitoringPortForward {
    echo "Set monitoring port forward...."
    kubectl port-forward service/prom-grafana 9000:80 &
    kubectl port-forward service/prom-kube-prometheus-stack-prometheus 9090 &
    kubectl port-forward service/prod-hw02-k8s-service 8001:8000 --namespace=monitoring &
    echo "Set monitoring port forward....Done"
}

function runTests {
  npm run e2e
}

case $1 in
  installDB) installDB ;;
  dropDB) dropDB ;;
  start) startService ;;
  stop) stopService ;;
  test) runTests ;;
  monitoring) startMonitoring ;;
  monitoringPortForward) monitoringPortForward ;;
  *) usage ;;
esac
