# 🔒 安全指南

## ⚠️ 重要提醒

**永远不要将私钥提交到 Git 仓库！**

## 环境变量配置

### 1. 创建 .env 文件

在项目根目录创建 `.env` 文件（已在 .gitignore 中，不会被提交）：

```bash
# .env
PRIVATE_KEY=0x你的私钥
```

### 2. 使用环境变量

所有需要私钥的脚本都会从环境变量读取：

```bash
# 部署合约
PRIVATE_KEY=0x... npm run deploy

# 测试合约
PRIVATE_KEY=0x... npm run test:contracts

# 测试所有功能
PRIVATE_KEY=0x... npm run test:all
```

### 3. 临时使用（推荐）

如果不想创建 .env 文件，可以在命令行临时设置：

```bash
# macOS/Linux
export PRIVATE_KEY=0x...
npm run deploy

# Windows (PowerShell)
$env:PRIVATE_KEY="0x..."
npm run deploy

# Windows (CMD)
set PRIVATE_KEY=0x...
npm run deploy
```

## 检查清单

在提交代码前，请确保：

- [ ] `.env` 文件已添加到 `.gitignore`
- [ ] 代码中没有硬编码的私钥
- [ ] 代码中没有硬编码的钱包地址（测试地址除外）
- [ ] 运行 `git status` 确认 `.env` 不在待提交列表中

## 检查命令

```bash
# 检查是否有硬编码的私钥
grep -r "0x[a-fA-F0-9]\{64\}" --include="*.js" --include="*.jsx" . | grep -v node_modules

# 检查 .env 是否在 .gitignore 中
grep "\.env" .gitignore

# 确认 .env 不会被提交
git status --ignored | grep .env
```

## 如果不小心提交了私钥

1. **立即更换钱包**: 将资金转移到新钱包
2. **从 Git 历史中删除**:
   ```bash
   # 使用 git filter-branch 或 BFG Repo-Cleaner
   # 详见: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
   ```
3. **强制推送**: `git push --force`
4. **通知团队成员**: 让所有人重新克隆仓库

## 最佳实践

1. **使用测试网**: 开发时使用测试网络和测试代币
2. **分离环境**: 开发、测试、生产使用不同的钱包
3. **最小权限**: 只给必要的权限
4. **定期轮换**: 定期更换私钥
5. **硬件钱包**: 生产环境使用硬件钱包

## 联系方式

如果发现安全问题，请立即联系项目维护者。

