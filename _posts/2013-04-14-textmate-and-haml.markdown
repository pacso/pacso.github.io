---
layout: post
title: "TextMate &amp; HAML"
date: 2013-04-14 21:21
comments: true
permalink: blog/textmate-and-haml
categories:
---
This seems to be a problem that never goes away. I really hope that somebody picks up development of TextMate soon and starts getting these niggles ironed out in TextMate 2. Yes I'm aware I could stop hoping and start doing something about that myself, but that's another story.

So, you're used to using the CMD+ALT+Down-Arrow shortcut to jump between controllers and views? Started using HAML? Switched to Rails 3.2? Noticed you keep generating ERB templates by accident? Annoying isn't it. Here's how to fix it:

In your favourite editor (vi, obviously), open the following file:

{% highlight bash %}
vi /Applications/TextMate.app/Contents/SharedSupport/Bundles/Ruby\ on\ Rails.tmbundle/Support/lib/rails/rails_path.rb
{% endhighlight %}

Find the definition for the `wants_haml` method, and modify it as follows:

{% highlight ruby %}
def wants_haml
  @wants_html ||= File.file?(File.join(rails_root, "vendor/plugins/haml/", "init.rb")) ||
    File.read(File.join(rails_root, 'config', 'environment.rb')) =~ /haml/ ||
    File.read(File.join(rails_root, 'Gemfile')) =~ /haml/
end
{% endhighlight %}

The added third line checks to see if you're including HAML in your Gemfile. If it finds mention of HAML it now assumes that you want HAML templates rather than ERB ones.

Restart TextMate. Winning.
