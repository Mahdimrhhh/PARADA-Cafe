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
    "npm --version",
    "which npm",
    "readlink -f \"$(which npm)\"",
    "npm config get userconfig",
    "cat /root/.npmrc 2>/dev/null || true",
    "npm view express version --fetch-timeout=30000 --fetch-retries=0",
    "npm view lodash version --fetch-timeout=30000 --fetch-retries=0",
    "npm view vite version --fetch-timeout=30000 --fetch-retries=0",
    "curl -4 -L --max-time 30 -o /dev/null -w \"express HTTP=%{http_code} SIZE=%{size_download} TIME=%{time_total}\\n\" https://registry.npmjs.org/express",
    "curl -4 -L --max-time 30 -o /dev/null -w \"lodash HTTP=%{http_code} SIZE=%{size_download} TIME=%{time_total}\\n\" https://registry.npmjs.org/lodash",
    "curl -4 -L --max-time 30 -o /dev/null -w \"vite HTTP=%{http_code} SIZE=%{size_download} TIME=%{time_total}\\n\" https://registry.npmjs.org/vite",
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
