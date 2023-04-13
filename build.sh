#!/bin/sh
cp feeds.conf.default feeds.conf
echo "src-link local_build $(pwd)/local-build" >> ./feeds.conf

./scripts/feeds update -a
make defconfig
./scripts/feeds install -p openwrt_packages -f luci-app-natmap

make package/luci-app-natmap/compile V=s