"use strict";

var mongoose = require('mongoose'),
    monguurl = require('../.'),
    should = require('chai').should(),
    Post, Page, Redirect, Short;


/* Setup
============================================================================= */

mongoose.connect('mongodb://localhost/monguurl_test');

Post = new mongoose.Schema({
  title: String,
  alias: String
});

Page = new mongoose.Schema({
  name: String,
  slug: String
});

Redirect = new mongoose.Schema({
  target: String
});

Short = new mongoose.Schema({
  title: String,
  alias: String
});

Post.plugin(monguurl());
Page.plugin(monguurl({
  source: 'name',
  target: 'slug'
}));
Redirect.plugin(monguurl({
  target: 'target'
}));
Short.plugin(monguurl({
  length: 10
}));

mongoose.model('Post', Post);
mongoose.model('Page', Page);
mongoose.model('Redirect', Redirect);
mongoose.model('Short', Short);


/* Tests
============================================================================= */

describe('Default source and target', function () {
  it('Normal english title', function (done) {
    mongoose.model('Post').create({
      title: 'Shrimp Sandwhich!'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('alias').and.equal('shrimp-sandwhich');
      done();
    });
  });

  it('Swedish title', function (done) {
    mongoose.model('Post').create({
      title: 'Räksmörgås'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('alias').and.equal('raksmorgaas');
      done();
    });
  });

  it('Duplicate english post', function (done) {
    mongoose.model('Post').create({
      title: 'Shrimp Sandwhich!'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('alias').and.equal('shrimp-sandwhich-2');
      done();
    });
  });

  after(function (done) {
    mongoose.model('Post').remove({}, function () {
      done();
    });
  });
});

describe('Custom source and target', function () {
  it('Normal english name', function (done) {
    mongoose.model('Page').create({
      name: 'Shrimp Sandwhich!'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('slug').and.equal('shrimp-sandwhich');
      done();
    });
  });

  it('Swedish name', function (done) {
    mongoose.model('Page').create({
      name: 'Räksmörgås'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('slug').and.equal('raksmorgaas');
      done();
    });
  });

  it('Duplicate english post', function (done) {
    mongoose.model('Page').create({
      name: 'Shrimp Sandwhich!'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('slug').and.equal('shrimp-sandwhich-2');
      done();
    });
  });

  after(function (done) {
    mongoose.model('Page').remove({}, function () {
      done();
    });
  });
});

describe('Only alias', function () {
  it('I want THIS alias!', function (done) {
    mongoose.model('Redirect').create({
      target: 'this-should-be-left-unaltered-1'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('target').and.equal('this-should-be-left-unaltered-1');
      done();
    });
  });

  it('I want THIS alias AGAIN!', function (done) {
    mongoose.model('Redirect').create({
      target: 'this-should-be-left-unaltered-1'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('target').and.equal('this-should-be-left-unaltered-2');
      done();
    });
  });

  it('I want it in SWEDISH!', function (done) {
    mongoose.model('Redirect').create({
      target: 'this-!s-cåmplete-garbage'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('target').and.equal('this-s-caamplete-garbage');
      done();
    });
  });

  after(function (done) {
    mongoose.model('Redirect').remove({}, function () {
      done();
    });
  });
});

describe('Shorter alias', function () {
  it('Short', function (done) {
    mongoose.model('Short').create({
      title: 'Short'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('alias').and.equal('short');
      done();
    });
  });

  it('Just the right length', function (done) {
    mongoose.model('Short').create({
      title: 'Blå skålar'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('alias').and.equal('blaa-skaalar');
      done();
    });
  });

  it('Just the right length again', function (done) {
    mongoose.model('Short').create({
      title: 'Blå skålar'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('alias').and.equal('blaa-skaalar-2');
      done();
    });
  });

  it('Too long', function (done) {
    mongoose.model('Short').create({
      title: 'The quick mongoose jumped over the lazy mysql'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('alias').and.equal('the-quick');
      done();
    });
  });

  it('Too long again', function (done) {
    mongoose.model('Short').create({
      title: 'The quick mongoose jumped over the lazy mysql'
    }, function (err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc.should.have.property('alias').and.equal('the-quick-2');
      done();
    });
  });

  after(function (done) {
    mongoose.model('Short').remove({}, function () {
      done();
    });
  });
});
