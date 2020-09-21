'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
class UserController extends Controller {
  // 用户注册
  async register() {
    const { ctx } = this;
    // 获取到用户注册信息
    let userInfo = ctx.request.body;
    // 把用户注册信息传给数据库去验证
    let result = await ctx.service.user.register(userInfo);
    // 把注册信息最终结果响应给客户端
    ctx.body = result;
  }
  // 用户登录
  async login() {
    let { ctx } = this;
    let result = await ctx.service.user.login(ctx.request.body);
    ctx.body = result;
  }
  // 验证码获取
  async verification() {
    let res = await this.ctx.service.user.captcha();
    this.ctx.body = res;
  }
  // 文件上传
  async upload() {
    // 接受数据
    let file = this.ctx.request.files;
    if(file) {
      console.log(666);
      // 文件存在
      let oldFile = file[0].filepath;
      let newFile = path.join(__dirname, '../', 'public', 'upload', path.basename(oldFile));
      fs.copyFileSync(oldFile, newFile);
      //删除c盘临时文件
      fs.unlinkSync(oldFile);
      // 拼接路径给前端返回
      let pathFile = `/public/upload/${path.basename(oldFile)}`;
      this.ctx.body = pathFile;
    } else {
      //文件不存在
      this.ctx.body = null;
    }
    
  }
}

module.exports = UserController;
