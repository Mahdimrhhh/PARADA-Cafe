import paramiko
import os
import sys

HOST = "193.105.234.248"
USER = "root"
PASSWORD = os.environ.get("SSH_PASSWORD", "")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=22, username=USER, password=PASSWORD, timeout=15)

# Test one command at a time with shorter timeout
commands = [
    ("npm view lodash version --fetch-timeout=30000 --fetch-retries=0 --maxsockets=1 --loglevel=http", 45),
    ("npm view vite version --fetch-timeout=30000 --fetch-retries=0 --maxsockets=1 --loglevel=http", 45),
]

for cmd, timeout in commands:
    print(f"\n=== {cmd} ===")
    print(f"timeout: {timeout}s")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    try:
        out = stdout.read().decode("utf-8", errors="replace").strip()
        err = stderr.read().decode("utf-8", errors="replace").strip()
        if out:
            sys.stdout.buffer.write(out.encode("utf-8"))
            sys.stdout.flush()
        if err:
            sys.stdout.buffer.write(("STDERR: " + err).encode("utf-8"))
            sys.stdout.flush()
        print(f"COMMAND_COMPLETED")
    except Exception as e:
        print(f"TIMEOUT_OR_ERROR: {e}")
    sys.stdout.flush()

client.close()
