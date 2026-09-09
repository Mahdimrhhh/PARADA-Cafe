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
    "cd /var/www/PARADA-Cafe && git status --short",
    "cd /var/www/PARADA-Cafe && git branch --show-current",
    "cd /var/www/PARADA-Cafe && git log -1 --oneline",
    "cd /var/www/PARADA-Cafe && git ls-tree -r origin/development --name-only | grep '^package-lock.json$' || echo 'PACKAGE-LOCK-NOT-IN-REMOTE'",
    "cd /var/www/PARADA-Cafe && ls -lh package-lock.json 2>/dev/null || echo 'package-lock.json missing locally'",
    "cd /var/www/PARADA-Cafe && du -sh node_modules 2>/dev/null || echo 'node_modules missing'",
    "cd /var/www/PARADA-Cafe && test -d node_modules && echo 'node_modules exists' || echo 'node_modules missing'",
]

for cmd in commands:
    print(f"\n=== {cmd} ===")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=30)
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    if out:
        sys.stdout.buffer.write(out.encode("utf-8"))
        sys.stdout.flush()
    if err:
        sys.stdout.buffer.write(("STDERR: " + err).encode("utf-8"))
        sys.stdout.flush()

client.close()
