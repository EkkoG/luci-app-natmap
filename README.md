### 支持版本

OpenWrt 19.07 及以上
### 使用

添加软件源

```
curl -fsSL https://github.com/ekkog/openwrt-dist/raw/master/add-feed.sh | sh 
```

更新软件源并安装

```
opkg update
opkg install luci-app-natmap
```
