import paramiko
import os
import sys

HOST = "193.105.234.248"
USER = "root"
PASSWORD = os.environ.get("SSH_PASSWORD", "")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=22, username=USER, password=PASSWORD, timeout=15)

# Run just lodash test first
cmd = "npm view lodash version --fetch-timeout=30000 --fetch-retries=0 --maxsockets=1 --loglevel=http"
print(f"=== {cmd} ===", flush=True)

stdin, stdout, stderr = client.exec_command(cmd, timeout=45)
out = stdout.read().decode("utf-8", errors="replace").strip()
err = stderr.read().decode("utf-8", errors="replace").strip()

if out:
    print(out, flush=True)
if err:
    print("STDERR:", err, flush=True)

print("LODASH_TEST_DONE", flush=True)
client.close()
