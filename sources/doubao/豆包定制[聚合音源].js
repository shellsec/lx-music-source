/*!
 * @name 豆包定制[聚合音源]
 * @description v8.10.12 探测素材修正（移除写死的无效 VIP 歌/单曲素材）｜v8.10.4 可播校验错误码修复（超时/网络异常不判死链 + LINK_EXPIRED 补 code）｜v8.10.3 分档预算 + 冷启动探针豁免 + 缓存分级 TTL（2026-11-06：①分档预算 flac 6s/320k 4s/128k 4s + 末档保底 3s，防高音质吃满总预算饿死低档致点歌无声；②冷启动源探针超时放宽到 30s + 豁免自动关闭，onrender 冷态 30s 不再被 20min 误摘；③短路探路窗口 6h→1h，源临时波动后用户不用等 6h 才恢复高音质；④高音质缓存分级 TTL——flac/320k 30min（原 6h 链接已死仍返回死链），128k 保持 6h；⑤历史快照 60→144（10h→24h），趋势图跨天不断；新增 5 配置键，冒烟 T46/T47/T48；v8.10.1 补修：缓存 LRU 缺 delete 致高音质缓存过期重播 TypeError，T46/T47/T48 由空壳改为真行为验证）；v8.9 huibq 平台能力收窄 + 档位短路判据拆分（2026-11-06：huibq 实测仅 kw/wy 可用，从 tx/mg/kg 链尾移除；短路判据由 fail+businessFail 拆为 fail+linkExpired——404 无版权不再误伤、410 死链仍能短路；source-audit 支持 --strict 退出码）；v8.8 竞速引擎改造（2026-11-06：6 条全做——①竞速执行器重写为全链分批错峰并发（消灭"竞速3+串行rest"，kw 最坏 31s→≤10.5s）②单次请求总预算 12s 跨音质档共享（防三级降档理论 90s+）③档位短路（某源某档历史 0 成功且样本≥3 直接跳过该档，6h 放行探路防死锁）④冷启动源预热 + 单源超时放宽到 8s（huibq onrender 冷态 30s > 旧 5s 必败）⑤gdWy 配额源 batch:2 降后批省配额⑥verified 等待精确化（无 verified 源在飞则立即交付，不再白等 600ms）；USER_CONFIG 新增 7 键，冒烟 T40/T41/T42/T43）；v8.7 huibq假成功治理（2026-11-06：msg 失败词判失败，避免交付错歌）；v8.6 huibq默认开启（2026-11-06：全平台全音质可用，进五平台链尾兜底 + 探针托管）；v8.5 巡检工具与监控口径升级（2026-11-06：source-audit 巡检工具 + probe 假阳性治理 + huibq 探针）；v8.4 全源全接口深度巡检修复（2026-11-06：suyinKuwo br 修正 + xinghaiBackend 匿名适配，可用源 15→21）；v8.3 ikun默认开启（2026-11-06：A 方案——公益版免卡密默认进 kw 链尾兜底，探测自动托管/失败自动关/恢复自动开）；v8.2 ikun探针接入（2026-11-06：默认关闭源补齐健康探针，用户手动开启后自动监控；POST /music/url 固定歌 + Range 可播校验）；v8.1 ikun源复活（2026-11-06：域名 api.ikunshare.com→c.wwwweb.top，接口 GET /url→POST /music/url，公益版免卡密，实测 rid=228908 出真实128k链）；v8.0 全量审计修复版（版本重新整理：原 v11.11~v29.9 共53个小版本合并为8个大版本；旧版本归档见 docs/ARCHIVE_OLD_TAGS.md）；v29.9 全量审计修复（helloworld通道②补试听片段检测+reqTimestamps初始化防御+raceFirst空数组防御+注释修正+self-check补config/trend检查）；v29.8 小修复合集（logInfo版本号同步+清理冗余正则+@description同步）；v29.7 helloworld(kw)试听片段修复（降优先级移到Juhe之后 + URL关键词检测preview/test/sample抛错换源）；v29.6 巡检脚本全面优化(并发池限流+403/429判定修正+退出码分级+平台健康汇总+死源分级+原因标注+恢复标记+UA轮换+重试机制+README表格自动生成)；v29.5 深度交叉点审计修复(配置写模式返回current脱敏+PARAM_LIMITS上下限校验+改熔断阈值重置failureCount+改缓存TTL清空successCache+手动探测不存历史快照+deadCount含half-open+兜底平台按avgScore排序+历史快照上限20→60条+历史快照去冗余字段+breakers→breakerMap变量名修复)；v28 自动健康日报(scripts/health-daily.js：读probe-history按端点聚合近7日成功率/均时，连续3天全失败或真故障率>50%自动生成摘除建议，输出docs/health-daily/YYYY-MM-DD.md)；v27.4 健康分10分制输出；v27.3 全面审计修复(三源内部缓存命中返回裸URL——旧返回{url,type,subSource}包装对象被wrapExecute validateUrl拦截致缓存后跨平台取链秒失败；wy封面取songs[0].album.picUrl/blurPicUrl回退+补移动UA——网易detail实测带ids参数顶层picUrl恒null、封面在album字段；probe.js端点过滤正则悬空|恒真修复；ecosystem-scan.js源表改为从SOURCE_HANDLERS动态提取防漂移)；v27.2 候选 helloworld 实证接入(生态扫描候选——kw 128k/320k/flac 三档 convert_url_with_sign 直链全端到端实证通过(2026-10-29：mock宿主加载+真实flac/320k返回+Range 206+魔数校验)，与星海后端并列 kw 高音质竞速；haitangw v1 resolve-url 作通道②备用)；v26.3 生态扫描制度化(scripts/ecosystem-scan.js抓pdone每日健康表交叉——自动产出新候选/失效清单，纳入迭代协议；运行时逻辑同v26.1)；v26.1 自动摘死源(播放连续失败≥3次实时摘除出链+playDead快照+播放成功/探测通过自动复活——与manualOff分层)；v26.0 音源日志增强(竞速过程打点+失败逐源明细——配合App「音源日志」一次失败定位到子源与原因)；v25.11 沙箱兼容(raceFirst setInterval→setTimeout——洛雪移动端VM无setInterval，修复UnhandledPromiseRejection与候选取回失效)；v25.10 防御修复(raceFirst 裸url分支source兜底空串，防未来裸值调用丢子源透出)；v25.9 子源名透出(musicUrl 返回补 subSourceName——实际子源中文名，App 播放页音源标签直接显示「平台·子源名」，无需端侧维护映射)；v25.8 实际子源透出(musicUrl 成功返回 {url,type,subSource}——实际交付链接的子源id，缓存同存；配合 App 播放页音源标签显示「平台·子源」)；v25.7 第三轮全维度审计修复(探测清单过滤手动关闭/默认关闭源——juhe五源不再白耗外呼、手动关闭源不再被标休眠)；v25.6 第二轮全量审计修复(熔断跳过不再误记限流/CDN410走1min缓存/删COPYRIGHT_LIMIT死枚举/删HIRES死常量/补allFailShortTtlMs配置键)；v25.5 全量审计修复(溯音咪咕对象冒充直链/星海备API伪装直链/酷我官方错歌校验/删死代码)；v25.4 字段完整透传(juheGetUrl 透传 strMediaMid/mediaMid/hash/rid/copyrightId 等原始ID+meta层，提升API型源高音质解析)；v25.3 音源健康审计修复(健康分口径/并发保护/本地节流误记/探测锁/休眠复活/降频生效)；v25.2 健康面板使用中分组(真实播放请求记录 lastUsedAt 时间戳进快照，配合 App 五级分区排序：使用中→正常→待采样→休眠→已关)；v25.1 Juhe源族治理(Juhe上游2026-10-28实测整体不可用：五平台超时/429→默认关闭；协议型探测(固定歌POST校验code200/303)接通休眠/自动关闭/自愈复活；全链网络类失败30s短缓存防反复卡18s)；v25.0 Juhe源族扩充(tx全链路实测通：POST→303→vkeys中转→qqmusic直链；wy/kg/mg按平台标识字段注册，服务端受限时自动降级)；v24.0 音质协商链可观测(降档日志+快照 lastQuality 实际交付音质，配合 App 真实音质显示；降档链 v11.12/v13.x 已有)；v23.1 发布前自检门(scripts/self-check.js：版本串同步/actions声明/README与ROADMAP同步，CI L2 任一失败阻断发布)；v22.0 配置化治理(USER_CONFIG 全量参数化：缓存TTL/熔断阈值与冷却/429退避/并发与限速/探测间隔/竞速超时均可配，缺省行为与历史一致)；v19.2 探测自适应(连续通过≥5轮降频为每2轮一探)+探测歌曲池扩至12首(随机轮换防单曲被风控)；v19.1 并发上限+滑动窗口限速+UA池轮换(单源并发≤2、3s窗口≤5次、4套移动UA轮换，防上游风控)；v19.0 健康分排序源链(sortChainByHealth 强化：verified 源附加优先权重，串行兜底按健康分降序；v14.1 已实现基础)；v18.0 源族扩充(Juhe聚合API：kw 全音质 303重定向校验协议全链路实测可用，独立新源族 juheKw)；v17.2 429限流退避(短退避30s不触发熔断、连续≥3次标记被限状态，快照 rateLimited)；v17.1 成功率按音质分档(byQuality：flac/320k/128k 各档 rate/avgTime，flac 坏但低音质好的源精确呈现)；v17.0 失败归因分离(版权/业务失败单独计数 copyrightFail——无版权歌不再惩罚健康分/不计入成功率分母)；v16.5.1 停用 updateAlert 发版弹窗(每次加载/导入不再弹更新提示)；v16.5 健康面板"管"能力(toggle 源级开关+manualOff手动锁定防探测复活、probe 手动探测一轮返回结果、快照 sleeping 休眠字段)；v16.4 健康面板数据语义修正(无样本 successRate/avgTime 返回 null + reqCount/probeCount 样本计数，App 显示"-"与采样数)；v16.3 App健康面板联动(health action：App fork 声明即注册 getHealth，聚合快照直通设置页面板)；v16.2发布后监控/回滚决策(Release自动巡检基线+核心源连续失败≥3天回滚)；v16.1死源建议(连续3天失败自动标记)；v16.0仓库级成功率统计(probe-history近7日)；v15.2健康统计快照(getHealthSnapshot)；v15.0歌词/封面透出(wy lyric+pic/kw pic)；v14.3分级探测+休眠复活；v14.2竞速匹配校验；v14.1健康权重自学习；v14.0失败原因结构化透出；v13.4配置化+v12.1失败缓存差异化；保留v12.0星海kw高音质双源+v11.12防错歌加固
 * @version 8.10.12 探测素材修正：移除写死的无效/单曲素材，统一走免费歌池轮换（2026-11-08：超时/网络异常不再判死链 + LINK_EXPIRED 补 err.code）；8.10.3 全覆盖审计修复（2026-11-07：15 项隐性缺陷——①probeSingleSource 形参 cfg 遮蔽全局 cfg()，huibq（唯一冷启动源）探针 100% TypeError、请求从未发出、健康分恒负垫底休眠；②429 不再计入 byQuality.fail/成功率分母（旧实现 3 次限流把该档短路 1h），半开遇 429 收口回 open；③降档交付按实交付音质入缓存槽（旧实现请求 flac 实给 128k 却存进 flac 槽，6h 内不再试高音质）；④失败缓存命中还原代表性 code（旧实现 code 丢失，网络全挂被当歌不存在）；⑤平台分组改由竞速链生成（旧手写清单漏 suyinKuwo，wy/tx/mg/kg 只剩它活着时误报全挂）；⑥探针通过一并复位断路器/限流退避（旧实现只清休眠，出现「探针正常 + 熔断中」矛盾态）；⑦末端预算上界显式钳在总预算+保底；⑧validateUrl 返回 trim 后 URL；⑨320k/128k 单档预算 4s→5s 对齐单源超时（旧 4s 把 5s 内本可成功的源判死并累计熔断）；⑩删死键 raceOverallTimeoutMs、面板改暴露真键 raceBudgetMs；⑪huibq 假成功判据单点化并补进探针；⑫lingchuan 补 platforms 显式声明；⑬A19 备注 20→144；⑭冒烟新增 T50–T55（回退必红）共 55 组）；v8.10.2 分档预算 + 冷启动探针豁免 + 缓存分级 TTL（2026-11-06：①分档预算 flac 6s/320k 4s/128k 4s + 末档保底 3s，防高音质吃满总预算饿死低档致点歌无声；②冷启动源探针超时放宽到 30s + 豁免自动关闭，onrender 冷态 30s 不再被 20min 误摘；③短路探路窗口 6h→1h；④高音质缓存分级 TTL——flac/320k 30min，128k 保持 6h；⑤历史快照 60→144（10h→24h）；新增 5 配置键，冒烟 T46/T47/T48；v8.10.1 补修：缓存 LRU 缺 delete 致高音质缓存过期重播 TypeError，T46/T47/T48 由空壳改为真行为验证）；v8.9 huibq 平台能力收窄 + 收尾修复（2026-11-06：实测 tx/mg/kg 必败，从三平台链尾移除仅留 kw/wy；source-audit.js 跑完自动退出；hyw 候选状态修正为已判否自动复检）；v8.8 竞速引擎改造（2026-11-06：全链分批错峰并发 + 跨档 12s 总预算 + 档位短路 + 冷启动预热 + gdWy 降批 + verified 精确等待；新增7配置键）；v8.7 huibq 假成功治理（2026-11-06：上游"无法获取播放链接！"仍返回 code=0 + 可播错链（实测 panspace 酷我 206）→ 按 msg 失败词判失败，避免静默播错歌）；v8.6 huibq 默认开启（2026-11-06：A 方案——全平台全音质实测可用，进 kw/wy/tx/mg/kg 链尾兜底 + 探针自动托管；v8.5 巡检工具与监控口径升级（2026-11-06：新增 scripts/source-audit.js 全源取链巡检工具 + docs/SOURCE_AUDIT.md 基线；probe.js 对取链型端点加真实取链+Range 可播二次校验（治理"端点✅但源410"假阳性，xcvts 由假✅转真❌）；huibq 探针补齐；真死域名排除清单更新）；v8.4 全源全接口深度巡检修复（2026-11-06：溯音酷我 128k br=7→9（实测唯一可播，flac/320k VIP 死链）；星海后端去自定义 X-Token 改匿名第三方调用（上游对无效 token 403"请使用官方版本"，匿名放行）；全源实测 15→21/35 可用）；v8.3 ikun默认开启（2026-11-06：A 方案——公益版免卡密，默认进 kw 链尾兜底 + 每3轮探测自动托管；探测失败2次自动关、恢复自动开自愈闭环）；v8.2 ikun探针接入（2026-11-06：默认关闭源补齐健康探针——用户手动开启后自动监控健康；POST /music/url 固定歌 rid=228908 + code200/url非空 + Range可播二次校验，tier=secondary 每3轮一探避免公益版频控）；v8.1 ikun源复活（2026-11-06：域名 api.ikunshare.com→c.wwwweb.top，接口 GET /url→POST /music/url，公益版免卡密，实测 rid=228908 晴天出真实128k链）；v8.0 全量审计修复版（2026-11-05 版本重新整理：原 v11.11~v29.9 共53个小版本合并为8个大版本，旧版本详细历史归档见 docs/ARCHIVE_OLD_TAGS.md）
 * @author 豆包定制
 * @contribution 基线同v11.11(2026-10-15实测)；v11.12为代码加固(防错歌/https/熔断分类/探测一致性/清理)；v11.13(2026-10-28)：D11日志防御——vm无console沙箱验证通过(修复前加载抛TypeError复现)，真机装包待验证；v12.0(2026-10-28)：星海后端kw高音质——E10实测(128k/320k/flac/flac24bit四档code200、URL均Range 206、魔数正确、码率吻合、ID3歌名对应songmid)，解除仅128k限制并接入kw链双源，URL http→https升级(实测https 206可播)；v12.1-v13.4(2026-10-28)：失败缓存差异化+探测收敛+决策日志+updateAlert+自动化测试CI+端点巡检+音质表收敛+配置化，走验证链L0-L1(L2按需)
 */
// ============================================================
// 第〇部分：用户配置区（v2.0 配置化 — 开配置即用，默认不暴露）
// 需配置源（ikun 卡密 / 聆川密钥）从这里读取：
//   方式一：直接改下方 USER_CONFIG 常量（改源码即生效）；
//   方式二：宿主全局注入 globalThis.__lxSourceConfig = { ikunApiKey, lingchuanApiKey }（fork App 可做，不改源码）。
// 星海令牌默认自动生成（device_id 随机）；如需固定可在此配置 xinghaiDeviceId。
// ============================================================
const USER_CONFIG = {
  ikunApiKey: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.ikunApiKey) || "", // 填入 ikun 卡密后开启
  lingchuanApiKey: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.lingchuanApiKey) || "",
  xinghaiDeviceId: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.xinghaiDeviceId) || "",
  // v5.0：运行参数全量可配置（从 __lxSourceConfig 读取，缺省用代码默认值，行为与历史一致）
  cacheTtlMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.cacheTtlMs) || 21600000,          // 成功缓存 TTL(6h，低音质用)
  cacheTtlHighQualityMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.cacheTtlHighQualityMs) || 1800000, // v8.10：高音质缓存 TTL(30min，flac/320k/24bit 用)
  failCacheNotFoundMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.failCacheNotFoundMs) || 3600000,  // 失败缓存 404→1h
  failCacheExpiredMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.failCacheExpiredMs) || 60000,      // 失败缓存 410→1min
  breakerThreshold: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.breakerThreshold) || 3,       // 熔断阈值
  breakerCooldownMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.breakerCooldownMs) || 180000, // 熔断冷却
  rateLimitBackoffMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.rateLimitBackoffMs) || 30000, // 429退避
  maxConcurrency: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.maxConcurrency) || 2,            // 单源并发上限
  rateWindowMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.rateWindowMs) || 3000,             // 限速窗口
  rateWindowMax: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.rateWindowMax) || 5,              // 窗口内请求上限
  healthCheckIntervalMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.healthCheckIntervalMs) || 600000, // 探测间隔(10min)
  raceMatchWaitMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.raceMatchWaitMs) || 600,         // verified 等待窗口
  allFailShortTtlMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.allFailShortTtlMs) || 30000,      // v6.0：全链网络类失败短缓存 TTL(补齐 v6.0 漏配键)
  raceBudgetMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.raceBudgetMs) || 12000,          // v8.8：单次请求总预算(跨音质档共享)
  raceBudgetPerQuality: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.raceBudgetPerQuality) || { flac: 6000, "320k": 5000, "128k": 5000, flac24bit: 6000 }, // v8.10：分档预算（防高音质吃满总预算饿死低档）
  raceBudgetFloorMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.raceBudgetFloorMs != null) ? globalThis.__lxSourceConfig.raceBudgetFloorMs : 3000,     // v8.10：最后一档保底预算(防整次取链失败)
  raceBatchSize: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.raceBatchSize) || 3,             // v8.8：每批并发源数
  raceBatchStaggerMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.raceBatchStaggerMs) || 300, // v8.8：批间错峰
  coldStartTimeoutMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.coldStartTimeoutMs) || 8000, // v8.8：冷启动源单源超时
  coldStartProbeTimeoutMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.coldStartProbeTimeoutMs) || 30000, // v8.10：冷启动源探针超时（onrender 冷态 30s，8s 必误判）
  coldStartWarmTtlMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.coldStartWarmTtlMs) || 300000, // v8.8：冷启动预热间隔
  qualityShortCircuit: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig) ? globalThis.__lxSourceConfig.qualityShortCircuit : undefined, // v8.8：档位短路开关(缺省 true)
  coldStartWarmEnabled: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig) ? globalThis.__lxSourceConfig.coldStartWarmEnabled : undefined, // v8.8：冷启动预热开关(缺省 true)
  qualityShortCircuitSamples: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.qualityShortCircuitSamples) || 3, // v8.8：档位短路样本门槛
  qualityShortCircuitProbeMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.qualityShortCircuitProbeMs) || 3600000, // v8.10：短路放行探路间隔(1h，原 6h 太长)
  playDeadReviveMs: (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.playDeadReviveMs) || 300000        // v7.0：播放摘除后半开试探冷却期(5min)
};
// v5.0：运行参数读取（USER_CONFIG 缺失/空值时回退默认）
function cfg(key, def) {
  const v = USER_CONFIG[key];
  return v === undefined || v === null || v === "" ? def : v;
}

// ============================================================
// 第一部分：常量配置
// ============================================================
const CACHE_TTL_MS = 21600000;          // 6小时 成功缓存
const FAIL_CACHE_TTL_MS = 300000;       // 5分钟 失败缓存（v1.0 起按失败类型差异化：见 getFailCached）
const CACHE_MAX_SIZE = 500;
const FAIL_CACHE_MAX_SIZE = 300;
const HTTP_URL_REGEX = /^https?:\/\//i;
const BREAKER_THRESHOLD = 3;            // 连续失败熔断阈值
const BREAKER_COOLDOWN_MS = 180000;
const RATE_LIMIT_BACKOFF_MS = 30000;   // v4.0：429 限流短退避(30s)，不触发熔断
const RATE_LIMIT_TRIP = 3;            // v4.0：连续限流≥3 次标记"被限"状态
const SOURCE_MAX_CONCURRENCY = 2;    // v4.0：单源最大并发数（超限本轮跳过，防上游过载/风控）
const RATE_WINDOW_MS = 3000;         // v4.0：滑动窗口限速窗口(3s)
const RATE_WINDOW_MAX = 5;           // v4.0：窗口内最大请求数（超限本轮跳过）     // 熔断冷却 3分钟
const RETRY_TIMES = 1;                  // 网络错误重试次数(v1.0:2→1，避免重试放大)
const RACE_OVERALL_TIMEOUT_MS = 6000;   // fallbackRace 整体超时(v1.0新增)
const RACE_MATCH_WAIT_MS = 600;         // v3.0：未校验源首个成功后的等待窗口——给已验证源(内部做songInfoMatch)机会，防"快但错歌"抢答

const ERROR_CODES = {
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PARAM_ERROR: 'PARAM_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  MISMATCH: 'SONG_MISMATCH',
  CONFIG_ERROR: 'CONFIG_ERROR',
  LINK_EXPIRED: 'LINK_EXPIRED'   // v1.0：HTTP 410 签名/直链过期
};

// v1.0：失败缓存差异化 TTL（404=歌确实不存在，缓存1h；410=签名死链，很快恢复，缓存1min；网络类/限流=瞬时，不缓存）
const FAIL_CACHE_TTL_BY_CODE = {
  [ERROR_CODES.NOT_FOUND]: 60 * 60 * 1000,        // 404/无版权/搜索无结果 → 1小时
  [ERROR_CODES.MISMATCH]: 60 * 60 * 1000,          // 歌信息不匹配(近1h内重查意义低) → 1小时
  [ERROR_CODES.LINK_EXPIRED]: 60 * 1000,           // 410 签名死链 → 1分钟
  [ERROR_CODES.RATE_LIMIT]: 0,                     // 限流 → 不缓存(会恢复)
  [ERROR_CODES.NETWORK_TIMEOUT]: 0,                // 超时 → 不缓存(瞬时)
  [ERROR_CODES.NETWORK_ERROR]: 0,                  // 网络错误 → 不缓存(瞬时)
  [ERROR_CODES.SERVER_ERROR]: 0,                   // 5xx → 不缓存(服务端会恢复)
};

const TIMEOUT_CONFIG = { search: 3000, parse: 5000, default: 5000 }; // v1.0: parse 8000→5000

// API 端点
// GD Studio（实测：仅网易云 netease，br=999→真实flac/br=320→320k/br=128→128k；免费公共服务，5分钟50次限制，仅用于wy高音质链，不进128k兜底竞速）
const GD_API = "https://music-api.gdstudio.xyz/api.php?use_xbridge3=true&loader_name=forest&need_sec_link=1&sec_link_scene=im&theme=light";
const XINGHAI_BACKUP_API = "https://music-dl.sayqz.com/api/"; // 实测：域名不可解析，已失效（保留常量便于恢复）
// 溯音系（实测：仅 Kuwo 可用；QQ -403维护中；163 免费歌恢复可用；咪咕 502 IP限制）
const SUYIN_QQ_API = "https://oiapi.net/api/QQ_Music";
const SUYIN_QQ_KEY = "oiapi-ef6133b7-ac2f-dc7d-878c-d3e207a82575";
const SUYIN_163_API = "https://oiapi.net/api/Music_163";
const SUYIN_KUWO_API = "https://oiapi.net/api/Kuwo";
const SUYIN_MIGU_API = "https://api.xcvts.cn/api/music/migu";
// Huibq：实测仅酷我真实可用，其他平台假兜底，默认关闭
const HUIBQ_API = "https://lxmusicapi.onrender.com";
const JUHE_API = "https://api.music.lerd.dpdns.org";  // v4.0：Juhe聚合API(CF)——kw 全链路实测可用(2026-10-28 E21：POST /kw→303重定向→mobi.kuwo.cn签名→kw-er.kuwo.cn直链)
const HUIBQ_REQUEST_KEY = "share-v3";
// 聆川（未配置，默认关闭；2026-11-06 实测域名不可解析已死，保留常量便于恢复，probe 已排除该域名）
const LINGCHUAN_API = "https://api.lingchuan.com/v1";
// 星海后端主域聚合（v1.0重新接入kw；v1.0起支持 kw 128k/320k/flac 三档，E10实测四档code200+206可播+ID3对应；wy 签名URL本机403疑绑定后端出口IP，未接入wy）
const XINGHAI_BACKEND_API = "https://yy.zddyr.top/lx/api/";
// 网易云官方 outer 直连（免费歌302→真实mp3；VIP/无版权歌404自动跳过；固定128k）
const WY_OUTER_API = "https://music.163.com/song/media/outer/url?id={id}.mp3";
// v3.0：歌词/封面接口（实测：网易云公开 lyric/detail 接口可用；酷我仅封面 hts_MVPIC 可用，歌词无稳定接口）
const WY_LYRIC_API = "https://music.163.com/api/song/lyric";
const WY_DETAIL_API = "https://music.163.com/api/song/detail";
// 酷我官方直连（自研：搜索r.s→rid→convert_url，固定128k真实mp3，无第三方）
const KUWO_SEARCH_API = "http://search.kuwo.cn/r.s";
const KUWO_CONVERT_API = "http://antiserver.kuwo.cn/anti.s";
// ikun 服务器源（v8.1：域名迁移 api.ikunshare.com→c.wwwweb.top；公益版免卡密（X-Api-Key 留空），付费版填 USER_CONFIG.ikunApiKey；2026-11-06 实测 rid=228908 晴天出真实128k链）
const IKUN_API = "https://c.wwwweb.top";

// 长青SVIP（实测：IP白名单/无链接/需付费level，已失效，默认关闭）
const CHANGQING_URL_TEMPLATES = {
  tx: "http://175.27.166.236/kgqq/qq.php?type=mp3&id={id}&level={level}",
  wy: "http://175.27.166.236/wy/wy.php?type=mp3&id={id}&level={level}",
  kw: "https://musicapi.haitangw.net/music/kw.php?type=mp3&id={id}&level={level}",
  kg: "https://music.haitangw.cc/kgqq/kg.php?type=mp3&id={id}&level={level}",
  mg: "https://music.haitangw.cc/musicapi/mg.php?type=mp3&id={id}&level={level}"
};
// 念心SVIP（实测：全部404/空跳转，已失效，默认关闭）
const NIANXIN_URL_TEMPLATES = {
  tx: "https://music.nxinxz.com/kgqq/tx.php?id={id}&level={level}&type=mp3",
  wy: "http://music.nxinxz.com/wy.php?id={id}&level={level}&type=mp3",
  kw: "http://music.nxinxz.com/kw.php?id={id}&level={level}&type=mp3",
  kg: "https://music.nxinxz.com/kgqq/kg.php?id={id}&level={level}&type=mp3",
  mg: "http://music.nxinxz.com/mg.php?id={id}&level={level}&type=mp3"
};
// v7.0：helloworld 源（生态候选，2026-10-29 实证：kw 全链端到端可用——flac/320k 直链 Range206+魔数校验通过）
// 通道①：酷我官方 convert_url_with_sign（rid 直取，与 kuwoOfficial 同链路族但独立子源计数；flac24bit 被服务器降级 128k，按实际交付）
const HELLOWORLD_KW_CONVERT_API = "http://nmobi.kuwo.cn/mobi.s";
// 通道②：haitangw v1 新版 API（code:0 + data.url 直接匹配，实测可用；作为通道①的备用）
const HELLOWORLD_HTW_API = "https://musicserver.haitangw.cc/v1/music/resolve-url";

// ============================================================
// 第二部分：音源开关（按实测结果配置，可自行调整）
// ============================================================
const SOURCE_TOGGLES = {
  // ---- 默认开启（实测可用） ----
  suyinKuwo: true,      // 溯音酷我：全平台兜底(第三方，支持flac/320k/128k)
  wyOuter: true,        // 网易云官方outer直连：固定128k免费歌直链(实测可用)
  kuwoOfficial: true,   // 酷我官方直连：固定128k真实mp3(实测可用，无第三方)
  suyin163: true,       // 溯音163：免费歌真实128k直链，VIP歌url:null自动跳过
  gdWy: false,          // GD Studio：wy flac/320k高音质源(限5min50次，2026-11-08实测75%时间403配额用完，默认关闭省竞速预算，用户需要可手动开)
  xinghaiBackend: true, // 星海后端主域：kw 高音质双源(v1.0，与溯音酷我并列flac/320k) + 128k 兜底(与酷我官方并列)
  helloworldKw: true,   // v7.0：helloworld(kw) 生态候选——convert_url_with_sign 直链 128k/320k/flac 三档全端到端实证通过(2026-10-29)，默认开启参与 kw 链竞速
  // ---- 默认关闭（接口失效/需配置，可自行开启） ----
  xinghaiBackup: false, // 星海备：域名不可解析
  suyinQQ: false,       // 溯音QQ：2026-10-28实测仍-403(oiapi.net维护中)，保持关闭待上游恢复
  suyinMigu: false,     // 溯音咪咕：2026-10-28实测——上游api.xcvts.cn域名200可达(0.26s)但接口502"服务器IP可能被咪咕限制"，换备用域名不可行(IP级限制)，待上游恢复
  changqingVip: true,  // 长青：v1.0实测仅kw恢复(302→car-er.kuwo.cn新鲜mp3)，仅kw 128k兜底
  nianxinVip: true,    // 念心：v1.0实测仅kw恢复(302→car-er.kuwo.cn新鲜mp3)，仅kw 128k兜底
  huibq: true,          // v8.6：A 方案默认开启——2026-11-06 全源巡检实测 kw/wy/tx/mg/kg 全平台 flac/320k/128k 均出链可播，进全平台链尾兜底（onrender 免费实例冷启动慢，仅在前面源全失败时打到）
  juheKw: false, juheTx: false, juheWy: false, juheKg: false, juheMg: false, // v6.0(A1)：Juhe上游(api.music.lerd.dpdns.org)2026-10-28实测整体不可用(五平台超时/429)，默认关闭；上游恢复+探测连续通过自动复活(A2自愈)
  lingchuan: false,     // 聆川：需配置
  ikun: true            // v8.3 默认开启（A 方案）：公益版免卡密（c.wwwweb.top）、kw 链尾兜底；tier=secondary 每3轮一探（30分钟）；探测失败2次自动关、恢复自动开（自愈闭环）
};

// ============================================================
// 第二部分B：健康探测模块（v1.0：探测清单收敛为当前可用源 + 并发探测 + 统一跟随302）
// ============================================================
// 运行时开关：随探测结果自动变化；buildSourceChain 以它为准
const runtimeToggles = { ...SOURCE_TOGGLES };
// v4.0：用户手动关闭锁定——手动 toggle(false) 的源，探测通过也不再自动启用（除非用户手动开启）
const manualOff = {};

const HEALTH_CHECK_INTERVAL_MS = 10 * 60 * 1000; // 每10分钟一轮
const HEALTH_CHECK_INITIAL_DELAY_MS = 60 * 1000; // 加载后1分钟开始第一轮
const HEALTH_CHECK_TIMEOUT = 6000;                // 单次探测超时(v1.0:4000→6000，减少误摘)
const PROBE_PASS_REQUIRED = 2;                    // 连续通过2次才判定可用（防抖动）
const PROBE_FAIL_REQUIRED = 2;                    // 连续失败2次才判定失效（防抖动）
// v3.0：分级探测——核心源(播放主链路)每轮探测，次要源每3轮一探（省请求且减少对免费源的骚扰）
const PROBE_TIER_CORE_INTERVAL = 1;
const PROBE_TIER_SECONDARY_INTERVAL = 3;
// v3.0：失效源休眠——连续3轮失败进入休眠(不再每轮空打)，每10轮做一次复活试探（新端点/上游恢复时自动回归）
const PROBE_SLEEP_AFTER_DEAD = 3;
const PROBE_WAKE_EVERY_ROUND = 10;
// v1.0：探测歌曲池轮换（晴天/海阔天空/稻香），避免单曲被风控导致探测误判
const PROBE_SONG_POOL = ["晴天", "海阔天空", "稻香", "青花瓷", "七里香", "夜曲", "后来", "光年之外", "演员", "平凡之路", "成都", "小幸运"];
// v1.0 (D9)：溯音163 探测免费歌池（实测 code:0 + data[0].url 真实mp3；186016周杰伦VIP无url已排除）
const PROBE_163_IDS = ["2652820720", "347230"];

// v6.0 (A2)：Juhe 协议型探测配置工厂（POST /platform，校验服务端 code 200/303）
function juheProbeCfg(platform, ids) {
  return {
    tier: "secondary",  // 每3轮一探（免费 worker，减少对限流中上游的打扰）
    url: `${JUHE_API}/${platform}`,
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": getMobileUserAgent() },
    body: JSON.stringify({
      type: "128k",
      musicInfo: { name: "晴天", singer: "周杰伦", album: "叶惠美", duration: 271000, interval: 271, source: platform, ...ids, quality: "128k" }
    }),
    check: b => !!b && typeof b === "object" && (Number(b.code) === 200 || Number(b.code) === 303)
  };
}

// 各源探测请求定义：仅保留当前可用源，失效源不再每轮空打
function buildProbeConfig() {
  const probeSong = PROBE_SONG_POOL[(globalThis.__probeRound || 0) % PROBE_SONG_POOL.length];
  const cfg = {
    gdWy: {
      tier: "core",
      // v1.0 (D9)：补 Range 可播性二次校验（防"网关200+签名过期410"假存活）。
      // v8.10.5：探测素材修正。原先写死 186016，而那是「周杰伦 VIP 无 url」——仓库早已把它从探测池排除，
      // 继续拿它探测会让本端点无论好坏都取不到链接、被恒定判死（2026-11-08 实测确认）。
      // 改用 2652820720（scripts/probe.js 实测 payload:true、真取到 mp3 链）。
      // 注意：**不能**把 PROBE_163_IDS 整体搬来轮换，该池另一首 347230 未在本端点验证过，轮换会制造假故障；
      // 各端点的探测素材须各自实测通过后才可用。
      url: `${GD_API}&types=url&source=netease&id=2652820720&br=320`,
      check: b => !!b && typeof b === "object" && typeof b.url === "string" && b.url.length > 0,
      extractUrl: b => (b && typeof b === "object" && typeof b.url === "string" && b.url.length > 0) ? b.url : null
    },
    xinghaiBackend: {
      tier: "core",
      // v8.10.5 复核结论：此处写死「晴天/周杰伦」是**刻意的**，不是缺陷——
      // 该接口按「歌名+歌手」联合检索，写死热门曲目可保证稳定命中；若换成轮换歌名但歌手对不上会直接搜不到，反而制造误判。
      url: `${XINGHAI_BACKEND_API}?source=kw&name=${encodeURIComponent("晴天")}&singer=${encodeURIComponent("周杰伦")}&songmid=1&interval=&albumName=&quality=128k`,
      headers: { "X-Client": "lx-aggregate/11.7" }, // v8.4：去 X-Token（无效 token 会被上游 403，匿名第三方调用放行）
      check: b => !!b && typeof b === "object" && Number(b.code) === 200 && typeof b.url === "string" && b.url.length > 0
    },
    suyin163: {
      tier: "core",
      // v1.0 (D9)：免费歌池轮换 + Range 可播性二次校验（与溯音酷我探测标准一致）
      url: `${SUYIN_163_API}?id=${PROBE_163_IDS[(globalThis.__probeRound || 0) % PROBE_163_IDS.length]}`,
      check: b => !!b && typeof b === "object" && Array.isArray(b.data) && typeof (b.data[0] || {}).url === "string" && b.data[0].url.length > 0,
      extractUrl: b => (b && Array.isArray(b.data) && typeof (b.data[0] || {}).url === "string" && b.data[0].url.length > 0) ? b.data[0].url : null
    },
    suyinKuwo: {
      tier: "core",
      // v1.0 P0：双音质分域探测(flac br=1 + 128k br=7)，任一可播即算源存活；
      // 修复"128k仍410死链但flac已恢复新签名"时单路探测误判整体失效、误摘高音质源
      // v1.0：探测歌曲走 PROBE_SONG_POOL 轮换，防单曲被风控误判
      probes: [
        {
          url: `${SUYIN_KUWO_API}?msg=${encodeURIComponent(probeSong)}&n=1&br=1`,
          check: b => !!b && typeof b === "object" && (!!(b.data && b.data.url) || /音乐链接/.test(String(b.message || ""))),
          extractUrl: b => ((b && b.data && b.data.url) ? b.data.url : (String((b && b.message) || "").match(/音乐链接[：:](\S+)/) || [])[1]) || null
        },
        {
          url: `${SUYIN_KUWO_API}?msg=${encodeURIComponent(probeSong)}&n=1&br=9`,
          check: b => !!b && typeof b === "object" && (!!(b.data && b.data.url) || /音乐链接/.test(String(b.message || ""))),
          extractUrl: b => ((b && b.data && b.data.url) ? b.data.url : (String((b && b.message) || "").match(/音乐链接[：:](\S+)/) || [])[1]) || null
        }
      ]
    },
    wyOuter: {
      tier: "core",
      // v8.10.5：保留写死 2652820720 —— 2026-11-08 实测该 id 走 outer 接口返回 200/audio/mpeg/4.4MB 真可播；
      // 而池内 347230 走同一接口返回 200 **但 content-type 是 text/html**（不可播），
      // 若随池轮换会每两轮误报一次「源不可用」。故本端点探测素材固定为此 id，不参与轮换。
      url: WY_OUTER_API.replace("{id}", "2652820720"),
      headers: { "User-Agent": getMobileUserAgent() },
      checkRes: res => res.statusCode === 200 && /audio|octet|mpeg/i.test(String(res.headers?.["content-type"] || ""))
    },
    kuwoOfficial: {
      tier: "secondary",
      url: `${KUWO_SEARCH_API}?client=kt&all=${encodeURIComponent("晴天 周杰伦")}&pn=0&rn=1&ft=music&rformat=json&encoding=utf8`,
      headers: { "User-Agent": getMobileUserAgent() },
      check: b => {
        const raw = typeof b === "string" ? b : String(b || "");
        return raw.includes("MP3RID") && raw.includes("abslist");
      }
    },
    // v7.0：helloworld(kw) 探测——convert_url_with_sign 2000kflac 固定歌(rid=228908 晴天)，code=200+url 非空判定
    helloworldKw: {
      tier: "secondary",
      url: `${HELLOWORLD_KW_CONVERT_API}?f=web&user=0&source=kwplayerhd_ar_1.1.4.5_tianbao_T1A_qirui.apk&type=convert_url_with_sign&rid=228908&br=2000kflac`,
      headers: { "User-Agent": getMobileUserAgent() },
      check: b => !!b && typeof b === "object" && Number(b.code) === 200 && !!b.data && typeof b.data.url === "string" && b.data.url.length > 0
    },
    // v1.0：长青kw/念心kw 302→car-er.kuwo.cn新鲜mp3，Range校验可播(用rid=228908 晴天周杰伦)
    changqingVip: {
      tier: "secondary",
      url: CHANGQING_URL_TEMPLATES.kw.replace("{id}", "228908").replace("{level}", "standard"),
      headers: { "User-Agent": getMobileUserAgent(), "Range": "bytes=0-1023" },
      checkRes: res => (res.statusCode === 200 || res.statusCode === 206) && /audio|octet|mpeg/i.test(String(res.headers?.["content-type"] || "")) && !/kw\.php/.test(String(res.url || ""))
    },
    nianxinVip: {
      tier: "secondary",
      url: NIANXIN_URL_TEMPLATES.kw.replace("{id}", "228908").replace("{level}", "standard"),
      headers: { "User-Agent": getMobileUserAgent(), "Range": "bytes=0-1023" },
      checkRes: res => (res.statusCode === 200 || res.statusCode === 206) && /audio|octet|mpeg/i.test(String(res.headers?.["content-type"] || "")) && !/nxinxz\.com/.test(String(res.url || ""))
    },
    // v6.0 (A2)：Juhe 聚合源族协议型探测——Juhe 为 POST 协议型源(需歌曲ID)，
    // 探测固定歌"服务端能否完整响应 code 200(直链)/303(重定向)"；上游整体不可用时
    // (超时/429)探测失败 → 触发自动关闭+休眠；上游恢复 → 连续通过 → 自动复活(自愈闭环)
    juheKw: juheProbeCfg("kw", { songmid: "228908", id: "228908" }),
    juheTx: juheProbeCfg("tx", { songmid: "228908", id: "228908" }),
    juheWy: juheProbeCfg("wy", { id: "2652820720", songmid: "2652820720" }),
    juheKg: juheProbeCfg("kg", { hash: "228908", songmid: "228908", id: "228908" }),
    juheMg: juheProbeCfg("mg", { songmid: "228908", id: "228908" }),
    // v8.2：ikun 探针——默认关闭源补齐健康探针（用户手动开启后进探测清单自动监控健康；
    // 关闭状态被 buildProbeConfig 过滤不白探）。POST /music/url 固定歌 kw 128k（rid=228908 晴天），
    // code=200 + url 非空 + Range 可播二次校验；tier=secondary 每3轮一探，降低公益版接口频控压力。
    // 注意：探测连续失败2次会自动关闭（默认关闭源关闭后不再探测，恢复需用户再次手动开启——避免永久白探公益接口）
    ikun: {
      tier: "secondary",
      url: `${IKUN_API}/music/url`,
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": getMobileUserAgent(), "X-Api-Key": USER_CONFIG.ikunApiKey || "" },
      body: JSON.stringify({ source: "kw", musicId: "228908", quality: "128k" }),
      check: b => !!b && typeof b === "object" && Number(b.code) === 200 && typeof b.url === "string" && b.url.length > 0,
      extractUrl: b => (b && typeof b === "object" && typeof b.url === "string" && b.url.length > 0) ? upgradeToHttps(b.url) : null
    },
    // v8.5：huibq 探针（v8.6 起源已默认开启，探针自动托管健康；2026-11-06 全源巡检实测 kw/wy/tx/mg/kg 全平台全音质出链可播）。GET /url/kw/固定歌(rid=228908) + code=0 + url 非空 + Range 可播；tier=secondary 每3轮一探。
    huibq: {
      tier: "secondary",
      url: `${HUIBQ_API}/url/kw/228908/128k`,
      headers: { "X-Request-Key": HUIBQ_REQUEST_KEY, "User-Agent": getMobileUserAgent() },
      // v8.10.3：探针补 msg 失败词判据（与取链路径同一单点 isHuibqFailMsg），
      // 否则上游 code=0 +「无法获取播放链接」+ 可播错链时探针仍判"健康"
      check: b => !!b && typeof b === "object" && Number(b.code) === 0 && typeof b.url === "string" && b.url.length > 0 && !isHuibqFailMsg(b.msg),
      extractUrl: b => (b && typeof b === "object" && typeof b.url === "string" && b.url.length > 0) ? b.url : null
    }
  };
  // v3.0：休眠源过滤——连续 PROBE_SLEEP_AFTER_DEAD 轮失败后不再每轮空打；
  // 每 PROBE_WAKE_EVERY_ROUND 轮做一次复活试探（上游恢复/新端点时自动回归）
  const round = globalThis.__probeRound || 0;
  // v6.0：探测清单过滤——(1) 用户手动关闭(manualOff)的源不探测：用户已明确不想用，白耗外呼还会把源标成"休眠"污染面板语义；
  // (2) 默认关闭(SOURCE_TOGGLES=false)且未被手动开启的源不探测：juhe 五源等默认关，探测失败进 sleeping 会让面板显示"休眠"而非"已关"。
  // 注意：自动关闭的源(SOURCE_TOGGLES=true 被探测失败关掉)保留探测——这是自愈复活闭环的前提
  for (const id of Object.keys(cfg)) {
    if (manualOff[id]) { delete cfg[id]; continue; }
    if (SOURCE_TOGGLES[id] === false && runtimeToggles[id] !== true) { delete cfg[id]; continue; }
    if (probeState.sleeping[id]) {
      const since = probeState.sleepRound[id] || 0;
      if (round - since < PROBE_WAKE_EVERY_ROUND) {
        delete cfg[id]; // 休眠中且未到复活轮：跳过本轮探测
      } else {
        logWarn(`健康探测: [${id}] 到达复活试探轮，重探`);
      }
    }
  }
  return cfg;
}

// v3.0：分级探测轮次判定（core 每轮 / secondary 每 N 轮一探）
function tierShouldProbe(round, tier, sourceId) {
  const interval = tier === "secondary" ? PROBE_TIER_SECONDARY_INTERVAL : PROBE_TIER_CORE_INTERVAL;
  if (round % interval !== 0) return false;
  // v4.0/v6.0：探测频率自适应——连续通过≥5轮的源降频为每2轮一探（健康源无需高频验证，省上游外呼）
  // v6.0 修复：改用 passStreak（连续通过轮数）判定——旧实现用 passCount，但 passCount 到 2 即清零，降频从未生效
  if (sourceId && (probeState.passStreak[sourceId] || 0) >= 5 && round % 2 !== 0) return false;
  return true;
}

const probeState = {
  passCount: {},
  // v6.0：连续通过轮数（不清零的长期连胜，用于探测降频；passCount 到 PROBE_PASS_REQUIRED 会清零，无法承载降频判断）
  passStreak: {},
  failCount: {},
  // v3.0：失效休眠状态——deadCount 连续失败累计；sleeping=true 进入休眠；sleepRound 记录休眠起点轮
  deadCount: {},
  sleeping: {},
  sleepRound: {},
  running: false
};

async function probeSingleSource(id, pc) {
  // v8.10.3：形参从 cfg 改名 pc —— 旧名遮蔽了全局配置读取函数 cfg(key, def)，
  // 而下面冷启动分支要调 cfg('coldStartProbeTimeoutMs')，直接 TypeError 被 catch 吞成"探测失败"。
  // 全仓唯一 coldStart 源是 huibq → 它的探针 100% 失败（实测：正常响应也不发请求、score 恒为负）。
  // v1.0 P0：支持多路探测(probes)，任一路"结构+可播"通过即算源存活；
  // 解决溯音酷我"flac已恢复但128k仍410"时，单路(仅128k)探测误判整体失效、误摘高音质源的问题
  const probes = pc.probes || [{
    url: pc.url,
    // v8.2 修复：method/body 漏透传——juheProbeCfg(juhe 五源)与 ikun 探针都是 POST 协议型源，
    // 旧实现只透传 url/headers/check，实际发出 GET → 上游 404/405 误判失败（juhe 探测长期"失败"的隐藏原因之一）
    method: pc.method,
    body: pc.body,
    headers: pc.headers,
    check: pc.check,
    checkRes: pc.checkRes,
    extractUrl: pc.extractUrl
  }];
  try {
    const results = await Promise.all(probes.map(async p => {
      const startProbe = Date.now();
      try {
        // v8.10：冷启动源探针超时放宽（onrender 冷态 30s，6s 必误判）
        const h = SOURCE_HANDLERS[id];
        const probeTimeout = (h && h.coldStart) ? cfg('coldStartProbeTimeoutMs', 30000) : HEALTH_CHECK_TIMEOUT;
        const res = await httpRequest(p.url || "", {
          method: p.method || "GET",
          headers: { "User-Agent": getMobileUserAgent(), ...(p.headers || {}) },
          body: p.body,
          timeout: probeTimeout,
          follow_max: 5   // v1.0 P0：统一跟随302，修复wyOuter(outer 302→mp3)被误判失败
        });
        let usable = p.checkRes ? p.checkRes(res) : (p.check ? p.check(res.body) : true);
        // v1.0 P0：结构/状态通过后，对解析出的音频URL做Range可播性二次校验，
        // 识破"网关200、结构完整、但CDN签名已过期410死链"的假存活(如溯音酷我)
        if (usable && typeof p.extractUrl === "function") {
          const audioUrl = p.extractUrl(res.body);
          usable = audioUrl ? await isAudioPlayable(audioUrl, probeTimeout) : false; // v8.10：冷启动源可播校验同放宽
        }
        return { usable, duration: Date.now() - startProbe };
      } catch (e) {
        return { usable: false, duration: Date.now() - startProbe };
      }
    }));
    const usable = results.some(r => r.usable);
    // v1.0：探测结果并入竞速统计（成功率/均时供 sortChainByHealth 排序复用；
    // 只更新统计、不触发熔断——熔断仅由真实播放请求触发，避免探测与熔断双机制打架）
    recordProbeResult(id, usable, results.reduce((s, r) => s + r.duration, 0) / Math.max(results.length, 1));
    return { usable, raw: null };
  } catch (e) {
    recordProbeResult(id, false, 0);
    return { usable: false, raw: null };
  }
}

// v1.0：探测结果并入竞速统计（见 probeSingleSource）
// v3.0：探测样本独立计数（probe*），与真实请求样本分级加权——探测仅作低权重参考，真实请求主导健康评分
function recordProbeResult(id, usable, avgDuration) {
  const b = getBreaker(id);
  b.probeRequests = (b.probeRequests || 0) + 1;
  if (usable) {
    b.probeSuccess = (b.probeSuccess || 0) + 1;
    b.probeTime = (b.probeTime || 0) + (avgDuration || 0);
  }
}

function applyProbeResult(id, usable) {
  if (usable) {
    // v8.10.3：探测通过 → 一并复位断路器与限流退避。旧实现只清 sleeping/playDead/passCount，
    // 面板会出现"探针正常 + 熔断中"的矛盾态；更关键的是 half-open 卡死（F-01）只能靠重启救回。
    const br = getBreaker(id);
    if (br.state !== "closed" || br.failureCount > 0 || br.rateLimited) {
      br.state = "closed"; br.failureCount = 0; br.lastFailureTime = 0;
      br.rateLimitUntil = 0; br.rateLimited = false; br.rateLimitCount = 0;
      logInfo(`健康探测: [${id}] 探测通过，断路器与限流退避已复位`);
    }
    probeState.failCount[id] = 0;
    probeState.passCount[id] = (probeState.passCount[id] || 0) + 1;
    probeState.passStreak[id] = (probeState.passStreak[id] || 0) + 1; // v6.0：连胜累计（降频判断用）
    // v7.0：探测通过 → 播放摘除解除（源恢复即回归竞速链）
    if ((playDeadStreak.get(id) || 0) > 0) { playDeadStreak.set(id, 0); playDeadDeadline.delete(id); }
    // v3.0：探测通过即复活（清休眠），避免复活试探成功后被下一次抖动打回休眠
    delete probeState.deadCount[id];
    delete probeState.sleeping[id];
    delete probeState.sleepRound[id];
    if (probeState.passCount[id] >= PROBE_PASS_REQUIRED) {
      const wasOff = runtimeToggles[id] === false;
      if (wasOff && !manualOff[id]) { // v4.0：手动关闭锁定的源不自动复活
        runtimeToggles[id] = true;
        logInfo(`健康探测: [${id}] 连续${PROBE_PASS_REQUIRED}次探测通过，已自动启用`);
      }
      probeState.passCount[id] = 0; // 重置，避免反复打日志
    }
  } else {
    probeState.passCount[id] = 0;
    probeState.passStreak[id] = 0; // v6.0：连胜中断
    probeState.failCount[id] = (probeState.failCount[id] || 0) + 1;
    if (probeState.failCount[id] >= PROBE_FAIL_REQUIRED) {
      const wasOn = runtimeToggles[id] === true;
      // v8.10：冷启动源豁免自动关闭——onrender 冷态 30s，两轮探测失败可能是冷态未唤醒，不是真死
      const h = SOURCE_HANDLERS[id];
      const isColdStart = h && h.coldStart;
      if (wasOn && !isColdStart) {
        runtimeToggles[id] = false;
        logWarn(`健康探测: [${id}] 连续${PROBE_FAIL_REQUIRED}次探测失败，已自动关闭(恢复后会自动启用)`);
      } else if (wasOn && isColdStart) {
        logWarn(`健康探测: [${id}] 连续${PROBE_FAIL_REQUIRED}次探测失败，冷启动豁免自动关闭（冷态可能未唤醒，保留启用）`);
      }
      probeState.failCount[id] = 0;
    }
    // v3.0：连续失败累计 → 休眠（不再每轮空打无效请求）
    probeState.deadCount[id] = (probeState.deadCount[id] || 0) + 1;
    if (probeState.deadCount[id] >= PROBE_SLEEP_AFTER_DEAD) {
      if (!probeState.sleeping[id]) {
        probeState.sleeping[id] = true;
        probeState.sleepRound[id] = globalThis.__probeRound || 0;
        logWarn(`健康探测: [${id}] 连续${PROBE_SLEEP_AFTER_DEAD}轮失败，进入休眠(每${PROBE_WAKE_EVERY_ROUND}轮复活试探一次)`);
      } else {
        // v6.0：休眠中复活试探失败 → 重置休眠起点轮。
        // 旧实现不更新 sleepRound，round-since 恒≥10 → 复活轮失败后每轮都重探（失去休眠意义、白耗外呼）
        probeState.sleepRound[id] = globalThis.__probeRound || 0;
      }
    }
  }
}

// v8.0：健康历史趋势记录（每次自动探测完成后存一条）；v8.10：上限 60→144（10min/条 ≈ 24h）
const healthHistory = [];
const HEALTH_HISTORY_MAX = 144; // v8.10：历史快照上限（60→144，10min/条 ≈ 24h，原 10h 跨天就断）

async function runHealthCheck(saveHistory = true) {
  if (probeState.running) return;
  probeState.running = true;
  try {  // v6.0：try/finally——构建配置等任何异常都不会把 running 锁死（否则探测链永久停摆）
  // v1.0：轮次先递增再构建配置，确保探测歌曲池轮换从首轮生效
  const round = (globalThis.__probeRound = (globalThis.__probeRound || 0) + 1);
  const probeConfig = buildProbeConfig();
  // v3.0：分级探测——核心源每轮，次要源每 PROBE_TIER_SECONDARY_INTERVAL 轮一探
  const ids = Object.keys(probeConfig).filter(id => tierShouldProbe(round, probeConfig[id].tier || "core", id));
  logInfo(`健康探测: 开始第${round}轮，共${ids.length}个源(核心每轮/次要${PROBE_TIER_SECONDARY_INTERVAL}轮一探)`);
  // v1.0 P2：改并发探测，一轮从~50s降到~6s
  await Promise.all(ids.map(async id => {
    const result = await probeSingleSource(id, probeConfig[id]);
    applyProbeResult(id, result.usable);
  }));
  const active = Object.keys(runtimeToggles).filter(k => runtimeToggles[k]);
  logInfo(`健康探测: 本轮完成，当前自动启用: ${active.join(", ")}`);
  // v8.0：记录历史快照（用于趋势图）——v30.1：手动探测不存历史，避免污染趋势
  if (saveHistory) {
    const snap = getHealthSnapshot();
    const historyEntry = {
      timestamp: Date.now(),
      sources: {}
    };
    for (const [id, item] of Object.entries(snap)) {
      if (id.startsWith('_')) continue; // 跳过平台聚合等特殊字段
      // v30.1：只存趋势图需要的字段（score + successRate），去掉多余的 name/enabled
      historyEntry.sources[id] = {
        score: item.healthScore,
        successRate: item.successRate
      };
    }
    healthHistory.push(historyEntry);
    if (healthHistory.length > HEALTH_HISTORY_MAX) healthHistory.shift();
  }
  } catch (e) {
    logWarn(`健康探测异常: ${e && e.message ? e.message : String(e)}`);
  } finally {
    probeState.running = false; // v6.0：异常也释放探测锁
  }
}

function startHealthCheck() {
  setTimeout(async () => {
    try { await runHealthCheck(); } catch (e) { logWarn(`健康探测异常: ${e.message}`); }
    setTimeout(function tick() {
      const iv = cfg('healthCheckIntervalMs', HEALTH_CHECK_INTERVAL_MS);
      runHealthCheck().then(() => {
        setTimeout(tick, iv);
      }).catch(() => {
        setTimeout(tick, iv);
      });
    }, cfg('healthCheckIntervalMs', HEALTH_CHECK_INTERVAL_MS));
  }, HEALTH_CHECK_INITIAL_DELAY_MS);
}

const Q = ["128k", "320k", "flac", "flac24bit"];
const PLATFORM_QUALITIES = { wy: Q, tx: Q, kw: Q, kg: Q, mg: Q };
// v1.0 P0-6：上报 qualitys 按真实能力裁剪——不再上报无人能交付的 flac24bit
const REPORT_QUALITIES = {
  wy: ["128k", "320k", "flac"],   // outer/suyin163=128k；GD Studio=flac；suyinKuwo=flac兜底
  tx: ["128k", "320k", "flac"],   // 仅 suyinKuwo 搜索酷我兜底
  kw: ["128k", "320k", "flac"],   // kuwoOfficial/xinghaiBackend=128k；suyinKuwo=flac
  kg: ["128k", "320k", "flac"],   // 仅 suyinKuwo 搜索酷我兜底
  mg: ["128k", "320k", "flac"]    // 仅 suyinKuwo 搜索酷我兜底
};

const PLATFORM_TO_XINGHAI_BACKUP = { wy: "netease", tx: "qq", kw: "kuwo" };
// v2.0 (E11)：音质映射 magic number 收敛——统一 QUALITY_TO_X 表，按官方"源内映射"模型组织（请求音质 → 各源内部编码）
// 各子源只从本表取编码，禁止散落 magic number（gdBrMap 等已并入）
const QUALITY_TO_X = {
  // 通用 br 参考（星海 level 语义 / 长青念心 level）：flac24bit/hires 均 999
  br: { "128k": "128", "192k": "192", "320k": "320", flac: "740", flac24bit: "999", "24bit": "999" },
  // 溯音QQ：br 数值（hires=3/atmos=2/master=1/24bit=1 专用值直传）
  suyinQQ: { "128k": 7, "320k": 5, flac: 4, hires: 3, atmos: 2, master: 1, "24bit": 1 },
  // 酷我系（溯音酷我搜索 br 参数）：flac=1 / 320k=5 / 128k=7
  kuwo: { flac: 1, "320k": 5, "128k": 9, "24bit": 1 }, // v8.4 修正：128k br=7→9（实测 br=9 唯一可播 mp3，7/5/1 均 CDN410 死链；flac/320k 为 VIP 链 loginUid 空 410）
  // GD Studio：br 字符串（flac/hires 均走 999 真实 flac）
  gd: { "128k": "128", "192k": "320", "320k": "320", flac: "999", flac24bit: "999", hires: "999" }
};
// v1.0 P0-4：实际音质降级阶梯（去掉无源区分的192k短接），请求音质放首位再向下降级
const QUALITY_PRIORITY = ["flac24bit", "flac", "320k", "128k"];
// v1.0 P0-1：音质等级数值，用于源能力过滤与缓存音质校验
const QUALITY_RANK = { "128k": 1, "192k": 2, "320k": 3, flac: 4, flac24bit: 5, hires: 4, master: 5, atmos: 5, "24bit": 5 };
function qualityRank(q) { return QUALITY_RANK[String(q || "128k").toLowerCase()] || 1; }
const QUALITY_FIRST = true; // 音质优先模式：解析从请求音质(默认flac)开始逐级降级

const { EVENT_NAMES, request, on, send, utils, env, version } = globalThis.lx;

// ============================================================
// 第三部分：日志 + LRU双层缓存 + 断路器
// ============================================================
// v1.0 D11：console 宿主防御 — 官方移动版「可用宿主环境 API」仅 setTimeout/clearTimeout（无 console 保证）
// 依据：lxmusic.toside.cn/mobile/custom-source 宿主 API 清单 + fork user-api-preload.js 未注入 console + vm 无 console 沙箱复现（修复前加载即抛 TypeError）
const safeConsole = {
  log: (typeof console !== "undefined" && typeof console.log === "function") ? console.log.bind(console) : () => {},
  warn: (typeof console !== "undefined" && typeof console.warn === "function") ? console.warn.bind(console) : () => {},
  error: (typeof console !== "undefined" && typeof console.error === "function") ? console.error.bind(console) : () => {},
};
const LOG_ENABLED = (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.logEnabled !== undefined) ? !!globalThis.__lxSourceConfig.logEnabled : true;
// v1.0：debug 级源级决策日志（默认关；排查时改 LOG_DEBUG=true 或宿主注入 __lxSourceConfig.logDebug=true）
const LOG_DEBUG = (typeof globalThis !== "undefined" && globalThis.__lxSourceConfig && globalThis.__lxSourceConfig.logDebug) || false;
function logInfo(...args) { if (LOG_ENABLED) safeConsole.log("[聚合音源][信息]", ...args); }
function logWarn(...args) { if (LOG_ENABLED) safeConsole.warn("[聚合音源][警告]", ...args); }
function logDebug(...args) { if (LOG_ENABLED && LOG_DEBUG) safeConsole.log("[聚合音源][决策]", ...args); }

// v1.0：直接用原字符串作 Map 键（Map 支持字符串键），省掉32位哈希与碰撞覆盖
function createLRUCache(maxSize, ttl) {
  const map = new Map();
  return {
    get(key) {
      const entry = map.get(key);
      if (!entry) return null;
      if (Date.now() - entry.timestamp >= ttl) { map.delete(key); return null; }
      map.delete(key);
      map.set(key, entry);
      return entry.value;
    },
    // v8.10.1：补 delete——分级 TTL 过期时 getCachedUrl 需要主动删除条目（旧无此方法，高音质缓存超 30min 重播必 TypeError）
    delete(key) { map.delete(key); },
    set(key, value) {
      if (map.has(key)) map.delete(key);
      map.set(key, { value, timestamp: Date.now() });
      if (map.size > maxSize) {
        const firstKey = map.keys().next().value;
        if (firstKey !== undefined) map.delete(firstKey);
      }
    },
    hasExpired(key) {
      const entry = map.get(key);
      if (!entry) return false;
      return Date.now() - entry.timestamp >= ttl;
    },
    getExpired(key) {
      const entry = map.get(key);
      return entry ? entry.value : null;
    },
    // v30.1：清空所有缓存（配置热更新时调用，让新 TTL 立即生效）
    clear() {
      map.clear();
    }
  };
}
const successCache = createLRUCache(CACHE_MAX_SIZE, cfg('cacheTtlMs', CACHE_TTL_MS));
// v1.0：失败缓存 LRU 不再用固定5min TTL——过期由 getFailCached 按失败类型差异化判断(404→1h/410→1min/网络错误不缓存)
const failCache = createLRUCache(FAIL_CACHE_MAX_SIZE, Number.MAX_SAFE_INTEGER);

const breakerMap = new Map();
// v7.0：播放实时失败摘除——真实播放请求连续失败 ≥PLAY_DEAD_STREAK 次即从竞速链摘除（不等探测周期）；
// 复活三路径：①播放成功即时解除；②探测通过解除（探测清单内源）；③摘除冷却期满后自动半开试探（不依赖探测清单，失败重新计时）
// 与 manualOff 用户锁定分层：手动关闭永不复活
const PLAY_DEAD_STREAK = 3;
const playDeadStreak = new Map();
const playDeadDeadline = new Map(); // 摘除计时起点（半开试探冷却）
function isPlayDead(sourceId) {
  const streak = playDeadStreak.get(sourceId) || 0;
  if (streak < PLAY_DEAD_STREAK) return false;
  // 冷却期满 → 允许半开试探（返回 false 放行进链；试探失败 recordFailure 会重新计时）
  const reviveMs = cfg('playDeadReviveMs', 5 * 60 * 1000);
  const age = Date.now() - (playDeadDeadline.get(sourceId) || 0);
  logDebug(`[摘除判定] ${sourceId} streak=${streak} age=${age}ms revive=${reviveMs}ms 结果=${age < reviveMs}`);
  return age < reviveMs;
}
function getBreaker(sourceId) {
  if (!breakerMap.has(sourceId)) {
    breakerMap.set(sourceId, { state: 'closed', failureCount: 0, lastFailureTime: 0, totalRequests: 0, totalSuccess: 0, totalTime: 0,
      // v3.0：探测样本单独计数（与真实请求分级加权，避免探测污染真实成功率）
      probeRequests: 0, probeSuccess: 0, probeTime: 0,
      // v4.0：失败归因分离——版权/业务失败（无版权404、歌不存在、错歌）单独计数，
      // 不惩罚健康分、不计入成功率分母（避免热门版权歌冤枉健康源）
      copyrightFail: 0,
      // v4.0：按音质分档统计 { quality: {req, success, time, fail, businessFail} }
      byQuality: {},
      // v4.0：限流退避——429 不触发熔断，短退避后恢复；连续限流标记"被限"
      rateLimitCount: 0, rateLimitUntil: 0, rateLimited: false,
      // v6.0：最近一次成功交付音质（音质协商链降档后可诊断"UI显示FLAC实际128k"问题）
      lastQuality: null });
  }
  return breakerMap.get(sourceId);
}
// v4.0：429 限流单独处理——短退避(30s)后自动恢复，不计入熔断阈值；连续≥3 次标记"被限"
function recordRateLimit(sourceId, quality) {
  const b = getBreaker(sourceId);
  // v8.10.3：429 不再计入请求/失败分子分母——限流是"源没坏、只是过载"，旧实现记进
  // byQuality.fail/totalRequests 后会被 isQualityHopeless(fail+linkExpired>=3) 当成
  // "该档 3 次全失败"直接短路 1 小时，同时把面板成功率拉低。
  b.rateLimitCount = (b.rateLimitCount || 0) + 1;
  b.rateLimitUntil = Date.now() + cfg('rateLimitBackoffMs', RATE_LIMIT_BACKOFF_MS);
  if (b.rateLimitCount >= RATE_LIMIT_TRIP) b.rateLimited = true;
  // v8.10.3：半开试探遇 429 必须收口——canExecute 在 half-open 恒返回 false，
  // 不收口则 state 永久停在 half-open，该源再也不会被调用（只修了业务失败/本地节流两条出口）。
  if (b.state === "half-open") {
    b.state = "open";
    b.lastFailureTime = Date.now();
    logWarn(`断路器[${sourceId}] 半开试探失败(${quality || "128k"} 限流429)，重新熔断`);
  }
  logDebug(`[${sourceId}] 429限流第${b.rateLimitCount}次，退避${cfg('rateLimitBackoffMs', RATE_LIMIT_BACKOFF_MS) / 1000}s${b.rateLimited ? '（已标记被限）' : ''}`);
}
function canExecute(sourceId) {
  const b = getBreaker(sourceId);
  // v4.0：限流退避期内跳过（源没坏，只是过载/风控）；退避结束自动恢复
  if (b.rateLimitUntil > 0) {
    if (Date.now() < b.rateLimitUntil) return false;
    b.rateLimitUntil = 0; b.rateLimited = false;
  }
  if (b.state === 'closed') return true;
  if (b.state === 'open') {
    if (Date.now() - b.lastFailureTime >= cfg('breakerCooldownMs', BREAKER_COOLDOWN_MS)) {
      b.state = 'half-open';
      return true;
    }
    return false;
  }
  return false;
}
function recordSuccess(sourceId, duration, quality) {
  const b = getBreaker(sourceId);
  b.totalRequests++;
  b.totalSuccess++;
  b.totalTime += duration;
  b.lastQuality = String(quality || "128k"); // v6.0：记录实际交付音质
  const q = b.byQuality[String(quality || 'default')] || (b.byQuality[String(quality || 'default')] = { req: 0, success: 0, time: 0, fail: 0, businessFail: 0 });
  q.req++; q.success++; q.time += duration;
  if (b.state === 'half-open') { b.state = 'closed'; b.failureCount = 0; logWarn(`断路器[${sourceId}] 半开试探成功，恢复`); }
  b.failureCount = 0;
  // v7.0：播放成功 → 解除摘除
  if ((playDeadStreak.get(sourceId) || 0) > 0) {
    playDeadStreak.set(sourceId, 0);
    playDeadDeadline.delete(sourceId);
    logWarn(`播放摘除: [${sourceId}] 播放成功，解除摘除`);
  }
}
// v8.10.3：播放失败累计抽成单点——半开试探失败同样算一次真实播放失败（旧实现 return 跳过累加，
// 与"真实播放失败累计"的注释语义不符，导致反复半开失败的源永远凑不够摘除阈值）
function bumpPlayDead(sourceId) {
  playDeadStreak.set(sourceId, (playDeadStreak.get(sourceId) || 0) + 1);
  if (playDeadStreak.get(sourceId) >= PLAY_DEAD_STREAK) playDeadDeadline.set(sourceId, Date.now()); // 摘除/续计时（半开试探冷却）
  if (isPlayDead(sourceId)) logWarn(`播放摘除: [${sourceId}] 连续${PLAY_DEAD_STREAK}次播放失败，已从竞速链摘除(${Math.round(cfg('playDeadReviveMs', 5 * 60 * 1000) / 60000)}分钟后半开试探自动复活)`);
}
function recordFailure(sourceId, quality) {
  const b = getBreaker(sourceId);
  b.totalRequests++;
  b.failureCount++;
  b.lastFailureTime = Date.now();
  const q = b.byQuality[String(quality || 'default')] || (b.byQuality[String(quality || 'default')] = { req: 0, success: 0, time: 0, fail: 0, businessFail: 0 });
  q.req++; q.fail++;
  bumpPlayDead(sourceId);
  if (b.state === 'half-open') { b.state = 'open'; logWarn(`断路器[${sourceId}] 半开试探失败，重新熔断`); return; }
  const thr = cfg('breakerThreshold', BREAKER_THRESHOLD);
  if (b.state === 'closed' && b.failureCount >= thr) {
    b.state = 'open';
    logWarn(`断路器[${sourceId}] 连续失败${thr}次，熔断${cfg('breakerCooldownMs', BREAKER_COOLDOWN_MS) / 1000}秒`);
  }
}
// v4.0：版权/业务失败单独计数（无版权404、歌不存在、错歌等——源已正常响应，只是这首歌没有/需VIP）
// 不惩罚健康分、不计入成功率分母、不触发熔断
function recordBusinessFail(sourceId, quality) {
  const b = getBreaker(sourceId);
  b.totalRequests++;
  b.copyrightFail = (b.copyrightFail || 0) + 1;
  const q = b.byQuality[String(quality || 'default')] || (b.byQuality[String(quality || 'default')] = { req: 0, success: 0, time: 0, fail: 0, businessFail: 0 });
  q.req++; q.businessFail++;
  // v8.10.2：半开试探失败收口——业务失败（404/错歌/410/空URL）同样说明这次试探没成功，
  // 不能让 state 停在 half-open（canExecute 在 half-open 恒返回 false，源会永久不被调用）。
  // 必须同时刷新 lastFailureTime，否则冷却判定用旧时间戳，会立刻再次放行。
  if (b.state === "half-open") {
    b.state = "open";
    b.lastFailureTime = Date.now();
    logWarn(`断路器[${sourceId}] 半开试探失败(${quality || "128k"} 业务失败)，重新熔断`);
  }
}
function getSourceStats(sourceId) {
  const b = getBreaker(sourceId);
  // v4.0：无样本时返回 null（App 显示"-"），不再用 1/9999 误导；同时暴露样本计数
  const reqCount = b.totalRequests || 0;
  const probeCount = b.probeRequests || 0;
  // v4.0：有效请求 = 总请求 - 版权/业务失败（无版权歌不惩罚源）；全部都是版权失败 → 无有效样本
  const validCount = Math.max(reqCount - (b.copyrightFail || 0), 0);
  return {
    successRate: validCount === 0 ? null : b.totalSuccess / validCount,
    avgTime: b.totalSuccess === 0 ? null : b.totalTime / b.totalSuccess,
    state: b.state,
    reqCount,
    probeCount,
    copyrightFail: b.copyrightFail || 0,
    // v4.0：按音质分档 { quality: {rate, avgTime, req, success, businessFail} }——flac 坏但 128k 好的源可精确呈现
    byQuality: Object.fromEntries(Object.entries(b.byQuality || {}).map(([quality, q]) => {
      const valid = Math.max(q.req - q.businessFail, 0);
      return [quality, {
        rate: valid === 0 ? null : q.success / valid,
        avgTime: q.success === 0 ? null : q.time / q.success,
        req: q.req, success: q.success, businessFail: q.businessFail
      }];
    }))
  };
}

// v3.0：源健康权重自学习——健康评分 = 真实样本成功率(置信度收缩) − 均时惩罚 − 连续失败惩罚
// 内部评分区间 −1~1（无样本基线 0：无样本按 9999ms 最劣均时惩罚压分）；v7.0 起快照输出 ×10 为 10 分制（0~10），内部排序/熔断仍用 −1~1
// 探测样本仅在无真实请求样本时整体采用（同 K=4 收缩）；有真实样本时探测不参与（非固定 0.3 混合权重）
const HEALTH_PRIOR_K = 4;      // 置信度收缩伪计数（样本少时成功率向 0.5 收缩，防止"1 次成功=满分"）
const HEALTH_TIME_PENALTY = 0.5; // 均时惩罚系数（归一化到 5000ms）
const HEALTH_STREAK_STEP = 0.08; // 每 1 次连续失败扣分
const HEALTH_STREAK_CAP = 0.5;   // 连续失败惩罚上限
function computeHealthScore(sourceId) {
  const b = getBreaker(sourceId);
  // v6.0：有效真实请求 = 真实请求 - 版权/业务失败（无版权歌不惩罚健康分）
  // 修复：probe* 为独立计数(recordProbeResult 单独记账)，totalRequests/totalSuccess 不含探测——
  // 旧实现做减法会把真实样本削掉(探测多时 realReq 归零、成功率退回 0.5)，健康分系统性偏低且与面板成功率口径不一致
  const realReq = Math.max(b.totalRequests - (b.copyrightFail || 0), 0);
  const realSuccess = b.totalSuccess;
  // 真实样本成功率（置信度收缩）
  const rateReal = realReq === 0 ? 0.5 : (realSuccess + HEALTH_PRIOR_K * 0.5) / (realReq + HEALTH_PRIOR_K);
  // 探测样本参考（纯探测期：无真实样本时用探测成功率收缩）
  const probeReq = b.probeRequests || 0;
  const probeSuccess = b.probeSuccess || 0;
  const rateProbe = probeReq === 0 ? 0.5 : (probeSuccess + HEALTH_PRIOR_K * 0.5) / (probeReq + HEALTH_PRIOR_K);
  const rate = realReq > 0 ? rateReal : rateProbe; // 真实样本存在时主导，否则退回探测参考
  // 均时惩罚：真实样本均时优先，纯探测用探测均时；无样本按 9999 最劣
  const avgTime = realSuccess > 0
    ? b.totalTime / realSuccess   // v6.0：totalTime 只计真实成功耗时，不再减 probeTime（同 S1 口径修复）
    : (probeSuccess > 0 ? (b.probeTime || 0) / probeSuccess : 9999);
  const timePenalty = Math.min(avgTime / 5000, 1) * HEALTH_TIME_PENALTY;
  // 连续失败惩罚（熔断阈值内递增；已熔断由 canExecute 挡链，此处仅影响参考分）
  const streakPenalty = Math.min(b.failureCount * HEALTH_STREAK_STEP, HEALTH_STREAK_CAP);
  const score = rate - timePenalty - streakPenalty;
  return { score, rate, avgTime, state: b.state };
}

// ============================================================
// 第四部分：HTTP 请求封装
// ============================================================
function httpRequest(url, options = { method: "GET" }) {
  const timeout = options.timeout || TIMEOUT_CONFIG.default;
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    request(url, { timeout, ...options }, (err, res) => {
      const duration = Date.now() - startTime;
      if (err) {
        const code = String(err.message || "").includes("timeout") ? ERROR_CODES.NETWORK_TIMEOUT : ERROR_CODES.NETWORK_ERROR;
        const error = new Error(`${code}: ${err.message}`);
        error.code = code;
        reject(error);
        return;
      }
      let body = res?.body;
      if (typeof body === "string") {
        const trimmed = body.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed.startsWith('"')) {
          try { body = JSON.parse(trimmed); } catch (e) { /* 保持原始 */ }
        }
      }
      const result = { statusCode: res?.statusCode ?? 0, headers: res?.headers || {}, body, duration, url: res?.url || url };
      if (result.statusCode >= 500) {
        const error = new Error(`${ERROR_CODES.SERVER_ERROR}: HTTP ${result.statusCode}`);
        error.code = ERROR_CODES.SERVER_ERROR;
        reject(error);
      } else if (result.statusCode === 429) {
        const error = new Error(`${ERROR_CODES.RATE_LIMIT}: 被限流`);
        error.code = ERROR_CODES.RATE_LIMIT;
        reject(error);
      } else if (result.statusCode === 410) {
        // v1.0：410 Gone = 签名/直链过期（死链），单独映射，供失败缓存差异化(1min)与诊断
        const error = new Error(`${ERROR_CODES.LINK_EXPIRED}: 链接已过期(HTTP 410)`);
        error.code = ERROR_CODES.LINK_EXPIRED;
        reject(error);
      } else if (result.statusCode === 404) {
        // v1.0：404 = 歌曲/资源不存在，单独映射，供失败缓存差异化(1h)与诊断
        const error = new Error(`${ERROR_CODES.NOT_FOUND}: 资源不存在(HTTP 404)`);
        error.code = ERROR_CODES.NOT_FOUND;
        reject(error);
      } else if (result.statusCode >= 400) {
        const error = new Error(`${ERROR_CODES.NETWORK_ERROR}: HTTP ${result.statusCode}`);
        error.code = ERROR_CODES.NETWORK_ERROR;
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

async function httpRequestWithRetry(url, options = {}, retries = RETRY_TIMES) {
  let lastError = null;
  for (let i = 0; i <= retries; i++) {
    try {
      return await httpRequest(url, options);
    } catch (e) {
      lastError = e;
      // 网络错误/超时/5xx临时错误重试；4xx(403/404)与429限流不重试
      if (e.code !== ERROR_CODES.NETWORK_TIMEOUT && e.code !== ERROR_CODES.NETWORK_ERROR && e.code !== ERROR_CODES.SERVER_ERROR) break;
      if (i < retries) {
        const delay = Math.pow(2, i) * 200;
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

function buildQueryString(params = {}) {
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  return parts.length ? "?" + parts.join("&") : "";
}

async function httpGet(url, params = {}, timeoutType = 'default', headers = null) {
  const fullUrl = url + buildQueryString(params);
  const opts = { method: "GET", timeout: TIMEOUT_CONFIG[timeoutType] || TIMEOUT_CONFIG.default };
  // v7.0 (S4)：可选请求头——部分上游对无 UA 请求差异化响应，调用方可显式传移动 UA 提高稳定性
  if (headers && typeof headers === "object" && Object.keys(headers).length) opts.headers = headers;
  const res = await httpRequestWithRetry(fullUrl, opts);
  return res.body;
}

// v1.0 P0：轻量音频可播性判定——Range 取前1KB，206/200音频即视为可播
// v8.10.4：区分「确定死链」与「校验未完成」——410/403/404 判死链；超时/网络/5xx/429 抛出交给竞速按网络类处理
async function isAudioPlayable(audioUrl, timeoutMs = 3000) {
  if (!audioUrl || typeof audioUrl !== "string" || !HTTP_URL_REGEX.test(audioUrl)) return false;
  try {
    const res = await httpRequest(audioUrl, {
      method: "GET",
      headers: { "User-Agent": getMobileUserAgent(), "Range": "bytes=0-1023" },
      timeout: timeoutMs,
      follow_max: 5
    });
    const ct = String(res.headers?.["content-type"] || "");
    if (res.statusCode === 206) return true;
    if (res.statusCode === 200 && /audio|octet|mpeg|mp3|flac|ogg|aac/i.test(ct)) return true;
    return false;
  } catch (e) {
    // v8.10.4：网络类异常 ≠ 死链。旧实现一律 return false，调用方据此抛 LINK_EXPIRED，
    // 该码不进 failureCount 但会计入 byQuality.linkExpired，命中档位短路判据
    // (fail+linkExpired)>=3 后把该源该音质档压制 6 小时——而按网络类处理只需 180s 冷却 + 半开探针自愈。
    // 故此处改为抛出原错误码（NETWORK_TIMEOUT / NETWORK_ERROR / SERVER_ERROR / RATE_LIMIT），
    // 仅当确实是 LINK_EXPIRED（410）时才仍返回 false 交给调用方判死链。
    const code = (e && e.code) ? e.code : ERROR_CODES.NETWORK_ERROR;
    if (code === ERROR_CODES.LINK_EXPIRED) return false;
    const err = new Error(`${code}: 可播性校验未完成(${(e && e.message) || "unknown"})`);
    err.code = code;
    throw err;
  }
}

// ============================================================
// 第五部分：歌曲信息与匹配工具
// ============================================================
// v1.0 (D10)：已移除死代码 normalizeQuality/selectQuality/qualityToNetease（链级统一降级，源内直接使用请求音质）
function qualityToSuyinQQ(quality) {
  const q = String(quality || "128k").toLowerCase();
  if (q === "flac24bit") return "hires";
  if (q === "192k") return "320k";
  return QUALITY_TO_X.suyinQQ[q] ? q : "128k";
}

// v4.0：UA 池轮换——多套移动 UA 按请求计数器轮换，降低单 UA 被上游风控识别的概率
const MOBILE_UA_POOL = [
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Mobile Safari/537.36"
];
let __uaCounter = 0;
function getMobileUserAgent() {
  return MOBILE_UA_POOL[(__uaCounter++ + Math.floor(Date.now() / 60000)) % MOBILE_UA_POOL.length];
}

// v1.0 (D10)：已移除死代码 getSongId
function getHashOrMid(songInfo) {
  return songInfo?.hash ?? songInfo?.songmid ?? songInfo?.id ?? null;
}

function getQQSongId(songInfo) {
  const mid = songInfo?.meta?.qq?.mid || songInfo?.meta?.mid || songInfo?.songmid ||
    (typeof songInfo?.id === "string" && !/^\d+$/.test(songInfo.id) ? songInfo.id : null);
  if (mid) return { type: "mid", value: mid };
  const songid = songInfo?.meta?.qq?.songid || songInfo?.meta?.songid ||
    (typeof songInfo?.id === "number" ? songInfo.id :
      (typeof songInfo?.id === "string" && /^\d+$/.test(songInfo.id) ? Number(songInfo.id) : null));
  if (songid) return { type: "songid", value: songid };
  return null;
}

// v1.0 (D10)：已移除死代码 normalizeSongInfo/getFirstData
function normalizeKeyword(keyword) {
  if (!keyword) return "";
  return String(keyword)
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, "")
    .replace(/[^\w\u4e00-\u9fa5]/g, "")
    .trim()
    .toLowerCase();
}

function titleMatch(a, b) {
  const na = normalizeKeyword(a);
  const nb = normalizeKeyword(b);
  if (!na || !nb) return true;
  return na.includes(nb) || nb.includes(na);
}

function durationMatch(dur1, dur2, threshold = 5) {
  if (!dur1 || !dur2) return true;
  return Math.abs(Number(dur1) - Number(dur2)) <= threshold;
}

function buildSearchKeywords(songInfo) {
  const keywords = [];
  const name = songInfo?.name || "";
  const album = songInfo?.albumName || songInfo?.album || "";
  const singer = songInfo?.singer || "";
  if (name && album) {
    const kw = normalizeKeyword(name + album);
    if (kw) keywords.push({ keyword: kw, strict: true });
  }
  if (name && singer) {
    const kw = normalizeKeyword(name + singer);
    if (kw) keywords.push({ keyword: kw, strict: true });
  }
  if (name) {
    const kw = normalizeKeyword(name);
    if (kw) keywords.push({ keyword: kw, strict: false });
  }
  return keywords;
}

// v1.0 P0-1 (D1)：片段/试听特征词。必须对原始歌名匹配（normalizeKeyword 会删括号内容，如"难却(15秒0.8x片段)"归一化后与"难却"相同）
const FRAGMENT_RE = /(15\s*秒|0\.?\s*8x|片段|试听|demo|preview|teaser)/i;

// v8.0：试听片段URL检测——酷我VIP试听片段(5秒)URL特征
// 实测发现 helloworld 源部分歌曲返回的是酷我VIP试听片段链接（能播但只有5秒）
// 检测URL关键词，命中即判定为试听片段
const PREVIEW_URL_RE = /(preview|test|sample|试听|片段|demo|teaser|clip)/i;
function isPreviewFragmentUrl(url) {
  if (!url || typeof url !== "string") return false;
  return PREVIEW_URL_RE.test(url);
}

// v1.0 P0-4 (D4)：时长归一化到秒（兼容 ms/秒混用：>5000 视为毫秒）
function normalizeDurationSec(d) {
  const v = Number(d);
  if (!Number.isFinite(v) || v <= 0) return 0;
  return v > 5000 ? Math.floor(v / 1000) : Math.round(v);
}

function songInfoMatch(responseData, songInfo) {
  const song = responseData?.song || responseData?.data?.song || "";
  const singer = responseData?.singer || responseData?.data?.singer || "";
  const album = responseData?.album || responseData?.data?.album || "";
  if (!titleMatch(song, songInfo?.name || "")) return false;
  // v1.0 P0-1 (D1)：目标歌名无片段特征词而返回歌名含 → 拒绝（防《难却》匹配到15秒0.8x片段）
  const targetName = String(songInfo?.name || "");
  if (targetName && song && !FRAGMENT_RE.test(targetName) && FRAGMENT_RE.test(String(song))) return false;
  if (songInfo?.singer && singer && !titleMatch(singer, songInfo.singer)) return false;
  if ((songInfo?.albumName || songInfo?.album) && album && !titleMatch(album, songInfo.albumName || songInfo.album)) return false;
  // v1.0 P0-4 (D4)：双方时长已知且差>5s → 拒绝（片段版时长明显短于完整版）
  const tDur = normalizeDurationSec(songInfo?.duration);
  const rDur = normalizeDurationSec(responseData?.duration || responseData?.data?.duration || responseData?.musicInfo?.duration);
  if (tDur && rDur && !durationMatch(tDur, rDur, 5)) return false;
  return true;
}

function parseMessageSongInfo(message) {
  if (!message) return null;
  const result = {};
  const lines = String(message).split("\n");
  for (const line of lines) {
    if (line.startsWith("歌名：")) result.song = line.replace("歌名：", "").trim();
    if (line.startsWith("歌手：")) result.singer = line.replace("歌手：", "").trim();
    if (line.startsWith("专辑：")) result.album = line.replace("专辑：", "").trim();
    // v1.0 P0-4 (D4)：消息路径带时长时一并解析，供时长校验使用
    if (line.startsWith("时长：")) result.duration = Number(line.replace("时长：", "").trim()) || 0;
  }
  return result.song ? result : null;
}

// v8.10.3：huibq 假成功判据单点化——上游对无版权/取链失败仍返回 code=0，但 msg 带失败词
// （实测"无法获取播放链接！" + panspace 酷我链 206 可播 = 错歌）。v8.7 只把它用在取链路径，
// 探针没有同款判据 → 上游假成功时探针判"健康"、源被抬高排序且不会被自动关闭。
const HUIBQ_FAIL_MSG_REGEX = /无法获取|获取失败|失败|错误|不存在|无效|error/i;
function isHuibqFailMsg(msg) { return HUIBQ_FAIL_MSG_REGEX.test(String(msg || "")); }

function validateUrl(url, sourceName) {
  if (!url || typeof url !== "string" || !url.trim()) throw new Error(`${ERROR_CODES.NOT_FOUND}: ${sourceName}返回空URL`);
  if (!HTTP_URL_REGEX.test(url.trim())) throw new Error(`${ERROR_CODES.PARAM_ERROR}: ${sourceName}非法URL格式`);
  // v8.10.3：校验用 trim 后的串，返回也必须 trim——旧实现返回原串，带首尾空白/换行的 URL 会直达播放器
  return url.trim();
}

// v1.0 P0-3 (D2)：kw CDN 音频链 http→https（实测 https 升级后 206 可播，部分网络/播放器对 http 音频处理异常）
function upgradeToHttps(url) {
  if (!url || typeof url !== "string") return url;
  return url.replace(/^http:\/\//i, "https://");
}

// v1.0 P1：缓存 key 加入 songId 维度，避免同名不同版本冲突
function buildCacheKey(prefix, songInfo, quality = "") {
  const id = songInfo?.id || songInfo?.songmid || songInfo?.hash || songInfo?.rid || "";
  const name = songInfo?.name || "";
  const singer = songInfo?.singer || "";
  const album = songInfo?.albumName || songInfo?.album || "";
  return `${prefix}_${id}_${name}_${singer}_${album}_${quality}`;
}

// v1.0 P1：缓存值记录实际音质 {url, quality}，命中/过期兜底时校验
// v8.10：高音质缓存分级 TTL——flac/320k/24bit 用 30min（链接有效期短），128k 用 6h
function getCachedUrl(cacheKey) {
  const entry = successCache.get(cacheKey);
  if (!entry) return null;
  // v8.10：按音质判断是否过期（LRU 总 TTL 仍由 cacheTtlMs 兜底，但高音质提前判 miss）
  const q = String(entry.quality || "128k").toLowerCase();
  const isHighQuality = q === "flac" || q === "320k" || q === "flac24bit" || q === "hires";
  const ttl = isHighQuality ? cfg('cacheTtlHighQualityMs', 1800000) : cfg('cacheTtlMs', 21600000);
  if (entry.ts && (Date.now() - entry.ts) > ttl) {
    successCache.delete(cacheKey); // 过期删除，下次重新取链
    return null;
  }
  return entry;
}
function setCachedUrl(cacheKey, url, quality, source) {
  successCache.set(cacheKey, { url, quality: quality || "128k", source, ts: Date.now() }); // v8.10：存 ts 用于分级 TTL 判断
}
// v1.0：失败缓存差异化——按失败类型记录，get 时按差异化 TTL 判断过期（404→1h / 410→1min / 网络错误不缓存）
function setFailCached(failKey, code, ttl) { failCache.set(failKey, { code: code || ERROR_CODES.NETWORK_ERROR, ts: Date.now(), ttl }); } // v6.0(A3)：支持自定义 TTL（网络类全链失败 30s 短缓存）
// v8.10.3：返回整条记录（而不是布尔）——失败缓存命中时要还原当初的代表性失败码，
// 否则 App 只能看到 NOT_FOUND，把"网络全挂 30s 短缓存"当成"这首歌不存在"
function getFailCachedEntry(failKey) {
  const entry = failCache.get(failKey);
  if (!entry) return null;
  // v5.0：差异化 TTL 可配置（404→1h / 410→1min / 网络错误不缓存）
  const ttl = entry.ttl !== undefined ? entry.ttl   // v6.0(A3)：自定义短缓存 TTL 优先
    : entry.code === ERROR_CODES.NOT_FOUND
      ? cfg('failCacheNotFoundMs', 3600000)
      : entry.code === ERROR_CODES.LINK_EXPIRED
        ? cfg('failCacheExpiredMs', 60000)
        : FAIL_CACHE_TTL_BY_CODE[entry.code];
  if (ttl === undefined) return entry; // 未配置的 code 按旧行为 5min
  if (ttl === 0) return null;          // 网络错误/限流 → 不缓存
  return (Date.now() - entry.ts) < ttl ? entry : null;
}
function getFailCached(failKey) { return !!getFailCachedEntry(failKey); }

// ============================================================
// 第六部分：音源实现
// ============================================================

/* 网易云官方 outer 直连（免费歌302直链，固定128k，VIP/无版权歌404自动跳过） */
async function wyOuterGetUrl(platform, songId, quality, songInfo) {
  if (platform !== "wy") throw new Error(`${ERROR_CODES.PARAM_ERROR}: 网易云官方仅支持wy平台`);
  const id = songId ?? songInfo?.id ?? songInfo?.songmid;
  if (!id) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 网易云官方缺少歌曲ID`);
  const url = WY_OUTER_API.replace("{id}", encodeURIComponent(String(id)));
  const res = await httpRequestWithRetry(url, {
    method: "GET",
    headers: { "User-Agent": getMobileUserAgent() },
    timeout: TIMEOUT_CONFIG.parse,
    follow_max: 5
  });
  const ct = String(res.headers?.["content-type"] || "");
  if (res.statusCode !== 200 || !/audio|octet|mpeg/i.test(ct)) {
    throw new Error(`${ERROR_CODES.NOT_FOUND}: 网易云该歌曲不可试听(可能需VIP)，跳过`);
  }
  return res.url || url;
}

/* 酷我官方直连（自研：搜索 r.s → rid → convert_url，固定128k真实mp3，无第三方） */
function kuwoUnescape(text) {
  return String(text || "")
    .replace(/&nbsp;/g, " ")
    .replace(/\\u([0-9a-fA-F]{4})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)))
    .trim();
}

async function kuwoOfficialSearch(keyword, rn = 10) {
  const url = `${KUWO_SEARCH_API}?client=kt&all=${encodeURIComponent(keyword)}&pn=0&rn=${rn}&ft=music&rformat=json&encoding=utf8`;
  const res = await httpRequestWithRetry(url, {
    method: "GET",
    headers: { "User-Agent": getMobileUserAgent() },
    timeout: TIMEOUT_CONFIG.search
  });
  const raw = typeof res.body === "string" ? res.body : String(res.body || "");
  // 酷我返回 Python repr 风格(单引号)，清洗为 JSON
  const cleaned = raw.replace(/'/g, '"');
  let parsed = null;
  try { parsed = JSON.parse(cleaned); } catch (e) { /* 解析失败走正则兜底 */ }
  if (parsed && Array.isArray(parsed.abslist)) {
    return parsed.abslist.map(item => ({
      rid: String(item.MP3RID || "").replace("MP3_", ""),
      name: kuwoUnescape(item.NAME),
      singer: kuwoUnescape(item.ARTIST),
      duration: Number(item.DURATION) || 0
    })).filter(i => i.rid);
  }
  // 正则兜底
  const items = [];
  const blockRe = /\{'MP3RID':'MP3_(\d+)'/g;
  let m;
  while ((m = blockRe.exec(raw))) {
    items.push({ rid: m[1], name: "", singer: "", duration: 0 });
  }
  return items;
}

/* ============================================================
 * v3.0：歌词/封面透出（App fork 已支持 lyric/pic action，音源声明即注册）
 * 实证：网易云公开 lyric(带时间标签) / detail(picUrl) 接口可用；酷我搜索 abslist 含 hts_MVPIC 封面；
 *      酷我歌词无稳定公开接口、tx/kg/mg 无签名接口 → 对应平台不声明，App 自动走内置源兜底
 * ============================================================ */

// 酷我封面搜索（单引号 Python repr → 清洗 JSON，取 abslist[0].hts_MVPIC）
async function kuwoPicSearch(keyword) {
  const url = `${KUWO_SEARCH_API}?client=kt&all=${encodeURIComponent(keyword)}&pn=0&rn=1&ft=music&rformat=json&encoding=utf8`;
  const res = await httpRequestWithRetry(url, {
    method: "GET",
    headers: { "User-Agent": getMobileUserAgent() },
    timeout: TIMEOUT_CONFIG.search
  });
  const raw = typeof res.body === "string" ? res.body : String(res.body || "");
  const cleaned = raw.replace(/'/g, '"');
  try {
    const parsed = JSON.parse(cleaned);
    const item = parsed?.abslist?.[0];
    if (item) {
      // hts_MVPIC 为完整 https 封面；MVPIC 为短路径需拼 img2.kuwo.cn 前缀
      const pic = item.hts_MVPIC || (item.MVPIC ? `https://img2.kuwo.cn/${item.MVPIC}` : null);
      if (typeof pic === "string" && /^https?:/.test(pic)) return pic;
    }
  } catch (e) { /* 解析失败走 NOT_FOUND */ }
  throw new Error(`${ERROR_CODES.NOT_FOUND}: 酷我封面获取失败`);
}

// 歌词透出：仅 wy（网易云公开接口），返回 {lyric, tlyric, rlyric}（App verifyLyricInfo 校验 lyric 非空且≤51200）
async function getLyricForPlatform(platform, songInfo) {
  if (!songInfo || typeof songInfo !== "object") throw new Error(`${ERROR_CODES.PARAM_ERROR}: 无效的歌曲信息`);
  if (platform !== "wy") throw new Error(`${ERROR_CODES.NOT_FOUND}: ${platform} 平台暂无稳定歌词接口`);
  const id = songInfo?.songmid || songInfo?.id;
  if (!id) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 网易云歌词缺少歌曲ID`);
  const res = await httpGet(WY_LYRIC_API, { id: String(id), lv: 1, kv: 1, tv: -1 }, 'parse');
  const lyric = res?.lrc?.lyric;
  if (typeof lyric !== "string" || !lyric.length) throw new Error(`${ERROR_CODES.NOT_FOUND}: 网易云歌词不存在或需VIP`);
  return {
    lyric,
    tlyric: (typeof res?.tlyric?.lyric === "string" && res.tlyric.lyric.length) ? res.tlyric.lyric : null,
    rlyric: null
  };
}

// 封面透出：wy 用 detail 接口 picUrl；kw 用搜索接口 hts_MVPIC；返回 https 字符串 URL（App 校验）
async function getPicForPlatform(platform, songInfo) {
  if (!songInfo || typeof songInfo !== "object") throw new Error(`${ERROR_CODES.PARAM_ERROR}: 无效的歌曲信息`);
  if (platform === "wy") {
    const id = songInfo?.songmid || songInfo?.id;
    if (!id) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 网易云封面缺少歌曲ID`);
    // v7.0 (S4)：网易 detail 接口实测(2026-10-30 双曲对照)带 ids 参数时返回结构顶层 picUrl 恒为 null，
    // 封面稳定存在于 songs[0].album.picUrl / blurPicUrl——必须回退取 album 字段，否则封面永远 NOT_FOUND。
    // 同时补移动 UA 头：网易对无 UA 请求存在差异化/不稳定响应(实测同参有时 200 完整有时 200 空响应)。
    const res = await httpGet(WY_DETAIL_API, { id: String(id), ids: `[${String(id)}]` }, 'parse', { "User-Agent": getMobileUserAgent() });
    const song = res?.songs?.[0];
    const picUrl = song?.picUrl || song?.album?.picUrl || song?.album?.blurPicUrl;
    if (typeof picUrl !== "string" || !/^https?:/.test(picUrl)) throw new Error(`${ERROR_CODES.NOT_FOUND}: 网易云封面获取失败`);
    return picUrl;
  }
  if (platform === "kw") {
    const keyword = songInfo?.name ? `${songInfo.name} ${songInfo?.singer || ""}`.trim() : "";
    if (!keyword) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 酷我封面缺少歌曲名`);
    return kuwoPicSearch(keyword);
  }
  throw new Error(`${ERROR_CODES.NOT_FOUND}: ${platform} 平台暂无稳定封面接口`);
}

async function kuwoOfficialConvert(rid) {
  if (!rid) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 酷我官方缺少rid`);
  const url = `${KUWO_CONVERT_API}?type=convert_url&rid=${encodeURIComponent(rid)}&format=mp3&response=url`;  const res = await httpRequestWithRetry(url, {
    method: "GET",
    headers: { "User-Agent": getMobileUserAgent() },
    timeout: TIMEOUT_CONFIG.parse
  });
  const text = typeof res.body === "string" ? res.body.trim() : String(res.body || "").trim();
  if (!text || text === "refuse request!" || !HTTP_URL_REGEX.test(text)) {
    throw new Error(`${ERROR_CODES.NOT_FOUND}: 酷我官方convert_url未返回链接`);
  }
  return text;
}

async function kuwoOfficialGetUrl(platform, songId, quality, songInfo) {
  if (platform !== "kw") throw new Error(`${ERROR_CODES.PARAM_ERROR}: 酷我官方仅支持kw平台`);
  if (!songInfo?.name) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 酷我官方需要歌曲名`);
  const cacheKey = buildCacheKey("kwoff", songInfo, "128k");
  const cached = getCachedUrl(cacheKey);
  // v7.0 (S1)：内部缓存命中必须返回裸 URL 字符串——wrapExecute 的 validateUrl 只接受字符串，
  // 旧实现返回 {url,type,subSource} 包装对象导致缓存后取链被 validateUrl 拦截(实测0ms秒失败 NOT_FOUND)。
  // subSource 透出由 getUrlWithFallback 按实际交付源统一组装，此处无需携带。
  if (cached && cached.url) return cached.url;
  const targetName = normalizeKeyword(songInfo.name);
  const targetSinger = normalizeKeyword(songInfo.singer);
  const items = await kuwoOfficialSearch(`${songInfo.name} ${songInfo.singer || ""}`.trim(), 10);
  if (!items.length) throw new Error(`${ERROR_CODES.NOT_FOUND}: 酷我官方搜索无结果`);
  // 匹配优先级：歌名精确 → 歌名包含 → 第一首；歌手/时长辅助校验
  let match = null;
  for (const item of items) {
    if (normalizeKeyword(item.name) === targetName) { match = item; break; }
  }
  if (!match) {
    for (const item of items) {
      const n = normalizeKeyword(item.name);
      if (n && n.includes(targetName)) { match = item; break; }
    }
  }
  if (!match) match = items[0];
  // v6.0：匹配结果加歌手/时长轻量校验——搜索接口同名歌多（翻唱/不同版本），
  // 旧实现"精确→包含→第一首"可能取到同名错歌；校验不通过明确失败走下一源，比播放错歌可诊断
  if (!titleMatch(match.name, songInfo.name) || (targetSinger && !titleMatch(match.singer, targetSinger))) {
    throw new Error(`${ERROR_CODES.MISMATCH}: 酷我官方匹配结果与目标歌曲不符`);
  }
  const url = await kuwoOfficialConvert(match.rid);
  setCachedUrl(cacheKey, url, "128k");
  return url;
}

/* v7.0：helloworld(kw)——生态候选实证接入（2026-10-29 全链端到端验证通过）
 * 通道① convert_url_with_sign（rid 直取，128k/320k/flac 三档真实返回，flac24bit 被服务器降级 128k 按实际交付）
 * 通道② haitangw v1 resolve-url（code:0 + data.url 直接匹配，作通道①备用）
 * 设计对齐既有源模式：ID 提取 → 请求 → JSON 校验 → https 升级 → Range 可播性二次校验（防签名死链） */
const HELLOWORLD_KW_BR = { "128k": "128kmp3", "320k": "320kmp3", flac: "2000kflac", flac24bit: "4000kflac" };
async function helloworldKwGetUrl(platform, songId, quality, songInfo) {
  if (platform !== "kw") throw new Error(`${ERROR_CODES.PARAM_ERROR}: helloworld仅支持kw平台`);
  const id = songInfo?.rid || songInfo?.songmid || songInfo?.id || songId;
  if (!id) throw new Error(`${ERROR_CODES.PARAM_ERROR}: helloworld缺少kw rid`);
  const cacheKey = buildCacheKey("hwkw", songInfo, quality);
  const cached = getCachedUrl(cacheKey);
  // v7.0 (S1)：内部缓存命中返回裸 URL 字符串（validateUrl 只接受字符串；子源透出由外层统一组装）
  if (cached && cached.url) return cached.url;
  const q = String(quality || "128k").toLowerCase();
  const br = HELLOWORLD_KW_BR[q] || "2000kflac";
  // 通道①：酷我官方 convert_url_with_sign（rid 签名直链）
  const convertUrl = `${HELLOWORLD_KW_CONVERT_API}?f=web&user=0&source=kwplayerhd_ar_1.1.4.5_tianbao_T1A_qirui.apk&type=convert_url_with_sign&rid=${encodeURIComponent(String(id))}&br=${br}`;
  let lastError = null;
  try {
    const res = await httpRequestWithRetry(convertUrl, {
      method: "GET",
      headers: { "User-Agent": getMobileUserAgent() },
      timeout: TIMEOUT_CONFIG.parse
    });
    const data = res?.body;
    // v7.0：校验结构——code=200 + data.url 为直链（实测响应 {code:200, data:{url,format,...}}）
    if (data && typeof data === "object" && Number(data.code) === 200 && data.data && typeof data.data.url === "string" && data.data.url.length > 0) {
      const rawUrl = data.data.url;
      if (HTTP_URL_REGEX.test(rawUrl)) {
        // v6.0 同款：CDN 410 签名死链防御——Range 轻量校验可播才返回（不缓存、不计成功）
        const httpsUrl = upgradeToHttps(rawUrl);
        if (!await isAudioPlayable(httpsUrl, 2500)) {
          const helloworldErr = new Error(`${ERROR_CODES.LINK_EXPIRED}: helloworld签名URL不可播(CDN 410)`);
          helloworldErr.code = ERROR_CODES.LINK_EXPIRED; // v8.10.4：必须设 code——竞速按 e.code 分类，只写在 message 里会被当成业务失败
          throw helloworldErr;
        }
        // v8.0：试听片段检测——酷我VIP试听片段(5秒)URL特征检测
        // 实测发现 helloworld 源部分歌曲返回的是酷我VIP试听片段链接（能播但只有5秒）
        // 检测URL关键词（preview/test/sample等），命中即抛错让竞速换源
        if (isPreviewFragmentUrl(httpsUrl)) {
          throw new Error(`${ERROR_CODES.NOT_FOUND}: helloworld返回试听片段(非完整版)，跳过`);
        }
        setCachedUrl(cacheKey, httpsUrl, q);
        return httpsUrl;
      }
    }
    lastError = new Error(`${ERROR_CODES.NOT_FOUND}: helloworld convert_url未返回有效链接`);
  } catch (e) { lastError = e; }
  // 通道②：haitangw v1 resolve-url 备用（通道①网络失败/结构异常时兜底）
  try {
    const res2 = await httpRequestWithRetry(HELLOWORLD_HTW_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": getMobileUserAgent() },
      body: JSON.stringify({
        source: "kw",
        songmid: String(id),
        quality: q === "128k" ? "standard" : (q === "320k" ? "high" : "lossless")
      }),
      timeout: TIMEOUT_CONFIG.parse
    });
    const d2 = res2?.body;
    if (d2 && typeof d2 === "object" && (Number(d2.code) === 0 || Number(d2.code) === 200) && typeof d2.url === "string" && d2.url.length > 0 && HTTP_URL_REGEX.test(d2.url)) {
      const httpsUrl2 = upgradeToHttps(d2.url);
      if (!await isAudioPlayable(httpsUrl2, 2500)) {
        const helloworldHtwErr = new Error(`${ERROR_CODES.LINK_EXPIRED}: helloworld htw签名URL不可播(CDN 410)`);
        helloworldHtwErr.code = ERROR_CODES.LINK_EXPIRED; // v8.10.4：同上，必须设 code
        throw helloworldHtwErr;
      }
      // v8.0：通道②同款试听片段检测（和通道①保持一致）
      if (isPreviewFragmentUrl(httpsUrl2)) {
        throw new Error(`${ERROR_CODES.NOT_FOUND}: helloworld htw返回试听片段(非完整版)，跳过`);
      }
      setCachedUrl(cacheKey, httpsUrl2, q);
      return httpsUrl2;
    }
    if (!lastError) lastError = new Error(`${ERROR_CODES.NOT_FOUND}: helloworld htw未返回有效链接`);
  } catch (e) { if (!lastError) lastError = e; }
  throw lastError || new Error(`${ERROR_CODES.NOT_FOUND}: helloworld失败`);
}

/* ikun 服务器源（v8.1：域名迁移 api.ikunshare.com→c.wwwweb.top，接口 GET /url→POST /music/url；
 * 公益版免卡密（X-Api-Key 留空即可用），付费版填 USER_CONFIG.ikunApiKey；
 * 2026-11-06 实测：POST /music/url + {source,musicId,quality} → code200 + 真实128k链（https 206 audio/mpeg 可播） */
async function ikunGetUrl(platform, songId, quality, songInfo) {
  if (platform !== "kw" && platform !== "wy") throw new Error(`${ERROR_CODES.PARAM_ERROR}: ikun仅支持kw/wy平台`);
  const id = songInfo?.hash ?? songInfo?.songmid ?? songId;
  if (!id) throw new Error(`${ERROR_CODES.PARAM_ERROR}: ikun缺少歌曲ID`);
  const res = await httpRequestWithRetry(`${IKUN_API}/music/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": getMobileUserAgent(), "X-Api-Key": USER_CONFIG.ikunApiKey || "" },
    body: JSON.stringify({ source: platform, musicId: String(id), quality: quality || "128k" }),
    timeout: TIMEOUT_CONFIG.parse,
    follow_max: 5
  });
  const body = res.body;
  if (!body || typeof body !== "object" || Number.isNaN(Number(body.code))) throw new Error(`${ERROR_CODES.SERVER_ERROR}: ikun返回无效`);
  const code = Number(body.code);
  if (code === 200 && body.url) return upgradeToHttps(body.url);
  if (code === 403) throw new Error(`${ERROR_CODES.CONFIG_ERROR}: ikun卡密失效/鉴权失败（公益版留空卡密即可）`);
  if (code === 429) throw new Error(`${ERROR_CODES.RATE_LIMIT}: ikun请求过频`);
  throw new Error(`${ERROR_CODES.NOT_FOUND}: ikun ${body.message || "获取URL失败"}`);
}

/* GD Studio（v1.0接入：仅wy，br=999真实flac/br=320 320k/br=128 128k；限5min50次，仅用于wy高音质链，高音质优先、不进128k兜底竞速） */
async function gdWyGetUrl(platform, songId, quality, songInfo) {
  if (platform !== "wy") throw new Error(`${ERROR_CODES.PARAM_ERROR}: GD Studio仅支持网易云`);
  const id = songId ?? songInfo?.id;
  if (!id) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 缺少wy songId`);
  const q = String(quality || "flac").toLowerCase();
  // v2.0：音质编码统一走 QUALITY_TO_X.gd（原 gdBrMap 已并入）
  const br = QUALITY_TO_X.gd[q] || "320";
  const url = `${GD_API}&types=url&source=netease&id=${encodeURIComponent(id)}&br=${br}`;
  const res = await httpRequestWithRetry(url, {
    method: "GET",
    headers: { "User-Agent": "LX-Music-Mobile", Accept: "application/json" },
    timeout: TIMEOUT_CONFIG.parse
  });
  const body = res.body;
  if (!body || typeof body !== "object" || !body.url) throw new Error((body && body.message) || `${ERROR_CODES.NOT_FOUND}: GD Studio未返回可用URL`);
  return body.url;
}

/* 星海备（实测域名不可解析，默认关闭，保留函数便于恢复） */
async function xinghaiBackupGetUrl(platform, songId, quality, songInfo) {
  const source = PLATFORM_TO_XINGHAI_BACKUP[platform];
  if (!source) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 星海备不支持该平台`);
  const id = songId ?? getHashOrMid(songInfo);
  if (!id) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 缺少songId`);
  const selectedQuality = String(quality || "128k").toLowerCase(); // v1.0 (D10)：链级已过滤，直接音质
  // v6.0：修复——旧实现直接返回"API 请求 URL"当作音频直链（域名恢复后播放器会拿 JSON 当音频，必然播放失败）。
  // 当前域名实测不可解析、无响应可验证解析逻辑，明确失败而非伪装直链；域名恢复后需按 kuwoOfficial 模式补齐请求+校验
  throw new Error(`${ERROR_CODES.NOT_FOUND}: 星海备域名不可解析(需实测补齐直链解析)`);
}

/* 星海后端主域聚合（v1.0：仅 kw；v1.0：128k/320k/flac 三档，E10 实测） */
function xinghaiBackendToken() {
  try {
    const payload = {
      // v2.0：device_id 可配置（USER_CONFIG.xinghaiDeviceId），默认自动生成
      device_id: USER_CONFIG.xinghaiDeviceId || ('lx-' + Math.random().toString(36).substring(2, 10)),
      ip: '0.0.0.0',
      timestamp: Math.floor(Date.now() / 1000),
      random: Math.random().toString(36).substring(2, 12)
    };
    if (globalThis.lx?.utils?.buffer?.from) {
      const buf = globalThis.lx.utils.buffer.from(JSON.stringify(payload), 'utf-8');
      return globalThis.lx.utils.buffer.bufToString(buf, 'base64');
    }
    return btoa(JSON.stringify(payload));
  } catch (e) {
    return '';
  }
}
async function xinghaiBackendGetUrl(platform, songId, quality, songInfo) {
  if (platform !== "kw") {
    throw new Error(`${ERROR_CODES.PARAM_ERROR}: 星海后端主域仅接入kw(wy签名URL本机403疑绑定后端出口IP，需家庭宽带自验后再开)`);
  }
  // v1.0 (E10)：后端实测支持 128k/320k/flac 三档（flac24bit 亦返回 flac 同链，故 maxQuality 记为 flac），不再限制 128k
  const selectedQuality = String(quality || "128k").toLowerCase();
  const id = songId ?? getHashOrMid(songInfo) ?? "1";
  const params = {
    source: "kw",
    name: songInfo?.name || '',
    singer: songInfo?.singer || '',
    songmid: id,
    interval: songInfo?.interval || songInfo?.duration || '',
    albumName: songInfo?.albumName || songInfo?.album || '',
    quality: selectedQuality
  };
  const query = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
  const res = await httpRequestWithRetry(`${XINGHAI_BACKEND_API}?${query}`, {
    method: "GET",
    // v8.4 修复：上游 token 校验升级——自定义 X-Token 被判"无效/过期，请使用官方版本"返回 403；
    // 实测不带 X-Token 的第三方调用放行(200，受总 QPS 限，notice 要求标注来源)。故不再发送自定义 token。
    headers: {
      "X-Client": "lx-aggregate/12.0",
      "User-Agent": "LX-Music-Mobile"
    },
    timeout: TIMEOUT_CONFIG.parse
  });
  const body = res.body;
  if (!body || typeof body !== "object") throw new Error(`${ERROR_CODES.SERVER_ERROR}: 星海后端返回无效`);
  if (Number(body.code) !== 200 || !body.url) throw new Error(body.msg ? `${ERROR_CODES.NOT_FOUND}: ${body.msg}` : `${ERROR_CODES.NOT_FOUND}: 星海后端无可用链接`);
  // v1.0 (D2 模式)：实测 https 同路径 206 可播，http→https 升级，避免明文播放受限
  return String(body.url).replace(/^http:\/\//i, "https://");
}

/* Huibq（实测仅酷我真实，其他平台假兜底，默认关闭） */
async function huibqGetUrl(platform, songId, quality, songInfo) {
  if (!HUIBQ_API || !HUIBQ_REQUEST_KEY) throw new Error(`${ERROR_CODES.CONFIG_ERROR}: Huibq未配置`);
  const songIdVal = songInfo?.hash ?? songInfo?.songmid ?? songId;
  if (!songIdVal) throw new Error(`${ERROR_CODES.PARAM_ERROR}: Huibq缺少ID`);
  const selectedQuality = String(quality || "128k").toLowerCase(); // v1.0 (D10)：链级已过滤，直接音质
  const url = `${HUIBQ_API}/url/${platform}/${encodeURIComponent(songIdVal)}/${encodeURIComponent(selectedQuality)}`;
  const res = await httpRequestWithRetry(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", "User-Agent": getMobileUserAgent(), "X-Request-Key": HUIBQ_REQUEST_KEY },
    timeout: cfg('coldStartTimeoutMs', 8000) // v8.8：冷启动源放宽单源超时（默认8s）
  });
  const body = res.body;
  if (!body || typeof body !== "object" || Number.isNaN(Number(body.code))) throw new Error(`${ERROR_CODES.SERVER_ERROR}: Huibq返回无效`);
  if (Number(body.code) !== 0 || !body.url) throw new Error(body.msg || `${ERROR_CODES.NOT_FOUND}: Huibq未返回URL`);
  // v8.7：上游"未取到"时假成功治理——实测 tx/mg 请求拿不到时仍返回 code=0 + 一条可播但不属于该平台的兜底链
  //（msg「无法获取播放链接！」+ 酷我 panspace 链 206 可播 = 错歌）。必须按 msg 失败词判失败，避免静默交付错歌。
  if (isHuibqFailMsg(body.msg)) {
    throw new Error(`${ERROR_CODES.NOT_FOUND}: Huibq未取到该平台链接(${String(body.msg || "").slice(0, 40)})`);
  }
  return body.url;
}

/* 聆川（未配置，默认关闭；v2.0 密钥从 USER_CONFIG.lingchuanApiKey 读取，开配置即用） */
async function lingchuanGetUrl(platform, songId, quality, songInfo) {
  if (!LINGCHUAN_API) throw new Error(`${ERROR_CODES.CONFIG_ERROR}: 聆川未配置`);
  const hashOrMid = songInfo?.hash ?? songInfo?.songmid;
  if (!hashOrMid) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 聆川缺少hash/songmid`);
  const selectedQuality = String(quality || "128k").toLowerCase(); // v1.0 (D10)：链级已过滤，直接音质
  const url = `${LINGCHUAN_API}/url?source=${encodeURIComponent(platform)}&songId=${encodeURIComponent(hashOrMid)}&quality=${encodeURIComponent(selectedQuality)}`;
  const res = await httpRequestWithRetry(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", "User-Agent": getMobileUserAgent(), ...(USER_CONFIG.lingchuanApiKey ? { "Authorization": `Bearer ${USER_CONFIG.lingchuanApiKey}` } : {}) },
    follow_max: 5,
    timeout: TIMEOUT_CONFIG.parse
  });
  const body = res.body;
  if (!body || typeof body !== "object" || Number.isNaN(Number(body.code))) throw new Error(`${ERROR_CODES.SERVER_ERROR}: 聆川返回无效`);
  if (Number(body.code) !== 200 || !body.url) throw new Error(body.message || `${ERROR_CODES.NOT_FOUND}: 聆川未返回URL`);
  return body.url;
}

/* 溯音QQ（实测-403维护中，默认关闭） */
async function suyinQQGetUrl(songInfo, quality) {
  const qqId = getQQSongId(songInfo);
  if (!qqId) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 溯音QQ缺少songmid/id`);
  const normalizedQuality = qualityToSuyinQQ(quality);
  const startBr = QUALITY_TO_X.suyinQQ[normalizedQuality] || QUALITY_TO_X.suyinQQ["128k"];
  const brList = [startBr, 4, 5, 7]
    .filter((val, idx, arr) => arr.indexOf(val) === idx && val >= startBr)
    .sort((a, b) => a - b);
  let lastError = null;
  for (const br of brList) {
    try {
      const reqParams = { key: SUYIN_QQ_KEY, type: "json", br, n: 1 };
      if (qqId.type === "mid") reqParams.mid = qqId.value;
      else reqParams.songid = qqId.value;
      const res = await httpGet(SUYIN_QQ_API, reqParams, 'parse');
      if (res?.music) return res.music;
      if (res?.url) return res.url;
      if (res?.message) {
        const match = String(res.message).match(/音频链接[：:](.+?)(?:\n|$)/);
        if (match && match[1]) return match[1].trim();
      }
      throw new Error(`${ERROR_CODES.NOT_FOUND}: 溯音QQ未找到音频链接`);
    } catch (e) { lastError = e; }
  }
  throw lastError || new Error(`${ERROR_CODES.NOT_FOUND}: 溯音QQ全部音质尝试失败`);
}

/* 溯音163（免费歌真实128k直链，VIP歌url:null自动跳过，默认开启） */
async function suyin163GetUrl(songInfo) {
  const id = songInfo?.songmid || songInfo?.id;
  if (!id) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 溯音163缺少songmid/id`);
  const res = await httpGet(SUYIN_163_API, { id }, 'parse');
  if (res?.code === 0 && res?.data) {
    const item = Array.isArray(res.data) ? res.data[0] : res.data;
    if (item?.url) return item.url;
  }
  throw new Error(`${ERROR_CODES.NOT_FOUND}: 溯音163获取失败`);
}

/* 溯音酷我（实测可用：核心音源 + 全平台兜底，支持flac/320k/128k） */
async function suyinKuwoSearch(keyword, br, songInfo = null) {
  const res = await httpGet(SUYIN_KUWO_API, { msg: keyword, n: 1, br }, 'parse');
  if (res?.data?.url) {
    if (songInfo && !songInfoMatch(res, songInfo)) throw new Error(`${ERROR_CODES.MISMATCH}: 溯音酷我歌曲信息不匹配`);
    return res.data.url;
  }
  if (res?.message) {
    const match = String(res.message).match(/音乐链接[：:](\S+)/);
    if (match && match[1]) {
      if (songInfo) {
        const parsed = parseMessageSongInfo(res.message);
        if (parsed && !songInfoMatch(parsed, songInfo)) throw new Error(`${ERROR_CODES.MISMATCH}: 溯音酷我歌曲信息不匹配`);
      }
      return match[1];
    }
  }
  throw new Error(`${ERROR_CODES.NOT_FOUND}: 溯音酷我未找到链接`);
}

async function suyinKuwoGetUrl(songInfo, quality) {
  if (!songInfo?.name) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 溯音酷我需要歌曲名`);
  const cacheKey = buildCacheKey("kw", songInfo, quality);
  const cached = getCachedUrl(cacheKey);
  // v7.0 (S1)：内部缓存命中返回裸 URL 字符串（validateUrl 只接受字符串；子源透出由外层统一组装）
  if (cached && cached.url) return cached.url;
  // v1.0 (D10)：链级已按 maxQuality 过滤，此处直接用请求音质，不再二次降级
  const br = QUALITY_TO_X.kuwo[String(quality || "128k").toLowerCase()] || 1;
  const keywords = buildSearchKeywords(songInfo);
  let lastError = null;
  for (const item of keywords) {
    try {
      // v1.0 P0-2：兜底档(strict=false)也做歌名校验+时长校验（轻量：歌手/专辑可放宽，但歌名与时长必须一致）
      const url = await suyinKuwoSearch(item.keyword, br, item.strict ? songInfo : { name: songInfo.name, duration: songInfo.duration });
      if (url) {
        // v1.0 P0：解析出的酷我CDN链接必须Range可播，否则视为签名过期死链(410)，不缓存、不计成功，继续下一源
        // v1.0 P0-3 (D2)：先升级 https 再校验，确保返回的 https 直链真实可播
        const httpsUrl = upgradeToHttps(url);
        if (!await isAudioPlayable(httpsUrl, 2500)) {
          // v6.0：CDN 410 签名死链改用 LINK_EXPIRED 码——失败缓存走 1min 差异化 TTL（旧用 NOT_FOUND 缓存 1h，恢复要等近1小时才重试该歌）
          const suyinExpiredErr = new Error(`${ERROR_CODES.LINK_EXPIRED}: 溯音酷我签名URL已过期(CDN 410)，不可播`);
          suyinExpiredErr.code = ERROR_CODES.LINK_EXPIRED; // v8.10.4：同上，必须设 code
          throw suyinExpiredErr;
        }
        setCachedUrl(cacheKey, httpsUrl, String(quality || "128k").toLowerCase());
        return httpsUrl;
      }
    } catch (e) { lastError = e; }
  }
  throw lastError || new Error(`${ERROR_CODES.NOT_FOUND}: 溯音酷我失败`);
}

/* 溯音咪咕（实测502，默认关闭） */
async function suyinMiguGetUrl(songInfo) {
  if (!songInfo?.name) throw new Error(`${ERROR_CODES.PARAM_ERROR}: 溯音咪咕需要歌曲名`);
  const cacheKey = buildCacheKey("mg", songInfo);
  const cached = getCachedUrl(cacheKey);
  // v7.0 (S1)：内部缓存命中返回裸 URL 字符串（validateUrl 只接受字符串；子源透出由外层统一组装）
  if (cached && cached.url) return cached.url;
  const keywords = buildSearchKeywords(songInfo);
  let lastError = null;
  for (const item of keywords) {
    try {
      const res = await httpGet(SUYIN_MIGU_API, { gm: item.keyword, n: 1, num: 1, type: "json" }, 'parse');
      if (res?.code === 200 && res?.musicInfo) {
        // v1.0 P0-2：兜底档也做歌名校验+时长校验（与溯音酷我一致，轻量：歌手/专辑可放宽）
        if (!songInfoMatch(res, item.strict ? songInfo : { name: songInfo.name, duration: songInfo.duration })) throw new Error(`${ERROR_CODES.MISMATCH}: 溯音咪咕歌曲信息不匹配`);
        // v6.0：修复缓存/返回缺陷——musicInfo 为对象不能当直链缓存与返回（validateUrl 必拦、缓存永不命中）。
        // 上游 502 实测无法确认字段结构，统一按字符串 URL 提取，失败抛明确错误（不把对象伪装成直链）
        const miguUrl = typeof res.musicInfo === "string"
          ? res.musicInfo
          : (typeof res.musicInfo?.url === "string" ? res.musicInfo.url : null);
        if (!miguUrl || !HTTP_URL_REGEX.test(miguUrl)) throw new Error(`${ERROR_CODES.SERVER_ERROR}: 溯音咪咕未返回可用的音频直链(字段结构待上游恢复后验证)`);
        setCachedUrl(cacheKey, miguUrl, "128k");
        return miguUrl;
      }
    } catch (e) { lastError = e; }
  }
  throw lastError || new Error(`${ERROR_CODES.NOT_FOUND}: 溯音咪咕失败`);
}

/* 溯音统一入口 */
async function suyinGetUrl(platform, songId, quality, songInfo) {
  switch (platform) {
    case "tx": return suyinQQGetUrl(songInfo, quality);
    case "wy": return suyin163GetUrl(songInfo);
    case "kw": return suyinKuwoGetUrl(songInfo, quality);
    case "mg": return suyinMiguGetUrl(songInfo);
    default: throw new Error(`${ERROR_CODES.PARAM_ERROR}: 溯音不支持该平台`);
  }
}

/* 长青/念心SVIP（v1.0实测仅kw恢复：302→car-er.kuwo.cn新鲜mp3；其余平台仍403/401/404；v1.0 D10模板工厂化） */
function createTemplateVipSource(templateUrl, rejectRe, sourceName) {
  return async function templateVipGetUrl(platform, songId, quality, songInfo) {
    if (platform !== "kw") throw new Error(`${ERROR_CODES.PARAM_ERROR}: ${sourceName}今日仅kw恢复(其余平台仍403/401/404)`);
    const id = getPlatformSongId(platform, songInfo);
    if (!id) throw new Error(`${ERROR_CODES.PARAM_ERROR}: ${sourceName}缺少kw rid`);
    // 仅128k测通，固定standard级别，忽略请求音质
    const target = templateUrl.replace("{id}", encodeURIComponent(String(id))).replace("{level}", encodeURIComponent("standard"));
    // v1.0：跟随302取car-er.kuwo.cn新鲜mp3直链（Range轻量校验，不下载全曲）
    const res = await httpRequestWithRetry(target, {
      method: "GET",
      headers: { "User-Agent": getMobileUserAgent(), "Range": "bytes=0-1023" },
      timeout: TIMEOUT_CONFIG.parse,
      follow_max: 5
    });
    const finalUrl = res.url || target;
    if (!HTTP_URL_REGEX.test(finalUrl) || rejectRe.test(finalUrl)) {
      throw new Error(`${ERROR_CODES.NOT_FOUND}: ${sourceName}未跟随到音频直链`);
    }
    // v1.0 P0-3 (D2)：http→https 升级
    return upgradeToHttps(finalUrl);
  };
}

// v4.0：Juhe 聚合API(CF)——kw 平台 303 重定向校验协议（实测：POST /kw 返回 request+check 规则，
// 再请求重定向 URL，校验 body.code==200 后取 body.data.url 为真实直链）
async function juheGetUrl(platform, songId, quality, songInfo) {
  const juheQ = String(quality || "128k").toLowerCase();
  const mid = songInfo?.songmid || songInfo?.id || songId || "";
  // v4.0：各平台标识字段——kw/tx/mg 用 songmid，wy 用 id，kg 用 hash（酷狗哈希）
  // 实测（2026-10-28）：tx 全链路通(POST→303→vkeys 中转→qqmusic 直链)；wy/kg/mg 服务端
  // 当前受限(网易云上游 1027 风控/取链失败/超时)，注册为尽力型源，恢复即自动可用
  const idFields = platform === "kg"
    ? { hash: songInfo?.hash || mid, songmid: mid, id: mid }
    : platform === "wy"
      ? { id: mid, songmid: mid }
      : { songmid: mid, id: mid };
  // v6.0：完整字段透传（借鉴 HYWmusic 模式）——tx 高音质解析依赖 strMediaMid/mediaMid、
  // kg 依赖 hash、mg 依赖 copyrightId/rid/albumAudioId 等原始 ID；meta.* 层兜底，
  // 服务端拿到完整字段才能解析高音质直链
  const extraFields = {};
  for (const f of ['strMediaMid', 'mediaMid', 'hash', 'rid', 'copyrightId', 'musicId', 'albumAudioId', 'albumId', 'albumMid', 'songid', 'songId']) {
    const v = songInfo?.[f];
    if (v !== undefined && v !== null && v !== '') extraFields[f] = v;
  }
  for (const f of ['strMediaMid', 'mediaMid', 'hash', 'rid', 'copyrightId', 'name', 'singer', 'album']) {
    const v = songInfo?.meta?.[f];
    if (v !== undefined && v !== null && v !== '' && extraFields[f] === undefined) extraFields[f] = v;
  }
  const info = {
    type: juheQ,
    musicInfo: {
      ...extraFields,
      name: songInfo?.name || "",
      singer: songInfo?.singer || "",
      album: songInfo?.album || "",
      duration: songInfo?.duration || 0,
      interval: Math.round((songInfo?.duration || 0) / 1000),
      source: platform === "kw" ? "kw" : String(platform || "kw"),
      ...idFields,
      quality: juheQ
    }
  };
  const res = await httpRequestWithRetry(`${JUHE_API}/${platform}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": getMobileUserAgent() },
    body: JSON.stringify(info),
    timeout: 15000
  }, 1);
  const d = res.body;
  if (d && d.code === 200 && typeof d.data?.url === "string") return upgradeToHttps(d.data.url);
  if (d && d.code === 303 && d.data?.request) {
    const r = d.data.request;
    const resp = await httpRequest(r.url, {
      method: String(r.options?.method || "GET").toUpperCase(),
      headers: r.options?.headers || {},
      timeout: 10000
    });
    // 校验作用于整个响应对象（body 已由 httpRequest 解析为对象）：
    // check.key ['body','code'] → resp.body.code；url ['body','data','url'] → resp.body.data.url
    const check = d.data.response?.check;
    if (check && check.key?.length) {
      const got = check.key.reduce((acc, k) => (acc && typeof acc === "object" ? acc[k] : undefined), resp);
      if (got !== check.value) throw new Error(`${ERROR_CODES.NOT_FOUND}: Juhe重定向校验失败`);
    }
    const u = (d.data.response?.url || []).reduce((acc, k) => (acc && typeof acc === "object" ? acc[k] : undefined), resp);
    if (typeof u === "string" && /^https?:/.test(u)) return upgradeToHttps(u);
    throw new Error(`${ERROR_CODES.NOT_FOUND}: Juhe重定向未取到直链`);
  }
  throw new Error(`${ERROR_CODES.NOT_FOUND}: Juhe响应异常(${d?.msg || "未知"})`);
}

const changqingGetUrl = createTemplateVipSource(CHANGQING_URL_TEMPLATES.kw, /kw\.php/, "长青");
const nianxinGetUrl = createTemplateVipSource(NIANXIN_URL_TEMPLATES.kw, /nxinxz\.com/, "念心");

function getPlatformSongId(platform, songInfo) {
  if (platform === "kg") return songInfo?.hash || songInfo?.songmid || songInfo?.id || songInfo?.rid || songInfo?.mid || null;
  if (platform === "tx") {
    const qqId = getQQSongId(songInfo);
    if (qqId?.value) return qqId.value;
  }
  return songInfo?.songmid || songInfo?.id || songInfo?.songId || songInfo?.rid || songInfo?.hash || null;
}

// v3.0：健康统计快照——供 App 健康面板/巡检消费；返回各源成功率/均时/熔断状态/健康分
function getHealthSnapshot() {
  const snapshot = {};
  for (const id of Object.keys(SOURCE_HANDLERS)) {
    const h = SOURCE_HANDLERS[id];
    const stats = getSourceStats(id);
    const score = computeHealthScore(id);
    snapshot[id] = {
      name: h.name,
      maxQuality: h.maxQuality,
      enabled: runtimeToggles[id] !== false,
      successRate: stats.successRate,
      avgTime: stats.avgTime,
      state: stats.state,
      // v6.0：真实播放请求最后使用时间戳（App 五级分区'使用中'判定；0=从未用过）
      lastUsedAt: lastUsedAt.get(id) || 0,
      // v4.0：样本计数（App 显示采样数；无样本的 successRate/avgTime 为 null → 显示"-"）
      reqCount: stats.reqCount,
      probeCount: stats.probeCount,
      // v4.0：休眠状态（连续失败轮休眠，每 PROBE_WAKE_EVERY_ROUND 轮复活试探；App 显示"休眠中"）
      sleeping: !!probeState.sleeping[id],
      // v4.0：版权/业务失败计数（无版权歌等；App 面板可在后续版本展示）
      copyrightFail: stats.copyrightFail,
      // v4.0：按音质分档统计（面板后续版本可消费）
      byQuality: stats.byQuality,
      // v7.0：播放实时摘除状态（连续播放失败被摘除；App 可显示"已摘除"）
      playDead: isPlayDead(id),
      // v4.0：限流状态（被限=连续429，App 显示"被限"而非"熔断"）
      rateLimited: !!getBreaker(id).rateLimited,
      rateLimitCount: getBreaker(id).rateLimitCount || 0,
      // v6.0：最近成功交付音质（音质协商链降档后诊断用）
      lastQuality: getBreaker(id).lastQuality || null,
      // v7.0：健康分输出改 10 分制（0~10，一位小数）——内部评分仍为 0~1（排序/熔断逻辑不变），
      // 仅快照输出 ×10 换算，配合 App 健康面板直观显示；负分保留（异常源 App 标红）
      healthScore: Number((score.score * 10).toFixed(1))
    };
  }
  // v8.0：平台级降级聚合（按平台分组子源，判断某平台全部启用子源是否失效）
  // v8.10.3：平台分组不再手写——旧实现漏了"链构建会对所有非 kw 平台追加 suyinKuwo"这一事实
  // （wy/tx/mg/kg 的分组清单都没列它），导致这些平台只剩 suyinKuwo 活着时被判"无活跃源/全挂"。
  // 现改为按各音质把 buildSourceChain 的结果取并集：分组与竞速链永远一致，不会再漂移。
  const PLATFORM_GROUPS = {};
  for (const p of Object.keys(PLATFORM_QUALITIES)) {
    const set = new Set();
    for (const q of ["128k", "320k", "flac", "flac24bit"]) {
      for (const h of buildSourceChain(p, q)) set.add(h.id);
    }
    PLATFORM_GROUPS[p] = [...set];
  }
  const platformSummary = {};
  const healthyPlatforms = [];
  for (const [platform, sourceIds] of Object.entries(PLATFORM_GROUPS)) {
    const activeSources = sourceIds.filter(id => snapshot[id] && snapshot[id].enabled);
    if (!activeSources.length) {
      platformSummary[platform] = { degraded: false, reason: "no_active_sources" };
      continue;
    }
    // v30.1：deadCount 加上 half-open 状态（半开试探中也算"可能还坏着"）
    const deadCount = activeSources.filter(id =>
      snapshot[id].playDead || snapshot[id].sleeping ||
      snapshot[id].state === "open" || snapshot[id].state === "half-open"
    ).length;
    const allDead = deadCount === activeSources.length;
    // v30.1：计算平台平均健康分（用于选兜底平台）
    const avgScore = activeSources.reduce((sum, id) => sum + (snapshot[id].healthScore || 0), 0) / activeSources.length;
    platformSummary[platform] = { degraded: allDead, activeCount: activeSources.length, deadCount, avgScore: Math.round(avgScore * 10) / 10 };
    if (!allDead) healthyPlatforms.push({ platform, avgScore });
  }
  snapshot._platformSummary = platformSummary;
  // v30.1：兜底平台选健康分最高的（不再是第一个）
  healthyPlatforms.sort((a, b) => b.avgScore - a.avgScore);
  snapshot._fallbackPlatform = healthyPlatforms[0]?.platform || null;
  return snapshot;
}

// ============================================================
// 第七部分：音源注册表 + 调度（源级音质过滤 + 竞速回退 + 6s整体超时）
// ============================================================
// v1.0 P0-1：每个源标注 maxQuality 真实能力；buildSourceChain 按请求音质过滤，杜绝128k源冒充flac竞速
const SOURCE_HANDLERS = {
  gdWy: { id: "gdWy", name: "GD Studio(网易)", fn: gdWyGetUrl, maxQuality: "flac", batch: 2 }, // v8.8：配额源（5min/50次）降到后批，前批失败才打，省配额
  wyOuter: { id: "wyOuter", name: "网易云官方", fn: wyOuterGetUrl, maxQuality: "128k" },
  kuwoOfficial: { id: "kuwoOfficial", name: "酷我官方直连", fn: kuwoOfficialGetUrl, maxQuality: "128k" },
  helloworldKw: { id: "helloworldKw", name: "helloworld(kw)", fn: helloworldKwGetUrl, maxQuality: "flac" }, // v7.0：生态候选实证通过——kw 128k/320k/flac 三档直链(convert_url_with_sign + htw v1 双通道)
  ikun: { id: "ikun", name: "ikun", fn: ikunGetUrl, maxQuality: "flac" },
  xinghaiBackup: { id: "xinghaiBackup", name: "星海备", fn: xinghaiBackupGetUrl, maxQuality: "128k" },
  xinghaiBackend: { id: "xinghaiBackend", name: "星海后端", fn: xinghaiBackendGetUrl, maxQuality: "flac" },
  huibq: { id: "huibq", name: "Huibq", fn: huibqGetUrl, maxQuality: "320k", coldStart: true, platforms: ["kw", "wy"] }, // v8.9：仅 kw/wy（实测 tx/mg/kg 必败）；v8.8：冷启动源（onrender 免费实例，预热 + 放宽超时）
  lingchuan: { id: "lingchuan", name: "聆川", fn: lingchuanGetUrl, maxQuality: "320k", platforms: ["kw", "wy", "tx", "mg", "kg"] }, // v8.10.3：显式声明全平台（协议为 source=平台由服务端路由），实测收窄只需改此一处
  suyinQQ: { id: "suyinQQ", name: "溯音QQ", fn: (platform, songId, quality, songInfo) => suyinGetUrl("tx", songId, quality, songInfo), maxQuality: "flac" },
  suyin163: { id: "suyin163", name: "溯音163", fn: (platform, songId, quality, songInfo) => suyinGetUrl("wy", songId, quality, songInfo), maxQuality: "128k" },
  suyinKuwo: { id: "suyinKuwo", name: "溯音酷我", fn: (platform, songId, quality, songInfo) => suyinKuwoGetUrl(songInfo, quality), maxQuality: "flac", verified: true }, // v8.4：128k br 修正为 9（实测唯一可播）；flac/320k 当前为 VIP 死链(br=1/5 均410)会失败降级，保留 maxQuality 以便 oiapi 恢复高音质时自动可用
  juheKw: { id: "juheKw", name: "Juhe聚合(kw)", fn: juheGetUrl, maxQuality: "flac" }, // v4.0：Juhe 独立新源族(kw 全音质)
  // v4.0：Juhe 源族扩充——tx 全链路实测通；wy/kg/mg 协议已实证(按平台标识字段路由)，服务端受限时由熔断/降级兜底
  juheTx: { id: "juheTx", name: "Juhe聚合(tx)", fn: juheGetUrl, maxQuality: "flac" },
  juheWy: { id: "juheWy", name: "Juhe聚合(wy)", fn: juheGetUrl, maxQuality: "flac" },
  juheKg: { id: "juheKg", name: "Juhe聚合(kg)", fn: juheGetUrl, maxQuality: "flac" },
  juheMg: { id: "juheMg", name: "Juhe聚合(mg)", fn: juheGetUrl, maxQuality: "flac" },
  suyinMigu: { id: "suyinMigu", name: "溯音咪咕", fn: (platform, songId, quality, songInfo) => suyinGetUrl("mg", songId, quality, songInfo), maxQuality: "flac", verified: true }, // v3.0：内部做 songInfoMatch 校验，竞速优先
  changqingVip: { id: "changqingVip", name: "长青kw", fn: changqingGetUrl, maxQuality: "128k" },
  nianxinVip: { id: "nianxinVip", name: "念心kw", fn: nianxinGetUrl, maxQuality: "128k" }
};

// 构建音源链：按平台 + 请求音质过滤源能力（maxQuality >= 请求音质），高音质源在前
function buildSourceChain(platform, quality) {
  const chain = [];
  const t = runtimeToggles;
  const q = String(quality || "128k").toLowerCase();
  const canDo = (h) => qualityRank(h.maxQuality) >= qualityRank(q);
  const push = (h) => {
    // v7.0：播放连续失败被摘除的源不进链（不等探测周期；探测通过自动回归）
    if (isPlayDead(h.id)) {
      if (LOG_DEBUG) logDebug(`[链] ${h.id} 播放连续失败${playDeadStreak.get(h.id)}次，已摘除`);
      return;
    }
    if (h && canDo(h)) chain.push(h);
    else if (h && LOG_DEBUG) logDebug(`[链] ${h.id}(maxQuality=${h.maxQuality}) 不满足请求音质(${q})，已过滤`);
  };

  if (platform === "kw") {
    // 高音质(flac/320k)：溯音酷我 + 星海后端 双源(v1.0)；128k：溯音酷我 + 星海后端 + 酷我官方 + 长青 + 念心 多源竞速兜底
    if (t.suyinKuwo) push(SOURCE_HANDLERS.suyinKuwo);
    if (t.xinghaiBackend) push(SOURCE_HANDLERS.xinghaiBackend);
    // v4.0：Juhe 独立新源族(kw 全音质)——排在既有稳定源之后作兜底
    if (t.juheKw) push(SOURCE_HANDLERS.juheKw);
    // v8.0：helloworld(kw) 从高音质竞速降为备用——实测发现部分歌曲返回酷我VIP试听片段(5秒)，
    // 与溯音/星海并列竞速时经常先返回试听片段；移到 Juhe 之后，只有前面都失败才用它
    if (t.helloworldKw) push(SOURCE_HANDLERS.helloworldKw);
    if (t.kuwoOfficial) push(SOURCE_HANDLERS.kuwoOfficial);
    // v1.0：长青/念心 kw 128k，排在现有稳定源之后
    if (t.changqingVip) push(SOURCE_HANDLERS.changqingVip);
    if (t.nianxinVip) push(SOURCE_HANDLERS.nianxinVip);
    if (t.ikun) push(SOURCE_HANDLERS.ikun);
  }
  if (platform === "wy") {
    // 高音质(flac/320k)：GD Studio 优先(高音质补充)，suyinKuwo 搜索兜底；
    // 128k：suyin163 + wyOuter 官方直连优先（GD Studio 不进128k链，省配额）
    if (t.gdWy && (q === "flac" || q === "flac24bit" || q === "320k" || q === "hires")) push(SOURCE_HANDLERS.gdWy);
    // v4.0：Juhe wy 全音质兜底（服务端恢复即自动参与竞速）
    if (t.juheWy) push(SOURCE_HANDLERS.juheWy);
    if (t.suyin163) push(SOURCE_HANDLERS.suyin163);
    if (t.wyOuter) push(SOURCE_HANDLERS.wyOuter);
    if (t.ikun) push(SOURCE_HANDLERS.ikun);
  }
  // 全平台兜底（kw 已在上面 push，这里其余平台追加）
  if (t.suyinKuwo && platform !== "kw") push(SOURCE_HANDLERS.suyinKuwo);
  // 其他平台/备用源
  if (t.suyinQQ && platform === "tx") push(SOURCE_HANDLERS.suyinQQ);
  if (t.juheTx && platform === "tx") push(SOURCE_HANDLERS.juheTx); // v4.0：Juhe tx 兜底
  if (t.suyinMigu && platform === "mg") push(SOURCE_HANDLERS.suyinMigu);
  if (t.juheMg && platform === "mg") push(SOURCE_HANDLERS.juheMg); // v4.0：Juhe mg 兜底
  // v4.0：Juhe kg——kg 平台专属新源（酷狗 hash 路由）
  if (t.juheKg && platform === "kg") push(SOURCE_HANDLERS.juheKg);
  if (t.xinghaiBackup && platform !== "kg") push(SOURCE_HANDLERS.xinghaiBackup);
  // 长青/念心已在 kw 块内按 kw-only 顺序 push（maxQuality=128k，仅进kw 128k链）
  // v8.9：huibq 仅支持 kw/wy（2026-11-06 实测：tx/mg/kg 均返回"无法获取播放链接"，必败兜底白耗 1~1.5s）
  // v8.9：按 handler 的 platforms 能力声明过滤（单一真相，避免链构建与声明各写一份而漂移）
  if (t.huibq && (!SOURCE_HANDLERS.huibq.platforms || SOURCE_HANDLERS.huibq.platforms.includes(platform))) push(SOURCE_HANDLERS.huibq);
  if (t.lingchuan) push(SOURCE_HANDLERS.lingchuan);
  return chain;
}

// v3.0：排序改用综合健康评分（成功率×置信度 + 均时 + 连续失败惩罚）；分数差>0.05 优先，否则按均时兜底
function sortChainByHealth(chain) {
  return chain.slice().sort((a, b) => {
    // v4.0：verified 源(内部 songInfoMatch 校验)附加优先权重——健康分相近时已校验源靠前（串行兜底顺序）；
    // 竞速层 raceFirst 已有 verified 优先返回机制，此权重仅优化 rest 兜底顺序
    const av = a.verified ? 0.15 : 0;
    const bv = b.verified ? 0.15 : 0;
    const ha = computeHealthScore(a.id).score + av;
    const hb = computeHealthScore(b.id).score + bv;
    if (Math.abs(hb - ha) > 0.05) return hb - ha;
    return computeHealthScore(a.id).avgTime - computeHealthScore(b.id).avgTime;
  });
}

// v8.8：竞速执行器重写
// ① 分批错峰并发：批1 启动后 staggerMs 内未成功即启动批2（不再"竞速3个+串行rest"）
// ② 全局预算：deadline 由 getUrlWithFallback 跨音质档共享
// ③ verified 精确等待：仅当批次里还有"未 settle 的 verified 源"才给匹配等待；否则立即交付
function raceFirst(launchers, opts = {}) {
  const batchSize = Math.max(1, Number(opts.batchSize || cfg('raceBatchSize', 3)));
  const staggerMs = Math.max(0, Number(opts.staggerMs !== undefined ? opts.staggerMs : cfg('raceBatchStaggerMs', 300)));
  const matchWaitMs = Math.max(0, Number(opts.matchWaitMs !== undefined ? opts.matchWaitMs : cfg('raceMatchWaitMs', 600)));
  const deadline = Number(opts.deadline || (Date.now() + cfg('raceBudgetMs', 12000)));
  if (!launchers || launchers.length === 0) {
    return Promise.reject(new Error(`${ERROR_CODES.NOT_FOUND}: 无可竞速的音源`));
  }
  return new Promise((resolve, reject) => {
    let settled = false;
    let started = 0;
    let pending = 0;
    let verifiedPending = 0;
    let candidate = null;
    let waiter = null;
    let budgetTimer = null;
    const errs = [];
    const total = launchers.length;
    const settle = (val) => {
      if (settled) return;
      settled = true;
      if (waiter) { clearTimeout(waiter); waiter = null; }
      if (budgetTimer) { clearTimeout(budgetTimer); budgetTimer = null; }
      resolve(val);
    };
    const fail = (err) => {
      if (settled) return;
      settled = true;
      if (waiter) { clearTimeout(waiter); waiter = null; }
      if (budgetTimer) { clearTimeout(budgetTimer); budgetTimer = null; }
      reject(err);
    };
    const startOne = (i) => {
      const item = launchers[i];
      const h = (item && item.handler) || null;
      const run = typeof item === "function" ? item : (item && item.run);
      const isVerified = !!(h && h.verified);
      started += 1;
      pending += 1;
      if (isVerified) verifiedPending += 1;
      Promise.resolve().then(run).then(
        (res) => {
          pending -= 1;
          if (isVerified) verifiedPending -= 1;
          if (settled) return;
          const url = (res && typeof res === "object" && res.url) ? res.url : res;
          const source = (res && typeof res === "object" && res.source) ? res.source : ((h && h.id) || "");
          logDebug(`[竞速] 候选成功: 源=${source || "未知"} verified=${isVerified}`);
          if (isVerified) return settle({ url, source: source || "" });
          if (!candidate) {
            candidate = { url, source: source || "" };
            if (verifiedPending > 0 && matchWaitMs > 0) {
              waiter = setTimeout(() => { waiter = null; if (!settled && candidate) settle(candidate); }, matchWaitMs);
            } else {
              settle(candidate);
            }
          }
        },
        (e) => {
          pending -= 1;
          if (isVerified) verifiedPending -= 1;
          errs.push(e);
          if (settled) return;
          if (candidate && verifiedPending === 0) return settle(candidate);
          if (pending === 0 && started >= total) {
            logDebug(`[竞速] 候选全败: ${errs.length} 个: ${errs.map(x => String((x && x.message) || "")).join(" | ")}`);
            return fail({ allFailed: true, errors: errs });
          }
        }
      );
    };
    const launchBatch = () => {
      if (settled) return;
      const endIdx = Math.min(started + batchSize, total);
      while (started < endIdx) startOne(started);
      if (started < total) setTimeout(launchBatch, staggerMs);
    };
    launchBatch();
    budgetTimer = setTimeout(() => {
      budgetTimer = null;
      if (settled) return;
      if (candidate) return settle(candidate);
      fail(new Error(`${ERROR_CODES.NETWORK_TIMEOUT}: 竞速预算耗尽(${cfg('raceBudgetMs', 12000)}ms)`));
    }, Math.max(deadline - Date.now(), 0));
  });
}

// v4.0：单源并发计数 + 滑动窗口限速（超限本轮跳过，不阻塞其他源）
const inflightCount = new Map();
// v6.0：真实播放请求最后使用时间戳（健康快照 lastUsedAt，供 App 判断'使用中'分组）
const lastUsedAt = new Map();
const reqTimestamps = new Map();
function throttleCheck(sourceId) {
  const inflight = inflightCount.get(sourceId) || 0;
  const maxConc = cfg('maxConcurrency', SOURCE_MAX_CONCURRENCY);
  if (inflight >= maxConc) {
    logDebug(`[限速] ${sourceId} 并发${inflight}≥${maxConc}，本轮跳过`);
    return false;
  }
  const now = Date.now();
  const winMs = cfg('rateWindowMs', RATE_WINDOW_MS);
  const winMax = cfg('rateWindowMax', RATE_WINDOW_MAX);
  const ts = (reqTimestamps.get(sourceId) || []).filter(t => now - t < winMs);
  reqTimestamps.set(sourceId, ts);
  if (ts.length >= winMax) {
    logDebug(`[限速] ${sourceId} ${winMs / 1000}s内${ts.length}次≥${winMax}，本轮跳过`);
    return false;
  }
  return true;
}
async function wrapExecute(handler, platform, songInfo, quality) {
  if (!canExecute(handler.id)) {
    logDebug(`[断路器] ${handler.id} 处于${getBreaker(handler.id).state}状态，跳过`);
    // v6.0：熔断跳过打 isThrottleSkip 标记——catch 短路抛出，不再误记 recordRateLimit
    //（旧实现熔断期每轮跳过都虚增 rateLimitCount，App 面板限流计数被污染）
    const breakerSkip = new Error(`${ERROR_CODES.RATE_LIMIT}: 音源[${handler.name}]已熔断`);
    breakerSkip.isThrottleSkip = true;
    throw breakerSkip;
  }
  if (!throttleCheck(handler.id)) {
    // v6.0：本地并发/限速保护跳过——标记 isThrottleSkip：非上游429，不记限流统计、不污染成功率、
    // 不触发 30s 退避（旧实现误记 recordRateLimit，流量高峰会把源冤枉成"被限"）
    const skipErr = new Error(`${ERROR_CODES.RATE_LIMIT}: 音源[${handler.name}]触发并发/限速保护，本轮跳过`);
    skipErr.isThrottleSkip = true;
    throw skipErr;
  }
  inflightCount.set(handler.id, (inflightCount.get(handler.id) || 0) + 1);
  // v8.0：防御性初始化——不依赖 throttleCheck 先调用，直接确保数组存在
  if (!reqTimestamps.has(handler.id)) reqTimestamps.set(handler.id, []);
  reqTimestamps.get(handler.id).push(Date.now());
  // v6.0：真实播放请求（成败均记）——健康面板'使用中'判定依据；探测不经过此路径
  lastUsedAt.set(handler.id, Date.now());
  const startTime = Date.now();
  try {
    const url = await handler.fn(platform, getHashOrMid(songInfo), quality, songInfo);
    // v8.10.2：先验后记——validateUrl 抛错时不再"既记成功又记业务失败"（旧顺序同一请求双记账，
    // 成功率分子分母各被记一次，健康分失真；也掩盖了真失败）
    const finalUrl = validateUrl(url, handler.name);
    recordSuccess(handler.id, Date.now() - startTime, quality);
    logInfo(`[${handler.name}] 解析成功: ${songInfo?.name || ""} 音质[${quality || "128k"}]`);
    return finalUrl;
  } catch (e) {
    // v6.0：本地节流跳过——不记账直接抛出（finally 仍释放并发计数）
    if (e && e.isThrottleSkip) {
      // v8.10.2：半开收口——canExecute 放行一次后若被本地节流/熔断拦下，试探并未真正发生，
      // 状态不能停在 half-open（那里恒返回 false，该源会永久不被调用）；退回 open 重新等冷却
      const b = getBreaker(handler.id);
      if (b.state === "half-open") {
        b.state = "open";
        b.lastFailureTime = Date.now();
        logWarn(`断路器[${handler.id}] 半开试探被本地节流拦下，退回熔断等待下次冷却`);
      }
      throw e;
    }
    // v6.0：删除 catch 里的 inflightCount 递减——finally 已统一释放；
    // 旧实现 catch+finally 双递减会把并发中其他请求的计数也归零，单源并发保护(2)失效
    // v3.0：失败原因结构化透出——给错误附加源 id，供聚合 detail 关联具体子源
    if (e && typeof e === "object" && !e.sourceId) e.sourceId = handler.id;
    // v1.0：决策日志——区分熔断类错误(网络类)与业务失败(不熔断)
    logDebug(`[${handler.name}] 失败 code=${e.code || "?"} msg=${e.message}; 熔断类=${e.code === ERROR_CODES.NETWORK_TIMEOUT || e.code === ERROR_CODES.NETWORK_ERROR || e.code === ERROR_CODES.SERVER_ERROR || e.code === ERROR_CODES.RATE_LIMIT}`);
    // v1.0 (D8)：仅网络类错误(超时/5xx/429)计入熔断——业务失败(NOT_FOUND/MISMATCH等)说明源已正常响应，
    // 不应因"歌不存在/无版权"累积连续失败而误熔断健康源
    if (e.code === ERROR_CODES.RATE_LIMIT) {
      // v4.0：429 限流单独处理（不熔断，短退避）
      recordRateLimit(handler.id, quality);
    } else if (e.code === ERROR_CODES.NETWORK_TIMEOUT || e.code === ERROR_CODES.NETWORK_ERROR ||
        e.code === ERROR_CODES.SERVER_ERROR) {
      recordFailure(handler.id, quality);
    } else {
      // v4.0：业务失败（无版权404/歌不存在/错歌）单独归类——源正常响应，不再计入成功也不计入熔断，
      // 只记 copyrightFail（快照可见，健康分/成功率分母剔除）
      recordBusinessFail(handler.id, quality);
      // v8.9：410 死链单独计"档位能力失败"——短路判据要区分"这首歌没有(404)"与"这一档拿不到(410)"：
      // 404 是歌的问题不能短路源该档；410 是档位/权限问题（如 oiapi flac VIP 死链）应当短路
      if (e.code === ERROR_CODES.LINK_EXPIRED) {
        const qStat = getBreaker(handler.id).byQuality[String(quality)];
        if (qStat) qStat.linkExpired = (qStat.linkExpired || 0) + 1;
      }
    }
    throw e;
  } finally {
    inflightCount.set(handler.id, Math.max((inflightCount.get(handler.id) || 0) - 1, 0));
  }
}

// v1.0 P0-5：fallbackRace 加 6s 整体超时；超时后继续 rest 串行
async function fallbackRace(chain, platform, songInfo, quality, deadline) {
  // v8.8：预算耗尽快速失败（跨音质档共享）
  if (deadline && Date.now() >= deadline) {
    const budgetErr = new Error(`${ERROR_CODES.NETWORK_TIMEOUT}: 竞速预算耗尽(${cfg('raceBudgetMs', 12000)}ms)，跳过本档`);
    budgetErr.detail = [{ source: "budget", quality, code: ERROR_CODES.NETWORK_TIMEOUT, reason: "预算耗尽" }];
    throw budgetErr;
  }
  // v3.0：失败原因结构化——detail 数组每项 {source, quality, code, reason}，供 App 端展示/统计
  const collectDetails = [];
  if (chain.length === 1) {
    // v7.0：单链请求打点（可观测：只走一个候选源时的开始）
    logDebug(`[竞速] 单链请求: ${platform} ${quality} 源=${chain[0].id}`);
    try {
      return { url: await wrapExecute(chain[0], platform, songInfo, quality), source: chain[0].id };
    } catch (e) {
      const code = extractErrorCode(e);
      const aggErr = new Error(`${chain[0].name}: ${e.message}`);
      aggErr.code = code;
      collectDetails.push({ source: chain[0].id, quality, code, reason: String((e && e.message) || "") });
      aggErr.detail = collectDetails;
      throw aggErr;
    }
  }
  // v8.8：全链分批并发（不再"竞速3 + 串行 rest"）；batch 标签>1 的源（gdWy 配额源）排后批
  const primary = chain.filter(h => (h.batch || 1) === 1);
  const secondary = chain.filter(h => (h.batch || 1) > 1);
  const launchers = [...primary, ...secondary].map(h => ({
    handler: h,
    run: () => wrapExecute(h, platform, songInfo, quality).then(url => ({ url, source: h.id })),
  }));
  const batchSize = Math.min(cfg('raceBatchSize', 3), Math.max(primary.length, 1));
  const errors = [];
  const details = collectDetails;
  // v1.0：聚合错误携带"代表性"失败码——业务失败码优先(NOT_FOUND/MISMATCH/LINK_EXPIRED，稳定结论)，
  // 网络类码仅在全部为网络错误时兜底；避免"flac级业务失败 + 128k级网络错误"被覆盖成不缓存
  let aggCode = ERROR_CODES.NETWORK_ERROR;
  const mergeCode = (code) => {
    if (code === ERROR_CODES.NOT_FOUND || code === ERROR_CODES.MISMATCH || code === ERROR_CODES.LINK_EXPIRED) aggCode = code;
    else if (aggCode === ERROR_CODES.NETWORK_ERROR) aggCode = code;
  };
  const recordFail = (handlerId, q, err) => {
    const code = extractErrorCode(err);
    mergeCode(code);
    details.push({ source: handlerId, quality: q, code, reason: String((err && err.message) || "") });
    errors.push(err.message);
  };
  try {
    const winner = await raceFirst(launchers, { batchSize, deadline });
    logDebug(`[竞速] ${platform} ${quality} 首胜: 源=${(winner && winner.source) || "unknown"}`);
    return winner;
  } catch (e) {
    if (e && e.allFailed && Array.isArray(e.errors)) {
      for (const err of e.errors) { recordFail(err.sourceId || "race", quality, err); }
    } else {
      recordFail("race", quality, e);
    }
  }
  const aggErr = new Error(errors.join("; "));
  aggErr.code = aggCode; // v1.0：聚合错误带代表性失败码
  aggErr.detail = details; // v3.0：结构化失败明细
  throw aggErr;
}

// v1.0 P0-4：请求音质放首位，再按 QUALITY_PRIORITY 向下降级，截到≤3级；flac24bit/192k不再被短路
function buildQualityChain(requested) {
  const req = String(requested || "flac").toLowerCase();
  if (QUALITY_FIRST) {
    const chain = [req];
    const idx = QUALITY_PRIORITY.indexOf(req);
    if (idx >= 0) {
      for (let i = idx + 1; i < QUALITY_PRIORITY.length && chain.length < 3; i++) {
        chain.push(QUALITY_PRIORITY[i]);
      }
    } else {
      for (const q of ["flac", "320k", "128k"]) {
        if (!chain.includes(q) && chain.length < 3) chain.push(q);
      }
    }
    return chain;
  }
  const req2 = String(requested || "128k").toLowerCase();
  const idx2 = QUALITY_PRIORITY.indexOf(req2);
  const start = idx2 >= 0 ? idx2 : QUALITY_PRIORITY.length - 1;
  const chain = [];
  for (let i = start; i < QUALITY_PRIORITY.length; i++) {
    chain.push(QUALITY_PRIORITY[i]);
  }
  if (!chain.includes(req2)) chain.unshift(req2);
  return chain;
}

// v1.0：统一错误码提取——业务层抛错沿用"CODE: msg"前缀风格(e.code 未设置)，从 message 前缀还原 code，
// 供失败缓存差异化与决策日志使用；无前缀按网络错误处理(不缓存)
function extractErrorCode(e) {
  if (e && e.code) return e.code;
  const m = String((e && e.message) || "").match(/^([A-Z_]+):/);
  return m && ERROR_CODES[m[1]] ? m[1] : ERROR_CODES.NETWORK_ERROR;
}

// v8.8：档位短路——某源某音质档历史 success=0 且失败样本达标，则该档直接跳过该源
//（典型：tx/mg/kg 的 flac 只有 suyinKuwo 单源，而它 flac 档是 oiapi VIP 死链，每次点 flac 都白试一次必败档）
// 防死锁：每 qualityShortCircuitProbeMs 放行一次真实探路，避免源恢复后永久被跳。
const qualitySkipProbeAt = new Map();
const qualityShortCircuitKey = (id, quality) => `${id}:${String(quality || "").toLowerCase()}`;
// v8.9：短路判据拆分为两类失败之和——fail（超时/5xx/连接错）+ linkExpired（410 死链）；
// 排除 businessFail（404 无版权/歌不存在/错歌）：无版权是歌的问题不是源的问题，连续 3 首无版权歌不该把源该档短路 6h。
// 同时保留 410：oiapi flac/320k 是 VIP 死链，恒 410 属"这一档拿不到"，必须能短路，否则 v8.8 第③条收益会被修没。
function isQualityHopeless(sourceId, quality) {
  const b = breakerMap.get(sourceId);
  if (!b || !b.byQuality) return false;
  const q = b.byQuality[String(quality)];
  if (!q) return false;
  if ((q.success || 0) > 0) return false;
  if (((q.fail || 0) + (q.linkExpired || 0)) < cfg('qualityShortCircuitSamples', 3)) return false;
  const key = qualityShortCircuitKey(sourceId, quality);
  const probeMs = cfg('qualityShortCircuitProbeMs', 21600000);
  if (!qualitySkipProbeAt.has(key)) { qualitySkipProbeAt.set(key, Date.now() + probeMs); return true; } // 首次达标即短路
  if (Date.now() >= qualitySkipProbeAt.get(key)) { qualitySkipProbeAt.set(key, Date.now() + probeMs); return false; } // 到期放行探路
  return true;
}

// v8.8：冷启动源预热——huibq 跑 onrender 免费实例，冷态 30s+ 远超单源超时(5s)，冷态必然失败；
// 首次进链时后台 fire-and-forget 预热（不阻塞、不计统计），实例热起来后下一次即可参与竞速。
const coldStartWarmAt = new Map();
function warmUpColdStartSources(platform) {
  for (const h of Object.values(SOURCE_HANDLERS)) {
    if (!h || !h.coldStart || runtimeToggles[h.id] !== true) continue;
    if (Date.now() - (coldStartWarmAt.get(h.id) || 0) < cfg('coldStartWarmTtlMs', 300000)) continue;
    if (!buildSourceChain(platform, "128k").some(x => x.id === h.id)) continue;
    coldStartWarmAt.set(h.id, Date.now());
    logDebug(`[预热] ${h.id} 冷启动预热已发出`);
    Promise.resolve()
      .then(() => h.fn("kw", "228908", "128k", { name: "晴天", singer: "周杰伦", duration: 269000, songmid: "228908" }))
      .catch(() => {});
  }
}

async function getUrlWithFallback(platform, songInfo, quality) {
  if (!platform || typeof platform !== "string" || !PLATFORM_QUALITIES[platform]) {
    throw new Error(`${ERROR_CODES.PARAM_ERROR}: 无效的平台参数`);
  }
  if (!songInfo || typeof songInfo !== "object") {
    throw new Error(`${ERROR_CODES.PARAM_ERROR}: 无效的歌曲信息`);
  }

  const cacheKey = buildCacheKey(platform, songInfo, quality);

  // 1. 成功缓存命中（缓存值带实际音质）
  const cached = getCachedUrl(cacheKey);
  if (cached && cached.url) return { url: cached.url, type: cached.quality || "128k", subSource: cached.source || "", subSourceName: SOURCE_HANDLERS[cached.source]?.name || "" };

  // 2. 失败缓存命中（v1.0：差异化 TTL——404→1h / 410→1min / 网络错误不缓存）
  const failKey = buildCacheKey(`fail_${platform}`, songInfo, quality);
  const failEntry = getFailCachedEntry(failKey);
  if (failEntry) {
    logDebug(`失败缓存命中[${platform}] ${songInfo?.name || ""} 音质${quality || "128k"}，跳过重复请求`);
    // v8.10.3：命中路径补 code —— 旧实现只抛文案，err.code 为 undefined，App 无法区分
    // "网络全挂的 30s 短缓存"与"真的没版权"；这里按缓存里的代表性失败码还原
    const cachedCode = failEntry.code || ERROR_CODES.NOT_FOUND;
    const hitErr = new Error(`${cachedCode}: 该请求已知失败(${failEntry.ttl === 0 ? "不缓存" : "缓存中"})，跳过重复请求`);
    hitErr.code = cachedCode;
    throw hitErr;
  }

  if (cfg('coldStartWarmEnabled', true)) warmUpColdStartSources(platform); // v8.8：冷启动源后台预热

  const errors = [];
  const details = []; // v3.0：结构化失败明细（跨音质级汇总，供 App 端展示）
  // v1.0：代表性失败码——业务码(NOT_FOUND/MISMATCH/LINK_EXPIRED)一旦出现即固定(稳定结论)，
  // 网络类码仅在没有业务码时记录；防止低音质级(128k)的网络错误覆盖高音质级的"歌不存在"
  let lastFailCode = ERROR_CODES.NETWORK_ERROR;
  const mergeLastCode = (code) => {
    if (code === ERROR_CODES.NOT_FOUND || code === ERROR_CODES.MISMATCH || code === ERROR_CODES.LINK_EXPIRED) lastFailCode = code;
    else if (lastFailCode === ERROR_CODES.NETWORK_ERROR) lastFailCode = code;
  };

  // 3. 音质降级链（请求音质首位→向下降级；链内按源能力过滤，末级必有源）
  const qualityChain = buildQualityChain(quality || (QUALITY_FIRST ? "flac" : "128k"));
  // v8.8：单次请求总预算（跨音质档共享）；v8.10：分档预算 + 最后一档保底（防高音质吃满总预算饿死低档）
  const totalDeadline = Date.now() + cfg('raceBudgetMs', 12000);
  const perQBudget = cfg('raceBudgetPerQuality', { flac: 6000, "320k": 5000, "128k": 5000, flac24bit: 6000 });
  for (let qi = 0; qi < qualityChain.length; qi++) {
    const q = qualityChain[qi];
    const isLast = qi === qualityChain.length - 1;
    const selectedQuality = q; // v1.0 (D10)：buildQualityChain 已产出具体音质，无需再选
    const chainAll = sortChainByHealth(buildSourceChain(platform, selectedQuality));
    const chain = cfg('qualityShortCircuit', true)
      ? chainAll.filter(h => !isQualityHopeless(h.id, selectedQuality))
      : chainAll;
    if (chainAll.length && !chain.length) {
      // 整条链该档历史 0 成功 → 档位短路，直接降档（省一次必败尝试）
      logDebug(`[${platform}][${q}] 档位短路：全部源该档历史 0 成功，直接降档`);
      errors.push(`[${q}] 档位短路(全部源该档历史0成功)`);
      details.push({ source: "quality-short-circuit", quality: q, code: ERROR_CODES.NETWORK_ERROR, reason: "全部源该档历史0成功，已短路降档" });
      mergeLastCode(ERROR_CODES.NETWORK_ERROR);
      continue;
    }
    if (!chain.length) {
      errors.push(`[${q}] 无可用音源`);
      continue;
    }
    // v8.10.3：分档 deadline —— 单档 = min(该档预算, 剩余总预算)；
    // 末档保底 floor 允许突破总预算（否则前两档吃满预算时末档 0ms 必败 → 点歌无声），
    // 但上界显式钳在 "总预算 + 保底"，即默认 12s + 3s = 15s（与 PARAM_LIMITS 上限一致）
    const remaining = Math.max(totalDeadline - Date.now(), 0);
    const perQ = perQBudget[q] || cfg('raceBudgetMs', 12000);
    const floorMs = cfg('raceBudgetFloorMs', 3000);
    const qBudget = Math.min(perQ, remaining);
    const budget = isLast
      ? Math.min(Math.max(qBudget, floorMs), cfg('raceBudgetMs', 12000) + floorMs)
      : qBudget;
    const raceDeadline = Date.now() + budget;
    logDebug(`[${platform}][${q}] 音源链: ${chain.map(h => h.id).join(">")} (按健康排序)，预算 ${Math.round(raceDeadline - Date.now())}ms${isLast ? '（末档保底，可溢出总预算至' + Math.round((cfg('raceBudgetMs', 12000) + floorMs) / 1000) + 's）' : ''}`);
    try {
      const { url, source } = await fallbackRace(chain, platform, songInfo, selectedQuality, raceDeadline);
      // v8.10.3：缓存槽必须与"实交付音质"一致——旧实现用请求音质的 key 写实交付音质的值，
      // 导致请求 flac 实给 128k 时，这条 128k 被存进 flac 槽并按 128k 的 6h TTL 生效，
      // 6 小时内再点 flac 直接吃 128k、永不再试高音质
      const reqQ = String(quality || (QUALITY_FIRST ? "flac" : "128k")).toLowerCase();
      const deliverQ = String(selectedQuality || "128k").toLowerCase();
      const writeKey = deliverQ === reqQ ? cacheKey : buildCacheKey(platform, songInfo, selectedQuality);
      setCachedUrl(writeKey, url, selectedQuality, source); // v1.0：记录实际音质；v6.0：同存实际子源
      // v6.0：音质协商链降档日志（请求flac实际320k/128k时明示，配合 App 真实音质显示）
      if (deliverQ !== reqQ) {
        logInfo(`[${platform}] ${songInfo?.name || ""} 音质协商降档: ${reqQ}→${selectedQuality}（按交付音质入缓存槽，下次仍会重试高音质）`);
      }
      return { url, type: selectedQuality, subSource: source || "", subSourceName: SOURCE_HANDLERS[source]?.name || "" };
    } catch (e) {
      mergeLastCode(extractErrorCode(e)); // v1.0：业务码优先归并
      errors.push(`[${q}] ${e.message}`);
      // v3.0：透出结构化失败明细（fallbackRace 已结构化；旧路径兜底单条）
      if (e && Array.isArray(e.detail) && e.detail.length) {
        for (const d of e.detail) details.push({ ...d });
      } else {
        details.push({ source: "chain", quality: q, code: extractErrorCode(e), reason: String((e && e.message) || "") });
      }
    }
  }

  // 4. 过期缓存兜底：仅当过期记录的实际音质不低于请求音质时才返回（防128k冒充flac）
  if (successCache.hasExpired(cacheKey)) {
    const expired = successCache.getExpired(cacheKey);
    if (expired && expired.url) {
      if (qualityRank(expired.quality || "128k") >= qualityRank(quality)) {
        logWarn(`全部音源失败，返回过期缓存兜底(缓存音质${expired.quality}, 请求${quality})`);
        return { url: expired.url, type: expired.quality || "128k", subSource: expired.source || "", subSourceName: SOURCE_HANDLERS[expired.source]?.name || "" };
      }
      logWarn(`过期缓存音质(${expired.quality})低于请求(${quality})，不兜底`);
    }
  }

  // 5. 记录失败缓存（v1.0：按代表性失败码差异化 TTL；网络错误不缓存，下次立即重试）
  // v6.0 (A3)：整链全失败且为网络类（上游整体不可用/超时/5xx）→ 写 30s 短失败缓存，
  // 避免同一首歌每次重播都在降级链里白跑 ≈18s；30s 后自动过期恢复重试（上游可能恢复）。
  // 业务类(NOT_FOUND等)维持原差异化 TTL。熔断不受影响——缓存过期后的重试仍会计入源失败。
  setFailCached(failKey, lastFailCode, FAIL_CACHE_TTL_BY_CODE[lastFailCode] === 0 ? cfg('allFailShortTtlMs', 30000) : undefined);
  logDebug(`失败缓存写入[${platform}] code=${lastFailCode} ttl=${FAIL_CACHE_TTL_BY_CODE[lastFailCode] === 0 ? "不缓存" : ((FAIL_CACHE_TTL_BY_CODE[lastFailCode] || FAIL_CACHE_TTL_MS) / 1000) + "s"}`);
  // v7.0：失败逐源明细 logInfo——一次失败一屏看懂"哪些源、为什么失败"（供 App「音源日志」自查）
  if (details.length) {
    logInfo(`[失败明细] 平台=${platform} 歌=${songInfo?.name || ""} 音质=${quality || "128k"} 代表码=${lastFailCode}: ${details.map(d => `${d.source}=${d.code}(${String(d.reason || "").slice(0, 50)})`).join(" | ")}`);
  }
  // v8.10.3：文案前缀改用"代表性失败码"——旧实现固定写 NOT_FOUND，导致 code=NETWORK_TIMEOUT
  // 的错误读起来也像"这首歌不存在"（App 若按文案判类型会误判）
  const finalErr = new Error(`${lastFailCode}: 所有源均失败 [${errors.join(" | ")}]`);
  finalErr.code = lastFailCode; // v1.0：代表性失败码
  finalErr.detail = details; // v3.0：结构化失败明细（{source, quality, code, reason} 数组）
  throw finalErr;
}

// ============================================================
// 第八部分：音源配置上报 + 事件监听（洛雪官方协议）
// ============================================================
const sourceConfig = {};
const PLATFORM_NAMES = {
  wy: "网易云音乐", tx: "QQ音乐", kw: "酷我音乐", kg: "酷狗音乐", mg: "咪咕音乐"
};
Object.keys(PLATFORM_QUALITIES).forEach(platform => {
  // v3.0：歌词/封面按平台真实能力声明（App fork 声明即注册 getLyric/getPic）——
  // wy: 歌词+封面（网易云公开接口实测可用）；kw: 封面（搜索 hts_MVPIC 实测可用）；
  // tx/kg/mg: 无稳定接口不声明，App 自动走内置源兜底
  const actions = ["musicUrl"];
  if (platform === "wy") actions.push("lyric", "pic");
  else if (platform === "kw") actions.push("pic");
  actions.push("health"); // v4.0：健康快照 action（App fork 声明即注册 getHealth，与平台无关的聚合查询）
  actions.push("toggle", "probe"); // v4.0：源级开关 + 手动探测 action（App fork 声明即注册，健康面板「管」能力）
  actions.push("config"); // v8.0：配置热更新 action（App 设置页读写 USER_CONFIG 内存值，免重载音源）
  actions.push("trend"); // v8.0：健康趋势 action（返回历史健康快照数组，App 折线图展示）
  sourceConfig[platform] = {
    name: PLATFORM_NAMES[platform],
    type: "music",
    actions,
    qualitys: REPORT_QUALITIES[platform] || ["128k"] // v1.0 P0-6：按真实能力裁剪
  };
});

on(EVENT_NAMES.request, ({ action, source, info }) => {
  // v4.0：健康快照 action（聚合查询，与请求的 source 无关）
  if (action === "health") {
    return Promise.resolve(getHealthSnapshot());
  }
  // v4.0：源级开关（手动启用/停用某子源；停用写入 manualOff 锁定，探测不再自动复活；启用清除锁定并清休眠立即纳入探测）
  if (action === "toggle") {
    const target = info?.id;
    if (!target || !SOURCE_HANDLERS[target]) {
      return Promise.reject(new Error(`${ERROR_CODES.PARAM_ERROR}: unknown source id`));
    }
    const next = info.enabled !== false;
    runtimeToggles[target] = next;
    if (next) {
      delete manualOff[target];
      delete probeState.sleeping[target];
      delete probeState.deadCount[target];
      delete probeState.sleepRound[target];
      probeState.failCount[target] = 0;
      // v4.0：用户手动开启 = 强制重启——重置熔断/限流退避，立即可尝试
      const br = getBreaker(target);
      br.state = 'closed'; br.failureCount = 0; br.lastFailureTime = 0; br.rateLimitUntil = 0; br.rateLimited = false;
    } else {
      manualOff[target] = true;
    }
    return Promise.resolve({ id: target, enabled: next });
  }
  // v4.0：手动触发一轮健康探测（并发 ~6s；探测中返回 running:true 不排队）
  // v30.1：手动探测不存历史快照（避免污染趋势图）
  if (action === "probe") {
    if (probeState.running) {
      return Promise.resolve({ running: true });
    }
    return runHealthCheck(false).then(() => ({
      running: false,
      doneAt: Date.now(),
      round: globalThis.__probeRound || 0,
      active: Object.keys(runtimeToggles).filter(k => runtimeToggles[k]),
      sleeping: Object.keys(probeState.sleeping).filter(k => probeState.sleeping[k])
    })).catch(err => Promise.reject(err));
  }
  // v8.0：配置热更新 action（App 设置页读写 USER_CONFIG 内存值，免重载音源）
  // 无参数调用：返回当前所有配置项（只读）
  // 带参数调用（{key: value}）：更新内存中的配置值，立即生效
  if (action === "config") {
    if (!info || Object.keys(info).length === 0) {
      // 读模式：返回当前配置（过滤掉敏感的卡密类字段）
      const { ikunApiKey, lingchuanApiKey, xinghaiDeviceId, ...safeConfig } = USER_CONFIG;
      return Promise.resolve({
        ...safeConfig,
        ikunApiKey: ikunApiKey ? "***已设置***" : "",
        lingchuanApiKey: lingchuanApiKey ? "***已设置***" : "",
        xinghaiDeviceId: xinghaiDeviceId ? "***已设置***" : ""
      });
    }
    // 写模式：更新内存配置（仅允许白名单字段，防止乱改）
    const ALLOWED_KEYS = ["cacheTtlMs", "failCacheNotFoundMs", "failCacheExpiredMs",
      "breakerThreshold", "breakerCooldownMs", "rateLimitBackoffMs",
      "maxConcurrency", "rateWindowMs", "rateWindowMax",
      "healthCheckIntervalMs", "raceMatchWaitMs",
      "allFailShortTtlMs", "playDeadReviveMs", "raceBudgetMs"];
    // v30.1：每个参数的合理上下限（防极端值触发上游风控/雪崩）
    const PARAM_LIMITS = {
      cacheTtlMs: { max: 7 * 24 * 3600 * 1000 },        // 最大 7 天
      failCacheNotFoundMs: { max: 24 * 3600 * 1000 },   // 最大 1 天
      failCacheExpiredMs: { max: 3600 * 1000 },         // 最大 1 小时
      breakerThreshold: { max: 20 },                      // 最大 20 次
      breakerCooldownMs: { max: 30 * 60 * 1000 },       // 最大 30 分钟
      rateLimitBackoffMs: { max: 5 * 60 * 1000 },       // 最大 5 分钟
      maxConcurrency: { max: 5 },                          // 最大 5（单源并发，太大触发风控）
      rateWindowMs: { max: 10 * 1000 },                  // 最大 10 秒
      rateWindowMax: { max: 20 },                         // 最大 20 次
      healthCheckIntervalMs: { min: 60 * 1000 },        // 最小 1 分钟（防频繁探测）
      raceBudgetMs: { max: 15 * 1000 },                     // v8.10.3：总预算（死键 raceOverallTimeoutMs 已移除，唯一真相）
      raceMatchWaitMs: { max: 5 * 1000 },               // 最大 5 秒
      allFailShortTtlMs: { max: 10 * 60 * 1000 },       // 最大 10 分钟
      playDeadReviveMs: { max: 2 * 3600 * 1000 },       // 最大 2 小时
    };
    const updated = {};
    for (const [key, value] of Object.entries(info)) {
      if (!ALLOWED_KEYS.includes(key)) continue;
      if (typeof value !== "number" || value <= 0) continue;
      // v30.1：上下限校验
      const limits = PARAM_LIMITS[key];
      if (limits) {
        if (limits.min !== undefined && value < limits.min) continue;
        if (limits.max !== undefined && value > limits.max) continue;
      }
      USER_CONFIG[key] = value;
      updated[key] = value;
    }
    logInfo(`[config] 热更新配置：${JSON.stringify(updated)}`);
    // v30.1：修改熔断阈值后，重置所有源的 failureCount——避免"突然熔断"
    // （阈值从 3 改成 1 后，已累计 2 次失败的源下一次失败不会立即熔断）
    if (updated.breakerThreshold !== undefined) {
      for (const [, b] of breakerMap) {
        b.failureCount = 0;
      }
      logInfo(`[config] 熔断阈值已更新，所有源失败计数已重置`);
    }
    // v30.1：修改缓存 TTL 后，清空所有缓存——让新 TTL 立即生效
    if (updated.cacheTtlMs !== undefined) {
      successCache.clear();
      logInfo(`[config] 缓存 TTL 已更新，成功缓存已清空`);
    }
    // v30.1：返回 current 也脱敏（和读模式一致）
    const { ikunApiKey, lingchuanApiKey, xinghaiDeviceId, ...safeConfig } = USER_CONFIG;
    return Promise.resolve({
      updated,
      current: {
        ...safeConfig,
        ikunApiKey: ikunApiKey ? "***已设置***" : "",
        lingchuanApiKey: lingchuanApiKey ? "***已设置***" : "",
        xinghaiDeviceId: xinghaiDeviceId ? "***已设置***" : ""
      }
    });
  }
  // v8.0：健康趋势 action（返回历史健康快照数组，App 折线图展示）
  if (action === "trend") {
    return Promise.resolve({
      history: healthHistory,
      maxPoints: HEALTH_HISTORY_MAX
    });
  }
  // v3.0：歌词/封面 action（App fork userApi 已支持；失败 App 自动走内置源兜底）
  if (action === "lyric") {
    return getLyricForPlatform(source, info?.musicInfo).catch(err => Promise.reject(err));
  }
  if (action === "pic") {
    return getPicForPlatform(source, info?.musicInfo).catch(err => Promise.reject(err));
  }
  if (action !== "musicUrl") {
    return Promise.reject(new Error(`${ERROR_CODES.PARAM_ERROR}: action not support`));
  }
  if (!info?.musicInfo) {
    return Promise.reject(new Error(`${ERROR_CODES.PARAM_ERROR}: 请求参数不完整`));
  }
  return getUrlWithFallback(source, info.musicInfo, info.type || (QUALITY_FIRST ? "flac" : "128k"))
    .catch(err => Promise.reject(err));
});

send(EVENT_NAMES.inited, {
  status: true,
  openDevTools: false,
  sources: sourceConfig
});

// v4.0.1：发版通知（updateAlert）已停用——每次加载/导入都弹更新提示过于打扰，
// 用户选择关闭（App 端「允许显示更新弹窗」勾选与否都不再弹；版本信息看 logInfo/Release）
//
logInfo(`豆包定制聚合音源 v8.10.12 已加载（v8.10.4：可播校验错误码修复（2026-11-08：超时/网络异常不再判死链，改抛 NETWORK 码走 180s 熔断；三处 LINK_EXPIRED 抛错补 err.code，使 410 真正计入 linkExpired 与 1min 失败缓存；冒烟 55 增至 57 组，T56/T57 均已 red-green 验证；v8.10.3：全覆盖审计修复（2026-11-07：15 项隐性缺陷——①probeSingleSource 形参 cfg 遮蔽全局 cfg()，huibq（唯一冷启动源）探针 100% TypeError、请求从未发出、健康分恒负垫底休眠；②429 不再计入 byQuality.fail/成功率分母（旧实现 3 次限流把该档短路 1h），半开遇 429 收口回 open；③降档交付按实交付音质入缓存槽（旧实现请求 flac 实给 128k 却存进 flac 槽，6h 内不再试高音质）；④失败缓存命中还原代表性 code（旧实现 code 丢失，网络全挂被当歌不存在）；⑤平台分组改由竞速链生成（旧手写清单漏 suyinKuwo，wy/tx/mg/kg 只剩它活着时误报全挂）；⑥探针通过一并复位断路器/限流退避（旧实现只清休眠，出现「探针正常 + 熔断中」矛盾态）；⑦末端预算上界显式钳在总预算+保底；⑧validateUrl 返回 trim 后 URL；⑨320k/128k 单档预算 4s→5s 对齐单源超时（旧 4s 把 5s 内本可成功的源判死并累计熔断）；⑩删死键 raceOverallTimeoutMs、面板改暴露真键 raceBudgetMs；⑪huibq 假成功判据单点化并补进探针；⑫lingchuan 补 platforms 显式声明；⑬A19 备注 20→144；⑭冒烟新增 T50–T55（回退必红）共 55 组）；v8.10.2：修 validateUrl 与 recordSuccess 顺序——旧顺序把"URL 非法"既记成功又记业务失败(双记账)，现改为先验后记；并补齐半开试探收口(业务失败/本地节流也要 half-open→open，否则该源永久不被调用)；v8.10.1：分档预算 flac6s/320k4s/128k4s + 末档保底3s 防点歌无声、冷启动探针30s超时+豁免自动关 防onrender冷态误摘、短路窗口6h→1h、高音质缓存分级TTL flac/320k30min、历史快照60→144，冒烟48组；v8.10.1：修缓存 LRU 缺 delete（高音质缓存过期重播 TypeError）+ T46/T47/T48 改真验证；v8.9：huibq平台能力收窄至kw/wy + 短路判据拆分(fail+linkExpired，404不误伤/410仍短路) + source-audit --strict退出码；v8.8：竞速引擎改造——全链分批错峰并发/跨档12s总预算/档位短路/冷启动预热/gdWy降批/verified精确等待；v8.7：huibq假成功治理——上游"无法获取播放链接"仍返回 code=0 + 可播错链，按 msg 失败词判失败；v8.6：huibq默认开启——全平台全音质实测可用、进五平台链尾兜底、探针自动托管；v8.5：巡检工具与监控口径升级——scripts/source-audit.js + docs/SOURCE_AUDIT.md 基线、probe.js 取链可播二次校验、huibq 探针；v8.4：全源全接口深度巡检修复——suyinKuwo 128k br=9、xinghaiBackend 匿名调用适配，可用源 15→21/35；v8.3：ikun默认开启——公益版免卡密默认进 kw 链尾兜底、探测自动托管/失败自动关/恢复自动开；v8.2：ikun探针接入——默认关闭源补齐健康探针，手动开启后自动监控健康（POST /music/url 固定歌 + Range 可播校验）；v8.1：ikun源复活——域名 api.ikunshare.com→c.wwwweb.top、接口 GET /url→POST /music/url、公益版免卡密，2026-11-06实测 rid=228908 出真实128k链；v8.0：全量审计修复版——2026-11-05 版本重新整理，原 v1.0~v8.0 共53个小版本合并为8个大版本；旧版本归档见 docs/ARCHIVE_OLD_TAGS.md），上报 ${Object.keys(sourceConfig).length} 个音源；v4.0 health action(App健康面板)；v3.0歌词/封面透出；v3.0失败原因结构化+健康自愈；v2.0配置化(USER_CONFIG)；保留v1.0星海kw高音质双源+防错歌加固`);

// 启动健康探测（全自动自愈）
startHealthCheck();

// v3.0：测试导出块——宿主动态执行无 module，自动跳过；冒烟测试 require 后可断言纯函数
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    computeHealthScore,
    // v4.0：UA 池轮换（供测试/巡检验证轮换生效）
    getMobileUserAgent,
    sortChainByHealth,
    buildSourceChain,
    getUrlWithFallback,
    getBreaker,
    recordSuccess,
    recordFailure,
    recordBusinessFail, // v8.10.2：导出供测试断言半开收口
    ERROR_CODES,
    QUALITY_PRIORITY,
    // v3.0：探测巡检增强（分级轮次 + 休眠复活 + 配置构建）
    tierShouldProbe,
    applyProbeResult,
    buildProbeConfig, // v6.0：导出供测试断言探测清单过滤（关闭源不探测/自愈闭环保留）
    SOURCE_HANDLERS, // v8.8：导出供测试断言源标签（batch/coldStart）
    probeState,
    runtimeToggles,
    SOURCE_TOGGLES, // v8.6：导出供测试/巡检断言各源默认开关状态（A 方案默认开启源必须可见）
    // v3.0：健康统计快照（App 健康面板/巡检消费）
    getHealthSnapshot
  };
}
