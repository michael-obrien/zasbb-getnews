'use strict';

var bb = require('./bbparse');
var timeConvert = require('./time-convert');

var seneca = require('seneca')();

seneca.listen(10109); //requests from Hapi REST
seneca.client(10101); //requests to Directory Services

seneca.add({role:"get",cmd:"news"}, function( msg, respond) {

  //hardcoded 'news' posts - postids[0] is the default 'home' view.
  var postids = ['nwzt17', 'nwzt16', 'nwzt15', 'nwzt14', 'nwzt13', 'nwzt12', 'nwzt11', 'nwzt10']
  var requestSection = postids[0];
  if (isNaN(msg.section) === false) {
    if (msg.section >= 0 && msg.section <= 7) {
      requestSection = postids[msg.section];
    }
  }
  seneca.act({role:"find",cmd:"post",id:requestSection},function(err, result) {

    if (err) {
      //handleme
      respond( err );
    }
    result.post.when = timeConvert(result.post.when);
    result.post.content = bb.bbcodeToHtml(decodeURI(result.post.content));
    result.post.content = encodeURI(result.post.content);
    respond(null, result);
  });
});
