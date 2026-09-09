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
    "ls -lt /root/.npm/_logs/ | head -10",
    "LOG=$(ls -t /root/.npm/_logs/*.log 2>/dev/null | head -1); if [ -n \"$LOG\" ]; then echo \"=== $LOG ===\"; tail -100 \"$LOG\"; else echo 'no logs'; fi",
    "npm cache verify",
    "npm cache ls | grep -E '/(lodash|vite|express)(@|$)' | head -50 || true",
    "npm view express version --fetch-timeout=30000 --fetch-retries=0 --loglevel=http",
    "timeout 35 npm view lodash version --fetch-timeout=30000 --fetch-retries=0 --loglevel=http || echo 'LODASH_DIAG_TIMEOUT'",
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
