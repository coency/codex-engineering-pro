# Codex Engineering Pro · 0.1.2

这是给 **Codex 桌面端**使用的中文工程插件。在已有项目的对话中，你可以单独选用七个技能中的任意一个，也可以直接描述任务，让 Codex 按需匹配。个人项目，尚未选择许可证。[下载桌面插件发布包](https://github.com/coency/codex-engineering-pro/releases/latest)

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

1. 打开 [v0.1.2 发布页](https://github.com/coency/codex-engineering-pro/releases/tag/v0.1.2)，在 **Assets（附件）** 中下载 **codex-engineering-pro-0.1.2.zip**。页面自动生成的 **Source code (zip)** 是项目源码。
2. 在桌面客户端打开 **添加插件**，选择本地 ZIP 上传，直接选择刚下载的文件。保留压缩状态。
3. 按界面提示安装或启用 **Codex Engineering Pro**，打开项目的新对话，输入 `@codex-engineering-pro` 检查是否可选。

0.1.2 修正了 0.1.1 发布附件的目录层级。打开新的 ZIP，第一层就能看到 `plugin.json` 和 `skills/`。打包检查会逐文件核对技能、元数据和图标。各客户端的上传入口和账户策略可能不同。

## 智能模式 B

低风险且目标明确的工作直接推进。跨模块等复杂任务先给计划，再继续已授权、可回退的步骤。若希望先看方案，可在对话里写“只给计划，等我确认后再改”。

高风险或不可逆操作执行前须有覆盖具体目标、环境和后果的明确授权。目标改变时重新核对。独立代码审查会从需求和代码证据重新判断，可以在同一对话中完成。[完整工作约定](plugins/codex-engineering-pro/references/mode-b.md)

## 验证与资料

- [验证报告与已知限制](docs/VALIDATION-REPORT.md)
- [七个技能的样例与预期行为](docs/TEST-CASES.md)
- [验证清单](docs/VALIDATION.md)
- [打包格式依据](docs/RESEARCH.md)
