import {parseDocument} from 'htmlparser2';
import {PROSPECT_FIELDS,type ColumnMapping,type CompanyResearch,type CsvParseOptions,type EmailMatch,type MappingProposal,type NormalizedProspect,type ObservedEmail,type ParsedCompanyPage,type ParsedProspectCsv,type ProspectBatch,type ProspectExportOptions,type ProspectField,type ProspectResult,type ProspectRow} from './prospectTypes';

export const MAPPING_VERSION='prospect-mapping-1.0.0';
const clean=(value:string)=>value.normalize('NFKC').replace(/\s+/g,' ').trim();
const key=(value:string)=>clean(value).toLowerCase().replace(/[_\-]+/g,' ').replace(/[^\p{L}\p{N}\s]/gu,'').replace(/\s+/g,' ').trim();
const ALIASES:Record<ProspectField,string[]>={company:['company','company name','business','business name','organization','organisation','account name','employer','firm'],address:['address','street','street address','business address','company address','address line 1','address1'],person:['person','owner','owner name','contact','contact name','decision maker','decision maker name','full name','executive','principal','contact full name'],title:['title','role','job title','position','contact title'],phone:['phone','phone number','telephone','business phone','company phone','mobile','tel'],website:['website','web site','domain','company url','business url','url','company website'],linkedin:['linkedin','linkedin url','profile','profile url','linkedin profile','public profile'],email:['email','email address','work email','business email','contact email'],city:['city','town','business city'],state:['state','province','region','business state'],postalCode:['zip','zip code','zipcode','postal code','postcode','postal'],notes:['notes','note','comments','comment','description']};
export function proposeMapping(headers:string[]):MappingProposal{
 const mapping=Object.fromEntries(PROSPECT_FIELDS.map(field=>[field,null])) as ColumnMapping;const explanations:MappingProposal['explanations']=[];const used=new Set<number>();
 for(const field of PROSPECT_FIELDS){const candidates=headers.map((h,i)=>({index:i,value:key(h)})).filter(c=>ALIASES[field].some(alias=>alias===c.value||alias.replace(/ /g,'')===c.value.replace(/ /g,''))&&!used.has(c.index));const selected=candidates[0];mapping[field]=selected?.index??null;if(selected)used.add(selected.index);explanations.push({field,column:mapping[field],confidence:selected?candidates.length>1?80:98:0,reason:selected?`Header “${headers[selected.index]}” matches ${field}${candidates.length>1?'; multiple matches; review the selected column':''}.`:'No recognized header. Select a column or leave unmapped.'});}
 return {mapping,explanations};
}
export function parseProspectCsv(text:string,options:CsvParseOptions={}):ParsedProspectCsv{
 if(options.signal?.aborted)throw new DOMException('CSV import cancelled','AbortError');
 if(new TextEncoder().encode(text).byteLength>(options.maxBytes??32*1024*1024))throw new Error('CSV exceeds the configured import size capacity.');
 const maxRows=Math.min(options.maxRows??10000,100000);if(!Number.isInteger(maxRows)||maxRows<1)throw new Error('CSV row limit must be a positive integer.');
 const source=text.replace(/^\uFEFF/,'');if(!source.trim())throw new Error('CSV is empty.');
 let quoted=false;const counts:Record<string,number>={',':0,';':0,'\t':0};for(let i=0;i<source.length;i++){const c=source[i];if(c==='"'){if(quoted&&source[i+1]==='"')i++;else quoted=!quoted;}else if(!quoted){if(c==='\r'||c==='\n')break;if(c in counts)counts[c]++;}}
 const delimiter=options.delimiter??Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];
 const records:string[][]=[];const warnings:string[]=[];let row:string[]=[],field='',inQuotes=false,closedQuote=false,recordTouched=false;const warn=(message:string)=>{if(warnings.length<100)warnings.push(message);};
 const finishField=()=>{row.push(field);field='';closedQuote=false;};
 const finishRecord=()=>{finishField();if(recordTouched||row.some(v=>v!=='')){records.push(row);if(records.length>maxRows+1)throw new Error(`CSV exceeds ${maxRows.toLocaleString()} data rows. Split the import into smaller batches.`);}row=[];recordTouched=false;};
 for(let i=0;i<source.length;i++){
  if((i&4095)===0&&options.signal?.aborted)throw new DOMException('CSV import cancelled','AbortError');const c=source[i];
  if(inQuotes){if(c==='"'){if(source[i+1]==='"'){field+='"';i++;}else {inQuotes=false;closedQuote=true;}}else field+=c;recordTouched=true;continue;}
  if(c==='"'&&field===''&&!closedQuote){inQuotes=true;recordTouched=true;continue;}
  if(c===delimiter){finishField();recordTouched=true;continue;}
  if(c==='\r'||c==='\n'){finishRecord();if(c==='\r'&&source[i+1]==='\n')i++;continue;}
  if(c==='"'||closedQuote&&c.trim())warn(`Record ${records.length+1}: malformed quoting retained as literal data; review this row.`);
  field+=c;recordTouched=true;
 }
 if(inQuotes)warn(`Record ${records.length+1}: unterminated quoted field retained; review this row.`);
 if(field!==''||row.length||recordTouched)finishRecord();
 if(!records.length)throw new Error('CSV has no header row.');
 const headers=[...records[0]];const rows=records.slice(1);let width=headers.length;for(const r of rows)width=Math.max(width,r.length);
 if(width>500)throw new Error('CSV exceeds the 500-column safety limit.');
 for(let i=headers.length;i<width;i++){let name=`__extra_column_${i+1}`;while(headers.includes(name))name+='_' ;headers.push(name);}if(width>records[0].length)warn('Rows with extra fields were retained under generated additional column names.');
 const duplicates=headers.filter((h,i)=>headers.indexOf(h)!==i);if(duplicates.length)warn('Duplicate header names are preserved by column position; review mapping carefully.');
 rows.forEach((r,i)=>{if(r.length!==records[0].length)warn(`Data row ${i+1}: ${r.length} cells versus ${records[0].length} original headers; all cells retained.`);});
 return {headers,rows,warnings};
}
export function normalizeCompany(value:string):string{return key(value.replace(/\bL\.?\s*L\.?\s*C\.?\b/gi,'LLC')).replace(/\s+(?:llc|incorporated|inc|corporation|corp|company|co|limited|ltd)$/,'').trim();}
const NICKNAMES:Record<string,string>={bob:'robert',rob:'robert',bobby:'robert',bill:'william',will:'william',liz:'elizabeth',beth:'elizabeth',jim:'james',jimmy:'james',mike:'michael',matt:'matthew',tom:'thomas',dave:'david',kate:'katherine',katie:'katherine',chris:'christopher',dan:'daniel',steve:'steven',joe:'joseph',tony:'anthony'};
export function normalizePerson(value:string):string {const parts=key(value).split(' ').filter(Boolean).filter(v=>!['mr','mrs','ms','dr','jr','sr','ii','iii','iv'].includes(v));if(parts[0])parts[0]=NICKNAMES[parts[0]]||parts[0];return parts.filter((v,i)=>i===0||i===parts.length-1||v.length>1).join(' ');}
export function normalizeEmail(value:string):string{let v=clean(value).replace(/^mailto:/i,'').split('?')[0].toLowerCase();try{v=decodeURIComponent(v);}catch{return '';};return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,63}$/.test(v)&&v.length<=254&&!v.includes('..')&&!v.startsWith('.')&&!v.includes('.@')?v:'';}
export function normalizePhone(value:string):string{const digits=value.split(/\b(?:ext\.?|extension|x)\s*\d+/i)[0].replace(/\D/g,'');return digits.length>=7&&digits.length<=15?digits:'';}
export function normalizeURL(value:string):string{
 if(!value.trim())return '';try{const u=new URL(/^[a-z][a-z0-9+.-]*:/i.test(value.trim())?value.trim():`https://${value.trim()}`);if(!['https:','http:'].includes(u.protocol)||u.username||u.password||u.port||!u.hostname.includes('.')||/^\d+\.\d+\.\d+\.\d+$/.test(u.hostname)||u.hostname.startsWith('[')||u.hostname.endsWith('.local'))return '';u.protocol='https:';u.hash='';u.hostname=u.hostname.toLowerCase().replace(/^www\./,'');return u.href.replace(/\/$/,'');}catch{return '';}
}
export function normalizeDomain(value:string):string{const url=normalizeURL(value);return url?new URL(url).hostname:'';}
export function normalizeTitle(value:string):string {return key(value).replace(/\bchief executive officer\b/g,'ceo').replace(/\bchief financial officer\b/g,'cfo').replace(/\bchief operating officer\b/g,'coo').replace(/\bchief technology officer\b/g,'cto').replace(/\bvice president\b/g,'vp');}
export function normalizeProspectRow(row:readonly string[],headers:readonly string[],mapping:ColumnMapping):NormalizedProspect{
 const values=Object.fromEntries(PROSPECT_FIELDS.map(field=>{const i=mapping[field];if(i!==null&&(!Number.isInteger(i)||i<0||i>=headers.length))throw new Error(`Invalid mapping for ${field}.`);return [field,i===null?'':clean(String(row[i]??''))];})) as Record<ProspectField,string>;const errors:string[]=[];
 const website=normalizeURL(values.website),email=normalizeEmail(values.email),linkedin=normalizeURL(values.linkedin);if(values.website&&!website)errors.push('Input website is invalid or unsupported.');if(values.email&&!email)errors.push('Input email is invalid.');if(values.linkedin&&!linkedin)errors.push('Input public-profile URL is invalid.');
 return {...values,website,email,linkedin,normalizedCompany:normalizeCompany(values.company),normalizedPerson:normalizePerson(values.person),domain:normalizeDomain(website),normalizedPhone:normalizePhone(values.phone),errors};
}
export function companyGroupingKey(value:NormalizedProspect):string {if(value.domain)return `domain:${value.domain}`;if(!value.normalizedCompany)return '';return `identity:${JSON.stringify([value.normalizedCompany,key(value.address),key(value.city),key(value.state),value.postalCode,value.normalizedPhone])}`;}
export function groupProspects(rows:ProspectRow[]):Map<string,ProspectRow[]>{const groups=new Map<string,ProspectRow[]>();for(const row of rows){const k=companyGroupingKey(row.normalized)||`row:${row.id}`;const items=groups.get(k)||[];items.push(row);groups.set(k,items);}return groups;}
const GENERIC=new Set('info contact hello sales support office admin billing marketing press media careers jobs recruiting hr legal privacy enquiries inquiries service customerservice accounts webmaster noreply no-reply ceo cfo coo cto president owner founder reception general team'.split(' '));
export function isGenericEmail(email:string):boolean{const local=normalizeEmail(email).split('@')[0];return !!local&&(GENERIC.has(local.split('+')[0])||/^(?:info|contact|sales|support|office|admin)[._-]?\d*$/.test(local));}
const sameDomain=(a:string,b:string)=>a===b||!!b&&a.endsWith('.'+b);
function emailAffinity(email:string,person:string):number{
 const tokens=normalizePerson(person).split(' ').filter(Boolean);if(tokens.length<2)return 0;const first=tokens[0],last=tokens.at(-1)!;const local=email.split('@')[0].split('+')[0].replace(/[^a-z0-9]/g,'');
 const originals=key(person).split(' ').filter(Boolean);const firsts=[...new Set([first,originals[0],...Object.entries(NICKNAMES).filter(([,v])=>v===first).map(([k])=>k)])].filter(Boolean);
 if(firsts.some(f=>[f+last,f[0]+last,last+f,last+f[0]].includes(local)))return 25;
 if(firsts.includes(local))return 12;if(local.includes(last)&&firsts.some(f=>local.startsWith(f[0])))return 15;return 0;
}
function fullNameNearEmail(context:string,person:string):boolean{
 const tokens=normalizePerson(person).split(' ').filter(Boolean);if(tokens.length<2)return false;
 const withoutEmails=context.replace(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,63}/gi,' ');const normalized=normalizePerson(withoutEmails);const parts=normalized.split(' ');const first=tokens[0],last=tokens.at(-1)!;
 return parts.some((token,i)=>(NICKNAMES[token]||token)===first&&parts.slice(i+1,i+5).includes(last));
}
export function scoreObservedEmail(prospect:NormalizedProspect,research:CompanyResearch,observed:ObservedEmail):EmailMatch{
 const email=normalizeEmail(observed.email);const reasons:string[]=[];let score=0;
 if(!email)return {email:'',score:0,quality:'weak',reasons:['Invalid email observation.'],source:observed};
 if(isGenericEmail(email))return {email,score:0,quality:'generic',reasons:['Generic company/function mailbox; never an individual work email.'],source:observed};
 if(observed.sourceType==='inferred')return {email,score:0,quality:'inferred',reasons:['Inferred address is not independently observed and cannot be primary.'],source:observed};
 if(observed.sourceType==='user_provided')return {email,score:0,quality:'weak',reasons:['Imported/user-provided email is preserved but not publicly verified.'],source:observed};
 const domain=normalizeDomain(research.domain||research.website),emailDomain=email.split('@')[1],sourceDomain=normalizeDomain(observed.sourceUrl);const official=observed.official&&sameDomain(sourceDomain,domain);const domainMatches=!!domain&&sameDomain(emailDomain,domain);
 if(domainMatches){score+=25;reasons.push('Observed address matches company domain.');}else reasons.push('Email domain does not match the resolved company.');
 if(official){score+=10;reasons.push('Observed on the same official company domain.');}
 if(research.companyConfidence>=80){score+=10;reasons.push('Company association has strong supporting evidence.');}
 const affinity=emailAffinity(email,prospect.person);score+=affinity;if(affinity)reasons.push('Email local part has person-name affinity.');
 const named=fullNameNearEmail(observed.context,prospect.person)||!!observed.personName&&normalizePerson(observed.personName)===prospect.normalizedPerson;
 if(named){score+=25;reasons.push('Person name appears in the local source context.');}
 if(prospect.title&&normalizeTitle(observed.personTitle||observed.context).includes(normalizeTitle(prospect.title))){score+=5;reasons.push('Role/title context agrees.');}
 if(['mailto','structured_data'].includes(observed.sourceType)){score+=5;reasons.push('Address is explicitly linked or structured.');}
 const strong=named&&affinity>=15&&official&&domainMatches&&research.companyConfidence>=80&&(observed.sourceType!=='structured_data'||!!observed.personName);
 score=Math.min(score,strong?100:79);if(!domainMatches)score=Math.min(score,45);
 return {email,score,quality:strong&&score>=80?'verified':score>=55?'candidate':'weak',reasons,source:observed};
}

interface InertNode {type:string;name?:string;data?:string;attribs?:Record<string,string>;children?:InertNode[];parent?:InertNode|null}
const IGNORED=new Set(['style','script','noscript','template','iframe','svg','canvas']);
function hidden(node:InertNode):boolean{return !!node.name&&(IGNORED.has(node.name)||node.attribs?.hidden!==undefined||node.attribs?.['aria-hidden']==='true'||/display\s*:\s*none|visibility\s*:\s*hidden/i.test(node.attribs?.style||''));}
function textOf(node:InertNode,max=300000):string {const parts:string[]=[];const stack=[node];let size=0;while(stack.length&&size<max){const n=stack.pop()!;if(hidden(n))continue;if(n.type==='text'){const value=n.data||'';parts.push(value);size+=value.length;}else if(n.children)for(let i=n.children.length-1;i>=0;i--)stack.push(n.children[i]);}return clean(parts.join(' ')).slice(0,max);}
const EMAIL_PATTERN=/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,63}/gi;
function emailsIn(value:string):string[]{return [...new Set((value.match(EMAIL_PATTERN)||[]).map(v=>normalizeEmail(v.replace(/[.,;:]+$/,''))).filter(Boolean))];}
function contextEmails(node:InertNode):string[]{const found=emailsIn(textOf(node,1500));const stack=[node];let seen=0;while(stack.length&&seen++<1000){const n=stack.pop()!;if(hidden(n))continue;const href=n.attribs?.href||'';if(/^mailto:/i.test(href)){let decoded=href.slice(7).split('?')[0];try{decoded=decodeURIComponent(decoded);}catch{}found.push(...emailsIn(decoded));}if(n.children)stack.push(...n.children);}return [...new Set(found)];}
function localContext(node:InertNode,email:string):string{
 let best=textOf(node,700);let parent=node.parent;for(let depth=0;parent&&depth<5;depth++,parent=parent.parent){if(['body','html'].includes(parent.name||''))break;const text=textOf(parent,1200);if(text.length>700)break;const addresses=contextEmails(parent);if(addresses.some(e=>e!==email))break;best=text;if(['article','li','section','tr'].includes(parent.name||''))break;}return best.slice(0,700);
}
function safeLink(value:string,base:string):string {try{const u=new URL(value,base);if(u.protocol!=='https:'||u.username||u.password||!normalizeURL(u.href))return '';u.hash='';return u.href;}catch{return '';}}
export function parsePublicCompanyPage(html:string,inputUrl:string,checkedAt=new Date().toISOString()):ParsedCompanyPage{
 if(new TextEncoder().encode(html).byteLength>2*1024*1024)throw new Error('Company page exceeds the 2 MB parsing capacity.');
 const normalizedUrl=normalizeURL(inputUrl);if(!normalizedUrl)throw new Error('Company page needs a valid public HTTPS URL.');let url:string;try{const actual=new URL(inputUrl);if(actual.protocol!=='https:')throw new Error();actual.hash='';url=actual.href;}catch{throw new Error('Company page provenance requires the actual absolute HTTPS retrieval URL.');}const domain=normalizeDomain(url);if(domain==='linkedin.com'||domain.endsWith('.linkedin.com'))throw new Error('LinkedIn pages are references only and must not be crawled.');
 const document=parseDocument(html,{decodeEntities:true}) as unknown as InertNode;const nodes:InertNode[]=[];const stack=[document];while(stack.length){const n=stack.pop()!;nodes.push(n);if(nodes.length>100000)throw new Error('Company page has too many document nodes.');if(!hidden(n)||n.name==='script'&&n.attribs?.type==='application/ld+json')for(const child of (n.children||[]).slice().reverse())stack.push(child);}
 const titleNode=nodes.find(n=>n.name==='title');const title=titleNode?textOf(titleNode,500):'';const text=textOf(document);const emails:ObservedEmail[]=[];const phones:ParsedCompanyPage['phones']=[];const profiles=new Set<string>(),links=new Set<string>(),companyNames=new Set<string>();
 const seenEmails=new Set<string>();
 const addEmail=(email:string,node:InertNode,sourceType:ObservedEmail['sourceType'],extra:Partial<ObservedEmail>={})=>{const normalized=normalizeEmail(email);if(!normalized)return;const context=extra.context||localContext(node,normalized);const k=normalized+'|'+context+'|'+sourceType;if(seenEmails.has(k))return;seenEmails.add(k);if(emails.length<200)emails.push({email:normalized,sourceUrl:url,sourceType,context,pageTitle:title,observedAt:checkedAt,official:true,...extra});};
 for(const node of nodes){
  if(hidden(node)&&node.name!=='script')continue;
  if(node.name==='meta'&&node.attribs?.property==='og:site_name'&&node.attribs.content)companyNames.add(clean(node.attribs.content));
  if(node.name==='a'){
   const href=node.attribs?.href||'';if(/^mailto:/i.test(href)){for(const email of href.slice(7).split('?')[0].split(/[;,]/)){let decoded='';try{decoded=decodeURIComponent(email);}catch{}addEmail(decoded,node,'mailto');}}
   else if(/^tel:/i.test(href)){const raw=href.slice(4).split('?')[0];const phone=normalizePhone(raw);if(phone&&!/\b(?:home|personal|private|cell|mobile)\b/i.test(textOf(node.parent||node,500))&&phones.length<100)phones.push({phone:raw,sourceUrl:url,context:textOf(node.parent||node,500),kind:'company',observedAt:checkedAt});}
   else {const link=safeLink(href,url);if(link){const hostname=normalizeDomain(link);if(hostname==='linkedin.com'||hostname.endsWith('.linkedin.com'))profiles.add(link);else if(sameDomain(hostname,domain)&&!/[.](?:jpe?g|png|gif|svg|webp|ico|css|js|woff2?|ttf|zip|mp[34]|avi|mov|pdf)(?:[?]|$)/i.test(link)&&/(?:team|people|leadership|management|owner|founder|executive|staff|bio|profile|contact|about|company)/i.test(link+' '+textOf(node,200)))links.add(link);}}
  }
  if(node.type==='text'&&!hidden(node.parent||node)){
   const raw=node.data||'';for(const email of emailsIn(raw))addEmail(email,node,'visible_text');
   const decoded=raw.replace(/\s*(?:\[at\]|\(at\))\s*/gi,'@').replace(/\s*(?:\[dot\]|\(dot\))\s*/gi,'.');if(decoded!==raw)for(const email of emailsIn(decoded))addEmail(email,node,'obfuscated',{context:localContext(node,email).replace(/\s*(?:\[at\]|\(at\))\s*/gi,'@').replace(/\s*(?:\[dot\]|\(dot\))\s*/gi,'.')});
   // Only explicitly labelled business lines; never infer a private/home number from arbitrary digits.
   const phoneMatch=raw.match(/\b(?:main|office|business|company|telephone|phone|tel)\s*[:.]?\s*(\+?\d[\d\s().-]{7,25}\d)/i);if(phoneMatch&&!/\b(?:home|personal|private|cell|mobile)\b/i.test(raw)&&normalizePhone(phoneMatch[1])&&phones.length<100)phones.push({phone:clean(phoneMatch[1]),sourceUrl:url,context:clean(raw).slice(0,500),kind:'company',observedAt:checkedAt});
  }
  if(node.name==='script'&&node.attribs?.type?.toLowerCase()==='application/ld+json'){
   const raw=(node.children||[]).map(n=>n.data||'').join('');if(raw.length>250000)continue;let parsed:unknown;try{parsed=JSON.parse(raw);}catch{continue;}
   const objects:unknown[]=[parsed];let count=0;while(objects.length&&count++<1000){const item=objects.shift();if(Array.isArray(item)){objects.push(...item.slice(0,100));continue;}if(!item||typeof item!=='object')continue;const obj=item as Record<string,unknown>;const types=Array.isArray(obj['@type'])?obj['@type']:[obj['@type']];const person=types.includes('Person'),organization=types.some(t=>typeof t==='string'&&/Organization|Business|Corporation/.test(t));const name=typeof obj.name==='string'?clean(obj.name):'';
    if(organization&&name)companyNames.add(name);
    if(person||organization){if(typeof obj.email==='string')addEmail(obj.email,node,'structured_data',{personName:person?name:undefined,personTitle:person&&typeof obj.jobTitle==='string'?clean(obj.jobTitle):undefined,companyName:organization?name:undefined,context:JSON.stringify({name,jobTitle:obj.jobTitle,worksFor:obj.worksFor,email:obj.email}).slice(0,700)});if(organization&&typeof obj.telephone==='string'&&normalizePhone(obj.telephone))phones.push({phone:obj.telephone,sourceUrl:url,context:name,kind:'company',observedAt:checkedAt});const sameAs=Array.isArray(obj.sameAs)?obj.sameAs:[obj.sameAs];for(const value of sameAs)if(typeof value==='string'){const link=safeLink(value,url);if(link&&(normalizeDomain(link)==='linkedin.com'||normalizeDomain(link).endsWith('.linkedin.com')))profiles.add(link);}}
    for(const [k,value] of Object.entries(obj))if(k!=='@context'&&value&&typeof value==='object')objects.push(value);
   }
  }
 }
 const distinctPhones=[...new Map(phones.map(p=>[normalizePhone(p.phone),p])).values()];
 return {url,title,text,emails,phones:distinctPhones.slice(0,100),profiles:[...profiles].slice(0,50),links:[...links].slice(0,50),companyNames:[...companyNames].slice(0,20),evidence:{url,title,excerpt:text.slice(0,1200),checkedAt}};
}
export function scoreCompanyAssociation(prospect:NormalizedProspect,page:ParsedCompanyPage):{confidence:number;matched:boolean;reasons:string[]}{
 const reasons:string[]=[];let confidence=0;const domain=normalizeDomain(page.url);const expected=prospect.domain;
 if(expected&&domain===expected){confidence+=45;reasons.push('Supplied website matches fetched company domain.');}
 const company=prospect.normalizedCompany;const corpus=normalizeCompany(page.title+' '+page.companyNames.join(' ')+' '+page.text.slice(0,10000));
 if(company.length>=3&&(' '+corpus+' ').includes(' '+company+' ')){confidence+=35;reasons.push('Company name is present on the public company page.');}
 if(prospect.normalizedPhone&&page.phones.some(p=>normalizePhone(p.phone)===prospect.normalizedPhone)){confidence+=20;reasons.push('Supplied business phone matches a published company line.');}
 if(prospect.address&&key(page.text).includes(key(prospect.address))){confidence+=20;reasons.push('Supplied business address appears on the company page.');}
 confidence=Math.min(100,confidence);return {confidence,matched:confidence>=80,reasons};
}
export function selectResult(row:ProspectRow|NormalizedProspect,research?:CompanyResearch|null):ProspectResult{
 const n='normalized'in row?row.normalized:row;const result:ProspectResult={status:'not_found',domain:research?.domain||n.domain,website:research?.website||n.website,companyConfidence:research?.companyConfidence||0,companyResolution:research?.resolutionMethod||'unresolved',person:n.person,title:n.title,workEmail:'',emailConfidence:0,emailQuality:'unavailable',companyEmail:'',businessPhone:n.phone,linkedin:n.linkedin,emailSource:'',phoneSource:n.phone?'csv_input':'',sources:[],pagesChecked:research?.pages.length||0,companyEmailsFound:[],evidence:research?.pages||[],lastChecked:research?.checkedAt||new Date().toISOString(),emailMatches:[],errors:[...n.errors,...(research?.errors||[])]};
 if(!n.company&&!n.domain){result.status='insufficient_input';return result;}if(!research?.domain){result.status='company_not_resolved';return result;}
 result.sources=[...new Set(research.pages.map(p=>p.url))];result.companyEmailsFound=[...new Set(research.emails.map(e=>normalizeEmail(e.email)).filter(Boolean))];
 result.emailMatches=research.emails.map(e=>scoreObservedEmail(n,research,e)).sort((a,b)=>b.score-a.score);
 result.companyEmail=result.emailMatches.find(m=>m.quality==='generic'&&sameDomain(m.email.split('@')[1],research.domain))?.email||'';
 const phone=research.phones.find(p=>p.kind==='company');if(!result.businessPhone&&phone){result.businessPhone=phone.phone;result.phoneSource=phone.sourceUrl;}
 if(!result.linkedin)result.linkedin=research.profiles[0]||'';
 if(research.companyConfidence<80||n.domain&&normalizeDomain(research.domain)!==n.domain){result.status='review_required';return result;}
 const matches=result.emailMatches.filter(m=>m.quality==='verified'||m.quality==='candidate');const top=matches[0];
 if(top){const conflicting=matches.find(m=>m.email!==top.email&&m.score>=top.score-5);if(conflicting){result.status='review_required';result.errors.push('Several similarly supported individual addresses require owner review.');return result;}result.workEmail=top.email;result.emailConfidence=top.score;result.emailQuality=top.quality;result.emailSource=top.source.sourceUrl;result.status=top.quality==='verified'?'verified_work_email':'candidate_work_email';}
 else result.status=result.companyEmail||result.businessPhone||research.pages.length?'company_only':'not_found';
 return result;
}
export const PROSPECT_EXPORT_FIELDS=['prospect_import_id','prospect_row_id','enriched_status','enriched_domain','enriched_website','enriched_company_confidence','enriched_company_resolution','enriched_person','enriched_title','enriched_work_email','enriched_email_confidence','enriched_email_quality','enriched_company_email','enriched_business_phone','enriched_linkedin','enriched_email_source','enriched_phone_source','enriched_sources','enriched_pages_checked','enriched_company_emails_found','enriched_evidence','enriched_last_checked','enriched_crm_contact_id','enriched_owner_review','enriched_errors'] as const;
function exportValues(batch:ProspectBatch,row:ProspectRow):Record<typeof PROSPECT_EXPORT_FIELDS[number],string>{const r=row.result;return {prospect_import_id:batch.id,prospect_row_id:row.id,enriched_status:r?.status||'not_processed',enriched_domain:r?.domain||row.normalized.domain,enriched_website:r?.website||row.normalized.website,enriched_company_confidence:r?String(r.companyConfidence):'',enriched_company_resolution:r?.companyResolution||'',enriched_person:r?.person||row.normalized.person,enriched_title:r?.title||row.normalized.title,enriched_work_email:r?.workEmail||'',enriched_email_confidence:r?String(r.emailConfidence):'',enriched_email_quality:r?.emailQuality||'',enriched_company_email:r?.companyEmail||'',enriched_business_phone:r?.businessPhone||row.normalized.phone,enriched_linkedin:r?.linkedin||row.normalized.linkedin,enriched_email_source:r?.emailSource||'',enriched_phone_source:r?.phoneSource||'',enriched_sources:r?.sources.join(' | ')||'',enriched_pages_checked:r?String(r.pagesChecked):'',enriched_company_emails_found:r?.companyEmailsFound.join(' | ')||'',enriched_evidence:r?JSON.stringify(r.evidence):'',enriched_last_checked:r?.lastChecked||'',enriched_crm_contact_id:row.crmContactId||'',enriched_owner_review:row.review,enriched_errors:[...row.errors,...(r?.errors||[])].join(' | ')};}
function csvCell(value:string,safe:boolean):string {let text=value;if(safe&&/^[\s\uFEFF]*[=+\-@]/.test(text))text="'"+text;return /[",\r\n]/.test(text)?'"'+text.replace(/"/g,'""')+'"':text;}
export function exportProspectCsv(batch:ProspectBatch,rows:ProspectRow[],options:ProspectExportOptions={}):string{
 const profile=options.profile||'full_fidelity',selected=options.selectedRowIds?new Set(options.selectedRowIds):null;const filtered=rows.filter(row=>row.batchId===batch.id&&(!selected||selected.has(row.id))&&(profile!=='verified_contacts'||row.result?.status==='verified_work_email')&&(profile!=='exceptions'||!row.result||['not_found','company_not_resolved','insufficient_input','review_required','error'].includes(row.result.status))&&(profile!=='company_only'||row.result?.status==='company_only'));
 const crmFields=new Set(['prospect_import_id','prospect_row_id','enriched_status','enriched_domain','enriched_website','enriched_person','enriched_title','enriched_work_email','enriched_email_confidence','enriched_company_email','enriched_business_phone','enriched_linkedin','enriched_email_source','enriched_crm_contact_id','enriched_owner_review']);const pocFields=new Set(['prospect_import_id','prospect_row_id','enriched_status','enriched_person','enriched_title','enriched_work_email','enriched_email_confidence','enriched_email_quality','enriched_company_email','enriched_email_source','enriched_evidence','enriched_owner_review','enriched_errors']);const fields=PROSPECT_EXPORT_FIELDS.filter(field=>(profile!=='custom'||!options.selectedColumns||options.selectedColumns.includes(field))&&(profile!=='crm_import'||crmFields.has(field))&&(profile!=='poc_review'||pocFields.has(field)));const headers=[...batch.headers];for(const field of fields){let name:string=field;let suffix=2;while(headers.includes(name))name=`${field}_${suffix++}`;headers.push(name);}
 const safe=options.safeSpreadsheet!==false;const lines=[headers.map(h=>csvCell(h,safe)).join(',')];for(const row of filtered){const values=exportValues(batch,row);const original=batch.headers.map((_,i)=>row.original[i]??'');lines.push([...original,...fields.map(field=>values[field])].map(v=>csvCell(v,safe)).join(','));}
 return (options.includeBom===false?'':'\uFEFF')+lines.join('\r\n')+'\r\n';
}
