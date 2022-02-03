# Wildlife Backend

[![Build Status](https://app.travis-ci.com/jomi19/wildlife-backend.svg?branch=main)](https://app.travis-ci.com/jomi19/wildlife-backend)[![Coverage Status](https://coveralls.io/repos/github/jomi19/wildlifebackend/badge.svg?branch=main)](https://coveralls.io/github/jomi19/wildlifebackend?branch=main)

## Api paths

#### GET /post/.

Fetching one blog post with a slug
REQUIRED

```
{
    slug: slug to the post you want to find
}
```

#### GET /post/all

Fetching all posts no params needed

#### POST /post/

Inserting a new post

```
{
    title: Title of the blog posts
    markdown: Text formated with markdown for the blogpost
}
```

#### PUT /post/

Updating a blog posts
REQUIRED

```
{
    slug: slug of the blogpost to edit
}
```

```
{
    title: new title of the blogposts
    markdown: new markdown to the blogpost
}
```

#### DELETE /post/

REQUIRED

```
{
    slug: slog to the post to delete
}
```
