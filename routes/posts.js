var express = require('express'),
    Post = require('../models/Post'),
    Question = require('../models/Question');
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
  Post.find({}, function(err, docs) {
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
    post.email = req.body.email;
    post.title = req.body.title;
    post.content = req.body.content;
    post.save(function(err) {
      res.redirect('/posts/' + req.params.id);
    });
    res.redirect('back');
  });
});

router.delete('/:id', function(req, res, next) {
  Post.findOneAndRemove(req.params.id, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts/');
  });
});

router.post('/', function(req, res, next) {
  var post = new Post({
    title: req.body.title,
    email: req.body.email,
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
    Question.find({post: post.id}, function(err, questions) {
      if (err) {
        return next(err);
      }
      res.render('posts/show', {post: post, questions: questions});
    });
  });
});

router.post('/:id/questions', function(req, res, next) {
  var question = new Question({
    post: req.params.id,
    email: req.body.email,
    content: req.body.content
  });

  question.save(function(err) {
    if (err) {
      return next(err);
    }
    Post.findByIdAndUpdate(req.params.id, {$inc: {numQuestion: 1}}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/posts/' + req.params.id);
    });
  });
});


module.exports = router;
