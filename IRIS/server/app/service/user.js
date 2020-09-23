'use strict';

const svgCaptcha = require('svg-captcha');
const Service = require('egg').Service;
class UserService extends Service {
    // 用户注册信息查询
    async register(userInfo) {
        const { ctx } = this;
        console.log(userInfo.verification.toUpperCase());
        console.log(ctx.session);
        // 首先看用户的验证码是否输入正确
        if (userInfo.verification.toUpperCase() !== ctx.session.code.toUpperCase()) {
            // 比对失败
            return { code: -4001, message: '验证码输入错误' };
        }
        // 根据用户注册的邮箱去查找
        let sql = `select * from user where email="${userInfo.email}"`;
        let user = await ctx.app.mysql.query(sql);
        // 判断用户是否存在 该邮箱是否注册过
        if (JSON.stringify(user) != '[]') {
            // 注册过
            return { code: -4000, message: '该邮箱已被注册' };
        } else {
            // 没注册过
            // 判断用户是否输入头像
            if (!userInfo.avatar) userInfo.avatar = 'public/upload/default.png';
            let registerSql = `insert into user(avatar,username,email,password) 
            values("${userInfo.avatar}","${userInfo.username}","${userInfo.email}","${userInfo.password}")`;
            // 向数据库插入数据
            let result = await ctx.app.mysql.query(registerSql);
            // 把新创建好的用户返回出去
            let finduserSql = `select * from user where uid="${result.insertId}"`;
            let newUser = await ctx.app.mysql.query(finduserSql);
            delete newUser[0].password;
            return { code: 200, data: newUser[0], message: '注册成功' }
        }
    }
    // 用户登录
    async login(userInfo) {
        // 根据用户输入的账号邮箱进行判断 
        // 若存在数据库中 则去比对密码 若不存在，返回客户端
        let findOneSql = `select * from user where email="${userInfo.email}"`;
        let user = await this.app.mysql.query(findOneSql);

        if (JSON.stringify(user) === '[]') {
            // 说明该邮箱不存在
            return { code: -3001, message: '该邮箱还未注册' };
        } else {
            // 比对密码
            if (userInfo.password === user[0].password) {
                // 密码比对成功 用户登录成功
                // 颁发登录凭证（缓存用户信息）
                this.ctx.session.userInfo = user[0];
                // 返回数据
                return { code: 200, message: '登录成功' };
            } else {
                // 密码输入错误
                return { code: -3002, message: '登录失败，密码输入错误' }
            }
        }
    }
    // 产生验证码
    async captcha() {
        const captcha = svgCaptcha.create({
            size: 4,
            fontSize: 50,
            width: 100,
            height: 40,
            bacground: '#cc9966'
        });
        this.ctx.session.code = captcha.text;
        return captcha;
    }
    // 查找所有用户
    async user() {
        let findSql = `select uid,username,email,avatar,role,cid,create_at from user`;
        try {
            var users = await this.ctx.app.mysql.query(findSql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' };
        }
        // 把用户返回出去
        return { code: 200, data: users };
    }
    // 查询单个用户
    async getUser(idObj) {
        let uid = idObj.uid;
        let findOneSql = `select uid,username,email,avatar,role,cid,create_at from user where uid="${uid}"`;
        try {
            var user = await this.ctx.app.mysql.query(findOneSql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' };
        }
        if (JSON.stringify(user) === '[]') return { code: 404, message: '你访问的用户不存在' }
        // 返回结果给客户端
        return { code: 200, data: user[0] };
    }
    // 用户修改信息
    async modifyUser(userInfo) {
        let {avatar, uid, username} = userInfo;
        if(avatar && username) {
          
            var updateOneSql = `update user set avatar="${avatar}",username="${username}" where uid="${uid}"`;
            
        } else if(username) {
            
            var updateOneSql = `update user set username="${username}" where uid="${uid}"`;
        } else if(avatar) {
          
            var updateOneSql = `update user set avatar="${avatar}" where uid="${uid}"`;
        } else {
            return { code: -5002, message: '数据更新失败，参数不完整或填写错误' }
        }
        try {
            await this.ctx.app.mysql.query(updateOneSql);
        } catch (e) {
            return { code: -5002, message: '数据更新失败，参数不完整或填写错误' }
        }
        let user = await this.ctx.app.mysql.query(`select * from user where uid="${uid}"`)
        
        // 返回结果给客户端
        return { code: 200,data: user[0], message: '修改用户成功' };
    }
}
module.exports = UserService;