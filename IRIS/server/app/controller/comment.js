'use strict';


const Controller = require('egg').Controller;
class CommentController extends Controller {

    async comment() {
        let result = await this.ctx.service.comment.comment(this.ctx.request.body);
        this.ctx.body = result;
    }
    async cartonComments() {
        let result = await this.ctx.service.comment.cartonComments(this.ctx.params);
        this.ctx.body = result;
    }
}
module.exports = CommentController;