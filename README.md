### 支持版本

OpenWrt 19.07 及以上
### 使用

```
echo "src/gz ekkog https://github.com/ekkog/openwrt-dist/raw/packages/${architecture}/${openwrt_release}" >> /etc/opkg/customfeeds.conf
wget https://github.com/ekkog/openwrt-dist/raw/master/cd5844109a8e9dda
opkg-key add cd5844109a8e9dda
```


openwrt_release 可以是 22.03 或者 21.02, 其他旧版本用 21.02 即可

如果你的路由器是 x86_64 的，那么 architecture 就是 x86_64, 那么你的 opkg.conf 应该是这样的

```
echo "src/gz ekkog https://github.com/ekkog/openwrt-dist/raw/packages/x86_64/22.03" >> /etc/opkg/customfeeds.conf
wget https://github.com/ekkog/openwrt-dist/raw/master/cd5844109a8e9dda
opkg-key add cd5844109a8e9dda
```

如果你不知道自己的路由器是什么架构，可以用下面命令查看

```
cat /etc/openwrt_release | grep DISTRIB_ARCH | awk -F "'" '{print $2}'
```

添加好 feed 之后，就可以用 opkg 安装了

```
opkg update
opkg install luci-app-natmap
```