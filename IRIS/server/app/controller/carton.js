'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
class CartonController extends Controller {
    // 创建漫画
    async carton() {
        let result = await this.ctx.service.carton.carton(this.ctx.request.body);
        this.ctx.body = result;
    }
    // 查询所有漫画
    async cartons() {
        let result = await this.ctx.service.carton.cartons();
        this.ctx.body = result;
    }
    // 根据漫画id查询
    async getCarton() {
        // 路由匹配参数
        let result = await this.ctx.service.carton.getCarton(this.ctx.params);
        this.ctx.body = result;
    }
    // 根据分类查询漫画
    async categoryCarton() {
        // 路由匹配参数
        let result = await this.ctx.service.carton.categoryCarton(this.ctx.params);
        this.ctx.body = result;
    }
    // 根据阅读量查询漫画
    async viewsCarton() {
        let result = await this.ctx.service.carton.viewsCarton();
        this.ctx.body = result;
    }
    // 根据评论量查询漫画
    async comments() {
        let result = await this.ctx.service.carton.comments();
        this.ctx.body = result;
    }
    // 根据点赞量查询漫画
    async likes() {
        let result = await this.ctx.service.carton.likes();
        this.ctx.body = result;
    }
    // 根据是否原创筛选漫画
    async create() {
        // 接受客户端的参数
        let result = await this.ctx.service.carton.create(this.ctx.request.query);
        this.ctx.body = result;
    }
    // 根据是否完结筛选漫画
    async finished() {
        // 接受客户端的参数
        let result = await this.ctx.service.carton.finished(this.ctx.request.query);
        this.ctx.body = result;
    }
    // 根据更新时间筛选漫画
    async updated() {
        // 接受客户端的参数
        let result = await this.ctx.service.carton.updated();
        this.ctx.body = result;
    }
    // 根据关键字查询漫画
    async search() {
        // 路由匹配参数
        let result = await this.ctx.service.carton.search(this.ctx.params);
        this.ctx.body = result;
    }
    // 漫画点赞
    async like() {
        // 路由匹配参数
        let result = await this.ctx.service.carton.like(this.ctx.params);
        this.ctx.body = result;
    }
    // 漫画取消点赞
    async cancelLike() {
        // 路由匹配参数
        let result = await this.ctx.service.carton.cancelLike(this.ctx.params);
        this.ctx.body = result;
    }
    
}

module.exports = CartonController;