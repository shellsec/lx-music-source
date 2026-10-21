# lx-music-source

供外部程序加载和远程更新的 LX Music 音源集合，脚本统一保存在本仓库的 `sources/` 目录。

## 订阅入口

音源清单：[sources.json](sources.json)

| 访问方式 | 清单地址 |
|---|---|
| 加速链接 | [通过 gh-proxy.com 加载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources.json) |
| GitHub 直连 | [通过 raw.githubusercontent.com 加载](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources.json) |

清单内各音源的 `url` 已使用加速链接。加速服务暂时不可用时，可从对应地址中移除 `https://gh-proxy.com/` 前缀，尝试 GitHub 直连。

外部加载器读取清单中的 `id`、`name` 和 `url`，通过 `url` 下载对应的 JS 脚本。建议以稳定的 `id` 识别音源，每次更新重新读取清单中的地址。

## 音源列表

当前收录 14 个音源，可复制下表的 JS 加速链接到 LX Music 中导入：

| 音源 | JS 加速地址 | JS 直连地址 |
|---|---|---|
| Appx64 Clear Music | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/appx64/Appx64%20Clear%20Music.js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/appx64/Appx64%20Clear%20Music.js) |
| 星海音乐源 | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/xinghai/%E6%98%9F%E6%B5%B7%E9%9F%B3%E4%B9%90%E6%BA%90.js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/xinghai/%E6%98%9F%E6%B5%B7%E9%9F%B3%E4%B9%90%E6%BA%90.js) |
| 屿溪-终章 | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/yuxi/%E5%B1%BF%E6%BA%AA-%E7%BB%88%E7%AB%A0.js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/yuxi/%E5%B1%BF%E6%BA%AA-%E7%BB%88%E7%AB%A0.js) |
| lx-玉宁熙-Pro | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/yuningxi/lx-%E7%8E%89%E5%AE%81%E7%86%99-Pro.js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/yuningxi/lx-%E7%8E%89%E5%AE%81%E7%86%99-Pro.js) |
| fish_music | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/fish-music/fish_music.js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/fish-music/fish_music.js) |
| lx-animemusic | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/animemusic/lx-animemusic.js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/animemusic/lx-animemusic.js) |
| 长青SVIP音源(二改修复版) | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/changqing/%E9%95%BF%E9%9D%92SVIP%E9%9F%B3%E6%BA%90(%E4%BA%8C%E6%94%B9%E4%BF%AE%E5%A4%8D%E7%89%88).js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/changqing/%E9%95%BF%E9%9D%92SVIP%E9%9F%B3%E6%BA%90(%E4%BA%8C%E6%94%B9%E4%BF%AE%E5%A4%8D%E7%89%88).js) |
| 𝖧౿ᥣᥣ𝗈 Ԝ𝗈𝗋ᥣᑯ | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/hello-world/%F0%9D%96%A7%E0%B1%BF%E1%A5%A3%E1%A5%A3%F0%9D%97%88%20%D4%9C%F0%9D%97%88%F0%9D%97%8B%E1%A5%A3%E1%91%AF.js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/hello-world/%F0%9D%96%A7%E0%B1%BF%E1%A5%A3%E1%A5%A3%F0%9D%97%88%20%D4%9C%F0%9D%97%88%F0%9D%97%8B%E1%A5%A3%E1%91%AF.js) |
| 墨澜聚合音源 | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/molan/%E5%A2%A8%E6%BE%9C%E8%81%9A%E5%90%88%E9%9F%B3%E6%BA%90.js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/molan/%E5%A2%A8%E6%BE%9C%E8%81%9A%E5%90%88%E9%9F%B3%E6%BA%90.js) |
| K×H测试 | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/kxh/K%C3%97H%E6%B5%8B%E8%AF%95.js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/kxh/K%C3%97H%E6%B5%8B%E8%AF%95.js) |
| 杰翔聚合音源 | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/jiexiang/%E6%9D%B0%E7%BF%94%E8%81%9A%E5%90%88%E9%9F%B3%E6%BA%90.js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/jiexiang/%E6%9D%B0%E7%BF%94%E8%81%9A%E5%90%88%E9%9F%B3%E6%BA%90.js) |
| HYWmusic_公益版 | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/hyw/HYWmusic_%E5%85%AC%E7%9B%8A%E7%89%88.js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/hyw/HYWmusic_%E5%85%AC%E7%9B%8A%E7%89%88.js) |
| 全豆要[聚合音源] | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/qdy/%E5%85%A8%E8%B1%86%E8%A6%81%5B%E8%81%9A%E5%90%88%E9%9F%B3%E6%BA%90%5D.js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/qdy/%E5%85%A8%E8%B1%86%E8%A6%81%5B%E8%81%9A%E5%90%88%E9%9F%B3%E6%BA%90%5D.js) |
| 野草🌾 | [加速下载](https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/sources/grass/%E9%87%8E%E8%8D%89%F0%9F%8C%BE.js) | [GitHub 直连](https://raw.githubusercontent.com/shellsec/lx-music-source/master/sources/grass/%E9%87%8E%E8%8D%89%F0%9F%8C%BE.js) |

各音源支持的平台和音质以脚本声明为准，地址以 [sources.json](sources.json) 为准。

## 目录说明

```text
sources.json                 音源订阅清单
sources/<音源 id>/<名称>.js   音源脚本
```

JS 文件名取自脚本头部的 `@name`；Windows 不允许的字符替换为 `_`，清单 URL 对中文、空格等字符进行编码。重命名文件时需要同步更新 `sources.json`。

原根目录、`appx64/` 及临时 `latest.js` 路径已迁移，直接订阅旧地址的用户需要更换地址。

## 免责声明

- 本仓库用于音源脚本的整理、技术学习与交流，不存储音乐文件；脚本版权归各自作者所有。
- 音乐内容由第三方平台或接口提供，使用时请遵守相关平台规则及适用法律，尊重版权、支持正版，不得用于侵权或未经授权的商业用途。
- 第三方音源及加速服务可能变更、限流或停止服务，本仓库不保证其持续可用、内容准确或音质完整。
- HYWmusic 按所有者授权保留内嵌卡密，公开该文件会同时公开卡密；请勿将个人账号凭据或私有卡密提交到公开仓库。
- 如涉及版权或其他权益问题，请通过仓库 Issues 联系，核实后处理。
