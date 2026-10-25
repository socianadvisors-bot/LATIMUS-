import {ProspectBroker,indexedBrokerStorage,trustedProspectSender} from './prospectBroker';
const api=(globalThis as any).chrome;
const broker=new ProspectBroker({storage:indexedBrokerStorage,fetcher:fetch,extensionId:api.runtime.id,hasOrigin:async origin=>api.permissions.contains({origins:[origin]})});
api.action.onClicked.addListener(()=>api.tabs.create({url:api.runtime.getURL('index.html')}));
api.runtime.onMessage.addListener((request:unknown,sender:any,respond:(value:unknown)=>void)=>{void broker.handle(request,sender).then(respond).catch(()=>respond({ok:false,error:'Private adapter request failed.'}));return true;});
const ports=new Map<any,string>();api.runtime.onConnect.addListener((port:any)=>{if(port.name!=='latimus-unlocked-workspace'||!trustedProspectSender(port.sender,api.runtime.id)){port.disconnect();return;}port.onMessage.addListener((m:any)=>{if(m?.type==='ping'&&typeof m.workspaceId==='string'){ports.set(port,m.workspaceId);broker.ping(m.workspaceId);}});port.onDisconnect.addListener(()=>{const workspaceId=ports.get(port);ports.delete(port);if(workspaceId&&![...ports.values()].includes(workspaceId))broker.lock(workspaceId);});});
