lsof -i:3004 | awk '{print $2}' | grep -v '^PID'
