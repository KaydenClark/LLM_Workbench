#!/usr/bin/env node
// macOS local login service for the existing producer-room board.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const xml = value => String(value).replace(/[<>&"']/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[char]));
export function servicePlist({root,node=process.execPath,port=4646,label='com.kayden.workbench-dashboard'}) {
 if(!path.isAbsolute(root)||!path.isAbsolute(node)||!Number.isInteger(port)||port<1||port>65535||!/^com\.[a-zA-Z0-9.-]+$/.test(label))throw new Error('Absolute room/Node paths, a valid port and service label required');
 const args=[node,path.join(root,'tools/grill-board.mjs'),'serve','--path',root,'--port',String(port)];
 return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict>\n<key>Label</key><string>${xml(label)}</string>\n<key>ProgramArguments</key><array>${args.map(arg=>`<string>${xml(arg)}</string>`).join('')}</array>\n<key>WorkingDirectory</key><string>${xml(root)}</string>\n<key>RunAtLoad</key><true/>\n<key>KeepAlive</key><true/>\n<key>ThrottleInterval</key><integer>10</integer>\n<key>StandardOutPath</key><string>${xml(path.join(root,'workbench/grill-board/service.log'))}</string>\n<key>StandardErrorPath</key><string>${xml(path.join(root,'workbench/grill-board/service-error.log'))}</string>\n</dict></plist>\n`;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [command,...args]=process.argv.slice(2),flags={};for(let i=0;i<args.length;i+=2)flags[args[i].replace(/^--/,'')]=args[i+1];
  const root=path.resolve(flags.path||process.cwd()),label=flags.label||'com.kayden.workbench-dashboard',port=Number(flags.port||4646);
  const text=servicePlist({root,port,label});
  if(command==='print'){process.stdout.write(text);}else if(command==='install'){
   if(process.platform!=='darwin')throw new Error('Login service installation requires macOS; use grill-board.mjs serve on other hosts');
   if(!fs.existsSync(path.join(root,'tools/grill-board.mjs')))throw new Error('The selected checkout has no Dashboard server');
   const destination=path.join(os.homedir(),'Library/LaunchAgents',`${label}.plist`);
   if(fs.existsSync(destination))throw new Error(`Existing service configuration preserved: ${destination}. Inspect it before replacing it.`);
   fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,text,{flag:'wx'});
   const result=spawnSync('launchctl',['bootstrap',`gui/${process.getuid()}`,destination],{encoding:'utf8'});
   if(result.status!==0)throw new Error(`Service configuration saved at ${destination}; bootstrap failed: ${result.stderr.trim()}`);
   console.log(`Dashboard login service installed: ${destination}\nOpen http://127.0.0.1:${port}/\nInspect: launchctl print gui/${process.getuid()}/${label}\nStop: launchctl bootout gui/${process.getuid()}/${label}`);
  }else throw new Error('Usage: dashboard-service.mjs print|install --path ROOT --port 4646 [--label com.kayden.workbench-dashboard]');
 }catch(error){console.error(error.message);process.exitCode=1;}
}
