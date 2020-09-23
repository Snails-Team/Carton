'use strict';


const Controller = require('egg').Controller;
class CategoryController extends Controller {

    async categories() {
        const { ctx } = this;
        let result = await ctx.service.category.categories();
        ctx.body = result;
    }
}
module.exports = CategoryController;