/* Copyright 2015 - MIT license - pancake@nowsecure.com */

var r2f = require ("./host");
var useReadline = true;

var Cfg = {
  'trace.from': 0,
  'trace.to': 0,
  'asm.arch': 'arm'
}

var argv = process.argv.slice (2);
if (argv.length < 1) {
  console.log ("Use: main.js [-n] [pid | processname]")
  process.exit(1);
}
if (argv[0] === '-n') {
  argv = argv.slice(1);
  if (argv.length < 1) {
    console.error ('Missing argument');
    process.exit(1);
  }
  useReadline = false;
}

function setupPrompt(script) {
  if (useReadline) {
    var readline = require('readline');
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    r2f.setConfig(script, Cfg);

    rl.setPrompt("[" + r2f.Offset(r2f.getCurrentOffset(), 8) + "]> ");
    rl.prompt();
    rl.on('line', function(line) {
      r2f.processLine (script, line);
      rl.setPrompt("[" + r2f.Offset(r2f.getCurrentOffset(), 8) + "]> ");
      rl.prompt();
      if (line == "q") {
        rl.close();
        process.exit (0);
      }
    });
  } else {
    process.stdin.setEncoding('utf8');
    process.stdin.on('ready', function() {
      process.stdout.write("> ");
    });
    process.stdin.on('readable', function() {
      r2f.processLine (script, process.stdin.read());
    });
    process.stdin.on('end', function() {
      console.log("^D");
      process.exit(0);
    });
  }
}

function onLoad(script) {
  setupPrompt(script);
}

r2f.attachAndRun (argv[0], onLoad);
