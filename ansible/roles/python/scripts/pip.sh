#!/usr/bin/env bash
export PYTHONUNBUFFERED=1

VIRTUALENV=$1
REQUIREMENTS=$2

source $VIRTUALENV

pip install -r $REQUIREMENTS
