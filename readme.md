# ArcGIS Server Proxy Service

## Project Description

Due to network security requirements, the ArcGIS REST service directory (arcgis-rest-service-directory-traversal) needs to be disabled. However, this would affect WMTS and other services. Therefore, a proxy service is required to handle these requests - allowing requests with tokens or /generateToken requests while intercepting others.

This is a Node.js service for proxying ArcGIS Server requests, with main features including route interception, token validation, SQLite logging, and image processing.

## Features

- Intercept all /arcgis route requests
- Implement token validation logic
- Use SQLite database for access logging
- Properly handle image responses (PNG format)
- Record user token generation information

## Installation

1. Ensure Node.js environment is installed
2. Clone this project
3. Install dependencies:
```bash
npm install
```

## Usage

1. Start the service:
```bash
npm start
```
2. Service runs on port 6081 by default
3. Example access:
```
http://localhost:6081/arcgis/rest/services?token=YOUR_TOKEN
```

## Requirements

- Node.js 14+
- SQLite3 database
- ArcGIS Server running on port 6080

## Notes

1. When forwarding requests to arcserver on port 6080, the response may be PNG images. Therefore, when making requests to the local arcserver service, set the response format to { responseType: 'arraybuffer' } and set the response header to image/png when returning.
2. Need to remove potentially duplicate Content-Length and Transfer-Encoding headers to avoid nginx forwarding errors
3. The service will automatically create access_logs.db and user_tokens.db database files
4. Higher versions of fastify require specifying host as 0.0.0.0 to allow external access

# ArcGIS Server 代理服务

## 项目描述

因网络安全需要关闭ArcGIS REST 服务目录（arcgis-rest-service-directory-traversal），但关闭后会对wmts等服务造成影响，因此需要代理服务来处理这些请求，放行带token的请求或/generateToken请求，拦截其它请求。

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

