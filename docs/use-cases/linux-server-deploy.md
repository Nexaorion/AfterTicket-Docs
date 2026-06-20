---
description: 在 Linux 服务器上使用官方更新服务下载、安装并部署 AfterTicket Client。
---

# Linux 服务器一键部署

本文说明如何在 Linux 服务器上使用安装脚本下载最新的 AfterTicket Client，并提前选择运行模式、预填 Node Token。

官方安装脚本下载地址：

<https://apac.r2.static.isla.fan/public/afterticket/install-afterticket-linux.sh>

官方更新服务负责提供版本信息和客户端二进制下载：

- 服务根地址：`https://updater.afterticket.org/`
- API Base URL：`https://updater.afterticket.org/api/v1`
- 脚本会调用：`GET /api/v1/version`、`GET /api/v1/download/Linux`

## 下载脚本

在目标 Linux 服务器上执行：

```sh
curl -fsSLO https://apac.r2.static.isla.fan/public/afterticket/install-afterticket-linux.sh
chmod +x install-afterticket-linux.sh
```

如果服务器没有 `curl`，可以使用：

```sh
wget https://apac.r2.static.isla.fan/public/afterticket/install-afterticket-linux.sh
chmod +x install-afterticket-linux.sh
```

## 适用场景

### 集群节点模式

适合长期运行在服务器上的节点。脚本会写入节点配置，并在 root 权限下创建 `systemd` 服务：

```sh
sudo sh install-afterticket-linux.sh \
  --mode cluster \
  --token '你的_NODE_TOKEN' \
  --master https://api.afterticket.org \
  --updater-url https://updater.afterticket.org/api/v1
```

安装完成后，服务默认名为 `afterticket-node`，启动命令为：

```sh
/opt/afterticket/afterticket --node
```

### 单机模式

适合在服务器终端中交互式使用。脚本会预写单机模式所需的 Node Token，但不会默认安装 `systemd` 服务，因为单机模式仍需要终端交互登录和选择任务：

```sh
sh install-afterticket-linux.sh \
  --mode standalone \
  --token '你的_NODE_TOKEN' \
  --no-service
```

启动方式：

```sh
cd ~/.local/afterticket
./afterticket
```

## 安装前准备

服务器需要具备以下命令：

```sh
python3
openssl
curl 或 wget
install
sed
od
```

如果要安装 `systemd` 服务，需要使用 root 权限执行脚本。

Node Token 可在 AfterTicket Dashboard 的节点或集群相关页面获取。Node Token 属于敏感凭据，请不要写入公开仓库、截图、日志或工单。

## 常用参数

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `--mode cluster\|standalone` | 预选运行模式 | 交互询问，默认 `cluster` |
| `--token <TOKEN>` | 预填 Node Token | 必填 |
| `--master <URL>` | Control / Master 服务地址 | `https://api.afterticket.org` |
| `--name <NAME>` | 集群节点显示名称 | `Node-<机器ID前8位>` |
| `--updater-url <URL>` | 更新服务 API Base URL | `https://updater.afterticket.org/api/v1` |
| `--install-dir <DIR>` | 安装目录 | root 为 `/opt/afterticket`，普通用户为 `~/.local/afterticket` |
| `--service-user <USER>` | `systemd` 服务运行用户 | `SUDO_USER` 或当前用户 |
| `--service-name <NAME>` | `systemd` 服务名称 | `afterticket-node` |
| `--no-service` | 只安装文件，不安装服务 | 关闭 |
| `--no-start` | 安装服务但不立即启动 | 关闭 |
| `--non-interactive` | 缺少参数时直接失败 | 关闭 |

也可以使用环境变量完成无交互部署：

```sh
sudo RUN_MODE=cluster \
  NODE_TOKEN='你的_NODE_TOKEN' \
  MASTER_URL='https://api.afterticket.org' \
  UPDATER_API_URL='https://updater.afterticket.org/api/v1' \
  sh install-afterticket-linux.sh --non-interactive
```

## 验证

检查官方更新服务：

```sh
curl -fsSL https://updater.afterticket.org/api/v1/health
```

检查集群节点服务：

```sh
systemctl status afterticket-node
journalctl -u afterticket-node -f
```

确认二进制可以启动：

```sh
/opt/afterticket/afterticket --node
```

普通用户安装时，路径通常是：

```sh
~/.local/afterticket/afterticket --node
```

## 排错

### 提示 Linux asset is not available

更新服务当前没有可下载的 Linux 构建包。可先检查：

```sh
curl -fsSL https://updater.afterticket.org/api/v1/version
```

确认响应中的 `platforms.Linux.available` 是否为 `true`。

### 非 root 执行后没有 systemd 服务

这是预期行为。普通用户没有权限写入 `/etc/systemd/system/`。可以改用 root 重新执行，或手动运行：

```sh
cd ~/.local/afterticket
./afterticket --node
```

### 单机模式没有自动后台运行

这是预期行为。单机模式需要终端交互登录、选择购票配置和启动任务。服务器长期后台运行建议使用集群节点模式。
