import {describe,it,expect,vi} from 'vitest';
import {researchCompany,publicCompanyURL} from '../src/platform/publicResearch';
import {normalizeProspectRow,proposeMapping} from '../src/domain/prospecting';
import type {ProspectSettings} from '../src/domain/prospectTypes';
const headers=['Company','Owner','Website'];
const normalized=normalizeProspectRow(['Example Industrial LLC','Robert Johnson','https://example.com'],headers,proposeMapping(headers).mapping);
const settings:ProspectSettings={concurrency:1,maxPages:1,requestDelayMs:250,timeoutMs:3000,cacheMode:'refresh_stale',cacheDays:30};
const html='<title>Example Industrial LLC</title><h1>Example Industrial LLC</h1><article><h2>Robert Johnson</h2><a href="mailto:robert.johnson@example.com">Email Robert</a></article>';
const page=()=>new Response(html,{headers:{'content-type':'text/html'}});
const robots=(rules='User-agent: *\nDisallow:')=>new Response(rules,{headers:{'content-type':'text/plain'}});
function opaqueRedirect(){const response=new Response(null);Object.defineProperty(response,'type',{value:'opaqueredirect'});Object.defineProperty(response,'status',{value:0});return response;}

describe('browser opaque redirects and companion website policy',()=>{
 it('preserves an explicitly supplied www host for policy and permission checks',()=>{expect(new URL(publicCompanyURL('https://www.example.com/contact')).hostname).toBe('www.example.com');expect(new URL(publicCompanyURL('https://example.com/contact')).hostname).toBe('example.com')});
 it('probes only the owner-approved root/www companion when the browser conceals a redirect target',async()=>{
  const calls:string[]=[];const fetcher=vi.fn(async(url:string,init:RequestInit)=>{calls.push(url);expect(init.redirect).toBe('manual');expect((init as any).targetAddressSpace).toBe('public');const u=new URL(url);if(u.pathname==='/robots.txt')return robots();if(u.hostname==='example.com')return opaqueRedirect();return page()});
  const result=await researchCompany(normalized,settings,{fetcher:fetcher as any,allowOrigin:async()=>true},new AbortController().signal);expect(result.pages).toHaveLength(1);expect(result.pages[0].url).toBe('https://www.example.com/');expect(calls.every(url=>['example.com','www.example.com'].includes(new URL(url).hostname))).toBe(true);expect(calls).toContain('https://www.example.com/robots.txt');
 });
 it('does not infer permission for the www companion from permission for the root company host',async()=>{
  const fetcher=vi.fn(async(url:string)=>url.endsWith('/robots.txt')?robots():opaqueRedirect());const result=await researchCompany(normalized,settings,{fetcher:fetcher as any,allowOrigin:async url=>new URL(url).hostname==='example.com'},new AbortController().signal);expect(result.pages).toHaveLength(0);expect(result.errors.join()).toContain('permission_required');expect(fetcher.mock.calls.every(([url])=>new URL(url).hostname==='example.com')).toBe(true);
 });
 it('checks companion robots policy before fetching a root/www redirect destination',async()=>{
  for(const opaque of [true,false]){
   const calls:string[]=[];const fetcher=vi.fn(async(url:string)=>{calls.push(url);const u=new URL(url);if(u.pathname==='/robots.txt')return robots(u.hostname==='www.example.com'?'User-agent: *\nDisallow: /':'User-agent: *\nDisallow:');if(u.hostname==='example.com')return opaque?opaqueRedirect():new Response(null,{status:302,headers:{location:'https://www.example.com'+u.pathname}});return page()});
   const result=await researchCompany(normalized,settings,{fetcher:fetcher as any,allowOrigin:async()=>true},new AbortController().signal);expect(result.pages).toHaveLength(0);expect(calls).toContain('https://www.example.com/robots.txt');expect(calls.some(url=>new URL(url).hostname==='www.example.com'&&new URL(url).pathname!=='/robots.txt')).toBe(false);
  }
 });
 it('fails with a manual review state when both root and companion redirects remain opaque',async()=>{
  const fetcher=vi.fn(async(url:string)=>url.endsWith('/robots.txt')?robots():opaqueRedirect());const result=await researchCompany(normalized,settings,{fetcher:fetcher as any,allowOrigin:async()=>true},new AbortController().signal);expect(result.pages).toHaveLength(0);expect(result.errors.join()).toContain('opaque');expect(result.emails).toHaveLength(0);expect(fetcher.mock.calls.every(([url])=>['example.com','www.example.com'].includes(new URL(url).hostname))).toBe(true);
 });
});
