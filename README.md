# Codex Engineering Pro · 0.1.1

这是给 **Codex 桌面端**使用的中文工程插件。在已有项目的对话中，你可以单独选用七个技能中的任意一个，也可以直接描述任务，让 Codex 按需匹配。个人私有版本，尚未选择许可证。

## 在已有项目中使用

1. 在桌面应用左上角选择 **Codex**，从侧栏打开要处理的项目，进入该项目的对话。
2. 在消息输入框输入 `@codex-engineering-pro`，从结果中点选 **Codex Engineering Pro**。下面是 0.1.1 的桌面实测画面。

   ![桌面搜索结果中的插件名称和图标](docs/desktop-icon-row.png)

3. 在同一条消息里粘贴技能名，写上要做的事，然后发送。例如，第一次接手项目时可以用「代码库调查」：

   ```text
   $codex-engineering-pro:cep-codebase-investigator 请只读调查这个项目。告诉我程序从哪里启动、核心逻辑在哪个文件，以及现有测试怎么运行。
   ```

**只发技能名。** 如果你在上文已经说明“审查当前未提交的改动”，可以尝试在下一条消息只发 `$codex-engineering-pro:cep-independent-code-review`。在新对话里，补一句“审查当前未提交的改动”能明确审查范围。桌面实测已验证选中插件后发送“技能名＋任务”可以调用技能；仅发送技能名的桌面流程尚未单独验证。

**自动匹配。** 也可以直接发送“帮我找出为什么零数量订单仍会计费，并验证修复”。Codex 根据任务描述选择适用的技能。

## 按任务选技能

| 想做什么 | 技能 | 可复制到对话框的完整名称 |
| --- | --- | --- |
| 找到入口、调用链和相关文件 | 代码库调查 | `$codex-engineering-pro:cep-codebase-investigator` |
| 实现前先明确范围、步骤和验收条件 | 需求规划 | `$codex-engineering-pro:cep-requirement-planner` |
| 按明确需求修改代码 | 安全实现 | `$codex-engineering-pro:cep-safe-implementation` |
| 找出报错或失败测试的根因 | 调试专家 | `$codex-engineering-pro:cep-debugging-specialist` |
| 检查改动能否通过测试和验收 | 测试验证 | `$codex-engineering-pro:cep-test-verification` |
| 只读审查当前差异或指定提交 | 独立代码审查 | `$codex-engineering-pro:cep-independent-code-review` |
| 从需求开始，完成实现并验证 | 工程工作流统筹 | `$codex-engineering-pro:cep-engineering-workflow` |

## 首次在桌面安装

如果在对话中已经能搜到并选中插件，可以直接使用。要在新电脑上安装，可以走桌面插件目录的本地来源流程：

1. 使用有权访问私有仓库的账号，将本仓库克隆到本机的固定文件夹。这一步可以在 GitHub Desktop 的 **File → Clone repository** 中完成。保留包含 `.agents`、`plugins` 和本 README 的完整目录。
2. 在 Codex 桌面端把这个仓库根文件夹作为项目打开，重启桌面应用并重新打开该项目。
3. 在桌面应用的 **插件目录（Plugins Directory）** 中选择来源 **个人工程插件**，找到 **Codex Engineering Pro** 并安装。
4. 回到你要工作的项目，新建对话，按上面的步骤搜索插件并试用「代码库调查」。

以上安装步骤依据官方的仓库级本地插件市场说明。已在 Windows 桌面验证安装后的插件搜索、图标显示和单项技能调用；新电脑上从克隆到点击安装的整套图形界面流程尚未实测。若看不到来源，先确认打开的是含 `.agents/plugins/marketplace.json` 的仓库根目录。[官方本地插件市场说明](https://developers.openai.com/plugins/build/plugins#build-your-own-curated-plugin-list)

## 智能模式 B

低风险且目标明确的工作直接推进。跨模块等复杂任务先给计划，再继续已授权、可回退的步骤。若希望先看方案，可在对话里写“只给计划，等我确认后再改”。

高风险或不可逆操作执行前须有覆盖具体目标、环境和后果的明确授权。目标改变时重新核对。独立代码审查会从需求和代码证据重新判断，可以在同一对话中完成。[完整工作约定](plugins/codex-engineering-pro/references/mode-b.md)

## 验证与资料

- [验证报告与已知限制](docs/VALIDATION-REPORT.md)
- [七个技能的样例与预期行为](docs/TEST-CASES.md)
- [验证清单](docs/VALIDATION.md)
- [打包格式依据](docs/RESEARCH.md)
