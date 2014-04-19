Automatic javascript task runner
=====================================

0. Prerequisites. 

Need to have nodejs installed: http://www.nodejs.org

1. Configure: 

vi config.js 

config.project_dir = '~/Projects/aop-aux/'

2. Run npm instll (it will pick project.package and install dependencies)

3. Run filewatcher. 

node filewatcher.js <command> --watch-dir ~/where/are/my/files/  --work-dir ~/where/to/work
