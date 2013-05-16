"use strict";

var urlify = require('urlify').create({
  addEToUmlauts: false,
  szToSs: true,
  spaces: '-',
  nonPrintable: '',
  trim: true
});

module.exports = exports = function (options) {
  var settings = {
        source: 'title',
        target: 'alias',
        length: 0
      },
      schemaPrototype, i;

  // Extend defaults
  options = options || {};

  for(i in options) {
    if(options.hasOwnProperty(i)) {
      settings[i] = options[i];
    }
  }

  schemaPrototype = exports.schemaPrototype(settings);

  return function (schema) {
    var i;

    for(i in schemaPrototype) {
      if(schemaPrototype.hasOwnProperty(i)) {
        schema.method(i, schemaPrototype[i]);
      }
    }

    schema.pre('save', function (next) {
      this.makeUniqueAlias(next);
    });
  };
};

exports.schemaPrototype = function (settings) {
  return ({
    makeUniqueAlias: function (done) {
      var doc = this;

      if(!doc.get(settings.target)) {
        doc.set(settings.target, doc.get(settings.source));
      }

      // Always make sure the alias is urlified
      doc.set(settings.target, exports.urlProof(doc.get(settings.target), settings.length));

      doc.findUniqueAlias(done);
    },

    findUniqueAlias: function (callback) {
      var doc = this,
          alias = doc.get(settings.target) || '';

      doc.hasUniqueAlias(function (err, isUnique) {
        if(isUnique) {
          return callback();
        }

        if(alias.match(/[\-][0-9]{1,2}$/)) {
          alias = alias.replace(/[\-]([0-9]{1,2})$/, function (match, number) {
            return '-' + (number*1 + 1);
          });
        }
        else {
          alias = alias + '-2';
        }

        doc.set(settings.target, alias);
        doc.findUniqueAlias(callback);
      });
    },

    hasUniqueAlias: function (callback) {
      var doc = this,
          query = {};

      query[settings.target] = doc.get(settings.target);

      doc.model(doc.constructor.modelName).findOne(query, function (err, item) {
        callback(null, !item || ''+item._id === ''+doc._id);
      });
    }
  });
};

exports.urlProof = function (alias, length) {
  return exports.ensureLength(urlify(alias.toLowerCase()), length);
};

exports.ensureLength = function (alias, length) {
  var cutAt;

  // Taking appended numbers into account
  if(length && alias && alias.length > length + 6) {
    // Don't break words
    cutAt = alias.lastIndexOf('-', length);

    if(cutAt < 0) {
      // No dashes, just cut it anyway
      cutAt = length;
    }

    alias = alias.substring(0, cutAt);

    // Make sure no trailing dashes are left hanging around
    alias = alias.replace(/\-$/, '');
  }

  return alias;
};
