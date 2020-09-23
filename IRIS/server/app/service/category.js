'use strict';


const Service = require('egg').Service;
class CategoryService extends Service {

    async categories() {
        const { ctx } = this;
        let sql = `
        select * from category
        `;
        let data = await ctx.app.mysql.query(sql);
        return data;
    }
}
module.exports = CategoryService;