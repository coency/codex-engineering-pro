# 官方格式研究记录

核对日期：2026-11-25（Asia/Shanghai）。按官方文档、官方仓库与本机 CLI 交叉核对，没有使用第三方教程确定字段。

## 格式选择

[官方打包指南](https://developers.openai.com/plugins/build/plugins)当前建议新包以根 plugin.json 为入口，OpenAI 专用配置放入 extensions.com.openai；.codex-plugin/plugin.json 仍可作为回退。两处 OpenAI 配置不合并。本包使用根入口并附回退清单，验证器检查身份字段及界面元数据一致。skills 位于插件根目录；内联配置只设置界面元数据，回退清单另声明 ./skills/。路径按插件根解析。

[官方 plugin-creator 字段说明](https://github.com/openai/plugins/blob/main/.agents/skills/plugin-creator/references/plugin-json-spec.md)用于核对界面字段和本地市场结构。只填本包需要的字段，不虚构作者身份、主页、联系方式或许可证。

市场位于分发根的 .agents/plugins/marketplace.json，本地 source.path 相对于分发根，指向 ./plugins/codex-engineering-pro；不是相对于 .agents/plugins。installation 为 AVAILABLE，authentication 为 ON_USE；纯技能包没有需要登录的连接。

## Codex 产品范围

[OpenAI 官方市场示例](https://github.com/openai/plugins/blob/main/.agents/plugins/api_marketplace.json)使用 policy.products 的 CODEX 值。本包在市场条目声明相同限制。

[Codex 技能元数据解析实现](https://github.com/openai/codex/blob/main/codex-rs/skills/src/metadata.rs)支持技能 policy.products，本包七份 agents/openai.yaml 同样限定 CODEX。产品限制依赖宿主识别，不是访问控制机制；只承诺面向 Codex 的文档与验证，不承诺其他产品兼容。

[官方技能指南](https://learn.chatgpt.com/docs/build-skills)支持 SKILL.md 的 name、description，以及 agents/openai.yaml 的界面信息和 allow_implicit_invocation。技能目录与内部 name 使用英文 ID，正文、描述、显示名和默认提示词使用中文。七个技能均显式开启自动匹配，并保留 $ 技能选择。

## 安装依据

本机 codex --version 返回 0.171.0-alpha.13.2。该版本帮助实际列出 plugin marketplace add、plugin add、plugin list、plugin remove。因此 README 的安装命令以本机已确认的 CLI 语法为准；不使用 plugin install，也不提供 ZIP 直接导入的虚构命令。

官方概览对界面支持范围会持续更新，参见[插件使用说明](https://learn.chatgpt.com/docs/plugins)。未以 IDE 扩展或普通 ChatGPT 对话作为本次安装目标；桌面界面未实测。没有承诺最低版本，旧版本应先检查命令和技能列表。

## 研究边界

官方网页与 main 分支会变化，以上链接不是不可变快照。实际验证以本包附带的报告与 CLI 版本为准。此包自带结构检查，不宣称它是官方完整 Schema 验证器；根清单声明官方指南采用的 Agent Plugins 1.0 Schema URL，未进行该远端 Schema 的完整校验。

本次工具未提供读取所引用历史聊天的入口，缓存只有“对的”“？”和“开始吧”等片段。因此实现范围以本次用户请求中明确列出的决策为准，不能声称逐条核对了旧聊天的全部内容。
