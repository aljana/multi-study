# -*- mode: ruby -*-
# vi: set ft=ruby :

require 'yaml'
require 'rbconfig'

def merge_settings(a, b)
  a.each do |k, v|
    if b[k].kind_of?(Hash)
      a[k] = merge_settings(a[k], b[k])
    elsif b[k]
      a[k] = b[k]
    end
  end
  b.each do |k, v|
    if not a[k]
      a[k] = b[k]
    end
  end
  return a
end

def parse_settings(name, settings=nil)
  begin
    data = YAML.load_file("#{name}")
    if not settings
      return data
    end
    settings = merge_settings(settings, data)
  rescue
    return settings
  end
  return settings
end

# Parse settings
settings = parse_settings('settings/base.yml')
settings = parse_settings('settings/base.local.yml', settings)
settings = parse_settings('settings/production.yml', settings)
settings = parse_settings('settings/production.local.yml', settings)
settings = parse_settings('settings/staging.yml', settings)
settings = parse_settings('settings/staging.local.yml', settings)

# Detect Windows platform
if (RbConfig::CONFIG['host_os'] =~ /mswin|mingw|cygwin/)
  settings['system_host'] = 'windows'
else
  settings['system_host'] = 'linux/unix'
end

# Write merged settings
File.open('.settings.yml', 'w') { |f| f.write settings.to_yaml }

# Set up constants
VAGRANTFILE_API_VERSION = '2'

# Configure vagrant
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"
  config.ssh.forward_agent = true

  config.vm.box = settings['vagrant_box']
  config.vm.hostname = settings['vagrant_host']
  config.vm.network 'private_network', ip: settings['vagrant_ip']

  config.vm.synced_folder '.', '/vagrant', disabled: true
  config.vm.synced_folder '.', settings['root_dir']

  config.vm.provider :virtualbox do |vb|
    vb.memory = settings['vagrant_memory']
    vb.cpus = settings['vagrant_cpus']
    if settings['system_host'] == 'windows'
      vb.customize ['setextradata', :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/#{settings['root_dir']}", '1']
    end
    vb.customize ['modifyvm', :id, '--natdnshostresolver1', 'on', '--name', settings['vagrant_hostname']]
  end

  config.vm.provision 'shell' do |sh|
    sh.path = 'ansible/ansible.sh'
    sh.args = settings['root_dir']
  end
end
