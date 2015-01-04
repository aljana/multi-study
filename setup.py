#!/usr/bin/env python

import os
import yaml
import json

ROOT_DIR = os.path.dirname(__file__)


def flatten_list(obj, n=None, key=None):
    if n is None:
        n = {}
    for k, v in enumerate(obj):
        k = str(k)
        if isinstance(v, dict):
            if not key:
                flatten_object(v, n, k)
            else:
                flatten_object(v, n, key + '.' + k)
        elif isinstance(v, list):
            if not key:
                flatten_list(v, n, k)
            else:
                flatten_list(v, n, key + '.' + k)
        elif key:
            n[key + '.' + k] = v
        else:
            n[k] = v
    return n


def flatten_object(obj, n=None, key=None):
    if n is None:
        n = {}
    for k, v in obj.items():
        if isinstance(v, list):
            if not key:
                flatten_list(v, n, k)
            else:
                flatten_list(v, n, key + '.' + k)
        elif isinstance(v, dict):
            if not key:
                flatten_object(v, n, k)
            else:
                flatten_object(v, n, key + '.' + k)
        elif key:
            n[key + '.' + k] = v
        else:
            n[k] = v
    return n


def flatten(obj, n=None, key=None):
    if n is None:
        n = {}
    return flatten_object(obj, n, key)


def upper(obj):
    n = {}
    for k, v in obj.items():
        if isinstance(v, dict):
            n[k.upper()] = upper(v)
        elif isinstance(v, list):
            n[k.upper()] = []
            for i in range(len(v)):
                if isinstance(v[i], dict):
                    n[k.upper()].append(upper(v[i]))
                else:
                    n[k.upper()].append(v[i])
        else:
            n[k.upper()] = v
    return n


def merge(a, b):
    if not b:
        return a
    for k in a.keys():
        if b.get(k) and isinstance(b[k], dict):
            a[k] = merge(a[k], b[k])
        elif b.get(k):
            a[k] = b[k]
    for k in b.keys():
        if not a.get(k):
            a[k] = b[k]
    return a


def parse(name, obj):
    try:
        # noinspection PyUnresolvedReferences
        path = os.path.join(ROOT_DIR, 'settings', name + '.yml')
        fp = open(path, 'r')
        merge(obj, yaml.load(fp))
        fp.close()
    except IOError:
        pass

    return obj


def write(path, obj):
    if not os.path.exists(os.path.dirname(path)):
        os.makedirs(os.path.dirname(path))

    with open(path, 'w') as f:
        f.write(json.dumps(obj, sort_keys=True, indent=2))


if __name__ == '__main__':
    settings = parse('testing', {})
    write('workspace/_settings/testing.json', settings)
    write('workspace/_settings/testing.upper.json', upper(settings))
    write('workspace/_settings/testing.flat.json', flatten(settings))

    settings = parse('base', {})
    settings = parse('base.local', settings)
    settings = parse('production', settings)
    settings = parse('production.local', settings)

    write('workspace/_settings/production.json', settings)
    write('workspace/_settings/production.upper.json', upper(settings))
    write('workspace/_settings/production.flat.json', flatten(settings))

    settings = parse('staging', settings)
    settings = parse('staging.local', settings)

    write('workspace/_settings/staging.json', settings)
    write('workspace/_settings/staging.upper.json', upper(settings))
    write('workspace/_settings/staging.flat.json', flatten(settings))

    settings = parse('settings/development.yml', settings)
    settings = parse('settings/development.local.yml', settings)

    write('workspace/_settings/development.json', settings)
    write('workspace/_settings/development.upper.json', upper(settings))
    write('workspace/_settings/development.flat.json', flatten(settings))
