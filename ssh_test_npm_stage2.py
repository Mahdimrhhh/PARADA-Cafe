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
    "npm config get registry",
    "npm config get maxsockets",
    "npm config get fetch-timeout",
    "npm config get fetch-retries",
    "curl -4 -I https://registry.npmjs.org/react",
    "curl -4 -L --max-time 30 -o /dev/null https://registry.npmjs.org/react/-/react-19.2.0.tgz",
]

for cmd in commands:
    print(f"\n=== {cmd} ===")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=60)
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    if out:
        sys.stdout.buffer.write(out.encode("utf-8"))
        sys.stdout.flush()
    if err:
        sys.stdout.buffer.write(("STDERR: " + err).encode("utf-8"))
        sys.stdout.flush()

client.close()
