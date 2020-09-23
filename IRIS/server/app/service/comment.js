'use strict';


const Service = require('egg').Service;
class CommentService extends Service {
    // 创建评论
    async comment(params) {
        // 漫画id
        let {cartonId,content} = params;
        if(!this.ctx.session.userInfo) return {code: -400, message: '该用户未登录'};
        let {uid} = this.ctx.session.userInfo;
        // let uid = 7;
        const { ctx } = this;
        let sql = `insert into comments(uid,cid,content) values("${uid}","${cartonId}","${content}")`;
        try {
            var result = await ctx.app.mysql.query(sql);
        } catch(e) {
            return { code: -5001, message: '数据插入失败，参数不完整或填写错误' }
        }
        // 根据漫画id查找漫画并把评论量加一
        let carton = await ctx.app.mysql.query(`select * from carton where _id="${cartonId}"`);
        // 漫画的评论量加一
        let comments = carton[0].comments + 1;
        // 更新数据库
        await ctx.app.mysql.query(`update carton set comments="${comments}" where _id="${cartonId}"`);
        // 返回刚刚创建的评论

        let justSql = `
        select * from (select c.comid,c.cid,c.content,c.create_at,u.username,u.avatar,u.email from comments c
        left join user u 
        on u.uid=c.uid) c where c.comid="${result.insertId}"
        limit 0, 20
        `;
        let comment = await ctx.app.mysql.query(justSql);
        return {code: 200, data: comment[0], message: '评论创建成功'};
    }
    // 根据漫画id查看所有评论
    async cartonComments(idObj) {
        let id = idObj.id;
        let commentSql = `
        select * from (select c.comid,c.cid,c.content,c.create_at,u.username,u.avatar,u.email from comments c
        left join user u 
        on u.uid=c.uid) c where c.cid="${id}" group by c.create_at desc
        limit 0, 20
        `;
        try {
            var comments = await this.ctx.app.mysql.query(commentSql);
        } catch(e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' };
        }
        if (JSON.stringify(comments) === '[]') return { code: 404, message: '本页面还未做评论' }
        return {code: 200, data: comments}
    }
}
module.exports = CommentService;