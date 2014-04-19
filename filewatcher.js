var chokidar 		= require('chokidar');
var cp       		= require('child_process'); 
var clc             = require('cli-color');
var parser          = require('nomnom');
var processing      = 0;
var reload_progress = 0;
var reload_queued   = 0;

var error  = clc.red.bold;
var warn   = clc.yellow;
var notice = clc.blueBright;
var info   = clc.greenBright;

var process_running = 0; 

var events = ['add', 'addDir', 'change', 'unlink', 'unlinkDir', 'error'];

var watcher = chokidar.watch('file or dir', {
	ignored: /[\/\\]\./,
	persistent: true
});

var __d = function(o){
  if (options.debug) console.log(o);
};

var __log = function(buffer){
  process.stdout.write(buffer.toString('utf8'));
}


var logEvent = function(message){
  return function(path, stat){
    console.log([notice(new Date().toISOString()), notice(['[', message, ']'].join('')), info(path)].join(' '));
  }
};

var run = function(path){

  if(process_running) {
    return;
  }

  process_running++;
  
  var comm = cp.spawn(options.command, options.args.split(' '), {
    cwd: options['work-dir'],
  }); 



  comm.stdout.on('data', __log);
  comm.stderr.on('data', __log);

  comm.on('close', function (err) {
    if(!err){
      console.log(info('-- processed --'));
    } else {
      console.log(error(['-- ERROR --', err].join(' ')));
    }
    process_running--;
  });
};

parser
  .script('filewatcher')
  .options({
    'watch-dir': {
      help: 'Directory to watch. Can be specified multiple times. Defaults to current directory.',
      list: true
    },
    'work-dir': {
      help: 'Directory command should be run in. Defaults to --watch-dir.'
    },
    command: {
      abbr: 'c',
      required: true,
      position: 0,
      help: 'command to run'
    },
    args: {
      abbr: 'a', 
      help: 'Arguments that will be passed to command.'
    },
    debug: {
      abbr: 'd',
      flag: true,
      help: 'Prints debugging info'
    }
  });

var options = parser.parse();

options['watch-dir'] = options['watch-dir'] || process.cwd();
options['work-dir']  = options['work-dir']  || options['watch-dir'];
options['args']      = options['args']      || '';

__d(options);

events.forEach(function(event){
  watcher.on(event, logEvent(event));
});

watcher.on('change', run);

console.log(info('filewatcher v 0.0.1'));

watcher.add(options['watch-dir']);



process.on('SIGINT', function(code) {
	watcher.close();
	console.log(error('-- terminated --'));
	process.exit();
});


