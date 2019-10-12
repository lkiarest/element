# 此脚本主要解决在 docker 或 WSL 中执行 ChromeHeadless 测试出现 crash 的问题
sudo update && sudo apt upgrade
sudo apt install ubuntu-desktop wget mesa-utils
sudo apt purge pulseaudio libpulse0 && sudo apt autoremove
wget https://dl.google.com/linux/direct/google-chrome-unstable_current_amd64.deb
sudo dpkg -i google-chrome-unstable_current_amd64.deb
sudo apt -f install           # probably
export DISPLAY=localhost:0
export NO_AT_BRIDGE=1
exec dbus-run-session -- bash
sudo service dbus start
google-chrome-unstable        # look mom, no flags
