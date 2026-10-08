import test from 'node:test';
import assert from 'node:assert/strict';
import * as service from './dashboard-service.mjs';
test('login service configuration pins the checkout and Node and stays local',()=>{
 assert.equal(typeof service.servicePlist,'function');
 const text=service.servicePlist({root:'/tmp/room & demo',node:'/usr/local/bin/node',port:4646,label:'com.kayden.workbench-dashboard'});
 assert.match(text,/<key>KeepAlive<\/key><true\/>/);assert.match(text,/<key>RunAtLoad<\/key><true\/>/);
 assert.match(text,/room &amp; demo/);assert.match(text,/<string>serve<\/string>/);assert.match(text,/<string>4646<\/string>/);
 assert.throws(()=>service.servicePlist({root:'/tmp/x',node:'/node',port:0,label:'unsafe label'}));
});
