require 'time'

# Stolen from http://arjanvandergaag.nl/blog/creating-new-jekyll-posts.html
desc 'create a new unpublished draft post'
task :post do
  title = ENV['TITLE']
  slug_date = Date.today
  slug_title = title.downcase.gsub(/[^\w]+/, '-').gsub(/-$/, '')
  slug = "#{slug_date}-#{slug_title}"

  file = File.join(File.dirname(__FILE__), '_drafts', slug + '.markdown')

  File.open(file, 'w') do |f|
    f << <<-EOS.gsub(/^     /, '')
---
layout: post
title: #{title}
<!-- date: #{Time.now} -->
permalink: /blog/#{slug_title}/
<!-- published: true -->
categories:
tags:
---

EOS
  end

  # system ("#{ENV['EDITOR']} #{file}")
end

desc 'Run the Jekyll Server'
task :serve do
  system "jekyll serve"
end
task s: :serve

desc 'Run the Jekyll Server in Drafts mode'
task :devel do
  system "jekyll serve --drafts"
end
task d: :devel
