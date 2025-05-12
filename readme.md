功能，包括路由拦截、token验证、SQLite日志记录和图片处理。关键点包括：1) 使用Flask路由系统拦截/arcgis请求；2) 实现token验证逻辑；3) 添加SQLite数据库记录；4) 正确处理图片响应;5)日志记录
注意事项：1）转发到arcserver的6080请求时，返回数据格式有可能是png图片，所以设定const config = require("./config.js");2）移除可能重复的Content-Length和Transfer-Encoding头部，不然会造成nginx转发报错。3）然后，需设置响应头            
```
Object.entries(resp2.headers).forEach(([key, value]) => {
                reply.header(key, value);
            });
```