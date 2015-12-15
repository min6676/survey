var express = require('express'),
    Post = require('../models/Post'),
    Question = require('../models/Question'),
    User = require('../models/User'),
    Response = require('../models/Response');
var router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    res.redirect('/signin');
  }
}

/* GET posts listing. */
router.get('/', needAuth, function(req, res, next) {
  Post.find({user_id: req.user.id}, function(err, docs) {
    if (err) {
      return next(err);
    }
    res.render('posts/index', {posts: docs});
  });
});

router.get('/new', function(req, res, next) {
  res.render('posts/new');
});

router.get('/:id/edit', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});
  });
});

router.put('/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    post.title = req.body.title;
    post.content = req.body.content;
    post.save(function(err) {
      return next(err);
    });
    req.flash('success', '수정되었습니다.');
    res.redirect('/posts');
  });
});

router.delete('/:id', function(req, res, next) {
  Post.findOneAndRemove(req.params.id, function(err) {
    if (err) {
      return next(err);
    }

    Question.find({post: req.params.id}).remove(function(err, qusetions){
      if(err) {
        return next(err);
      }
    });
  });
  res.redirect('/posts/');
});

router.post('/', function(req, res, next) {
  var post = new Post({
    title: req.body.title,
    user_id: req.user.id,
    content: req.body.content
  });

  post.save(function(err, doc) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts/' + doc.id);
  });
});

router.get('/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    Question.find({post_id: post.id}, function(err, questions) {
      if (err) {
        return next(err);
      }
      res.render('posts/show', {post: post, questions: questions});
    });
  });
});

router.put('/question/:id', function(req, res, next) {
  Question.findById(req.params.id, function(err, question) {
    if (err) {
      return next(err);
    }
    question.content = req.body.content;
    question.item[0].item1 = req.body.item1;
    question.item[0].item2 = req.body.item2;
    question.item[0].item3 = req.body.item3;
    question.item[0].item4 = req.body.item4;

    question.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '질문이 수정되었습니다.');
      res.redirect('/posts/' + question.post_id);
    });
  });
});

router.post('/:id/questions', function(req, res, next) {
  var question = new Question({
    post_id: req.params.id,
    content: req.body.content,
    type: req.body.type
  });
  question.item.push({
    item1: req.body.item1,
    item2: req.body.item2,
    item3: req.body.item3,
    item4: req.body.item4
  });

  question.save(function(err){
    if (err) {
      return next(err);
    }
    Post.findByIdAndUpdate(req.params.id, {$inc: {numQuestion: 1}}, function(err, post) {
      if (err) {
        return next(err);
      }
      question.number = post.numQuestion+1;
      question.save(function(err) {
        if (err) {
          return next(err);
        }
      });
      res.redirect('/posts/' + req.params.id);
    });
  });
});

router.get('/question/:id/edit', function(req, res, next) {
  Question.findById(req.params.id, function(err, question) {
    if (err) {
      return next(err);
    }
    res.render('posts/questionedit', {question: question});
  });
});

router.delete('/question/:id', function(req, res, next) {
  Question.findOneAndRemove({_id: req.params.id}, function(err, question) {
    if (err) {
      return next(err);
    }
    Question.find({number: {$gt: question.number}}, function(err, questions){
      if(err){
        return next(err);
      }
      for(var i=0; i<questions.length; i++){
        questions[i].number = questions[i].number-1;
        questions[i].save();
      }
    });
    Post.findByIdAndUpdate(question.post_id, {$inc: {numQuestion: -1}}, function(err){
      if(err){
        return next(err);
      }
      req.flash('success', '질문이 삭제되었습니다.');
      res.redirect('/posts/' + question.post_id);
    });
  });
});


module.exports = router;
