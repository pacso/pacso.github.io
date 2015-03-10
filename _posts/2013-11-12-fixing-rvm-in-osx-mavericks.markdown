---
layout: post
title: "Fixing RVM in OS X Mavericks"
date: 2013-11-12 23:28
permalink: blog/fixing-rvm-in-osx-mavericks
comments: true
categories:
---
I recently upgraded to OS X Mavericks on my home dev machine. I had a Rails project on the go and already had RVM set up with a set of gems installed and everything was working fine. Easiest OS X upgrade ever.

Then tonight I had to pull out an old project to make a couple of fixes. When I ran ```bundle install``` I was presented with all manner of errors, specifically when trying to install the bcrypt-ruby gem. I tried for some time to fix this to no avail.

My next attempt to fix things was to remove all my rubies, remove rvm, reinstall it and start again. Removing everything worked like a charm. Installing RVM again was also fine. Installing Ruby after that was impossible. Apparently I had no working C compiler available.

Eventually I found this StackOverflow article: [http://stackoverflow.com/questions/19594719/install-any-version-of-ruby-with-rvm-on-mavericks](http://stackoverflow.com/questions/19594719/install-any-version-of-ruby-with-rvm-on-mavericks)

The fix was quite simple:

* Make sure you have an up-to-date copy of XCode installed (I did)
* Make sure you have the command-line tools installed (I thought I did ... seems they got removed during the Mavericks upgrade)

If you don't have the command-line tools installed, you can sort that by running ```xcode-select --install``` in the console. After installing the command-line tools RVM was able to install the ruby version I wanted, and bundler could install all my gems.
