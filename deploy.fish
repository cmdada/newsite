#!/usr/bin/env fish


set SERVER "ada@192.168.86.243"
set REMOTE_DIR "~/newsite"
set SERVICE_NAME "adabit.service"

ssh $SERVER "
    cd $REMOTE_DIR;
    git pull;
    sudo -S systemctl restart $SERVICE_NAME;
"

echo "Updates pulled and $SERVICE_NAME restarted successfully on $SERVER."
