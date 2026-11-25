# Codex Engineering Pro 0.1.1 · 图标更新

新版在两份插件清单中为 logo 与 composerIcon 指定同一张 512 × 512 透明 PNG。[可编辑矢量稿](../plugins/codex-engineering-pro/assets/engineering-mark.svg) 与 [PNG](../plugins/codex-engineering-pro/assets/engineering-mark.png) 随包提供。

已实测当前用户安装 0.1.1 并启用。桌面 Codex 的 @ 搜索结果显示新图标，见[实际截图](desktop-icon-row.png)。本轮变更只涉及插件图标、版本和分发资料。以下 0.1.0 记录及其 JSON 证据保留为首版测试历史。

# Codex Engineering Pro 0.1.0 · 实际验证报告

日期：2026-11-25（Asia/Shanghai）。这是个人首版的本地包装和加载验证，不是公开发布审核。机器可读摘要见[验证证据](validation-evidence.json)。

## 包结构和引用：通过

五组结构检查全部通过：发布边界与 UTF-8、根入口与 Codex 回退清单、本地市场与产品范围、七个技能的中文元数据、Markdown 引用及显式名称。

七个目录各有 SKILL.md 和 agents/openai.yaml。所有技能都引用包内共用约定，允许自动匹配并声明 CODEX。市场来源相对于分发根解析，目标位于包内。无许可证文件或清单 license 字段，无 Windows 安装器、全局 AGENTS.md、MCP 服务、钩子或外部运行时依赖。

根 plugin.json 采用官方当前推荐的入口，.codex-plugin/plugin.json 保留兼容回退。身份字段及界面元数据一致。未把远端完整 Schema 校验计入通过项。

执行：

~~~text
node scripts/validate.mjs .
~~~

## 验证器测试：13/13 通过

执行：

~~~text
node --test scripts/test-validator.mjs
~~~

覆盖正常包、中文 YAML 子集、重复键拒绝，以及缺少技能文件、内部名称漂移、关闭自动匹配、市场路径越界、CODEX 限制丢失、回退元数据漂移、断链、插件引用越界、加入许可证字段、加入安装器和损坏 JSON 等情形。若干情形合并在同一条测试中，总计 13 条测试，无跳过或失败。

这是本包的静态一致性验证器，不是通用 YAML 解析器、官方完整清单校验器或模型行为评测器。

## Codex 安装和实际技能加载：通过

环境：Windows、Codex CLI 0.171.0-alpha.13.2、Node.js v24.14.1。使用工作目录内单独的 CODEX_HOME；未改动用户现有插件配置，也没有将本包正式安装到用户日常环境。

实际完成本地市场登记、插件安装、已启用状态查询、移除与重新安装。返回插件标识 codex-engineering-pro@cep-personal，版本 0.1.0。

通过 Codex app-server 的 initialize 与 skills/list 请求实际加载技能，没有发起模型对话。按 pluginId 过滤后，七个技能全部 enabled=true，加载 errors 为空。安装缓存中的 18 个插件文件与源码逐个进行 SHA-256 比较，全部一致，共用约定在缓存内可读取。

本次实际返回的完整技能名：

- codex-engineering-pro:cep-engineering-workflow
- codex-engineering-pro:cep-codebase-investigator
- codex-engineering-pro:cep-requirement-planner
- codex-engineering-pro:cep-safe-implementation
- codex-engineering-pro:cep-test-verification
- codex-engineering-pro:cep-independent-code-review
- codex-engineering-pro:cep-debugging-specialist

已据此修正 README 的显式提示词和七份默认提示词。skills/list 确认名称、中文界面元数据及加载成功；自动调用和产品限制的实际行为没有通过模型对话或其他产品的反向测试验证。

## 练习夹具：预期失败与修复后通过

在临时副本执行 node --test，初始结果为 3 通过、1 失败，退出码 1；失败点是数量为 0 时返回 250 而不是 0。

只在临时副本把 quantity 的默认值处理由逻辑或改为空值合并，再运行得到 4 通过、0 失败，退出码 0。证明夹具能区分缺陷与修复，不代表已由插件驱动模型完成修复。交付原件保留故意错误，供行为验收使用。

## 内容静态核对：完成

逐项核对了七个技能的用途边界、按需路由、智能模式 B、已有授权复用、只读请求不修改、保留用户改动、失败与未运行的如实报告，以及独立审查的能力限制。

低风险推进、复杂任务先计划、高风险执行前核对具体授权均写入所有技能必读的共用约定。计划不自动形成审批门槛；用户要求等待时必须等待。这是当前会话内的内容核对，没有声称独立代理已做审查。

## ZIP 完整性：通过

分发目录包含 30 个文件。使用支持隐藏目录的 ZIP 打包方式，解压到新工作目录，确认 .agents 和 .codex-plugin 均在包内，归档条目没有绝对路径或父级越界。

解压内容与可编辑目录逐文件比较 SHA-256，全部一致；解压目录再次通过结构验证。最终 ZIP 的 SHA-256 保存在 ZIP 同级的 .sha256 文件中，避免把归档自身哈希写入归档导致循环依赖。

## 未运行项目与限制

- 已准备 B01–B07、R01–R11 共 18 个行为场景；本次未发起模型驱动评测。自动匹配命中率、实际风险确认行为和真实工程任务表现仍需个人试用。
- 未验证桌面端 UI、IDE 扩展、其他操作系统、其他 Codex 版本或普通 ChatGPT；不能推定最低支持版本。
- CODEX 产品限制依赖宿主识别；本包的文字规则不提供操作系统权限隔离，也不保证拦截所有危险动作。
- “独立审查”可以是同一会话中单独的审查阶段；包本身不自动创建另一位代理。
- 未执行远端 Agent Plugins Schema 的完整校验；本地安装器与实际技能加载已通过。
- 没有可用的历史聊天读取工具，旧聊天预览也没有实质决策；以本次请求明确列出的选择为准。
- 未选许可证、未公开发布，未进行公开目录的提交、审核或上架。
