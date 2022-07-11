#!/usr/bin/env bash

RELEASE_NAME="prod"
PG_RELEASE_NAME="pg"
NAMESPACE="hw05"
CHART_DIR="k8s/charts/hw05-k8s-service"

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

function runTests {
  npm run e2e
}

case $1 in
  installDB) installDB ;;
  dropDB) dropDB ;;
  start) startService ;;
  stop) stopService ;;
  test) runTests ;;
  *) usage ;;
esac
