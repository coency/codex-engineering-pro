# Codex Engineering Pro

版本 0.1.2，个人首版，仅面向 Codex。通过 GitHub Releases 分发，尚未选择许可证。

从 GitHub Release 的附件下载 codex-engineering-pro-0.1.2.zip，在桌面“添加插件”的本地 ZIP 上传入口直接选择该文件。详细说明见[项目首页](https://github.com/coency/codex-engineering-pro)。

## 工作方式

在 Codex 桌面端打开已有项目，在对话框输入 `@codex-engineering-pro` 并选中插件。要单独调用某个技能，在同一条消息里填写 `$codex-engineering-pro:cep-codebase-investigator` 这样的完整名称和具体任务。也可以直接描述任务，由 Codex 自动匹配。七个技能的内部 ID 如下。

- cep-engineering-workflow：工程工作流统筹
- cep-codebase-investigator：代码库调查
- cep-requirement-planner：需求规划
- cep-safe-implementation：安全实现
- cep-test-verification：测试验证
- cep-independent-code-review：独立代码审查
- cep-debugging-specialist：调试专家

先按[智能模式 B](references/mode-b.md)判断当前动作的风险。复杂任务先计划；高风险动作前核对明确授权；用户只要求调查、规划、审查或验证时不擅自进入实现。

自动选择由 Codex 宿主和模型决定，本插件不提供新的工具或权限。“独立代码审查”指单独审查过程，不能保证由另一个模型完成。共享约定和其他技能采用相对路径读取，所有引用均保留在本插件目录内。

## 内容

根目录 plugin.json 是当前推荐的 Agent Plugins 入口，extensions.com.openai 保存界面信息；.codex-plugin/plugin.json 是 Codex 兼容回退清单。根入口有内联 OpenAI 配置时，宿主不将它与回退清单合并。

七个技能的 agents/openai.yaml 开启自动匹配，并声明 CODEX 产品范围。本地市场另有同样的产品限制。这是宿主支持的产品元数据，不是防止其他软件读取文件的隔离措施。
