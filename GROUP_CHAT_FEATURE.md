# 群聊功能开发说明

## 功能概述

已成功为 Pulse 去中心化聊天应用添加了完整的群聊功能，所有群聊消息都存储在链上。

## 实现的功能

### 1. 创建群聊
- ✅ 任何注册用户都可以创建群聊
- ✅ 群聊名称最长 100 字符
- ✅ 创建者自动成为第一个成员
- ✅ 创建成功后返回群聊 ID

### 2. 加入群聊
- ✅ **邀请链接方式**: 通过分享链接让其他用户加入
  - 链接格式: `https://your-domain.com?joinGroup=群聊ID`
  - 用户点击链接后自动加入群聊
- ✅ **直接邀请方式**: 群成员可以通过钱包地址邀请其他用户

### 3. 群聊消息
- ✅ 所有消息存储在链上，确保历史记录永久保存
- ✅ 后加入的用户可以看到完整的历史消息
- ✅ 只有群成员可以发送消息
- ✅ 消息最长 1000 字符
- ✅ 实时消息监听和更新

### 4. 群聊管理
- ✅ 查看群成员列表
- ✅ 显示成员头像和用户名
- ✅ 显示群聊创建时间和成员数量
- ✅ 复制邀请链接功能

## 技术实现

### 智能合约 (contracts/PulseChat.sol)

新增的数据结构:
```solidity
struct Group {
    uint256 groupId;
    string name;
    address creator;
    uint256 createdAt;
    bool exists;
}

struct GroupMessage {
    address sender;
    string content;
    uint256 timestamp;
    uint256 messageId;
}
```

新增的主要函数:
- `createGroup(string name)` - 创建群聊
- `joinGroup(uint256 groupId)` - 通过邀请链接加入
- `addGroupMember(uint256 groupId, address member)` - 邀请成员
- `sendGroupMessage(uint256 groupId, string content)` - 发送群消息
- `getGroupInfo(uint256 groupId)` - 获取群信息
- `getGroupMembers(uint256 groupId)` - 获取成员列表
- `getLatestGroupMessages(uint256 groupId, uint256 count)` - 获取最新消息
- `getUserGroups(address user)` - 获取用户的所有群聊

### 前端组件

#### 1. GroupList.jsx
- 显示用户加入的所有群聊
- 创建新群聊表单
- 群聊卡片展示（名称、成员数、创建时间）

#### 2. GroupChat.jsx
- 群聊消息界面
- 发送消息功能
- 成员列表面板
- 邀请功能面板（链接分享 + 地址邀请）
- 实时消息更新

#### 3. 更新的组件
- **ChatRoom.jsx**: 添加"Groups"按钮
- **MainLayout.jsx**: 集成群聊列表和群聊界面，处理邀请链接

### Hooks (useContract.js)

新增的合约交互函数:
- `createGroup(name)`
- `joinGroup(groupId)`
- `addGroupMember(groupId, memberAddress)`
- `sendGroupMessage(groupId, content)`
- `getGroupInfo(groupId)`
- `getGroupMembers(groupId)`
- `getLatestGroupMessages(groupId, count)`
- `getTotalGroupMessages(groupId)`
- `getUserGroups(userAddress)`
- `checkGroupMembership(groupId, userAddress)`
- `listenToGroupMessages(groupId, callback)`

## 使用流程

### 创建群聊
1. 点击主聊天界面的"Groups"按钮
2. 点击"Create Group"
3. 输入群聊名称
4. 点击"Create"确认
5. 等待交易确认（约 2 秒）

### 邀请成员

#### 方式一：邀请链接
1. 进入群聊
2. 点击"Invite"按钮
3. 点击"Copy"复制邀请链接
4. 分享链接给其他用户
5. 其他用户点击链接后自动加入

#### 方式二：直接邀请
1. 进入群聊
2. 点击"Invite"按钮
3. 在"Or invite by address"输入框中输入钱包地址
4. 点击"Invite"
5. 等待交易确认

### 发送消息
1. 在群聊界面底部输入框输入消息
2. 按 Enter 或点击发送按钮
3. 等待交易确认（约 2 秒）
4. 消息上链后自动刷新显示

## 部署说明

### 1. 编译合约
```bash
npm run compile
```

### 2. 部署合约
```bash
PRIVATE_KEY=你的私钥 npm run deploy
```

**注意**: 
- 需要在 Polkadot Hub TestNet 上有足够的 PAS 代币作为 gas 费
- 可以从水龙头获取测试代币: https://faucet.polkadot.io/?parachain=1111
- 部署成功后会自动更新 `src/contracts/deployment.json`

### 3. 启动开发服务器
```bash
npm run dev
```

## 文件清单

### 新增文件
- `src/components/GroupChat.jsx` - 群聊界面组件
- `src/components/GroupList.jsx` - 群聊列表组件
- `src/styles/GroupChat.css` - 群聊界面样式
- `src/styles/GroupList.css` - 群聊列表样式
- `GROUP_CHAT_FEATURE.md` - 本说明文档

### 修改文件
- `contracts/PulseChat.sol` - 添加群聊相关的智能合约功能
- `src/hooks/useContract.js` - 添加群聊相关的合约交互函数
- `src/components/MainLayout.jsx` - 集成群聊功能
- `src/components/ChatRoom.jsx` - 添加群聊入口按钮
- `src/styles/ChatRoom.css` - 更新按钮样式

## 注意事项

1. **Gas 费用**: 每次创建群聊、加入群聊、发送消息都需要支付 gas 费
2. **消息延迟**: 消息上链需要约 2 秒时间，发送后会自动刷新
3. **历史消息**: 默认加载最新 100 条消息
4. **成员权限**: 所有群成员都可以邀请新成员
5. **群聊 ID**: 群聊 ID 从 0 开始自动递增

## 后续优化建议

1. 添加群聊管理员功能
2. 支持踢出成员
3. 支持修改群名称
4. 添加群聊头像
5. 消息分页加载
6. 离线消息通知
7. 群聊搜索功能

## 测试建议

1. 创建多个群聊测试
2. 使用不同账户测试邀请功能
3. 测试邀请链接分享
4. 测试消息发送和历史记录
5. 测试成员列表显示

