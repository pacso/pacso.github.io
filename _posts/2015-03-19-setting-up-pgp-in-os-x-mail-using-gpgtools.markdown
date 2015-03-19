---
layout: post
title: Setting up PGP in OS X Mail using GPGTools
date: 2015-03-19 13:57:52 +0000
permalink: /blog/setting-up-pgp-in-os-x-mail-using-gpgtools/
published: true
comments: true
categories:
- Encryption
- Security
tags:
- PGP
- GPG
---

With more and more reports of people's privacy being infringed by newspapers, companies and even governments, it's hardly surprising that more and more people are looking for ways to protect their privacy online.

One area that is often overlooked is email. Regardless of how careful you are with using secure connections, VPN, clever passwords etc, if you're sending your emails in plain text you have no guarantees that they aren't being intercepted and read by various interested parties. A solution to this issue has been available for a very long time, but for some reason it is rarely included by default in email systems. Probably due to vendors wanting to keep their systems as easy as possible to use.

PGP (Pretty Good Privacy) is a method of encrypting and decrypting data. GPG (Gnu Privacy Guard) is an OpenSource implementation of the PGP algorithms, and you can freely use it to protect your emails in transit.

It isn't hard to get yourself set up.

## Install GPGTools

First of all, go to [this website](https://gpgtools.org/) and download the **GPG Suite Beta 5** - [https://gpgtools.org](https://gpgtools.org/)

Next, of course, run the installer. This will install a number of things including a patch for the Mail app adding the PGP features.

## Create your key

Now you have the right software, you need to generate a PGP key:

1. Open the **GPG Keychain** app.
1. Click the **New** button in the toolbar.
1. Enter your full name and email address for the account you want to send and receive signed/encrypted emails with.
1. Tick the **Upload public key** box. This allows others to find your public key to validate your signed emails.
1. **Add a passphrase!** This is important as it protects you from somebody else sending emails from your computer or using your private key if they get hold of it somehow.
1. Click the **Generate key** button.

By this point you will have two keys in your GPG Keychain. The first will be the public key of the GPGTools Team, which you can use to send them encrypted emails. The second will be the private/public (sec/pub) key-pair which you just generated.

Before moving onto actually using them, it's a good idea to generate a **Revoke Certificate** now and store it somewhere securely. If for some reason you ever lose your private key, or forget the passphrase you added, you can then use this revoke certificate to tell people to stop using the matching public key, allowing you to generate and publish a new one. Without the private key you cannot generate a new revoke certificate.

## Signing/Encrypting Email

Now that you have your own key-pair, you can now start sending signed/encrypted emails. Open the Mail app and create a new email from the account you generated the key-pair for. You should see a couple of new icons on the right of the window in the subject bar.

The tick icon tells you that your email will be signed with your private key. People will then be able to use the public key you've published to verify that the email was sent by you and that no modifications have been made to the email since you sent it. If you don't want to sign your email, simply click the tick and it'll switch to a cross.

The padlock icon allows you to swich on/off encryption of your email. However this requires you to have the public key of the recipient you're sending your email to. You can search for them and add them to your GPG Keychain using the **Lookup Key** button in the toolbar of the **GPG Keychain** application. Once you have their public key, your email will be encrypted with that and only their private key will be capable of decrypting your message.

## Spread the word!

Without widespread adoption, encryption systems for email are unlikely to be successful in the long term. You can do your part by telling people about it. It really isn't a difficult system to set up, and once configured there is very little overhead other than remembering a passphrase.

## My Public Key

Valid until **31 March 2019** for emails sent to [jon.pascoe@me.com](jon.pascoe@me.com):

{% highlight text %}
-----BEGIN PGP PUBLIC KEY BLOCK-----

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
62mKBNYZewNE
=1qc+
-----END PGP PUBLIC KEY BLOCK-----
{% endhighlight %}
