require 'time'

# Stolen from http://arjanvandergaag.nl/blog/creating-new-jekyll-posts.html
desc 'create a new unpublished draft post'
task :post do
  title = ENV['TITLE']
  slug = "#{Date.today}-#{title.downcase.gsub(/[^\w]+/, '-').gsub(/-$/, '')}"

  file = File.join(File.dirname(__FILE__), '_posts', slug + '.markdown')

  File.open(file, 'w') do |f|
    f << <<-EOS.gsub(/^     /, '')
---
layout: post
title: #{title}
date: #{Time.now}
published: false
categories:
tags:
---

EOS
  end

  # system ("#{ENV['EDITOR']} #{file}")
end
