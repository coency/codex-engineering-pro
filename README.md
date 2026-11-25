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

## 在已有项目中使用

用 Codex 打开要处理的项目，在该项目的对话中发送请求。七个技能都可以单独使用，只有需要从需求一路做到验收时，才建议选择「工程工作流统筹」。

**只发技能名。** 如果上文已经说清任务，例如“只审查我还没提交的改动”，下一条消息可以只写一行：

~~~text
$codex-engineering-pro:cep-independent-code-review
~~~

技能名指定工作方式，具体审查对象取自当前项目和对话上下文。在空白对话里，如果缺少目标、报错或审查范围，Codex 可能需要追问。每个技能都提供默认提示词，客户端是否自动填入取决于界面。桌面已实测「技能名加具体任务」能调用代码库调查；仅发送技能名的桌面流程尚未单独验证。

**首次接手项目。** 在空白对话中，给技能加一句具体目标，Codex 就能直接着手调查：

~~~text
$codex-engineering-pro:cep-codebase-investigator 找出项目的启动入口、核心调用链和测试命令，给出文件位置。只读调查。
~~~

在 CLI 中输入 `$` 或运行 `/skills` 可以选择技能。在桌面 Codex 对话中，可输入 `@codex-engineering-pro` 选择插件，再在同一条消息中写上完整技能名和任务。这些内容都发在对话输入框里。

**按任务选技能。** 下表中的完整名称可以直接复制。

| 眼下要做的事 | 技能 | 完整调用名 |
| --- | --- | --- |
| 理清已有项目的入口、模块和调用链 | 代码库调查 | `$codex-engineering-pro:cep-codebase-investigator` |
| 为新功能或重构明确范围和验收条件 | 需求规划 | `$codex-engineering-pro:cep-requirement-planner` |
| 按明确的目标修改代码 | 安全实现 | `$codex-engineering-pro:cep-safe-implementation` |
| 定位报错或失败测试的根因 | 调试专家 | `$codex-engineering-pro:cep-debugging-specialist` |
| 检查改动是否满足验收条件 | 测试验证 | `$codex-engineering-pro:cep-test-verification` |
| 只读审查当前差异或指定提交 | 独立代码审查 | `$codex-engineering-pro:cep-independent-code-review` |
| 从需求、实现一直推进到验证 | 工程工作流统筹 | `$codex-engineering-pro:cep-engineering-workflow` |

**自动匹配。** 也可以直接发送“修复这个项目中数量为 0 时仍然计费的问题，并验证修复”。Codex 会根据任务和技能描述决定是否调用相应技能。

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
