# Monguurl

Automatically generate a unique and url-friendly alias/slug and store it in Mongoose. For example for posts it's common to generate an alias/slug from the title.

## Example

Define your model like this:

```javascript
var mongoose = require('mongoose'),
    monguurl = require('monguurl');

Post = new mongoose.schema({
  title: { type: String },
  slug: { type: string, index: { unique: true } }
});

Post.plugin(monguurl({
  source: 'title',
  target: 'slug'
}));

mongoose.model('Post', Post);
```

And then if you for example create a new document like this:

```javascript
mongoose.model('Post').create({
  title: 'This is so Äwesome!'
});
```

The slug will be automatically generated and stored in the database:

```json
{
  "_id": "09876543...",
  "title": "This is so Äwesome!",
  "slug": "this-is-so-awesome"
}
```

Create another identical document and it will be stored like this:

```json
{
  "_id": "09876543...",
  "title": "This is so Äwesome!",
  "slug": "this-is-so-awesome-2"
}
```

The ending number will increase to "-100", then it will be "-100-2". This is to avoid ruining intentional numbers such as "It's over 9000" or "A day in 2013". It's unlikely enough that either such a title is repeated or that the same title is used more than a hundred times anyway.

Also note that theoretically this plugin can be used without a source/title, if such behavior is desired. Just set the target field when creating the document and any source will be ignored.

**Update:** It's now also possible to set a max-length for aliases. Setting `monguurl({ length: 40 })` will cut the alias approximately at the space (dash) closest before the limit. If there's no space/dash, the string will be cut off at the limit anyway. The final length might be up to 6 bytes longer to accomodate for appended numbers. The default length is 0, which is unlimited.


## Installation

* `npm install monguurl --save`


## Documentation

* __monguurl(options)__  
  Creates the mongoose plugin.
  * options.source (string) Path to the field which to generate the alias from.  
    Default: 'title'
  * options.target (string) path to the field where the alias should be stored.  
    Default: 'alias'
* __urlProof(alias)__  
  Method used to make a string url-friendly. If you want a different method, just replace it.
