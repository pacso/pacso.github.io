---
layout: post
title: AngularJS from scratch with Grunt, Bower and NPM
<!-- date: 2015-04-12 23:18:45 +0100 -->
permalink: /blog/getting-started-with-grunt-bower-and-npm/
<!-- published: true -->
categories:
- Web Development
- AngularJS
tags:
- AngularJS
- Grunt
- Bower
- NPM
---

I'm in the process of starting a new AngularJS project. Naturally my immediate thought was to turn to a trusty [Yeoman][] generator to get the basic framework underway without much effort. This however presented me with quite a conundrum ... which generator to use?

There are many out there, and they all of their pros and cons. I didn't need any NodeJS backend setup, which discounted a few for being overly complex. I wanted to have angular-ui-router built in from the start, so that knocked out a few others. It needed a working Karma/Jasmine setup, CSS/JS minification/concatenation/etc, and absolutely must compile all AngularJS template files into the template cache.

I reviewed a bunch of them, even referring to other guides reviewing generators such as [this one][review1] and [this quite in-depth one][review2]. I settled on [generator-cg-angular][] as the front-runner and started to get the project underway. Unfortunately I stumbled at the first hurdle. I created a very simple Angular directive, along with Karma tests for the directive and controller. For some reason I couldn't understand, I could never get the tests to run successfully. The template being loaded by the directive was causing the tests to fall over in a heap since the http request for the template wasn't expected. Somehow, the cached template wasn't being cached in the testing environment.

I spent a little time trying to resolve the issue, but ultimately decided that rather than bodge it, I would be better off creating a brand new configuration with just the components I needed for the project. Nice and clean with no extra crud complicating things.

So where do we start?

## Getting Started

First of all, we need our basic toolset to be installed.

**Install NodeJS, which will provide you with NPM.**

**Using NPM, install Bower**

**Create a `.bowerrc` file:**

<figure>
<figcaption>File: .bowerrc</figcaption>
{% highlight javascript linenos %}
{
  "directory": "app/bower_components"
}
{% endhighlight %}
</figure>


[Yeoman]: http://yeoman.io/
[generator-cg-angular]: https://github.com/cgross/generator-cg-angular

[review1]: http://gaboesquivel.com/blog/2014/overview-of-angular-generators-april-2014/
[review2]: http://www.dancancro.com/comparison-of-angularjs-application-starters/
