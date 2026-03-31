# 国际化快速开始指南

## 5 分钟上手

### 1. 在组件中使用翻译（30 秒）

```tsx
import React from 'react'
import { useI18n } from 'uiSrc/hooks/useI18n'

const MyComponent: React.FC = () => {
  const { t } = useI18n()
  
  return (
    <div>
      <h1>{t('app.welcome')}</h1>
      <p>{t('navigation.home')}</p>
    </div>
  )
}

export default MyComponent
```

### 2. 添加新的翻译文本（1 分钟）

打开翻译文件添加你的键：

**英文** (`ui/src/i18n/locales/en.json`):
```json
{
  "myFeature": {
    "title": "My Feature Title",
    "description": "This is a description"
  }
}
```

**中文** (`ui/src/i18n/locales/zh.json`):
```json
{
  "myFeature": {
    "title": "我的功能标题",
    "description": "这是一个描述"
  }
}
```

### 3. 使用新翻译（30 秒）

```tsx
const { t } = useI18n()

<h2>{t('myFeature.title')}</h2>
<p>{t('myFeature.description')}</p>
```

### 4. 切换语言（可选）

#### 方法 A: 使用现成组件

```tsx
import { LanguageSwitcher } from 'uiSrc/components/LanguageSwitcher'

// 在任何地方渲染
<LanguageSwitcher />
```

#### 方法 B: 自定义按钮

```tsx
const { setLanguage } = useI18n()

<button onClick={() => setLanguage('zh')}>中文</button>
<button onClick={() => setLanguage('en')}>English</button>
```

## 完整示例

### 示例 1: 表单验证

```tsx
import React, { useState } from 'react'
import { useI18n } from 'uiSrc/hooks/useI18n'

const LoginForm: React.FC = () => {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const validate = () => {
    if (!email) {
      setError(t('validation.required'))
      return false
    }
    
    if (!email.includes('@')) {
      setError(t('validation.invalidEmail'))
      return false
    }
    
    setError('')
    return true
  }

  return (
    <form>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {error && <span className="error">{error}</span>}
      <button type="submit">{t('common.save')}</button>
      <button type="button">{t('common.cancel')}</button>
    </form>
  )
}
```

### 示例 2: 动态消息

```tsx
import React from 'react'
import { useI18n } from 'uiSrc/hooks/useI18n'

interface Props {
  itemCount: number
  isSuccess: boolean
}

const StatusMessage: React.FC<Props> = ({ itemCount, isSuccess }) => {
  const { t } = useI18n()

  return (
    <div>
      {isSuccess ? (
        <span style={{ color: 'green' }}>
          ✓ {t('messages.saveSuccess')}
        </span>
      ) : (
        <span style={{ color: 'red' }}>
          ✗ {t('messages.saveFailed')}
        </span>
      )}
      
      <p>
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </p>
    </div>
  )
}
```

### 示例 3: 带变量的翻译

翻译文件：
```json
{
  "messages": {
    "itemsDeleted": "成功删除 {{count}} 个项目",
    "welcomeUser": "欢迎，{{username}}！"
  }
}
```

组件：
```tsx
const { t } = useI18n()

<p>{t('messages.itemsDeleted', { count: deletedCount })}</p>
<p>{t('messages.welcomeUser', { username: userName })}</p>
```

## 常见问题速查

### Q: 如何组织翻译键？

**按功能模块组织：**
```json
{
  "browser": {
    "keys": { ... },
    "string": { ... }
  },
  "workbench": {
    "tutorials": { ... }
  }
}
```

### Q: 如何处理复数？

i18next 支持复数形式：

翻译文件：
```json
{
  "items_one": "{{count}} item",
  "items_other": "{{count}} items"
}
```

使用：
```tsx
t('items', { count: 1 })  // "1 item"
t('items', { count: 5 })  // "5 items"
```

### Q: 如何在非组件中使用？

```tsx
import i18n from 'uiSrc/i18n/config'

// 在任何地方
const text = i18n.t('common.save')
```

### Q: 如何获取当前语言？

```tsx
const { currentLanguage } = useI18n()
console.log(currentLanguage) // "en" or "zh"
```

## 最佳实践清单

✅ **应该做的：**
- [ ] 所有用户可见文本都使用翻译
- [ ] 使用有意义的键名（按功能分组）
- [ ] 为所有支持的语言添加翻译
- [ ] 测试每种语言的显示效果
- [ ] 使用 `t()` 函数的类型提示

❌ **不应该做的：**
- [ ] 硬编码用户可见文本
- [ ] 混用翻译和硬编码文本
- [ ] 忘记添加某些语言的翻译
- [ ] 使用过长的翻译键

## 下一步

1. ✅ 阅读完整文档：`ui/src/i18n/README.md`
2. ✅ 查看更多示例：`ui/src/i18n/USAGE_EXAMPLES.tsx`
3. ✅ 开始在你的组件中使用 i18n
4. ✅ 将现有硬编码文本迁移到翻译系统

## 需要帮助？

- 📖 [完整文档](./README.md)
- 💡 [代码示例](./USAGE_EXAMPLES.tsx)
- 🔗 [i18next 官方文档](https://www.i18next.com/)
- 🐛 遇到问题？检查浏览器控制台的 i18n 日志

---

**最后更新**: 2026-03-31
**支持语言**: English, 中文 (简体中文)
