import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const skillIds = [
  'cep-engineering-workflow', 'cep-codebase-investigator', 'cep-requirement-planner',
  'cep-safe-implementation', 'cep-test-verification', 'cep-independent-code-review',
  'cep-debugging-specialist',
];
const han = /[\u3400-\u9fff]/u;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const within = (root, target) => {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
};
function need(condition, message) {
  if (!condition) throw new Error(message);
}
function json(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// 只解析本包采用的缩进映射、字符串列表和标量；不冒充通用 YAML 解析器。
// 多行标量、锚点、标签或复杂 YAML 需要更换完整解析器并重新核对宿主兼容性。
export function parseSimpleYaml(source) {
  const root = {};
  const rows = source.split(/\r?\n/).map((text, i) => ({ text, line: i + 1 }))
    .filter(({ text }) => text.trim() !== '' && !text.trimStart().startsWith('#'));
  const stack = [{ indent: -1, value: root }];
  const scalar = (text) => {
    if (text === 'true') return true;
    if (text === 'false') return false;
    if (text.startsWith('"')) {
      const value = JSON.parse(text);
      need(typeof value === 'string', 'YAML 标量必须是字符串');
      return value;
    }
    need(/^[a-z0-9-]+$/.test(text), '不支持的 YAML 标量：' + text);
    return text;
  };
  rows.forEach(({ text, line }, index) => {
    need(!text.includes('\t'), 'YAML 不允许制表符，第 ' + line + ' 行');
    const indent = text.length - text.trimStart().length;
    need(indent % 2 === 0, 'YAML 缩进须为两空格，第 ' + line + ' 行');
    const content = text.trimStart();
    while (stack.at(-1).indent >= indent) stack.pop();
    const parent = stack.at(-1);
    need(indent === parent.indent + (parent.indent === -1 ? 1 : 2), 'YAML 缩进层级无效');
    if (content.startsWith('- ')) {
      need(Array.isArray(parent.value), 'YAML 列表位置无效');
      parent.value.push(scalar(content.slice(2)));
      return;
    }
    need(!Array.isArray(parent.value), 'YAML 列表不能包含映射');
    const match = /^([a-z_]+):(?: (.*))?$/.exec(content);
    need(match, '不支持的 YAML 行：' + line);
    const [, key, value] = match;
    need(!Object.hasOwn(parent.value, key), 'YAML 重复键：' + key);
    if (value !== undefined && value !== '') {
      parent.value[key] = scalar(value);
    } else {
      const next = rows[index + 1];
      const nested = next && next.text.trimStart().startsWith('- ') ? [] : {};
      parent.value[key] = nested;
      stack.push({ indent, value: nested });
    }
  });
  return root;
}

export function validate(rootInput) {
  const root = path.resolve(rootInput);
  const checks = [];
  const errors = [];
  const check = (label, run) => {
    try { run(); checks.push(label); }
    catch (error) { errors.push(label + '：' + error.message); }
  };
  const plugin = path.join(root, 'plugins', 'codex-engineering-pro');
  let portable, fallback, market;
  check('根目录、UTF-8 文件和发布边界', () => {
    need(fs.statSync(root).isDirectory(), '分发根不存在');
    for (const relative of ['README.md', 'docs/RESEARCH.md', 'docs/VALIDATION.md',
      'docs/TEST-CASES.md', 'docs/VALIDATION-REPORT.md', 'scripts/validate.mjs',
      'scripts/test-validator.mjs', 'plugins/codex-engineering-pro/README.md']) {
      need(fs.statSync(path.join(root, relative)).isFile(), '缺少 ' + relative);
    }
    function scan(directory) {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (directory === root && entry.name === '.git') continue;
        const target = path.join(directory, entry.name);
        need(!entry.isSymbolicLink(), '不允许符号链接：' + target);
        need(entry.isDirectory() || entry.isFile(), '不支持的文件类型');
        need(!/^(AGENTS\.md|LICENSE(?:\..*)?|COPYING(?:\..*)?)$/i.test(entry.name), '禁止加入的文件：' + entry.name);
        need(!/\.(exe|msi|bat|cmd|ps1)$/i.test(entry.name), '本包不包含安装器：' + entry.name);
        if (entry.isDirectory()) scan(target);
        else {
          const bytes = fs.readFileSync(target);
          if (target === path.join(root, 'docs', 'desktop-icon-row.png')) {
            need(bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')), '桌面截图须为 PNG');
            continue;
          }
          if (target === path.join(plugin, 'assets', 'engineering-mark.png')) {
            need(bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))
              && bytes.length >= 33 && bytes.readUInt32BE(16) === 512 && bytes.readUInt32BE(20) === 512,
              '图标须为 512 × 512 PNG');
            continue;
          }
          const content = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
          need(!(bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf), '须为无 BOM 的 UTF-8');
          need(!content.includes('\ufffd'), '存在替换字符：' + target);
        }
      }
    }
    scan(root);
  });
  check('根入口与 Codex 兼容清单', () => {
    portable = json(path.join(plugin, 'plugin.json'));
    fallback = json(path.join(plugin, '.codex-plugin/plugin.json'));
    need(portable.$schema === 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', 'Schema 标识不符');
    need(portable.name === 'codex-engineering-pro', '插件名不符');
    need(/^\d+\.\d+\.\d+$/.test(portable.version), '版本须为三段数字');
    for (const field of ['name', 'version', 'description', 'keywords']) {
      need(same(portable[field], fallback[field]), '两清单不一致：' + field);
    }
    need(han.test(portable.description), '插件描述须为中文');
    const extension = portable.extensions?.['com.openai'];
    need(extension && same(extension.interface, fallback.interface), 'OpenAI 界面配置不一致');
    need(fallback.skills === './skills/', '兼容技能目录不符');
    need(!Object.hasOwn(portable, 'skills'), '根入口采用固定 skills/ 发现');
    for (const manifest of [portable, fallback]) {
      for (const field of ['license', 'author', 'homepage', 'repository', 'apps', 'mcpServers', 'hooks']) {
        need(!Object.hasOwn(manifest, field), '本首版不应包含 ' + field);
      }
    }
    need(same(Object.keys(extension), ['interface']), '出现未验证的扩展字段');
    const info = extension.interface;
    for (const field of ['logo', 'composerIcon']) {
      need(info[field] === './assets/engineering-mark.png' && fs.statSync(path.join(plugin, info[field])).isFile(), '缺少图标资源：' + field);
    }
    need(fs.statSync(path.join(plugin, 'assets/engineering-mark.svg')).isFile(), '缺少可编辑的矢量图标');
    need(info.displayName === 'Codex Engineering Pro', '显示名不符');
    for (const field of ['shortDescription', 'longDescription', 'developerName']) {
      need(typeof info[field] === 'string' && han.test(info[field]), '中文界面字段无效：' + field);
    }
    need(Array.isArray(info.defaultPrompt) && info.defaultPrompt.length <= 3, '默认提示词数量无效');
    for (const prompt of info.defaultPrompt) {
      need(han.test(prompt) && prompt.length <= 128, '默认提示词不合要求');
    }
    need(fs.statSync(path.resolve(plugin, fallback.skills)).isDirectory(), '技能目录不存在');
  });
  check('本地市场、产品范围与路径', () => {
    market = json(path.join(root, '.agents/plugins/marketplace.json'));
    need(market.name === 'cep-personal' && han.test(market.interface?.displayName), '市场身份无效');
    need(Array.isArray(market.plugins) && market.plugins.length === 1, '须为一个插件条目');
    const entry = market.plugins[0];
    need(entry.name === 'codex-engineering-pro', '市场插件名不符');
    need(entry.source?.source === 'local', '仅支持本地来源');
    const relative = entry.source.path;
    need(typeof relative === 'string' && relative.startsWith('./') && !relative.includes('\\'), '市场路径须以 ./ 开头');
    const target = path.resolve(root, relative);
    need(within(root, target) && target === plugin, '市场来源越界或目标不符');
    need(fs.statSync(target).isDirectory(), '市场目标缺失');
    need(entry.policy?.installation === 'AVAILABLE', '安装策略不符');
    need(entry.policy?.authentication === 'ON_USE', '认证策略不符');
    need(same(entry.policy?.products, ['CODEX']), '市场必须限定 CODEX');
    need(entry.category === 'Developer Tools', '市场分类不符');
  });
  check('七个技能及可解析的中文元数据', () => {
    const skillRoot = path.join(plugin, 'skills');
    const actual = fs.readdirSync(skillRoot).sort();
    need(same(actual, [...skillIds].sort()), '技能必须恰为预定七项');
    for (const id of skillIds) {
      const directory = path.join(skillRoot, id);
      const content = fs.readFileSync(path.join(directory, 'SKILL.md'), 'utf8');
      const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/.exec(content);
      need(match, id + ' 缺少前置元数据或正文');
      const front = parseSimpleYaml(match[1]);
      need(same(Object.keys(front).sort(), ['description', 'name']), id + ' 前置字段不符');
      need(front.name === id && /^[a-z0-9-]{1,63}$/.test(front.name), id + ' 名称不符');
      need(typeof front.description === 'string' && han.test(front.description) && front.description.length <= 1024, id + ' 描述无效');
      need(han.test(match[2]) && !/\b(TODO|FIXME|PLACEHOLDER)\b/.test(match[2]), id + ' 正文未完成');
      const contract = path.resolve(directory, '../../references/mode-b.md');
      need(fs.statSync(contract).isFile() && content.includes('../../references/mode-b.md'), id + ' 缺少共用约定');
      const metadata = parseSimpleYaml(fs.readFileSync(path.join(directory, 'agents/openai.yaml'), 'utf8'));
      need(same(Object.keys(metadata).sort(), ['interface', 'policy']), id + ' 元数据字段不符');
      need(metadata.policy?.allow_implicit_invocation === true, id + ' 未启用自动匹配');
      need(same(metadata.policy?.products, ['CODEX']), id + ' 产品范围不符');
      const info = metadata.interface;
      need(han.test(info?.display_name), id + ' 缺少中文显示名');
      need(han.test(info?.short_description) && info.short_description.length >= 25 && info.short_description.length <= 64, id + ' 短描述应为 25–64 字符');
      need(han.test(info?.default_prompt) && info.default_prompt.includes('$codex-engineering-pro:' + id), id + ' 默认提示词须引用自身');
    }
  });
  check('所有 Markdown 引用及技能显式名称', () => {
    function visit(directory) {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (directory === root && entry.name === '.git') continue;
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) { visit(file); continue; }
        if (!entry.name.endsWith('.md')) continue;
        const content = fs.readFileSync(file, 'utf8');
        for (const match of content.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)) {
          const href = match[1];
          if (/^https:\/\//.test(href) || href.startsWith('#')) continue;
          need(!/^[a-z]+:/i.test(href), '不支持的链接协议：' + href);
          const relative = decodeURIComponent(href.split('#')[0]);
          need(!path.isAbsolute(relative), '文档引用不可是绝对路径');
          const target = path.resolve(path.dirname(file), relative);
          const boundary = within(plugin, file) ? plugin : root;
          need(within(boundary, target), '文档引用越界：' + href);
          need(fs.statSync(target).isFile(), '引用文件缺失：' + href);
        }
        for (const match of content.matchAll(/\$codex-engineering-pro:(cep-[a-z-]+)/g)) {
          need(skillIds.includes(match[1]), '未知技能名：' + match[1]);
        }
      }
    }
    visit(root);
  });
  return { ok: errors.length === 0, checks, errors, root };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validate(process.argv[2] || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.ok ? 0 : 1;
}
