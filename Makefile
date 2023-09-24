# This is free software, licensed under the Apache License, Version 2.0

include $(TOPDIR)/rules.mk

PKG_VERSION:=1.0.0
PKG_PO_VERSION:=$(PKG_VERSION)

LUCI_TITLE:=LuCI Support for natmap
LUCI_DEPENDS:=+natmap
PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Richard Yu <yurichard3839@gmail.com>

include ../../luci.mk

# call BuildPackage - OpenWrt buildroot signature
