---
layout: post
title: days_in_year - My first contribution to Ruby on Rails
date: 2015-11-29 09:37:56 +0000
permalink: /blog/days_in_year-my-first-contribution-to-ruby-on-rails/
published: true
categories:
- Ruby on Rails
tags:
---

One of the items on my **2015 To Do List** was to become a [Rails core contributor](http://contributors.rubyonrails.org/).

Recently, whilst writing a small app to track the interest and repayments of a loan, I needed to know the number of days in a given year. This was required to calculate the daily rate of interest for the loan based on its APR.

The first thing I did was run a quick search against the Ruby documentation, and then against the Rails documentation, to see whether this method already existed. I found the [days_in_month](http://api.rubyonrails.org/classes/Time.html#method-c-days_in_month) method, but nothing to provide the days in a year. No big deal though, if you add `337` to the number of days in February, you get the number of days in the year.

So, I opened up the `Time` class and monkey-patched it with a small method which did exactly this and merrily continued building my app:

{% highlight ruby linenos %}
class Time
  def days_in_year(year = current.year)
    days_in_month(2, year) + 337
  end
end
{% endhighlight %}

A little later, I figured I probably wasn't the only person who ever needed this method. Why do we have a `days_in_month` method without a `days_in_year` method anyway? So why not send a pull request to the Rails core project asking to merge in my method?

And thus, my first contribution to the [Ruby on Rails](http://rubyonrails.org/) was born. I forked the project, wrote some tests, dropped in my new method, and then within a day or so [my pull request](https://github.com/rails/rails/pull/22244) was accepted!

I was quite amused to see that Gregg Pollack and Dan Bickford took the time to mention my tiny contribution in their [Ruby5 Podcast](https://ruby5.codeschool.com/episodes/644-episode-601-november-17th-2015). Thanks guys!

Seems I also got a mention in the [official Rails blog](http://weblog.rubyonrails.org/2015/11/14/this-week-in-rails-new-releases-exciting-rails-5-stuff-and-more/), and now have my very own [contributor page](http://contributors.rubyonrails.org/contributors/jon-pascoe/commits).

Whilst I can certainly put a tick next to my To Do item for becoming a Rails core contributor, I think need to contribute something somewhat more substantial before I can really mark that as being completed. But it's a start ... 
