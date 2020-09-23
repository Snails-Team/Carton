'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
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
  // 退出登录
  async logout() {
    // 清除缓存
    this.ctx.session = null;
    this.ctx.body = { code: 200, message: '退出登录成功' };
  }
  //登录状态
  async getStatus() {
    console.log(this.ctx);
    const { ctx } = this;
    let userInfo = ctx.session.userInfo
    // userInfo = [{username: "王菜鸟", email: '844040215@qq.com', uid: 1}]
    if (userInfo) {
      //存在 用户登录了
      //我们把id和登录状态发过去
      ctx.body = { code: 200, userId: userInfo[0].uid, loginStatus: true };
    } else {
      //不存在 用户未登录
      ctx.body = { code: 404, loginStatus: false };
    }

  }
  // 验证码获取
  async verification() {
    let res = await this.ctx.service.user.captcha();
    this.ctx.body = res;
  }
  // 查找所有用户
  async user() {
    let result = await this.ctx.service.user.user();
    this.ctx.body = result;
  }
  // 查找单个用户
  async getUser() {
    let result = await this.ctx.service.user.getUser(this.ctx.params);
    this.ctx.body = result;
  }
  // 用户修改信息
  async modifyUser() {
    let result = await this.ctx.service.user.modifyUser(this.ctx.request.body);
    this.ctx.body = result;
  }
  // 文件上传
  async upload() {
    // 创建表单解析对象
    const form = new formidable.IncomingForm();
    // 设置文件上传路径
    form.uploadDir = path.join(__dirname, '../', 'public', 'upload', 'avatar');
    // 保留文件拓展名
    form.keepExtensions = true;
    // 解析表单
    const { req } = this.ctx;
    function formFun() {
      return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          let reg = /\\/gm;
          let avatar = 'http://localhost:7001' + files.avatar.path.split('app')[1].replace(reg, '/');
          resolve(avatar);
        })
      })
    }
    // console.log(this.ctx)
    let data = await formFun();
    
    this.ctx.body = data

  }
  // 漫画图片内容上传
  async uploadBig() {
    // 创建表单解析对象
    const form = new formidable.IncomingForm();
    // 设置文件上传路径
    form.uploadDir = path.join(__dirname, '../', 'public', 'upload', 'imgs');
    // 保留文件拓展名
    form.keepExtensions = true;
    // 解析表单
    const { req } = this.ctx;
    let formData = {};
    function formFun() {
      return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          let reg = /\\/gm;
          formData.cover = 'http://localhost:7001' + files.cover.path.split('app')[1].replace(reg, '/');
          formData.profile ='http://localhost:7001' + files.profile.path.split('app')[1].replace(reg, '/');
          let contentAry = [];
          for (let i = 0; i < Object.keys(files).length - 2; i++) {
            contentAry.push('http://localhost:7001' + files[`img${i}`].path.split('app')[1])
          }
          formData.imgs = contentAry.join('&').replace(reg, '/');
          formData.owner = fields.owner;
          formData.finished = fields.finished;
          formData.categoryId = fields.categoryId;
          formData.cartonTitle = fields.cartonTitle;
          formData.introduce = fields.introduce;
          resolve(formData);
        })
      })
    }
    // console.log(this.ctx)
    let data = await formFun();
    let result = await this.ctx.service.carton.carton(data);
    this.ctx.body = result
  }
}

module.exports = UserController;
