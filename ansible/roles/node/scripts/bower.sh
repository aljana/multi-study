#!/usr/bin/env bash
export PYTHONUNBUFFERED=1

HOME_DIR=$1
ROOT_DIR=$2

source $HOME_DIR/.nvm/nvm.sh
nvm use default

if [ ! -f $ROOT_DIR/bower.json ]
    then
        exit 0
fi

cd $ROOT_DIR

bower install -q -f
