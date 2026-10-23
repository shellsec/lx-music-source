# 测试与分析记录

此目录保留方法、样本和结果，方便后续分析。模拟环境失败不等于真实 LX 客户端不可用。

## 收录标准

- 自动抽测能够初始化，并且至少一个声明支持的平台返回可识别的音频响应。
- 或者用户明确确认实际客户端可用并要求收录，记录日期及文件 SHA-256，保留自动失败结果。

野草由用户于 2026-10-21 确认实测可用后收录，见 [user-confirmed.json](user-confirmed.json)。

## 测试覆盖

离线检查清单结构、ID 唯一性、路径、脚本名称、语法，以及文件 SHA-256 是否匹配成功抽测或用户确认记录。

联网检测在独立 Node 进程中模拟 LX 请求回调、事件和基础工具接口。按 [music-samples.json](music-samples.json) 对脚本声明支持的网易、QQ、酷我、酷狗、咪咕各请求一个 `128k` 样本，再下载约 8KB 片段，检查 HTTP 状态和音频文件头；未声明支持的平台跳过。脚本可能自行降级或返回其他音质，请求音质不等于已验证实际码率。

网易、QQ、酷狗、咪咕样本为周杰伦《晴天》，专辑《叶惠美》，约 269 秒，ID/Hash 已依据官方详情或搜索响应核对。酷我 `228908` 仅作为历史响应样本，尚未核实歌名。

没有覆盖真实 LX 桌面/移动客户端、多首歌曲、全部音质、完整解码和整首播放、统一的歌曲身份/时长/码率验证，以及并发、缓存和长期稳定性。VM 和独立进程不是安全沙箱，只用于已知脚本。

## 运行命令

离线检查（Node.js 18+）：

```sh
node --test
```

手动联网抽测（另需 curl）：

```sh
node tools/probe-sources.cjs --output tests/latest-probe.json
```

命令末尾可指定一个或多个 JS 路径；部分检测请输出到其他文件，避免覆盖完整快照。任一脚本没有通过样本时返回非零退出码；用户确认收录不会将自动失败改为通过。

## 记录文件

| 文件 | 内容 |
|---|---|
| [availability.json](availability.json) | 首轮候选筛选与 Hash |
| [remote-recheck.json](remote-recheck.json) | 8 个远程候选的网易/酷我复查 |
| [platform-probe.md](platform-probe.md) | 五平台对照表 |
| [platform-probe.json](platform-probe.json) | 五平台原始结果与 QDY 复测 |
| [latest-probe.json](latest-probe.json) | 已收录脚本自动抽测快照 |
| [user-confirmed.json](user-confirmed.json) | 用户客户端确认记录 |
| [upstream-2026-10-23.md](upstream-2026-10-23.md) | 上游 11 个音源的复查与合并判断 |
| [upstream-2026-10-23.json](upstream-2026-10-23.json) | 固定上游提交、文件 Hash 和逐平台检测证据 |

结合检测时间、脚本 Hash 和用户实测判断差异。QDY 酷我历史失败，后续连续两次通过后恢复；野草模拟未通过，但用户确认可用。表中的 ✓ 仅代表音频响应通过，不代表整首或全平台可用。
