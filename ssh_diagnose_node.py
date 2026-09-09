import paramiko
import os
import sys

HOST = "193.105.234.248"
USER = "root"
PASSWORD = os.environ.get("SSH_PASSWORD", "")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=22, username=USER, password=PASSWORD, timeout=15)

commands = [
    "node -p \"process.version\"",
    "node -p \"process.versions\"",
    "getent ahosts registry.npmjs.org",
    "node -e \"const https=require('https'); const req=https.get({hostname:'registry.npmjs.org',path:'/react',family:4,timeout:30000},res=>{console.log('STATUS',res.statusCode); let n=0; res.on('data',d=>n+=d.length); res.on('end',()=>console.log('BYTES',n));}); req.on('timeout',()=>{console.error('HTTPS_TIMEOUT'); req.destroy();}); req.on('error',e=>console.error('HTTPS_ERROR',e.code,e.message));\"",
    "node -e \"const tls=require('tls'); const s=tls.connect({host:'registry.npmjs.org',port:443,servername:'registry.npmjs.org',family:4,rejectUnauthorized:false},()=>{console.log('TLS_CONNECTED'); console.log('PROTOCOL',s.getProtocol()); console.log('CIPHER',s.getCipher()); s.end();}); s.setTimeout(30000,()=>{console.error('TLS_TIMEOUT'); s.destroy();}); s.on('error',e=>console.error('TLS_ERROR',e.code,e.message));\"",
    "NODE_OPTIONS=\"--dns-result-order=ipv4first\" npm view react version --fetch-timeout=30000 --fetch-retries=0",
]

for cmd in commands:
    print(f"\n=== {cmd} ===")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=120)
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    if out:
        sys.stdout.buffer.write(out.encode("utf-8"))
        sys.stdout.flush()
    if err:
        sys.stdout.buffer.write(("STDERR: " + err).encode("utf-8"))
        sys.stdout.flush()

client.close()
