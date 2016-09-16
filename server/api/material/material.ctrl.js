'use strict';
var mongoose = require('mongoose');
var athlete = require('../athletes/ath.model');
var post = require('../editorials/editorial.model');
var record = require('../competitions/records/record.model')

module.exports = function(){
	var allAthletes,allPosts;
	var getUsuals = function(){
		console.log('getting all athletes and posts');
		athlete.find().exec((err,athletes)=>{ if(!err){ console.log('found all athletes'); allAthletes = athletes; }else{ console.log('Did not find athletes'); } });
		post.find().exec((err,posts)=>{ if(!err){ console.log('found all posts'); allPosts = posts; }else{ console.log('Did not find posts'); } });
	}
	return {
		homePage: function(req, res){
			console.log('get home page');
			getUsuals();
			res.render('material/index', {athletes:allAthletes, posts:allPosts});
		},
		athletes: function(req, res){
			console.log('get athletes page');
			getUsuals();
			res.render('material/allAthletes', {athletes:allAthletes, posts:allPosts});
		},
		posts: function(req, res){
			console.log('get posts');
			getUsuals();
			res.render('material/posts', {athletes:allAthletes, posts:allPosts});
		},
		getOneAthlete: function(req, res){
			console.log('get one athlete');
			var shows ;
			athlete.findById(req.params.id, function(err, athlete){
				if(!err){
					record.find({'athlete':req.params.id}).exec(function(err, records){
						console.log('looking up shows')
						if(err){ console.log(err); console.log('could not get this athletes shows')}
						else{ 
							console.log('got the shows'); 

							res.render('material/oneAth', {athletes:allAthletes, posts:allPosts, athlete:athlete, records: records});
						 }
					})
					
				}else{
					console.log('couldnt get one athlete');
					res.redirect('/');
				}
			})
		},
		AthleteGallery: function(req, res){
			console.log('getting ath album');
			athlete.findById(req.params.id, function(err,athlete){
				if(!err){
					console.log('found athlete')
					athlete.galleries.forEach((gallery)=>{
						if(gallery._id == req.params.galId){
							console.log('found album');
							res.render('material/album', {athlete:athlete, gallery:gallery, athletes:allAthletes, posts:allPosts});
						}else{
							console.log('wrong album');
						}
					})
				}else{
					console.log('could not find that athlete');
				}
			})
		},
		getOnePost: function(req, res){
			console.log('getting one post');
			post.findById(req.params.id, (err,post)=>{
				if(!err){
					console.log('found the post');
					getUsuals();
					res.render('material/onePost', {post:post, athletes:allAthletes, posts:allPosts});
				}else{
					console.log('could not find the post');
					res.redirect('/front');
				}
			});
		}
	}
};