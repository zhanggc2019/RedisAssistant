# 国际化 (i18n) 实现总结

## 已完成的工作

### 1. 安装依赖 ✅

已安装以下包：
- `i18next` - 国际化框架
- `react-i18next` - React 集成
- `i18next-browser-languagedetector` - 浏览器语言检测

### 2. 创建的文件结构

```
redisinsight/ui/src/
├── i18n/
│   ├── config.ts                    # i18n 初始化配置
│   ├── index.ts                     # 公共导出
│   ├── README.md                    # 使用文档
│   ├── USAGE_EXAMPLES.tsx          # 代码示例
│   └── locales/
│       ├── en.json                 # 英文翻译
│       └── zh.json                 # 中文翻译
│
├── slices/app/i18n.ts              # Redux slice (状态管理)
├── slices/app/i18n.spec.ts         # 测试文件
├── slices/store.ts                 # (已更新 - 添加 i18n reducer)
│
├── hooks/useI18n.ts                # 自定义 Hook
│
├── contexts/i18nContext.tsx        # Provider 组件
│
├── components/
│   └── LanguageSwitcher/
│       ├── LanguageSwitcher.tsx    # 语言切换 UI 组件
│       └── index.ts                # 导出
│
└── App.tsx                         # (已更新 - 集成 i18n)
```

### 3. 核心功能

#### 支持的语言
- English (`en`)
- 中文 (`zh`)

#### 翻译内容分类
- `app` - 应用相关（名称、欢迎语）
- `navigation` - 导航菜单
- `common` - 通用文本（按钮、操作）
- `actions` - 动作词汇
- `messages` - 消息提示
- `validation` - 验证错误
- `language` - 语言选择相关

### 4. 使用方法

#### 基本用法

```tsx
import { useI18n } from 'uiSrc/hooks/useI18n'

const MyComponent = () => {
  const { t } = useI18n()
  
  return (
    <div>
      <h1>{t('app.welcome')}</h1>
      <button>{t('common.save')}</button>
    </div>
  )
}
```

#### 切换语言

```tsx
import { useI18n } from 'uiSrc/hooks/useI18n'

const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useI18n()
  
  return (
    <button onClick={() => setLanguage('zh')}>
      切换到中文
    </button>
  )
}
```

#### 使用语言切换组件

```tsx
import { LanguageSwitcher } from 'uiSrc/components/LanguageSwitcher'

// 在 header 或设置页面中
<LanguageSwitcher />
```

### 5. 特性

- ✅ **自动语言检测** - 从浏览器或 localStorage 检测
- ✅ **持久化** - 用户选择保存到 localStorage
- ✅ **Redux 集成** - 语言状态全局可访问
- ✅ **类型安全** - TypeScript 支持
- ✅ **懒加载** - 不阻塞应用启动
- ✅ **插值支持** - 支持变量替换

### 6. 下一步操作

#### A. 扩展现有翻译

编辑 `ui/src/i18n/locales/en.json` 和 `ui/src/i18n/locales/zh.json`，添加更多翻译键。

#### B. 在组件中使用

将现有硬编码文本替换为翻译调用：

```tsx
// 之前
<button>Save</button>

// 之后
<button>{t('common.save')}</button>
```

#### C. 添加语言切换器到 UI

在合适的位置（如设置页面或 header）添加语言切换器：

```tsx
import { LanguageSwitcher } from 'uiSrc/components/LanguageSwitcher'

// 在导航或设置中
<LanguageSwitcher />
```

#### D. 添加更多语言

参考 `ui/src/i18n/README.md` 中的"添加新语言"部分。

### 7. 翻译键命名规范

```
category.item.subitem
例如:
- navigation.home
- browser.keys.refresh
- validation.required
```

### 8. 测试

运行测试：
```bash
npm test -- --testPathPattern="i18n"
```

手动测试步骤：
1. 启动应用：`npm run dev:ui`
2. 打开浏览器开发者工具
3. 检查 localStorage 中的 `i18nextLng` 值
4. 使用语言切换器切换语言
5. 验证文本是否正确翻译

### 9. 故障排除

#### 问题：翻译显示为键名而不是翻译文本

**解决方案：**
1. 检查翻译文件中是否存在该键
2. 确保 i18n 配置正确加载了翻译资源
3. 确认组件在 I18nextProvider 内部

#### 问题：语言切换后部分文本未更新

**解决方案：**
1. 确保所有文本都使用了 `t()` 函数
2. 检查是否有硬编码的文本
3. 某些组件可能需要 key 属性来触发重新渲染

### 10. 相关文件

- **配置文件**: `ui/src/i18n/config.ts`
- **翻译文件**: `ui/src/i18n/locales/`
- **Redux 状态**: `ui/src/slices/app/i18n.ts`
- **Hook**: `ui/src/hooks/useI18n.ts`
- **组件**: `ui/src/components/LanguageSwitcher/`
- **文档**: `ui/src/i18n/README.md`

## 快速参考

### 常用翻译键

```typescript
// 应用
t('app.name')         // "Redis Insight"
t('app.welcome')      // "Welcome to Redis Insight"

// 导航
t('navigation.home')      // "Home"
t('navigation.browser')   // "Browser"
t('navigation.settings')  // "Settings"

// 通用
t('common.save')     // "Save"
t('common.cancel')   // "Cancel"
t('common.delete')   // "Delete"
t('common.loading')  // "Loading..."

// 消息
t('messages.saveSuccess')    // "Saved successfully"
t('messages.confirmDelete')  // "Are you sure...?"
```

### API 参考

```typescript
const {
  t,                  // 翻译函数
  i18n,              // i18n 实例
  currentLanguage,   // 当前语言代码
  setLanguage,       // 切换语言方法
  isSupportedLanguage, // 检查语言是否支持
} = useI18n()
```

## 联系与支持

如有问题，请参考：
- [i18n README](ui/src/i18n/README.md) - 详细文档
- [使用示例](ui/src/i18n/USAGE_EXAMPLES.tsx) - 代码示例
- [i18next 官方文档](https://www.i18next.com/)
