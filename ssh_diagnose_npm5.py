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
    "npm view is-number version --registry=https://registry.npmmirror.com/ --fetch-timeout=30000 --fetch-retries=0 --loglevel=http",
    "mkdir -p /tmp/npm-test && cd /tmp/npm-test && npm pack is-number --registry=https://registry.npmmirror.com/ --fetch-timeout=30000 --fetch-retries=0 --loglevel=http",
    "ls -lh /tmp/npm-test",
    "rm -rf /tmp/npm-test",
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
