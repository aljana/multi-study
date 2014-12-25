#!/usr/bin/env bash
export PYTHONUNBUFFERED=1

VIRTUALENV=$1
PYTHON=$2

if [ ! -d "$VIRTUALENV" ]
    then
        virtualenv -p $PYTHON $VIRTUALENV
fi
