lsof -i:8007 | awk '{print $2}' | grep -v '^PID'
