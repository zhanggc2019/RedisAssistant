# 国际化迁移指南

## 迁移步骤

### 第一步：识别硬编码文本

使用以下方法找到需要翻译的文本：

```bash
# 搜索常见的硬编码文本模式
grep -r "Save" redisinsight/ui/src --include="*.tsx" | grep -v node_modules
grep -r "Cancel" redisinsight/ui/src --include="*.tsx" | grep -v node_modules
grep -r "Delete" redisinsight/ui/src --include="*.tsx" | grep -v node_modules
```

### 第二步：添加翻译键

在翻译文件中添加新的键：

**en.json**:
```json
{
  "browser": {
    "addKey": {
      "title": "Add Key",
      "keyNameLabel": "Key Name",
      "keyNamePlaceholder": "Enter key name"
    }
  }
}
```

**zh.json**:
```json
{
  "browser": {
    "addKey": {
      "title": "添加键",
      "keyNameLabel": "键名称",
      "keyNamePlaceholder": "输入键名称"
    }
  }
}
```

### 第三步：替换组件中的文本

**之前：**
```tsx
const AddKeyForm = () => (
  <div>
    <h2>Add Key</h2>
    <label>Key Name</label>
    <input placeholder="Enter key name" />
  </div>
)
```

**之后：**
```tsx
import { useI18n } from 'uiSrc/hooks/useI18n'

const AddKeyForm = () => {
  const { t } = useI18n()
  
  return (
    <div>
      <h2>{t('browser.addKey.title')}</h2>
      <label>{t('browser.addKey.keyNameLabel')}</label>
      <input placeholder={t('browser.addKey.keyNamePlaceholder')} />
    </div>
  )
}
```

### 第四步：测试

1. 切换到英文验证
2. 切换到中文验证
3. 检查布局是否适配（中文通常更短）

## 迁移优先级

### 🔴 高优先级（立即迁移）

- [ ] 导航菜单项
- [ ] 按钮文本
- [ ] 表单标签和占位符
- [ ] 错误消息
- [ ] 成功/失败提示

### 🟡 中优先级（尽快迁移）

- [ ] 页面标题
- [ ] 工具提示
- [ ] 确认对话框文本
- [ ] 空状态消息
- [ ] 加载文本

### 🟢 低优先级（可以稍后迁移）

- [ ] 帮助文本
- [ ] 示例内容
- [ ] 开发调试信息
- [ ] 日志消息

## 常见模式迁移

### 模式 1: 按钮

```tsx
// ❌ 之前
<button>Save</button>
<button onClick={handleDelete}>Delete</button>

// ✅ 之后
<button>{t('common.save')}</button>
<button onClick={handleDelete}>{t('common.delete')}</button>
```

### 模式 2: 标签和占位符

```tsx
// ❌ 之前
<label>Email Address</label>
<input placeholder="Enter your email" />

// ✅ 之后
<label>{t('form.emailLabel')}</label>
<input placeholder={t('form.emailPlaceholder')} />
```

### 模式 3: 消息和通知

```tsx
// ❌ 之前
showSuccess('Item saved successfully!')
showError('Failed to delete item')

// ✅ 之后
showSuccess(t('messages.saveSuccess'))
showError(t('messages.deleteFailed'))
```

### 模式 4: 条件文本

```tsx
// ❌ 之前
const text = isConnected ? 'Connected' : 'Disconnected'

// ✅ 之后
const text = isConnected 
  ? t('status.connected') 
  : t('status.disconnected')
```

### 模式 5: 数组映射

```tsx
// ❌ 之前
const items = ['All', 'Active', 'Inactive'].map(...)

// ✅ 之后
const items = [
  { label: t('filter.all'), value: 'all' },
  { label: t('filter.active'), value: 'active' },
  { label: t('filter.inactive'), value: 'inactive' },
].map(...)
```

## 特殊场景处理

### 场景 1: 带变量的文本

**翻译文件：**
```json
{
  "messages": {
    "itemsSelected": "已选择 {{count}} 个项目",
    "welcomeBack": "欢迎回来，{{name}}！"
  }
}
```

**组件：**
```tsx
t('messages.itemsSelected', { count: selectedCount })
t('messages.welcomeBack', { name: userName })
```

### 场景 2: HTML 内容

对于包含 HTML 的文本，使用 `dangerouslySetInnerHTML` 或拆分文本：

```tsx
// 方法 A: 拆分文本
<p>
  {t('terms.prefix')}
  <a href="/terms">{t('terms.link')}</a>
  {t('terms.suffix')}
</p>

// 方法 B: 使用 Trans 组件（如果需要完整句子）
import { Trans } from 'react-i18next'

<Trans i18nKey="terms.message">
  请阅读我们的 <a href="/terms">服务条款</a>
</Trans>
```

### 场景 3: 动态键名

避免使用动态键，如果必须使用：

```tsx
// ❌ 不推荐
t(`status.${dynamicStatus}`)

// ✅ 推荐 - 使用映射对象
const statusMap = {
  active: t('status.active'),
  inactive: t('status.inactive'),
  pending: t('status.pending'),
}
statusMap[dynamicStatus]
```

### 场景 4: 长文本/段落

对于长文本，考虑使用 Markdown 或拆分成多个部分：

```tsx
// 翻译文件
{
  "about": {
    "paragraph1": "第一段内容...",
    "paragraph2": "第二段内容...",
    "paragraph3": "第三段内容..."
  }
}

// 组件
<div>
  <p>{t('about.paragraph1')}</p>
  <p>{t('about.paragraph2')}</p>
  <p>{t('about.paragraph3')}</p>
</div>
```

## 质量检查清单

迁移完成后，检查：

- [ ] 所有用户可见文本都已翻译
- [ ] 两种语言都测试过
- [ ] 没有控制台错误
- [ ] 布局在所有语言下都正常
- [ ] 变量插值正确工作
- [ ] 复数形式正确处理（如果使用）
- [ ] 特殊字符正确显示
- [ ] 长文本不会破坏布局

## 性能优化

### 懒加载翻译（未来优化）

对于大型应用，可以考虑按需加载翻译：

```typescript
// 配置示例（高级用法）
i18n.use(Backend).init({
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
})
```

### 避免不必要的重渲染

```tsx
// ✅ 好的做法 - memoized
const MyComponent = memo(() => {
  const { t } = useI18n()
  return <div>{t('text')}</div>
})
```

## 回滚方案

如果遇到问题需要回滚：

1. 移除 App.tsx 中的 I18nextProvider
2. 暂时保留翻译文件
3. 恢复硬编码文本
4. 解决问题后重新应用

## 工具和脚本

### 查找未翻译的键

```bash
# 查找可能遗漏的翻译
grep -r "t('.*')" redisinsight/ui/src \
  | grep -v node_modules \
  | sort \
  | uniq
```

### 统计翻译覆盖率

可以使用 i18next-scanner 等工具扫描项目。

## 团队协作建议

1. **分工**: 按功能模块分配翻译任务
2. **审核**: 母语者审核翻译质量
3. **术语表**: 维护统一的技术术语翻译
4. **持续集成**: 在 CI 中添加翻译完整性检查

## 需要帮助？

- 📖 [完整文档](./README.md)
- 💡 [示例代码](./USAGE_EXAMPLES.tsx)
- 🚀 [快速开始](./QUICK_START.md)

---

**提示**: 渐进式迁移 - 不必一次性完成所有迁移。优先处理用户最常看到的部分。
