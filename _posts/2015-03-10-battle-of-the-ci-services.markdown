---
layout: post
title: Battle of the CI Services
date: 2015-03-10 17:05:13 +0000
permalink: /blog/battle-of-the-ci-services/
categories:
- Testing
- Continuous Integration
- Continuous Delivery
tags:
- CI
- TDD
- BDD
---

Until recently I've been running my own [Jenkins](http://jenkins-ci.org)
Continuous Integration (CI) server hosted on an [AWS](http://aws.amazon.com)
EC2 instance. This provided me with automated test runs against any commit I
pushed to my private repositories hosted on [GitHub](http://github.com).
However, this isn't a free EC2 instance and so I decided it was about time I
evaluated the competition to see what other options I had, and whether it would
be worth switching.

This got me thinking ... would it be viable, or possible even, to stop paying
for my CI environment and just use the free basic versions available from
certain vendors? And so started my quest to find the best and cheapest solution.

## The Contenders

There are many options available to you when choosing a CI solution. Depending
on your requirements some will be a better fit than others, and if you're going
down the route of a paid SaaS solution, some will be considerably more
expensive than others.

If you're building an OpenSource product, then you pretty much have the pick of
the bunch. Although saying that, they don't all provide a completely free tier
for OpenSource projects.

Here's a quick breakdown of some of your options, in no particular order:

### Self Hosted

Basically, do it yourself. Host your own CI server, with either your own testing
solution, or run something like [Jenkins](http://jenkins-ci.org), which is an
OpenSource application which you can use for Continuous Integration and
Delivery.

This is the solution I currently use, running Jenkins on an `m1.small` EC2
instance, which incurs a cost of around $32/month to keep it running 24/7.

There is obviously a small overhead on my time for keeping the server up to
date, installing/configuring Jenkins, and the inherent ongoing support
requirements of managing your own hardware.

### [CircleCI](https://circleci.com/)

A cloud-hosted CI solution with a bunch of features. They have a free tier
providing the ability to run a single threaded build of public or private
repositories, however there are no limits on the number of projects or monthly
builds you can put through your account.

After the free tier you have the option of adding containers at a cost of
$50/month per container. This allows you to either run multiple jobs in
parallel, or to multi-thread the execution of a single job. Either way, you'll
get faster builds.

### [SemaphoreCI](https://semaphoreci.com)

A very similar service offering to CircleCI in terms of features, but with a
slightly different take on the pricing model. They also have a free tier which
allows you to build projects from an unlimited number of private repositories,
however you are restricted to 100 private project builds per month. On the
plus side, you are given two processing nodes to execute your build on.

In addition to the free private tier, they also provide a free OpenSource
package, also with two processors, which give you unlimited builds of public
repositories.

After the free tier you have a smaller single-processor option at $29/month
($25/month if paid annually) and a service matching the free tier at $79/month
($66/month if paid annually), both with unlimited numbers of allowed builds.

### [Travis CI](https://travis-ci.com)

Again, a very similar service offering is provided by Travis CI. They have a
free tier with a fair-usage policy on concurrent jobs, but with no restrictions
on the numbers of builds, repositories or collaborators. However, this is
strictly an OpenSource offering, so all repositories must be public.

There is no free option available for building private repositories.

The first paid tier then starts at $129/month, allowing you two concurrent jobs
and the ability to build private repositories.

### [CloudBees](https://www.cloudbees.com/)

CloudBees provide a cloud-hosted Jenkins service. Aside from a two week trial
there is no free tier available. Their starter package costs $60/month for a
single-user account, with additional users costing $5/month.

Unless you absolutely need Jenkins and refuse to run your own hardware, then
this ends up being quite an expensive solution to your CI needs.

## Pricing

One easy way to evaluate these options is by their financial impact. Based on
my needs, for something to qualify as a valid option it needed to be free, or at
the very most equal to my current monthly outgoing of $32/month, and **must**
provide the ability to build private GitHub repositories.

This gives us the following viable options:

1. CircleCI (free) - single processing node, unlimited builds.
1. SemaphoreCI (free) - two parallel processing nodes, max 100 builds/month.
1. SemaphoreCI (Starter - $29/month) - single processing node, unlimited builds.

For all of the other options, you're financially better off running your own
self-hosted Jenkins server, which should cost you around $32/month on AWS EC2
(or less if you schedule your instance to only be available between certain
periods), compared to:

* CircleCI - two containers - $50/month
* CloudBees - Starter - $60/month
* Travis CI - Startup - $129/month

Based on these price points, for the rest of this evaluation I'll only be
looking at **CircleCI** and **SemaphoreCI**.

## Ease of Use

This really depends on what you're building. For a basic Ruby on Rails
application, where the application root is also the git repository root and
with a standard application configuration, both CircleCI and SemaphoreCI provide
an auto-configuration which will detect your DB type, set up your DB config,
install your bundled gems, load your DB schema, detect the test framework you're
using and then run your tests.

Things start to get more complicated when your setup does not conform to this
typical configuration. The application I will be testing has the following
structure:

{% highlight ruby %}
repository_root
 |-- json_api
 |    |-- app/assets/javascript/angularjs_app
 |-- app_1
 |-- app_2
{% endhighlight %}

There are 3 Ruby on Rails apps and an AngularJS app. The `json_api` app is just
that, a JSON API written with Rails providing an interface to the data layer for
and AngularJS app. The other two apps are basic Ruby on Rails apps providing
services to customers.

Each of these Rails apps has their own suite of RSpec tests and the AngularJS
app has a suite of tests in Karma/Jasmine, so there's a fair amount of scope
here for parallel execution of tests.

There are some fundamental differences between CircleCI and SemaphoreCI when
you start to configure a non-standard build process.

**CircleCI** requires you to create a `yaml` config file within your repository.
With this config file you can specify things such as which version of Ruby to
use, any specific actions required to setup your project before running a build,
how to run your tests/build/deployment, and then any post-build tasks.

**SemaphoreCI** allows you to do exactly the same thing, but without the config
file cluttering up your project. Instead you add your environment options, setup
commands, test/build/deploy commands, and any post-build tasks through a web
interface, with the added feature of being able to assign certain tasks to a
particular execution context. Anything in **setup** or **Post-thread** will run
for all threads, whereas tasks assigned to **Thread #1** or **Thread #2** will
only be executed against that thread.

I personally found it much easier to make configuration changes to CircleCI
than I did to SemaphoreCI, since I could edit a config file, push it to my repo
and have the build run against that new config immediately and automatically.
With SemaphoreCI I had to edit the config to add new tasks, then once saved I
would have to select the thread context for each of the new tasks ... and save
the config again. Once complete, I then need to manually trigger another build
or push a new change to my repo. It just seemed a clunky interface to what
should be a simple task.

I'm not a fan of littering my codebase with config files for 3rd party apps or
services which play no part in the running production application, but in this
instance I think the config/setup experience of CircleCI was better. A very
subjective thing though, and not something that should sway things in either
direction really. Much of a muchness.

## Speed

This is where things started to get interesting. Since there's a free offering
from both CircleCI and SemaphoreCI, what better way to evaluate them against
each other than by racing them!?

So ... I set up my non-standard app (described above) on both platforms, with
minimal changes from the default setup, and pushed a change to my repo. With
this first build I had the *json_api* Rails app and the *AngularJS* app tested
within one thread, and the other two Rails apps tested on the second thread
within SemaphoreCI. The results were quite interesting. CircleCI completed the
build in 5 minutes 17 seconds, whereas SemaphoreCI took 6 mintutes 5 seconds.

I then analysed the execution times for each test suite and reorganised which
threads things were executed on within SemaphoreCI such that I maximised the
usage of the threads available to me. This brought my execution down a little
but not a lot.

I then noticed that for some reason SemaphoreCI was running `bundle install`
against each of the three Rails apps, despite the fact that they share a common
set of gems, yet CircleCI was only running bundle install once. So, I updated
the SemaphoreCI config such that only one `bundle install` took place, and
pushed another change to my repo. This time the results were dramatically
different. CircleCI: 5 minutes 39 seconds (not sure why this took longer),
SemaphoreCI: 3 minutes 26 seconds.

Finally, some benefit from parallel test execution.

Next, I wanted to test how fast repeated tests would be, assuming that some
caching of assets, gems, etc could be provided by the CI environment to speed
things up for regularly tested repositories. So I repeatedly pushed empty
commits to the repo, one a minute for 5 minutes, using the following shell
script:

{% highlight bash %}
for i in 1 2 3 4 5
do
git commit -m "Force Build ${i}" --allow-empty && git push
sleep 60
done
{% endhighlight %}

The results were as follows:

| Test Number | CircleCI | SemaphoreCI |
|:-----------:|---------:|------------:|
| 1           | 5m 34s   | 4m 48s      |
| 2           | 6m 10s   | 5m 0s       |
| 3           | 7m 23s   | 3m 43s      |
| 4           | 5m 35s   | 3m 18s      |
| 5           | 5m 46s   | 3m 21s      |

As you can see, no perceivable increase in execution speed was experienced over
five consecutive test runs. Can't say I wasn't a little disappointed at that.

Overall though, providing you take advantage of the ability to split your tests
and run them in parallel, SemaphoreCI should be reliably faster.

## Conclusion

**CircleCI** and **SemaphoreCI** both provide a robust, flexible and easy-to-use
Continuous Integration and Deployment service. With their free service offerings
they cater for the requirements of all hobbyist programmers, small startups and
perhaps even reasonably busy one-man website development outfits.

Certainly, **SemaphoreCI** takes the prize for fastest build process, but given
the fact you have twice the processing capacity that really comes as no
surprise.

The most important factor here I think is that **CircleCI** provide you an
unlimited build capacity but with a slightly slower throughput. Yes, I can
shave a few minutes from the delay waiting for that green tick in GitHub by
using SemaphoreCI, but once I hit my 100th build of the month ... no more green
ticks. CircleCI however will just keep on trucking.

So, in conclusion, if you don't run more than 100 builds a month, use
**SemaphoreCI**. If you do ... use **CircleCI**.

If you need more than that, then you really should consider rolling your own
with Jenkins, since all of the hosted solutions come out more expensive in the
long run.

### The best of both worlds?

Want to have **three** parallel executions of your tests? For free?

How about you split up your tests such that:

* One set runs against CircleCI when you push your changes
* Another set runs against Thread #1 within SemaphoreCI
* The final set runs against Thread #2 within SemaphoreCI

Once your builds complete, they will both report back to GitHub the status of
the build and unless they both return successful results then GitHub will mark
the commit as bad.

If you need more throughput than that then you're making enough money to pay for
it.

Happy testing!
