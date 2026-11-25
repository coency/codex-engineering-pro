import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validate, parseSimpleYaml } from './validate.mjs';

const original = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const first = 'plugins/codex-engineering-pro/skills/cep-engineering-workflow';
function fixture(run) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'cep-validator-'));
  const root = path.join(temporary, 'bundle');
  try { fs.cpSync(original, root, { recursive: true, filter: source => source !== path.join(original, '.git') }); run(root); }
  finally {
    // 唯一递归删除对象是本函数创建的临时目录；原始分发目录永远不在其内。
    const resolved = fs.realpathSync(temporary);
    assert.equal(path.dirname(resolved).toLowerCase(), fs.realpathSync(os.tmpdir()).toLowerCase());
    assert.ok(path.basename(resolved).startsWith('cep-validator-'));
    fs.rmSync(resolved, { recursive: true, force: true });
  }
}
function mutateJson(root, relative, mutate) {
  const file = path.join(root, relative);
  const value = JSON.parse(fs.readFileSync(file, 'utf8'));
  mutate(value);
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}
function rejects(root, message) {
  const result = validate(root);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes(message)), result.errors.join('\n'));
}

test('完整包通过', () => assert.deepEqual(validate(original).errors, []));
test('共用 YAML 子集处理中文、布尔和产品列表', () => {
  assert.deepEqual(parseSimpleYaml('interface:\n  display_name: "中文"\npolicy:\n  allow_implicit_invocation: true\n  products:\n    - "CODEX"\n'),
    { interface: { display_name: '中文' }, policy: { allow_implicit_invocation: true, products: ['CODEX'] } });
  assert.throws(() => parseSimpleYaml('name: first\nname: second\n'), /重复键/);
});
test('缺少技能文件被拒绝', () => fixture((root) => {
  fs.unlinkSync(path.join(root, first, 'SKILL.md'));
  rejects(root, '七个技能');
}));
test('内部名称与目录不符被拒绝', () => fixture((root) => {
  const file = path.join(root, first, 'SKILL.md');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('name: cep-engineering-workflow', 'name: wrong-id'));
  rejects(root, '名称不符');
}));
test('关闭自动匹配被拒绝', () => fixture((root) => {
  const file = path.join(root, first, 'agents/openai.yaml');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('allow_implicit_invocation: true', 'allow_implicit_invocation: false'));
  rejects(root, '未启用自动匹配');
}));
test('市场路径越界被拒绝', () => fixture((root) => {
  mutateJson(root, '.agents/plugins/marketplace.json', (value) => { value.plugins[0].source.path = './../outside'; });
  rejects(root, '市场来源越界');
}));
test('市场产品范围丢失被拒绝', () => fixture((root) => {
  mutateJson(root, '.agents/plugins/marketplace.json', (value) => { delete value.plugins[0].policy.products; });
  rejects(root, '必须限定 CODEX');
}));
test('兼容清单元数据漂移被拒绝', () => fixture((root) => {
  mutateJson(root, 'plugins/codex-engineering-pro/.codex-plugin/plugin.json', (value) => { value.interface.displayName = 'different'; });
  rejects(root, '界面配置不一致');
}));
test('断裂引用被拒绝', () => fixture((root) => {
  fs.appendFileSync(path.join(root, first, 'SKILL.md'), '\n[断裂引用](missing.md)\n');
  rejects(root, 'Markdown 引用');
}));
test('插件引用逃出安装根被拒绝', () => fixture((root) => {
  fs.appendFileSync(path.join(root, first, 'SKILL.md'), '\n[越界引用](../../../../README.md)\n');
  rejects(root, '文档引用越界');
}));
test('未请求的许可证选择被拒绝', () => fixture((root) => {
  mutateJson(root, 'plugins/codex-engineering-pro/plugin.json', (value) => { value.license = 'MIT'; });
  rejects(root, '不应包含 license');
}));
test('安装器文件被拒绝', () => fixture((root) => {
  fs.writeFileSync(path.join(root, 'install.ps1'), '# undesired installer');
  rejects(root, '不包含安装器');
}));
test('损坏的 JSON 被拒绝', () => fixture((root) => {
  fs.writeFileSync(path.join(root, '.agents/plugins/marketplace.json'), '{');
  rejects(root, '本地市场');
}));
