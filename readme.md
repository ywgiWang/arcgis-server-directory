# ArcGIS Server 代理服务

## 项目描述

因网络安全需要关闭ArcGIS REST 服务目录，但关闭后会对wmts等服务造成影响，因此需要代理服务来处理这些请求，放行带token的请求或/generateToken请求，拦截其它请求。

这是一个用于代理ArcGIS Server请求的Node.js服务，主要功能包括路由拦截、token验证、SQLite日志记录和图片处理。

## 功能特性

- 拦截所有/arcgis路由请求
- 实现token验证逻辑
- 使用SQLite数据库记录访问日志
- 正确处理图片响应(PNG格式)
- 记录用户token生成信息

## 安装说明

1. 确保已安装Node.js环境
2. 克隆本项目
3. 安装依赖：
```bash
npm install
```

## 使用方法

1. 启动服务：
```bash
npm start
```
2. 服务默认运行在6081端口
3. 访问示例：
```
http://localhost:6081/arcgis/rest/services?token=YOUR_TOKEN
```

## 配置要求

- Node.js 14+
- SQLite3数据库
- ArcGIS Server运行在6080端口

## 注意事项

1. 转发到arcserver的6080请求时，返回数据可能是PNG图片，所以在请求本地arcserver服务时需要设置返回格式{ responseType: 'arraybuffer' }，并在服务返回时设置响应头为image/png。
2. 需要移除可能重复的Content-Length和Transfer-Encoding头部，否则会造成nginx转发报错
3. 服务会自动创建access_logs.db和user_tokens.db数据库文件
4. 高版本fastify需要指定host为0.0.0.0才能允许外部访问

