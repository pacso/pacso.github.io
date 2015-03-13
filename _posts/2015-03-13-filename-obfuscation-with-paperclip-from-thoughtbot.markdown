---
layout: post
title: Filename Obfuscation with Paperclip from Thoughtbot
date: 2015-03-13 13:12:45 +0000
permalink: /blog/filename-obfuscation-with-paperclip-from-thoughtbot/
published: true
categories:
- Ruby on Rails
tags:
- Ruby on Rails
- Rake
- Paperclip
- Attachments
---

[Paperclip](https://github.com/thoughtbot/paperclip) is an excellent gem produced by [thoughtbot](https://thoughtbot.com/open-source) for the easy attachment of files to models within [Ruby on Rails](http://rubyonrails.org/) applications.

If you're reading this then I expect you're already using Paperclip and if you aren't then you probably know about it. On the off chance that this is completely new to you then take a look at [this excellent screencast](http://railscasts.com/episodes/134-paperclip) from [Railscasts](http://railscasts.com/) which explains what it is and how to use it.

## A standard configuration

As with most things, when I started out using Paperclip I did not know what my needs would be far into the future. Initially I added it so that I could handle file attachments within the admin system of an online shop. When we needed to send scanned documents to customers by email, we upload the scanned image and it gets attached to their order using Paperclip. Then with a click of a button an email gets scheduled for delivery with their scanned documents attached.

One key thing to note here is that the customers did not interact directly with the images stored on the server. At this point our config for Paperclip looked something like this:

{% highlight ruby linenos %}
class Attachment < ActiveRecord::Base
  belongs_to :order
  has_attached_file :document,
    {
        styles: { thumb: '300x300>'}
    }

  validates_attachment :document,
            presence: true,
            content_type: {content_type: ["image/jpg", "image/jpeg", "image/png"]},
            size: { less_than: 2.megabytes }
end
{% endhighlight %}

Our `Order` object `has_many :attachments`. Using Paperclip, each `Attachment` can have an attached `document`. When saving attachments, using the validations above, Paperclip ensures that our documents are one of the allowed content types, are less than 2MB, and that an `Attachment` cannot be saved without a document being attached.

This works perfectly well, but once saved our uploaded documents have a URL of the following format:

`/system/attachments/documents/000/001/101/original/scanned_doc.jpg`

The problem here being that if your customers can see an image that they've uploaded and they inspect the path to that image, they can potentially guess paths to other images which do not belong to them.

Thankfully, there's a partial solution to this provided within Paperclip. [Obfuscation](http://en.wikipedia.org/wiki/Obfuscation). I say partial, because it just makes it difficult to guess the paths to other files. It does not provide any security to prevent you accessing an image you shouldn't be able to if you know its path.

## Adding obfuscation

Adding obfuscation to the filename of your attached documents is an easy thing to do, although [the instructions](https://github.com/thoughtbot/paperclip#uri-obfuscation) are not all that easy to follow. We can make a small modification to our model, and then any newly uploaded files will be stored with a randomised filename. Once done, it will be almost impossible for anybody to guess the path to another image stored on the server.

First of all, we need to generate a `hash_secret` which Paperclip will use as a salt when obfuscating the filename. Thankfully Rails provides us with an easy method to do this. Simply run the following rake task in your console:

{% highlight bash %}
% rake secret
abfa04a42c94f58d17a509bccb2276d2f2e1718e23de5f0ff4bc93b4c922c2dbd23f81b31a7932fbf4424c95f14e055639d2376f8b3cb40ebf91ea4682197645
{% endhighlight %}

Using this random string for our `hash_secret`, we can now modify our Paperclip setup so that it will randomise our filenames for us:

{% highlight ruby linenos %}
class Attachment < ActiveRecord::Base
  belongs_to :order
  has_attached_file :document,
    {
        styles: { thumb: '300x300>'},
        path: ":rails_root/public:url",
        url: "/system/:class/:attachment/:id_partition/:style/:hash.:extension",
        hash_secret: 'abfa04a42c94f58d17a509bccb2276d2f2e1718e23de5f0ff4bc93b4c922c2dbd23f81b31a7932fbf4424c95f14e055639d2376f8b3cb40ebf91ea4682197645'
    }

  validates_attachment :document,
            presence: true,
            content_type: {content_type: ["image/jpg", "image/jpeg", "image/png"]},
            size: { less_than: 2.megabytes }
end
{% endhighlight %}

We added a few new things here. The `hash_secret` is simply used as a salt by Paperclip when generating the `:hash` variable. We then updated our `:url` setting such that the filename of the saved document would be of the format `:hash.:extension`. Finally, we set the path to use the same structure when storing the document on the filesystem.

Restarting our Rails app and uploading a new document, we can now see that our files are no longer stored with the filename in plaintext, but rather something like this:

`/system/attachments/documents/000/001/101/original/e8be37d4130323ceb24c35788732727b707e033a.jpg`

So now, when any images are exposed to the customer, they will only be able to access images they already know the full path to. Guessing paths to images belonging to other orders will be almost impossible.

## That's great! ... Hang on, the links to older uploads are all broken!?

Yeah, one issue here is that we've now fundamentally changed the way that Paperclip stores and fetches images. For any documents uploaded prior to our obfuscation change, they are stored on the filesystem with the old name, yet Paperclip is generating a hash of the filename and then providing a URL to that place.

We have a few potential solutions:

1. Add a new method to the `Attachment` model which generates the old URL. Then figure out if the new or old filename exists before serving up a working URL.
1. Rename the old files so that they are stored on the filesystem with the new hashed filename.
1. Copy the old files to the new hashed filename, essentially duplicating all older uploaded documents on disk.

I don't like option 1. Just seems far too much work for generating URLs to images, and will have to be evaluated every time you need the URL. There's little point accessing the filesystem just to generate a URL.

Option 2 is OK if there are no customers using the old URL format and will save you a little disk space over option 3. Additionally, it removes the risk of people guessing the path to an old document.

Option 3 may be problematic for you if you have a lot of old files taking up large amounts of disk space. In this case, perhaps rename the files and create a symlink from the original filename to the obfuscated one.

Personally, no customers are currently aware of any of the legacy paths to documents, so I'm fine to go ahead with just renaming everything. Option 2 it is!

We can easily parse all of the saved `Attachment` objects, and fix their image filenames with a simple rake task:

{% highlight ruby linknos %}
desc "Obfuscate filenames of old paperclip documents"
task obfuscate_legacy_documents: :environment do
  Attachment.find_in_batches do |attachments|
    attachments.each do |attachment|
      if attachment.document.original_filename
        legacy_filename = File.join(
          File.dirname(attachment.document.path),
          attachment.document.original_filename
        )

        if File.exist? legacy_filename
          File.rename(legacy_filename, attachment.document.path)
        end
      end
    end
  end
end
{% endhighlight %}

With this rake task we can then quickly rename all of the old files to their new obfuscated locations. Note that we process the attachments in batches (of 1000 by default) using the [find_in_batches](http://api.rubyonrails.org/classes/ActiveRecord/Batches.html#method-i-find_in_batches) method. If you don't do this, and instead try to do it in one large `Attachment.all.each` loop, Rails will be instantiating all of the `Attachment` objects in memory at the same time, and will wait for them **all** to be in memory before beginning to process them. This will likely be very slow.
