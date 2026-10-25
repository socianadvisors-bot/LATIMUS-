import {describe,it,expect} from 'vitest';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
describe('built distribution contracts',()=>{
 it('portable artifact is self contained and its CSP authorizes the exact bundle only',()=>{
   const html=readFileSync('dist/LATIMUS.html','utf8');const script=html.match(/<script>([\s\S]*)<\/script>/)?.[1];expect(script).toBeTruthy();const digest=createHash('sha256').update(script!).digest('base64');expect(html).toContain(`script-src 'sha256-${digest}'`);expect(html).toContain("connect-src 'none'");expect(html).not.toMatch(/<script[^>]+src=/);expect(html).not.toMatch(/<link[^>]+href=/);
 });
 it('extension has stable identity, restrictive CSP and no network, content script or broad permissions',()=>{
   const m=JSON.parse(readFileSync('dist/extension/manifest.json','utf8'));expect(m.manifest_version).toBe(3);expect(m.permissions).toEqual([]);expect(m.key).toBeTruthy();expect(m.content_scripts).toBeUndefined();expect(m.host_permissions).toBeUndefined();expect(m.content_security_policy.extension_pages).toContain("connect-src 'none'");expect(existsSync('dist/extension/worker.js')).toBe(true);expect(existsSync('dist/LATIMUS-extension.zip')).toBe(true);
 });
});
