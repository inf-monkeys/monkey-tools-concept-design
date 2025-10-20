# 修复 DNS 解析问题 - 部署说明

## 问题描述

在 Docker 容器中，ngrok 域名 `df3e974a36dd.ngrok-free.app` 被错误解析为 `::1` (IPv6 localhost)，导致连接失败。

错误信息：
```
connect ECONNREFUSED ::1:443
```

## 修复方案

已在代码中添加 `family: 4` 配置，强制 axios 使用 IPv4 进行 DNS 解析。

修改文件：
- `src/modules/concept-design/concept-design.service.ts`

## 部署步骤

1. **提交代码到 Git**
   ```bash
   git add .
   git commit -m "fix: 强制使用 IPv4 解析 DNS，修复 Docker 容器中的连接问题"
   git push
   ```

2. **重新构建 Docker 镜像**
   ```bash
   docker build -t monkey-tools-concept-design:latest .
   ```

3. **重新部署到服务器**
   根据你的部署方式（k8s/docker-compose/其他）重新部署服务

4. **验证修复**
   部署后测试 model 接口：
   ```bash
   curl -X POST https://concept-design-infmonkeys.d.run/concept-design/model \
     -H "Content-Type: application/json" \
     -d '{
       "it": 0,
       "name": "test",
       "modelid": 0,
       "params": {"skid_length": 300}
     }'
   ```

## 其他可选方案

如果上述方案仍然不工作，可以考虑：

### 方案 2: 修改 Docker DNS 配置

在 `docker-compose.yml` 或 Kubernetes deployment 中添加：

```yaml
dns:
  - 8.8.8.8
  - 8.8.4.4
dns_options:
  - use-vc
  - no-tld-query
```

### 方案 3: 使用 IP 地址

将 ngrok 域名解析为 IP 地址，直接在配置中使用 IP（不推荐，因为 ngrok IP 会变化）

## 测试清单

- [ ] 本地构建成功
- [ ] Docker 镜像构建成功
- [ ] 部署到服务器成功
- [ ] API 调用测试通过
- [ ] S3 图像上传测试通过
