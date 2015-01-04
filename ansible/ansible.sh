#!/usr/bin/env bash

export PYTHONUNBUFFERED=1

ROOT_DIR=$1
TEMP_HOSTS="/tmp/ansible_hosts"

if [ ! -f $ROOT_DIR/ansible/vagrant.yml ]; then
  echo "Cannot find ansible playbook."
  exit 1
fi

if [ ! -f $ROOT_DIR/ansible/vagrant ]; then
  echo "Cannot find ansible hosts."
  exit 2
fi

# Install Ansible and its dependencies if it's not installed already
command -v ansible-playbook >/dev/null 2>&1 || {
    echo "Updating apt cache..."
    apt-get update
    echo "Installing ansible dependencies and git..."
    apt-get install -y ansible
    gem install librarian-ansible
}

cd $ROOT_DIR

librarian-ansible install

cp $ROOT_DIR/ansible/vagrant ${TEMP_HOSTS} && chmod -x ${TEMP_HOSTS}
echo "Running provisioner: ansible..."
ansible-playbook $ROOT_DIR/ansible/vagrant.yml --inventory-file=${TEMP_HOSTS} --extra-vars "@${ROOT_DIR}/.tmp/settings.json" --verbose -v --connection=local
rm ${TEMP_HOSTS}
