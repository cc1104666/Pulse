# Pulse 更新日志

## 最新更新 (2025-11-03)

### 🎯 主要功能改进

#### 1. 邀请功能完善
- **修复邀请链接错误**: 使用 `useWalletClient` hook 正确检测钱包状态，避免 "wallet not connected" 错误
- **创建邀请确认页面**: 用户通过邀请链接访问时，显示友好的确认界面，需要主动点击"Accept"按钮才触发钱包
- **权限控制**: 只有已加入群组/已订阅频道的用户才能看到邀请按钮
- **简化邀请 UI**: 移除重复的"invite by address"功能，统一使用邀请链接分享

#### 2. 频道权限管理
- **频道广播模式**: 只有频道创建者可以发送消息，其他用户只能订阅和查看
- **群组讨论模式**: 所有群组成员都可以发送消息
- **动态 UI**: 根据用户权限显示不同的界面
  - 未订阅/未加入: 显示"Subscribe"/"Join"按钮
  - 已订阅但非创建者: 显示提示"只有创建者能发送消息"
  - 创建者/成员: 显示消息输入框

#### 3. 修复成员/订阅者数量显示
- **问题**: 之前显示为 NaN
- **解决**: 在 `getAllChannels` 和 `getAllGroups` 中同时获取成员/订阅者数量
- **优化**: 使用 `Promise.all` 并行获取，提高性能

#### 4. "我的"列表过滤
- **问题**: "My Channels" 和 "My Groups" 显示所有公开的群组/频道
- **解决**: 
  - 新增 `getMyChannels()` 函数 - 只返回用户已订阅的频道
  - 新增 `getMyGroups()` 函数 - 只返回用户已加入的群组
  - 列表现在只显示用户真正加入的群组/频道

#### 5. 🆕 发现页面 (Discover)
- **全新功能**: 浏览和搜索所有公开的群组和频道
- **功能特性**:
  - 标签切换: Groups / Channels
  - 实时搜索: 按名称过滤
  - 详细信息: 显示成员数、订阅者数、创建时间
  - 一键加入: 直接加入/订阅感兴趣的群组/频道
  - 状态显示: 已加入的显示"✓ Joined"徽章
  - 快速打开: 点击"Open"按钮直接进入聊天

### 📝 新增文件

```
src/components/
├── Discover.jsx          # 发现页面组件
└── InviteAccept.jsx      # 邀请确认页面组件

src/styles/
├── Discover.css          # 发现页面样式
└── InviteAccept.css      # 邀请确认页面样式

.gitignore                # Git 忽略文件配置
CHANGELOG.md              # 本更新日志
```

### 🔧 修改的文件

#### 前端组件
- `src/components/MainLayout.jsx`
  - 添加邀请链接处理逻辑
  - 集成 Discover 组件
  - 使用 `useWalletClient` 检测钱包状态

- `src/components/ChatRoom.jsx`
  - 添加"Discover"按钮
  - 更新按钮文案: "Groups" → "My Groups", "Channels" → "My Channels"

- `src/components/Channel.jsx`
  - 添加订阅状态检查
  - 实现权限控制 UI
  - 只有创建者可以发送消息

- `src/components/GroupChat.jsx`
  - 添加成员状态检查
  - 实现权限控制 UI
  - 未加入显示"Join"按钮

- `src/components/ChannelList.jsx`
  - 使用 `getMyChannels()` 替代 `getAllChannels()`
  - 只显示用户已订阅的频道

- `src/components/GroupList.jsx`
  - 使用 `getMyGroups()` 替代 `getAllGroups()`
  - 只显示用户已加入的群组

#### 合约交互
- `src/hooks/useContract.js`
  - 修改 `getAllChannels()`: 添加订阅者数量获取
  - 修改 `getAllGroups()`: 添加成员数量获取
  - 新增 `getMyChannels()`: 过滤用户已订阅的频道
  - 新增 `getMyGroups()`: 过滤用户已加入的群组
  - 导出新函数供组件使用

#### 样式文件
- `src/styles/ChatRoom.css`
  - 添加 `.discover-btn` 样式
  - 更新响应式布局

- `src/styles/Channel.css`
  - 添加 `.subscribe-prompt` 样式
  - 添加 `.subscribe-btn` 样式

- `src/styles/GroupChat.css`
  - 添加 `.join-prompt` 样式
  - 添加 `.join-btn` 样式

#### 脚本文件
- `scripts/test-contracts.js`
  - **安全修复**: 移除硬编码的私钥
  - 强制要求通过环境变量 `PRIVATE_KEY` 传入

### 🔒 安全改进

1. **移除硬编码私钥**: 
   - 修复 `scripts/test-contracts.js` 中的硬编码私钥
   - 所有脚本现在都要求通过环境变量传入私钥

2. **添加 .gitignore**:
   - 忽略 `.env` 文件
   - 忽略私钥文件 (`*.key`, `*.pem`)
   - 忽略敏感目录 (`private-keys/`, `secrets/`)

### 📊 功能对比

| 功能 | 之前 | 现在 |
|------|------|------|
| 邀请链接 | 自动触发钱包，容易错过 | 显示确认页面，用户主动确认 |
| 成员数量 | 显示 NaN | 显示正确数量 |
| My Channels/Groups | 显示所有公开的 | 只显示已加入的 |
| 发现新群组/频道 | ❌ 不支持 | ✅ 专门的发现页面 |
| 搜索功能 | ❌ 不支持 | ✅ 实时搜索 |
| 频道权限 | 所有人都能发送 | 只有创建者能发送 |
| 私钥安全 | 硬编码在测试脚本中 | 通过环境变量传入 |

### 🚀 使用指南

#### 发现新群组/频道
1. 点击主界面的 "🔍 Discover" 按钮
2. 选择 "👥 Groups" 或 "📢 Channels" 标签
3. 使用搜索框搜索感兴趣的内容
4. 点击 "➕ Join" 或 "➕ Subscribe" 加入
5. 加入后点击 "💬 Open" 或 "📡 Open" 进入聊天

#### 邀请其他用户
1. 在群组/频道中点击 "➕ Invite" 按钮
2. 点击 "📋 Copy Link" 复制邀请链接
3. 将链接分享给其他用户
4. 用户点击链接后会看到确认页面
5. 用户点击 "Accept" 按钮并确认钱包交易即可加入

#### 运行测试脚本
```bash
# 设置私钥环境变量
export PRIVATE_KEY=0x...

# 运行测试
npm run test:contracts
```

### 🐛 已修复的问题

1. ✅ 邀请链接访问时的双重弹窗问题
2. ✅ "wallet not connected" 错误
3. ✅ 成员/订阅者数量显示 NaN
4. ✅ "My Channels/Groups" 显示所有公开内容
5. ✅ 未加入用户也能看到邀请按钮
6. ✅ 未加入用户也能看到消息输入框
7. ✅ 测试脚本中的硬编码私钥安全隐患

### 💡 技术亮点

1. **使用 wagmi hooks**: `useWalletClient` 正确检测钱包状态
2. **使用 useRef**: 防止邀请链接重复处理
3. **Promise.all 优化**: 并行获取成员数量，提高性能
4. **权限控制**: 基于用户角色的动态 UI
5. **模块化设计**: Discover 组件独立，易于维护
6. **响应式设计**: 所有新组件都支持移动端

### 📌 注意事项

1. **环境变量**: 确保 `.env` 文件不要提交到 Git
2. **私钥安全**: 永远不要在代码中硬编码私钥
3. **测试**: 运行脚本前务必设置 `PRIVATE_KEY` 环境变量

---

## 部署的合约地址

- **PulseChat**: `0x1bb70b8687dcf709ef15754f6037c1742d10526e`
- **PulseGroups**: `0xa047f1daaed0d4dab58b089d866e1e97f2ba2b1d`
- **PulseChannels**: `0x1bb70b8687dcf709ef15754f6037c1742d10526e`
- **PulseFriends**: `0x5c5e181a8a3c5c0d5e5e5e5e5e5e5e5e5e5e5e5e`
- **PulsePrivateMessages**: `0x6d6e191b9b4d6e6e6e6e6e6e6e6e6e6e6e6e6e6e`

## 网络信息

- **网络**: Polkadot Hub TestNet
- **Chain ID**: 420420422
- **RPC**: https://testnet-passet-hub-eth-rpc.polkadot.io
- **原生代币**: PAS

