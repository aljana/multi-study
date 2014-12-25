#!/usr/bin/env bash
export PYTHONUNBUFFERED=1

NO_BIN_LINKS=$1
HOME_DIR=$2
ROOT_DIR=$3

source $HOME_DIR/.nvm/nvm.sh
nvm use default

if [ ! -f $ROOT_DIR/package.json ]
    then
        exit 0
fi

cd $ROOT_DIR

if [ "$NO_BIN_LINKS" -ne 1 ]
    then
        PYTHON=/usr/bin/python2 npm install
    else
        PYTHON=/usr/bin/python2 npm install --no-bin-links
fi
