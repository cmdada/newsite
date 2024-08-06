# adabit.org

## Building instructions
We use pnpm and sveltekit here, so it's a simple `pnpm build`. `node build`

oh and i wrote a shitty systemd service file that doesnt restart correctly, so assuming you cloned the repo to /home/ada/newsite/ here you go

```
[Unit]
Description=adabit
After=multi-user.target

[Service]
Type=simple
ExecStart=bash -c "cd /home/ada/newsite&& npm run build && PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host node build"
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```
