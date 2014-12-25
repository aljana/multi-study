#!/usr/bin/env bash
export PYTHONUNBUFFERED=1

COMMAND=$1
HOME_DIR=$2
ROOT_DIR=$3

source $HOME_DIR/.nvm/nvm.sh
nvm use default

if [ ! -f $ROOT_DIR/gulpfile.js ]
    then
        exit 0
fi

cd $ROOT_DIR

gulp $COMMAND
