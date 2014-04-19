Automatic javascript packager for AOP
=====================================

0. Prerequisites. 

Need to have nodejs installed: http://www.nodejs.org

1. Configure: 

vi config.js 

config.project_dir = '~/Projects/aop-aux/'

2. Run npm instll (it will pick project.package and install dependencies)

3. Run filewatcher. 

node filewatcher.js --watch-dir ~/where/are/my/files/ --run 'my command' --work-dir ~/where/to/work


Filewatcher will package javascripts everytime there is a change. 