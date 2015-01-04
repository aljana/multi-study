# Multi-study

## Installation

1. Install [Virtualbox](https://www.virtualbox.org)
2. Install [Vagrant](https://www.vagrantup.com/)
3. Clone this repository
4. Run `vagrant up` and make sure there are no errors
5. Add hosts (provided in hosts section)
6. Setup PyCharm

### Hosts
```
10.1.1.3 www.multi-study.local <br />
10.1.1.3 dev.multi-study.local <br />
10.1.1.3 public.multi-study.local <br />
```

### PyCharm
1. Install EditorConfig plugin
2. Setup Vagrant
3. Setup remote Python interpreter (interpreter is located in `~/.virtualenv/multi-study/bin` folder inside VM)

## Development
You should have multiple shell instances open in order to setup full development environment.
Development URL: http://dev.multi-study.local/
In order to access each app coresponding development servers have to be up and running...

### Django
1. Go in `/vagrant/workspace` folder
2. Run `./manage.py runserver 0.0.0.0:8000`
3. Run `celery --app=_project worker -B -l DEBUG`

### Socket
1. Go in `/vagrant/workspace/socket` folder
2. Make sure node modules are installed (run `npm install` on host machine)
3. Run `gulp develop` on host machine / VM

### Frontend
1. Go in `/vagrant/workspace/www/` folder
2. Make sure node modules are installed (run `npm install` on host machine)
3. Make sure bower packages are installed (run `bower install` on host machine)
4. Run `gulp build` on host machine
5. Run `gulp runserver` on host machine
6. Run `gulp livereload` on VM

### Notes
If you are developing with Node.js on host machine make sure Node.js and following packages are installed globally:
- gulp
- bower
Example: `npm install -g gulp bower`
