const fastify = require('fastify')();
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./access_logs.db');
const config = require("./config.js");
// 创建访问日志表
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS access_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, account TEXT, access_time DATETIME DEFAULT CURRENT_TIMESTAMP)");
    //创建用户请求token表
    db.run("CREATE TABLE IF NOT EXISTS user_tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, token TEXT, access_time DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

// 拦截所有/arcgis路由
fastify.addHook('onRequest', async (request, reply) => {
    if (request.url.startsWith('/arcgis') && !request.url.startsWith('/arcgis/tokens/generateToken')) {
        const token = request.query.token;
        if (!token) {
            return reply.code(403).send({ error: 'Token is required' });
        }
        try {
            // 验证token有效性
            const response = await axios.get(`http://localhost:6080/arcgis/rest/services?f=json&token=${token}`);

            if ('error' in response.data) {
                return reply.code(403).send({ error: 'Invalid token' });
            }
            //将请求端口改为6080，重新开始请求url
            const resp2 = await axios.get("http://localhost:6080" + request.url, { responseType: 'arraybuffer' })

            // 记录访问日志           
            db.run("INSERT INTO access_logs (url, account) VALUES (?, ?)", [request.url, token]);
            // 返回arcserver返回数据

            // 设置状态码
            reply.code(resp2.status);
            // 移除可能重复的Content-Length和Transfer-Encoding头部
            if (resp2.headers['content-length']) {
                delete resp2.headers['content-length'];
            }
            if (resp2.headers['transfer-encoding']) {
                delete resp2.headers['transfer-encoding'];
            }
            // 复制所有响应头
            Object.entries(resp2.headers).forEach(([key, value]) => {
                reply.header(key, value);
            });
            // 返回响应体
            if (resp2.headers['content-type'] && resp2.headers['content-type'].includes('image/png')) {

                return reply.type('image/png').send(Buffer.from(resp2.data));
            }
            return reply.send(resp2.data);

        } catch (error) {
            return reply.code(500).send({ error: 'Token validation failed' });
        }
    } else if (request.url.startsWith('/arcgis/tokens/generateToken')) {
        // 要求必须有参数username和password
        if (!request.query.username || !request.query.password) {
            return reply.code(403).send({ error: 'username and password are required' });
        }
        try {
            // 直接访问，获取token
            const resp2 = await axios.get("http://localhost:6080" + request.url)
            //记录用户密码和token
            if (resp2.data) {
                db.run("INSERT INTO user_tokens (username, password, token) VALUES (?,?,?)", [request.query.username, request.query.password, resp2.data]);
            }
            return reply.send(resp2.data);
        }
        catch (error) {
            return reply.code(500).send({ error: '用户名或密码错误' });
        }
    } else {
        return reply.code(500).send({ error: 'error path' });
    }
});

// 启动服务器
//高版本fastify需要指定host，否则除本机外无法访问
fastify.listen({ port: 6081, host: "0.0.0.0" }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server is running on http://localhost:6081`);
});