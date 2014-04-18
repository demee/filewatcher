var chokidar = require('chokidar');
var cp       = require('child_process'); 

var projectDir = '/Users/slawomirdemichowicz/aop/aop-aux/';

var watcher = chokidar.watch('file or dir', {
	ignored: /^\./, 
	persistent: true
});

var reloading = 0;
var reload_progress = 0; 
var reload_queued = 0; 

var consoleLog = function(data){
	reload_progress += Math.ceil(100/20);
	if(reload_progress > 100) reload_progress = 100;
	process.stdout.write('\rPackaging JavaScripts: ' + reload_progress + '%');
};

var package_js = function(fileName){
		if(reloading){
			reload_queued++;
			console.log('File ' + fileName + ' is queued for processing.');

			return;
		}; 

		reloading++; 

		var mvn = cp.spawn('mvn', ['javascript:war-package'], {
			cwd: projectDir, 			
		}); 

		mvn.stdout.on('data', consoleLog);
		mvn.stderr.on('data', consoleLog);

		mvn.on('close', function (error) {
			if(!error){
				process.stdout.write('\rPackaging JavasSripts: ' + 100 + '%' + ' done!\n');
			} else {
				process.stderr.write("| ERROR " + error + "|");
			}

			reloading--;
			reload_progress = 0; 

			if(reload_queued){
				reload_queued = 0; 
				package_js();
			}
		});
	}

watcher
  	.on('add', function(path) {console.log(new Date(), 'File', path, 'is being monitored.');})
  	.on('change', function(path) {console.log(new Date(), 'File', path, 'has been changed');})
  	.on('unlink', function(path) {console.log(new Date(), 'File', path, 'has been removed');})
  	.on('error', function(error) {console.error(new Date(), 'Error happened', error);})

watcher.on('change', package_js);
watcher.on('add', package_js);
watcher.on('unlink', package_js);

watcher.add(projectDir + 'src/main/javascript');
watcher.close();
