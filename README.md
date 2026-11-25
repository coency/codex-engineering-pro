# Codex Engineering Pro · 0.1.1

个人首版，只面向 Codex。七个技能使用中文说明和中文界面描述，英文目录 ID；默认自动匹配，也可显式调用。没有选定许可证，也未公开发布。本包不自带外部服务、模型、MCP 连接或运行时权限扩展。

本次 0.1.1 更新加入[插件图标矢量稿](plugins/codex-engineering-pro/assets/engineering-mark.svg)。已在桌面插件搜索中[核对实际显示](docs/desktop-icon-row.png)。

## 安装前

需要已安装并能使用插件命令的 Codex CLI，以及模型访问权限（实际执行工程任务时需要）。本次包装与加载验证使用 Windows 上的 Codex CLI 0.171.0-alpha.13.2；未据此推定最低支持版本。先运行：

~~~text
codex --version
codex plugin --help
codex plugin marketplace add --help
codex plugin add --help
~~~

如果没有这些子命令，先通过你原有的 Codex 安装渠道更新；不要使用未经验证的安装命令。可选的包结构验证需要 Node.js 22 或更高版本；使用技能本身不需要 Node.js。

## 安装：本地插件市场

1. 完整解压 ZIP，保留隐藏目录 .agents 和 .codex-plugin。将解压得到的 codex-engineering-pro-0.1.1 文件夹放在一个稳定位置，后续保留它作为插件来源。
2. 在终端进入这个文件夹。下面的路径是示例，请替换为实际解压路径。不要进入里面的 plugins 子目录。
3. 添加本地市场，再安装插件：

~~~powershell
Set-Location -LiteralPath 'C:\CodexPlugins\codex-engineering-pro-0.1.1'
codex plugin marketplace add .
codex plugin add codex-engineering-pro@cep-personal
codex plugin list --marketplace cep-personal --json
~~~

每条命令成功后再执行下一条。列表中应有 codex-engineering-pro，并显示已安装、已启用；具体 JSON 字段随客户端版本变化。这里的市场名固定为 cep-personal，插件名固定为 codex-engineering-pro。

该步骤会通过 Codex 的插件机制登记本地市场、写入用户插件配置并建立安装缓存；不会安装全局 AGENTS.md 或独立技能副本。分发目录中的 .agents/plugins/marketplace.json 是市场目录，不是 AGENTS 指令文件。不需要把它复制到用户主目录，也不要直接修改 Codex 的缓存目录。

4. 重新启动 Codex 并新建一个对话。在 CLI 中运行 /skills 或输入 $，查看七个“cep-”技能；从选择器中选中后发送请求。桌面端如有插件目录，可查看“个人工程插件”来源和启用状态；已实测 Codex 桌面对话中的 @ 搜索可以找到插件并显示新版图标。
5. 在一个非生产的测试仓库里开始使用。优先运行下方显式调用示例，再试自动匹配。安装成功与模型行为测试是不同的验收项目。

如果企业策略禁止本地插件，或当前界面未显示该来源，请保留报错并核对宿主支持范围；不要通过覆盖全局配置绕过限制。

## 使用

自动匹配示例，直接在 Codex 中发送：

~~~text
修复这个项目中数量为 0 时仍然计费的问题，并验证修复。
~~~

Codex 会按描述决定是否读取匹配技能；允许自动匹配不代表每个请求必定触发。需要稳定指定流程时，输入 $ 并选择对应技能。以选择器显示的名称为准；本包固定的内部技能名如下：

| 中文名称 | 英文目录与内部 ID | 适用请求 |
| --- | --- | --- |
| 工程工作流统筹 | cep-engineering-workflow | 端到端完成工程任务 |
| 代码库调查 | cep-codebase-investigator | 只读解释入口与调用链 |
| 需求规划 | cep-requirement-planner | 先给范围与实施计划 |
| 安全实现 | cep-safe-implementation | 按明确目标编码 |
| 测试验证 | cep-test-verification | 验收与回归检查 |
| 独立代码审查 | cep-independent-code-review | 只读审查代码差异 |
| 调试专家 | cep-debugging-specialist | 复现异常并找根因 |

显式调用示例：

~~~text
$codex-engineering-pro:cep-engineering-workflow 完成当前需求，采用智能模式 B。
$codex-engineering-pro:cep-codebase-investigator 只读调查入口、调用链和测试命令，不修改文件。
$codex-engineering-pro:cep-requirement-planner 为这个跨模块需求制定计划，等我确认后再实现。
$codex-engineering-pro:cep-safe-implementation 按已确认的验收标准修改代码。
$codex-engineering-pro:cep-test-verification 验证当前改动，记录真实结果。
$codex-engineering-pro:cep-independent-code-review 只读审查当前差异，给出有证据的问题。
$codex-engineering-pro:cep-debugging-specialist 复现这个失败测试，定位根因并修复。
~~~

这些是 Codex 提示词，不是终端命令。本次 CLI 实测的完整注册名为 codex-engineering-pro: 后接内部 ID，上述示例已使用完整名称。若其他版本显示不同，从 $ 或 /skills 选择器选中该中文技能。

## 智能模式 B

低风险且清晰的工作直接推进。复杂任务先调查并给出计划，然后继续已获授权、可回退的步骤；“先规划”本身不意味着停下来等批准。用户明确要求只做计划或等确认时才等待。

高风险或不可逆操作要先完成安全准备，实际执行前核对具体授权；已有充分明确授权不反复询问。范围、目标或环境改变时重新核对。“开始吧”不等于授权生产删除、强推、发布、外发或权限变更。详见[共用约定](plugins/codex-engineering-pro/references/mode-b.md)。

该模式是技能指令，不是强制权限控制；宿主工具审批与权限机制继续有效。“独立审查”是单独的证据审查阶段，不承诺另一个模型或代理。

## 修改、重新安装与卸载

可编辑源码位于 plugins/codex-engineering-pro；修改后先做结构验证。安装缓存不一定会即时同步源文件。最明确的刷新方法是在任务结束后移除再安装，并重启 Codex、开启新对话：

~~~text
codex plugin remove codex-engineering-pro@cep-personal
codex plugin add codex-engineering-pro@cep-personal
~~~

卸载插件并移除这个来源：

~~~text
codex plugin remove codex-engineering-pro@cep-personal
codex plugin marketplace remove cep-personal
~~~

仅移除本包的精确标识，不清空插件目录或其他设置。用户后来往 cep-personal 加入其他插件时，不应移除整个来源。上述操作不会删除你的源码目录。

## 验证与资料

~~~text
node scripts/validate.mjs .
node --test scripts/test-validator.mjs
~~~

- [官方格式研究与版本依据](docs/RESEARCH.md)
- [验证清单](docs/VALIDATION.md)
- [样例行为测试与预期](docs/TEST-CASES.md)
- [本次实际验证报告与限制](docs/VALIDATION-REPORT.md)
- [插件内部使用说明](plugins/codex-engineering-pro/README.md)

fixture 是专门保留错误的练习项目，首次运行出现一条失败测试是预期结果，详见测试用例。不要在生产仓库执行危险动作来测试确认行为。
