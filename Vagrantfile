Vagrant.configure('2') do |config|
  config.vm.box = 'generic/ubuntu2204'
  config.vm.hostname = 'product-catalogue-dev'

  config.vm.synced_folder '.', '/vagrant',
    type: 'rsync',
    rsync__exclude: ['.git/', 'node_modules/']
  config.vm.network 'forwarded_port', guest: 3010, host: 3010, host_ip: '127.0.0.1', auto_correct: true

  config.vm.provider 'virtualbox' do |vb|
    vb.memory = 2048
    vb.cpus = 2
  end

  config.vm.provider :libvirt do |lv|
    lv.memory = 2048
    lv.cpus = 2
  end

  config.vm.provision 'shell', path: 'scripts/provision-vagrant.sh'
end
