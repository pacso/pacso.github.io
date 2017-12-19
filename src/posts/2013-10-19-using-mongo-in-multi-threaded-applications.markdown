---
layout: post
title: "Using Mongo in Multi-Threaded Applications"
date: 2013-10-19 13:18
permalink: /blog/using-mongo-in-multi-threaded-applications/
comments: true
categories:
- MongoDB
- Grails
redirect_from:
- /blog/2013/10/19/using-mongo-in-multi-threaded-applications/
---
We hit another Mongo related issue in our Grails app this week. For some unknown reason our application was hanging whilst testing a new multi-threaded feature we were building.

To provide some reliability and increased responsiveness to our application we wanted to fetch some resources from a 3rd party and cache them in the database so that the end-user didn't have to wait for them and the application would continue to operate if the remote resources were unavailable for any reason. There are many solutions to this kind of problem, but the one we implemented involved spawning some threads to fetch the resources so that the application can continue without waiting for them to be returned.

We didn't know it at the time, but by default Mongo will only allow 10 active connections. Grails responds to each request in a separate thread, but is clever in its usage of Mongo connections and shares them amongst all of the application's threads ... except for those you spawn yourself it would seem.

<!-- more -->

We were doing something quite simple in the application:

{% highlight groovy %}
Thread.start {
  // Fetch stuff from remote URL

  // Store stuff in Mongo
}
{% endhighlight %}

What we didn't know is that these threads have no visibility of the shared mongo connections used by the rest of the application. Since they can't use those shared connections they open one of their own to store the data. Helpfully, Grails keeps these connections open so that they can be reused later. Except that thread dies and will never reuse the connection.

As time progresses and more threads are created, more connections are used up and eventually you hit your 10 active connection limit. Mongo then refuses to respond to any queries until some connections get freed up and your Grails application hangs.

The solution turned out to be quite simple. If you execute your db query within the scope of a domain object it will have access to the shared mongo connections used by the rest of the application and as such will not consume the remaining available connections from the pool. We created an empty domain object called SharedMongo and used it like this:

{% highlight groovy %}
Thread.start {
  // Fetch stuff from remote URL

  SharedMongo.withNewSession {
    // Store stuff in Mongo
  }
}
{% endhighlight %}

Hey presto! No more hanging.
