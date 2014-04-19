Directory monitor and task runner
=================================

Fires given command on working dir if file changed in watched directory.

Prerequisites:

1. Need to have nodejs installed: http://www.nodejs.org

If you have a need/reason to use this script: 

1. Run npm install (it will pick project.package and install dependencies).

2. Run filewatcher: 

```bash
node filewatcher.js command --watch-dir ~/where/are/my/files/  --work-dir ~/where/to/work
```

If in doubt:

```bash
node filewatcher.js --help
```
