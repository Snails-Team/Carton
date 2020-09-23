'use strict';


const Service = require('egg').Service;
class CartonService extends Service {
    // 创建漫画
    async carton(cartonInfo) {
        const { ctx } = this;
        // if(!this.ctx.session.userInfo) return {code: -400, message: '该用户未登录'};
        // // 获取用户id
        // let uid = ctx.session.userInfo._id;
        // 获取分类id
        // 测试id
        let uids = [11, 12, 13, 14, 15, 17,18,19,20]
        let random = Math.ceil(Math.random()*9) - 1
        let uid = uids[random];
        let sql = `insert into carton(uid,cover,profile,cartonTitle,owner,finished,imgs,introduce,categoryId) values("${uid}","${cartonInfo.cover}","${cartonInfo.profile}",
        "${cartonInfo.cartonTitle}","${cartonInfo.owner}","${cartonInfo.finished}","${cartonInfo.imgs}","${cartonInfo.introduce}","${cartonInfo.categoryId}")`;
        try {
            var result = await ctx.app.mysql.query(sql);
        } catch (e) {
            console.log(e.message);
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
        if (JSON.stringify(cartons) === '[]') return { code: 404, message: '你访问的漫画不存在' }
        return { code: 200, data: cartons };
    }
    // 二级筛选漫画 分类和完结
    async screen(params) {
        let {categoryId, finished} = params;
        let sql = `
        select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
            left join user u
            on c.uid=u.uid) c
            left join category cate
            on c.categoryId=cate._id) r where r.categoryId="${categoryId}" and r.finished="${finished}"
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
    // 根据用户发表漫画
    async publish(idObj) {
        let {uid} = idObj;
        let sql = `
        select * from (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,c.uid,c.username,c.avatar,c.email,cate.title from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,c.create_at,
            c.views,c.likes,c.comments,c.categoryId,u.uid,u.username,u.avatar,u.email from carton c
            left join user u
            on c.uid=u.uid) c
            left join category cate
            on c.categoryId=cate._id) r where r.uid="${uid}"
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
        if(!this.ctx.session.userInfo) return {code: -400, message: '该用户未登录'};
        // 从缓存获取用户id
        let { uid } = this.ctx.session.userInfo;
        // let uid = 1;
        // 查看用户是否重复点赞同一漫画
        let isLikeSql = `select * from likes where uid="${uid}"`;
        let result = await this.ctx.app.mysql.query(isLikeSql);
        // 更新点赞表中
        let updateLikeSql = `update likes set state=1 where cid="${cartonId}" and uid="${uid}"`;
        try {
            var updateRes = await this.ctx.app.mysql.query(updateLikeSql);
        } catch (e) {
            return { code: -5002, message: '数据更新失败，参数不完整或填写错误' }
        }
        for (var i = 0; i < result.length; i++) {
            // 根据查询结果
            if (result[i].uid === uid && result[i].cid == cartonId && result[i].state === 1) {
                return { code: -6000, message: '点赞失败' }
            }
        }
        // 如果没有更新数据 ===== 数据表里没有该记录 就增加记录
        if (updateRes.changedRows === 0) {
            // 把用户id和漫画id存进点赞表中
            let likeSql = `insert into likes(uid,cid,state) values("${uid}","${cartonId}",1)`;
            try {
                await this.ctx.app.mysql.query(likeSql);
            } catch (e) {
                // console.log(e.message);
                return { code: -5001, message: '数据插入失败，参数不完整或填写错误' }
            }
        }
        // 对应漫画的点赞量+1
        let likes = carton[0].likes + 1;
        // 保存在数据库中去
        await this.ctx.app.mysql.query(`update carton set likes="${likes}" where _id="${cartonId}"`);
        // 把刚刚更新的关注表返回出去
        let res = await this.ctx.app.mysql.query(`select * from likes where cid="${cartonId}" and uid="${uid}"`);
        return { code: 200, data: res[0], message: '点赞成功' };
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
        if(!this.ctx.session.userInfo) return {code: -400, message: '该用户未登录'};
        // 从缓存获取用户id
        let { uid } = this.ctx.session.userInfo;
        // let uid = 1;
        // 查看用户是否重复点赞同一漫画
        let isLikeSql = `select * from likes where uid="${uid}"`;
        let result = await this.ctx.app.mysql.query(isLikeSql);
        // 根据查询结果
        for (var i = 0; i < result.length; i++) {
            // 根据查询结果
            if (result[i].uid === uid && result[i].cid == cartonId && result[i].state === -1) {
                return { code: -6001, message: '取消点赞失败' }
            }
        }
        // 更新点赞表中
        let likeSql = `update likes set state=-1 where cid="${cartonId}" and uid="${uid}"`;
        try {
            await this.ctx.app.mysql.query(likeSql);
        } catch (e) {
            return { code: -5002, message: '数据更新失败，参数不完整或填写错误' }
        }
        // 对应漫画的点赞量-1
        let likes = carton[0].likes - 1;
        // 不能为负数
        if (likes < 0) return;
        // 保存在数据库中去
        await this.ctx.app.mysql.query(`update carton set likes=${likes} where _id=${cartonId}`);
        // 把刚刚更新的关注表返回出去
        let res = await this.ctx.app.mysql.query(`select * from likes where cid="${cartonId}" and uid="${uid}"`);
        return { code: 200, data: res[0], message: '取消点赞成功' };
    }
    // 漫画关注
    async followCarton(follow) {
        let cartonId = follow.id;
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
        if (!this.ctx.session.userInfo) return { code: -400, message: '该用户未登录' };
        // 从缓存获取用户id
        let { uid } = this.ctx.session.userInfo;
        // let uid = 1;
        // 查看用户是否重复关注同一漫画
        let isFolloweSql = `select * from follow where uid="${uid}"`;
        let result = await this.ctx.app.mysql.query(isFolloweSql);
        // 更新关注表语句
        let updateFollowSql = `update follow set status=1 where cid="${cartonId}" and uid="${uid}"`;
        try {
            var updateRes = await this.ctx.app.mysql.query(updateFollowSql);
        } catch (e) {
            return { code: -5002, message: '数据更新失败，参数不完整或填写错误' }
        }
        for (var i = 0; i < result.length; i++) {
            // 根据查询结果
            if (result[i].uid === uid && result[i].cid == cartonId && result[i].status === 1) {
                return { code: -6000, message: '关注失败' }
            }
        }
        // 如果没有更新数据 ===== 数据表里没有该记录 就增加记录
        if (updateRes.changedRows === 0) {
            // 把用户id和漫画id存进关注表中
            let followSql = `insert into follow(uid,cid,status) values("${uid}","${cartonId}",1)`;
            try {
                await this.ctx.app.mysql.query(followSql);
            } catch (e) {
                // console.log(e.message);
                return { code: -5001, message: '数据插入失败，参数不完整或填写错误' }
            }
        }
        // 把刚刚更新的关注表返回出去
        let res = await this.ctx.app.mysql.query(`select * from follow where cid="${cartonId}" and uid="${uid}"`);
        return { code: 200, data: res[0], message: '关注成功' };
    }
    // 漫画取消关注
    async cancelFollow(follow) {
        // 获取用户点赞的漫画id
        let cartonId = follow.id;
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
        if (!this.ctx.session.userInfo) return { code: -400, message: '该用户未登录' };
        // 从缓存获取用户id
        let { uid } = this.ctx.session.userInfo;
        // let uid = 1;
        // 查看用户是否重复关注同一漫画
        let isFollowSql = `select * from follow where uid="${uid}"`;
        let result = await this.ctx.app.mysql.query(isFollowSql);
        // 根据查询结果
        for (var i = 0; i < result.length; i++) {
            // 根据查询结果
            if (result[i].uid === uid && result[i].cid == cartonId && result[i].status === -1) {
                return { code: -6001, message: '取消关注失败' }
            }
        }
        // 更新关注表中
        let followSql = `update follow set status=-1 where cid="${cartonId}" and uid="${uid}"`;
        try {
            await this.ctx.app.mysql.query(followSql);
        } catch (e) {
            return { code: -5002, message: '数据更新失败，参数不完整或填写错误' }
        }
        // 把刚刚更新的关注表返回出去
        let res = await this.ctx.app.mysql.query(`select * from follow where cid="${cartonId}" and uid="${uid}"`);

        return { code: 200, data: res[0], message: '取消关注成功' };
    }
    // 用户关注漫画展示
    async userFollow() {
        if (!this.ctx.session.userInfo) return { code: -400, message: '该用户未登录' };
        let { uid } = this.ctx.session.userInfo;
        // 查询语句
        let followSql = `
        select * from (select c.fid,c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,
            c.views,c.likes,c.comments,c.uid,c.followCreate_at,c.status,u.username,u.avatar,u.email from 
            (select c._id,c.cover,c.profile,c.cartonTitle,c.owner,c.finished,c.imgs,c.introduce,
            c.views,c.likes,c.comments,f.fid,f.uid,f.followCreate_at,f.status from follow f
            left join carton c 
            on c._id=f.cid) c
            left join user u
            on c.uid=u.uid) r group by r.followCreate_at desc having r.uid="${uid}"
            limit 0, 20
        `;
        try {
            var cartons = await this.ctx.app.mysql.query(followSql);
        } catch (e) {
            return { code: -2000, message: '系统繁忙，请稍后再试' }
        }
        if (JSON.stringify(cartons) === '[]') return { code: 404, message: '你还没有关注漫画哟！赶快去关注' }
        return { code: 200, data: cartons };
    }

}
module.exports = CartonService;