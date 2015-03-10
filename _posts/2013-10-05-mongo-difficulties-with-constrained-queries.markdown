---
layout: post
title: "Mongo difficulties with constrained queries"
date: 2013-10-05 18:56
permalink: blog/mongo-difficulties-with-constrained-queries
comments: true
categories:
- MongoDB
- Grails
---
We ran into this issue a little while ago at work. Basically, when you do a query with Mongo that has any constraints, Mongo will do two things. Firstly it will return the records which match your constraints, but more importantly it will only return the attributes from those records which are either mentioned in the constraints or requested specifically in your query.

This is a problem if you don't know what attributes a record may have, but you need to retrieve them all.
In MySQL (or any other relational database), this is easily achievable with a query like this:

{% highlight SQL %}
SELECT * FROM pages WHERE type in ('channel', 'main');
{% endhighlight %}

However, the database knows exactly what columns your table has. Mongo is not so simple. This was exactly the issue we faced whilst building a new Grails app backed by a Mongo database.

<!-- more -->

First of all we wanted to be able to call a method, passing in the constraints for our mongo query, and receive the full set of attributes for any matching record without doing multiple queries to mongo to retrieve the additional attributes. Here's our method call to retrieve all `pages` with a type of either `channel` or `main`:

{% highlight javascript %}
def pages = findDistinctPages([$or: [[type: 'channel'], [type: 'main']]])
{% endhighlight %}

And here's our implemented method which provides those results:

{% highlight groovy %}
private List<DBObject> findDistinctPages(Map by) {
    def command =
        new GroupCommand(
                (DBCollection) db.pages,
                new BasicDBObject(['url': 1]),
                new BasicDBObject(by),
                new BasicDBObject([:]),
                'function ( current, result ) { for(i in current) { result[i] = current[i] } }',
                ''
        )
    db.pages.group(command).sort { it.title }
}
{% endhighlight %}

The key here is the javascript function passed to mongo with the query. Mongo uses this to transform the results which matched your query into the item you want to return to your application. For each record it finds which matches your criteria, mongo passes the full record (`current`) and the result you want to return (`result`) to your function. You could do anything you like in this function, like adding VAT to prices in a banking application, or more usefully in our situation adding all the attribtues of the record to the result set. So we iterate over the attributes in `current` and add them to the `result` array.

Once the query is complete the set of results, including all of their attributes and not just those specified in your initial query, are returned to your application.

Simple! (But not as simple as `select * from ...`)
