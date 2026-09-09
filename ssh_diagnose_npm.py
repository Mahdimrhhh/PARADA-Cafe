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
    "npm config list",
    "npm config get strict-ssl",
    "npm config get maxsockets",
    "npm config get fetch-timeout",
    "npm config get fetch-retries",
    "env | grep -Ei 'proxy|npm|node' || true",
    "curl -4 -L --max-time 30 -v https://registry.npmjs.org/react -o /tmp/react-metadata.json",
    "ls -lh /tmp/react-metadata.json",
    "head -c 200 /tmp/react-metadata.json",
    'node -e "const https=require(\'https\'); const req=https.get(\'https://registry.npmjs.org/react\',(res)=>{console.log(\'STATUS\',res.statusCode); let n=0; res.on(\'data\',d=>n+=d.length); res.on(\'end\',()=>console.log(\'BYTES\',n));}); req.setTimeout(30000,()=>{console.error(\'TIMEOUT\'); req.destroy();}); req.on(\'error\',e=>console.error(\'ERROR\',e.code,e.message));"',
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
