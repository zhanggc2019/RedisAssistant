# RedisInsight 国际化 (i18n) 系统

## 概述

RedisInsight 现在支持多语言国际化，目前支持：
- **English** (英语) - `en`
- **中文** (简体中文) - `zh`

## 技术栈

- [i18next](https://www.i18next.com/) - 国际化框架
- [react-i18next](https://react.i18next.com/) - React 集成
- Redux Toolkit - 语言状态管理

## 目录结构

```
redisinsight/ui/src/
├── i18n/
│   ├── config.ts              # i18n 配置
│   ├── index.ts               # 导出
│   ├── locales/
│   │   ├── en.json           # 英文翻译
│   │   └── zh.json           # 中文翻译
│   └── USAGE_EXAMPLES.tsx    # 使用示例
├── slices/app/i18n.ts         # Redux slice
├── hooks/useI18n.ts           # 自定义 Hook
└── components/
    └── LanguageSwitcher/     # 语言切换组件
```

## 快速开始

### 1. 在组件中使用翻译

```tsx
import React from 'react'
import { useI18n } from 'uiSrc/hooks/useI18n'

const MyComponent: React.FC = () => {
  const { t } = useI18n()
  
  return (
    <div>
      <h1>{t('app.welcome')}</h1>
      <button>{t('common.save')}</button>
    </div>
  )
}
```

### 2. 切换语言

```tsx
import React from 'react'
import { useI18n } from 'uiSrc/hooks/useI18n'

const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useI18n()
  
  const handleLanguageChange = async (lng: string) => {
    await setLanguage(lng)
  }
  
  return (
    <select 
      value={currentLanguage} 
      onChange={(e) => handleLanguageChange(e.target.value)}
    >
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  )
}
```

### 3. 使用语言切换组件

```tsx
import { LanguageSwitcher } from 'uiSrc/components/LanguageSwitcher'

const Header: React.FC = () => (
  <header>
    <Logo />
    <Navigation />
    <LanguageSwitcher />
  </header>
)
```

## 翻译文件结构

### JSON 格式

```json
{
  "section": {
    "key": "翻译文本",
    "nested": {
      "key": "嵌套的翻译文本"
    }
  }
}
```

### 使用方式

```tsx
// 简单键
t('section.key')

// 嵌套键
t('section.nested.key')
```

## 插值（变量替换）

在翻译文件中定义变量：

```json
{
  "validation": {
    "minLength": "至少需要 {{min}} 个字符",
    "maxLength": "不能超过 {{max}} 个字符"
  }
}
```

在组件中使用：

```tsx
t('validation.minLength', { min: 6 })
t('validation.maxLength', { max: 50 })
```

## 添加新语言

### 1. 创建翻译文件

在 `ui/src/i18n/locales/` 目录下创建新的 JSON 文件：

```bash
# 例如添加西班牙语
touch es.json
```

### 2. 添加翻译内容

```json
{
  "app": {
    "name": "Redis Insight",
    "welcome": "Bienvenido a Redis Insight"
  },
  "common": {
    "save": "Guardar",
    "cancel": "Cancelar"
  }
}
```

### 3. 更新配置

编辑 `ui/src/i18n/config.ts`：

```typescript
import esTranslations from './locales/es.json'

export const supportedLngs = ['en', 'zh', 'es']

i18n.init({
  resources: {
    en: { common: enTranslations },
    zh: { common: zhTranslations },
    es: { common: esTranslations }, // 添加新语言
  },
  // ...其他配置
})
```

### 4. 更新语言名称映射

编辑 `ui/src/hooks/useI18n.ts`：

```typescript
export const getLanguageName = (lng: string): string => {
  const names: Record<string, string> = {
    en: 'English',
    zh: '中文',
    es: 'Español', // 添加新语言名称
  }
  return names[lng] || lng
}
```

## 最佳实践

### ✅ 推荐做法

1. **始终使用翻译 Hook**
   ```tsx
   const { t } = useI18n()
   ```

2. **组织翻译键**
   ```
   feature.item.action (例如：browser.keys.refresh)
   ```

3. **使用命名空间**
   ```tsx
   const { t } = useI18n('common')
   t('save') // 而不是 t('common.save')
   ```

4. **测试所有语言**
   - 开发时切换语言检查布局
   - 确保文本长度适配

### ❌ 避免的做法

1. **不要硬编码文本**
   ```tsx
   // ❌ 错误
   <button>Save</button>
   
   // ✅ 正确
   <button>{t('common.save')}</button>
   ```

2. **不要使用动态键（如果可能）**
   ```tsx
   // ❌ 难以静态分析
   t(`dynamic.${variable}`)
   
   // ✅ 更好
   const translations = {
     success: t('common.success'),
     error: t('common.error'),
   }
   translations[type]
   ```

3. **不要忘记添加所有语言的翻译**
   - 添加新键时，确保在所有语言文件中都有对应翻译

## Redux 集成

### State 结构

```typescript
interface I18nState {
  loading: boolean          // 语言切换加载状态
  currentLanguage: string   // 当前语言
  currentNamespace: string  // 当前命名空间
  error?: string           // 错误信息
}
```

### Actions

```typescript
// 切换语言
dispatch(changeLanguage('zh'))

// 初始化状态
dispatch(initializeI18nState())
```

### Selectors

```typescript
const { currentLanguage } = useSelector(i18nSelector)
```

## 持久化

语言选择会自动保存到 `localStorage`：
- Key: `i18nextLng`
- Value: 语言代码 (例如：`'en'`, `'zh'`)

## 语言检测顺序

1. localStorage (用户上次选择)
2. 浏览器语言设置
3. 默认语言 (English)

## 常见问题

### Q: 为什么我的翻译没有显示？

A: 检查以下几点：
1. 翻译键是否正确
2. 翻译文件是否包含该键
3. i18n 配置是否正确加载了翻译文件
4. 组件是否在 I18nextProvider 内部

### Q: 如何调试翻译问题？

A: 打开浏览器控制台：
```javascript
// 查看当前语言
i18n.language

// 手动切换语言
i18n.changeLanguage('zh')

// 查看翻译内容
i18n.getResourceBundle('zh', 'common')
```

### Q: 翻译文件应该放在哪里？

A: `ui/src/i18n/locales/{lang}.json`

## 相关文件

- 配置：`ui/src/i18n/config.ts`
- Redux Slice: `ui/src/slices/app/i18n.ts`
- Hook: `ui/src/hooks/useI18n.ts`
- 组件：`ui/src/components/LanguageSwitcher/`
- 翻译：`ui/src/i18n/locales/`

## 参考资源

- [i18next 文档](https://www.i18next.com/)
- [react-i18next 文档](https://react.i18next.com/)
- [使用示例](./USAGE_EXAMPLES.tsx)
