#!/bin/sh
# cp feeds.conf.default feeds.conf
# echo "src-link local_build $(pwd)/local-build" >> ./feeds.conf

./scripts/feeds update luci
cp -rf ./local-build/luci-app-natmap/* ./feeds/luci/applications/luci-app-natmap
ls ./feeds/luci/applications/luci-app-natmap
# ls ./feeds/luci/luci-app-natmap
make defconfig
./scripts/feeds install -a

ls package
make package/luci-app-natmap/compile V=s