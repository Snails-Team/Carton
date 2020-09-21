'use strict';


const Service = require('egg').Service;
class CartonService extends Service {
    // 创建漫画
    async carton(cartonInfo) {
        const { ctx } = this;

        // 获取用户id
        // let uid = ctx.session.userInfo._id;
        // 获取分类id
        // 测试id
        let uid = 1;
        cartonInfo.categoryId = 2;

        let sql = `insert into carton(uid,cover,profile,cartonTitle,owner,finished,imgs,introduce,categoryId) values("${uid}","${cartonInfo.cover}","${cartonInfo.profile}",
        "${cartonInfo.cartonTitle}","${cartonInfo.owner}","${cartonInfo.finished}","${cartonInfo.imgs}","${cartonInfo.introduce}","${cartonInfo.categoryId}")`;
        try {
            var result = await ctx.app.mysql.query(sql);
        } catch (e) {
            return { code: -5001, message: '数据插入失败，参数不完整或填写错误' }
        }

        let cartonId = result.insertId;
        // 查询刚刚创建的漫画
        let findOneSql = `select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
            left join user u
            on c.uid=u.uid) c
            left join category cate
            on c.categoryId=cate._id) r where r._id="${cartonId}"`;

        try {
            var carton = await ctx.app.mysql.query(findOneSql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' };
        }
        return { code: 200, data: carton[0], message: '漫画创建成功' };
    }
    // 查询所有漫画
    async cartons() {
        // console.log(777);
        let sql = `
        select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
        c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
        (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
        c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
        left join user u
        on c.uid=u.uid) c
        left join category cate
        on c.categoryId=cate._id
        limit 0, 40
        `;
        try {
            var cartons = await this.ctx.app.mysql.query(sql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' };
        }
        return { code: 200, data: cartons };
    }
    // 根据漫画id查询漫画
    async getCarton(idObj) {

        let sql = `
        select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
            left join user u
            on c.uid=u.uid) c
            left join category cate
            on c.categoryId=cate._id) r where r._id="${idObj.id}"
        `;
        try {
            var carton = await this.ctx.app.mysql.query(sql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' }
        }
        if (JSON.stringify(carton) === '[]') return { code: 404, message: '你访问的漫画不存在' }
        // 访问量加一
        let views = carton[0].views + 1
        // 保存在数据库中去
        await this.ctx.app.mysql.query(`update carton set views=${views} where _id=${idObj.id}`);
        return { code: 200, data: carton[0] };
    }
    // 根据分类查询漫画
    async categoryCarton(idObj) {
        let id = idObj.id;
        let sql = `
        select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
            left join user u
            on c.uid=u.uid) c
            left join category cate
            on c.categoryId=cate._id) r where r.categoryId="${id}"
            limit 0, 20
        `;
        try {
            var cartons = await this.ctx.app.mysql.query(sql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' }
        }
        if (JSON.stringify(cartons) === '[]') return { code: 404, message: '你访问的漫画不存在' }
        return { code: 200, data: cartons };
    }
    // 根据阅读量查询漫画
    async viewsCarton() {

        let sql = `
        select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
            left join user u
            on c.uid=u.uid) c
            left join category cate
            on c.categoryId=cate._id) r group by r.views desc,r._id asc 
            limit 0, 10
        `;
        try {
            var cartons = await this.ctx.app.mysql.query(sql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' }
        }
        return { code: 200, data: cartons };
    }
    // 根据评论量查询漫画
    async comments() {
        let sql = `
        select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
            left join user u
            on c.uid=u.uid) c
            left join category cate
            on c.categoryId=cate._id) r group by r.comments desc,r._id asc 
            limit 0, 10
        `;
        try {
            var cartons = await this.ctx.app.mysql.query(sql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' }
        }
        return { code: 200, data: cartons };
    }
    // 根据点赞量查询漫画
    async likes() {
        let sql = `
        select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
            left join user u
            on c.uid=u.uid) c
            left join category cate
            on c.categoryId=cate._id) r group by r.likes desc,r._id asc 
            limit 0, 10
        `;
        try {
            var cartons = await this.ctx.app.mysql.query(sql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' }
        }
        return { code: 200, data: cartons };
    }
    // 根据是否原创查询漫画
    async create(state) {
        if (!state.owner) return { code: -5000, message: '参数有误' }
        let sql = `
        select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
            left join user u
            on c.uid=u.uid) c
            left join category cate
            on c.categoryId=cate._id) r where r.owner="${state.owner}"
            limit 0, 20
        `;
        try {
            var cartons = await this.ctx.app.mysql.query(sql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' }
        }
        if (JSON.stringify(cartons) === '[]') return { code: 404, message: '你访问的漫画不存在' }
        return { code: 200, data: cartons };
    }
    // 根据是否完结查询漫画
    async finished(state) {
        if (!state.finished) return { code: -5000, message: '参数有误' }
        let sql = `
        select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
            left join user u
            on c.uid=u.uid) c
            left join category cate
            on c.categoryId=cate._id) r where r.finished="${state.finished}"
            limit 0, 20
        `;
        try {
            var cartons = await this.ctx.app.mysql.query(sql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' }
        }
        if (JSON.stringify(cartons) === '[]') return { code: 404, message: '你访问的漫画不存在' }
        return { code: 200, data: cartons };
    }
    // 根据漫画更新时间筛选
    async updated() {
        let sql = `
        select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
            left join user u
            on c.uid=u.uid) c
            left join category cate
            on c.categoryId=cate._id) r group by r.create_at desc,r._id asc
            limit 0, 20
        `;
        try {
            var cartons = await this.ctx.app.mysql.query(sql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' }
        }
        return { code: 200, data: cartons };
    }
    // 搜索漫画结果
    async search(keyObj) {
        let key = keyObj.key;
        let sql = `
        select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
        c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
        (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
        c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
        left join user u
        on c.uid=u.uid) c
        left join category cate
        on c.categoryId=cate._id) r where concat(ifnull(r.cartonTitle,''),ifnull(r.username,''),ifnull(r.title,'')) like "%${key}%"
        limit 0, 20
        `;
        try {
            var cartons = await this.ctx.app.mysql.query(sql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' }
        }
        if (JSON.stringify(cartons) === '[]') return { code: 404, message: '你搜索的漫画不存在' }
        return { code: 200, data: cartons };
    }
    // 漫画点赞
    async like(likeObj) {
        // 获取用户点赞的漫画id
        let cartonId = likeObj.id;
        // 根据id查找漫画
        let findOneSql = `
        select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
            left join user u
            on c.uid=u.uid) c
            left join category cate
            on c.categoryId=cate._id) r where r._id="${cartonId}"
        `;
        try {
            var carton = await this.ctx.app.mysql.query(findOneSql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' };
        }
        if (JSON.stringify(carton) === '[]') return { code: 404, message: '你访问的漫画不存在' };
        // 从缓存获取用户id
        let { uid } = this.ctx.session.userInfo;
        // 把用户id和漫画id存进点赞表中
        let likeSql = `insert into like(uid,cid) values("${uid}","${cartonId}")`;
        try {
            await ctx.app.mysql.query(likeSql);
        } catch (e) {
            return { code: -5001, message: '数据插入失败，参数不完整或填写错误' }
        }
        // 查看用户是否重复点赞同一漫画
        let likeSql = `select * from like where uid="${uid}"`;
        let result = this.ctx.app.mysql.query(likeSql);
        // 根据查询结果
        // 根据id查找用户id和文章id
        // 对应漫画的点赞量+1
        let likes = carton[0].likes + 1;
        // // 把点赞漫画id缓存起来
        // this.ctx.session.userInfo.likeCartonId = cartonId;
        // // 解构赋值
        // const { cartonId, uid } = this.ctx.session.userInfo;
        // // 判断用户是否在同一漫画上点赞多次
        // if(uid === uid && cartonId === likeCartonId) return;
        // 保存在数据库中去
        await this.ctx.app.mysql.query(`update carton set likes=${likes} where _id=${cartonId}`);
        return { code: 200, message:'点赞成功'};
    }
     // 漫画取消点赞
     async cancelLike(likeObj) {
        // 获取用户点赞的漫画id
        let cartonId = likeObj.id;
        // 根据id查找漫画
        let findOneSql = `
        select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
            left join user u
            on c.uid=u.uid) c
            left join category cate
            on c.categoryId=cate._id) r where r._id="${cartonId}"
        `;
        try {
            var carton = await this.ctx.app.mysql.query(findOneSql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' };
        }
        if (JSON.stringify(carton) === '[]') return { code: 404, message: '你访问的漫画不存在' }
        // 对应漫画的点赞量+1
        let likes = carton[0].likes - 1;
        // 不能为负数
        if(likes<0) return;
        // 保存在数据库中去
        await this.ctx.app.mysql.query(`update carton set likes=${likes} where _id=${cartonId}`);
        return { code: 200, message:'取消点赞成功'};
    }
}
module.exports = CartonService;