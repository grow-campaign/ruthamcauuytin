/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let _module = new __viewRender('default');

_module.index = function (req, res) {
	Promise.all([
		__models.Posts.find({}).sort({created_at: -1}).limit(4).populate('category_id').exec(function (err, articles) {
			return articles
		})
	]).then(function (result) {
		_module.render(req, res, 'index', {
			title: 'Rút hầm cầu Duy Bảo - Dịch vụ rút hầm cầu uy tín tại TP.HCM (Sài Gòn)',
			articles: result[0]
		});
	})
};

_module.contact = function (req, res) {
	_module.render(req, res, 'contact', {
		title: 'Liên hệ'
	})
}

_module.introduction = function (req, res) {
	_module.render(req, res, 'introduction', {
		title: 'Giới thiệu'
	})
}

_module.view_category = function (req, res) {
	__models.Posts.find({}, {category_id: 1, title: 1, description: 1, image: 1, alias: 1, created_at: 1}).populate({
		path: 'category_id',
		select: 'alias name',
		match: {
			alias: req.params.category_alias
		}
	}).exec(function (err, posts) {
		let result = posts.filter(function (post) {
			return post.category_id.length > 0
		})
		_module.render(req, res, 'view_category', {
			title: 'Danh mục',
			posts: result
		})
	})
}

_module.view_article_details = function (req, res) {
	__models.Objects.findOne({
		key: 'objects:category',
		alias: req.params.category_alias
	}).exec(function (err, category) {
		if (category) {
			Promise.all([
				__models.Posts.find({category_id: {$in: [category._id]}, alias: {$ne: req.params.article_alias}}, {
					image: 1,
					title: 1,
					description: 1,
					created_at: 1,
					alias: 1
				}).sort({created_at: -1}).limit(3).exec(function(err, related_posts) {
					return related_posts
				}),
				__models.Posts.findOne({category_id: {$in: [category._id]}, alias: req.params.article_alias}).populate({
					path: 'category_id',
					select: 'name alias'
				}).exec(function (err, post) {
					return post
				})
			]).then(function (result) {
				_module.render(req, res, 'view_article_details', {
					title: result[1].title + ' - Ruthamcauuytin.net',
					post: result[1],
					posts: result[0],
					category_alias: req.params.category_alias
				})
			}).catch(function (error) {
				_module.index(req, res)
			})
		} else {
			_module.index(req, res)
		}
	})
}

module.exports = _module;
