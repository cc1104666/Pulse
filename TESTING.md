# Pulse 测试文档

## 概述

本文档描述了 Pulse 项目的测试策略和测试用例，确保群聊、频道和好友功能的正确性和稳定性。

## 测试框架

- **Vitest**: 快速的单元测试框架
- **React Testing Library**: React 组件测试
- **jsdom**: 浏览器环境模拟

## 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行测试 UI 界面
npm run test:ui
```

## 测试结构

```
src/tests/
├── setup.js              # 测试环境配置
├── contract.test.js      # 智能合约逻辑测试
├── components.test.jsx   # React 组件测试
└── integration.test.js   # 集成测试
```

## 测试覆盖范围

### 1. 智能合约逻辑测试 (contract.test.js)

#### 群聊功能
- ✅ 群组名称验证（非空、长度限制）
- ✅ 群组成员管理（添加、去重）
- ✅ 群组消息验证（内容非空、长度限制）

#### 频道功能
- ✅ 频道名称验证（非空、长度限制）
- ✅ 频道权限控制（仅创建者可发送消息）
- ✅ 频道订阅管理（添加、去重）

#### 好友系统
- ✅ 好友添加验证（不能添加自己、防止重复）
- ✅ 好友移除验证（仅移除已存在的好友）
- ✅ 好友关系检查

#### 数据验证
- ✅ 地址格式验证
- ✅ 计数器递增逻辑
- ✅ 时间戳生成和验证

**测试用例数**: 28 个

### 2. React 组件测试 (components.test.jsx)

#### GroupList 组件
- ✅ 渲染创建群组按钮
- ✅ 点击按钮显示创建表单
- ✅ 输入框长度限制验证

#### GroupChat 组件
- ✅ 显示群组名称
- ✅ 渲染消息输入框
- ✅ 消息长度限制验证

#### ChannelList 组件
- ✅ 渲染创建频道按钮
- ✅ 点击按钮显示创建表单
- ✅ 输入框长度限制验证

#### Channel 组件
- ✅ 显示频道名称
- ✅ 显示创建者徽章

#### PrivateChat 组件（好友功能）
- ✅ 显示添加好友按钮
- ✅ 显示私聊提示信息

**测试用例数**: 13 个

### 3. 集成测试 (integration.test.js)

#### 群聊集成流程
- ✅ 创建群组并添加创建者为首个成员
- ✅ 生成邀请链接
- ✅ 通过邀请链接加入群组
- ✅ 防止重复加入
- ✅ 成员权限验证
- ✅ 消息顺序存储

#### 频道集成流程
- ✅ 创建频道并添加创建者为首个订阅者
- ✅ 生成邀请链接
- ✅ 通过邀请链接订阅频道
- ✅ 防止重复订阅
- ✅ 创建者广播权限验证
- ✅ 广播消息顺序存储

#### 好友系统集成流程
- ✅ 添加好友并更新状态
- ✅ 防止添加自己为好友
- ✅ 移除好友并更新状态
- ✅ 获取好友列表

#### URL 参数处理
- ✅ 解析群组邀请参数
- ✅ 解析频道邀请参数
- ✅ 处理多个 URL 参数

**测试用例数**: 19 个

## 测试结果

```
✓ src/tests/contract.test.js (28 tests)
✓ src/tests/integration.test.js (19 tests)
✓ src/tests/components.test.jsx (13 tests)

Test Files  3 passed (3)
Tests  60 passed (60)
```

## 关键测试场景

### 场景 1: 创建群组并邀请成员

```javascript
// 1. 用户创建群组
const groupId = await createGroup('My Group');

// 2. 生成邀请链接
const inviteLink = `${baseUrl}?joinGroup=${groupId}`;

// 3. 其他用户通过链接加入
await joinGroup(groupId);

// 4. 验证成员已添加
const members = await getGroupMembers(groupId);
expect(members).toContain(newMemberAddress);
```

### 场景 2: 创建频道并广播消息

```javascript
// 1. 用户创建频道
const channelId = await createChannel('Announcements');

// 2. 验证创建者身份
const info = await getChannelInfo(channelId);
expect(info.creator).toBe(currentUser);

// 3. 创建者发送广播
await sendChannelMessage(channelId, 'Hello everyone!');

// 4. 订阅者只能查看，不能发送
// 非创建者调用 sendChannelMessage 会失败
```

### 场景 3: 添加好友

```javascript
// 1. 打开私聊界面
onOpenPrivateChat(user);

// 2. 检查好友状态
const isFriend = await checkFriendship(currentUser, user.address);

// 3. 添加好友
if (!isFriend) {
  await addFriend(user.address);
}

// 4. 验证好友关系
const friends = await getFriends(currentUser);
expect(friends).toContain(user.address);
```

## 边界条件测试

### 输入验证
- ✅ 空字符串输入
- ✅ 超长字符串输入（>100 字符名称，>1000 字符消息）
- ✅ 特殊字符处理

### 权限验证
- ✅ 非成员发送群组消息
- ✅ 非创建者发送频道消息
- ✅ 添加自己为好友

### 重复操作
- ✅ 重复加入群组
- ✅ 重复订阅频道
- ✅ 重复添加好友

## Mock 策略

### Wagmi Hooks Mock
```javascript
vi.mock('wagmi', () => ({
  useAccount: () => ({ address: '0x...', isConnected: true }),
  useWalletClient: () => ({ data: { writeContract: vi.fn() } }),
  usePublicClient: () => ({ data: { readContract: vi.fn() } }),
}));
```

### Contract Hook Mock
```javascript
vi.mock('../hooks/useContract', () => ({
  useContract: () => ({
    createGroup: vi.fn().mockResolvedValue(1),
    sendGroupMessage: vi.fn().mockResolvedValue('0x...'),
    // ... 其他函数
  }),
}));
```

## 持续集成建议

### GitHub Actions 配置示例

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## 测试最佳实践

1. **每次提交前运行测试**: 确保代码修改不会破坏现有功能
2. **保持测试独立**: 每个测试用例应该独立运行
3. **使用描述性测试名称**: 清楚说明测试的目的
4. **测试边界条件**: 不仅测试正常流程，也要测试异常情况
5. **保持测试简洁**: 每个测试只验证一个功能点

## 未来测试计划

- [ ] E2E 测试（使用 Playwright 或 Cypress）
- [ ] 性能测试（大量消息加载）
- [ ] 安全测试（XSS、注入攻击）
- [ ] 移动端兼容性测试
- [ ] 网络异常处理测试

## 问题报告

如果发现测试失败或需要添加新的测试用例，请：

1. 在 GitHub Issues 中创建问题
2. 描述失败的测试场景
3. 提供复现步骤
4. 附上错误日志

## 贡献指南

添加新功能时，请确保：

1. 为新功能编写单元测试
2. 更新集成测试
3. 确保所有测试通过
4. 更新本文档

---

**最后更新**: 2025-11-02  
**测试覆盖率目标**: > 80%  
**当前测试用例数**: 60

