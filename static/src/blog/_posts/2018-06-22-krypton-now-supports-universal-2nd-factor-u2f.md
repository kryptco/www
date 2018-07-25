---
layout: page
title: "Krypton is now a U2F Authenticator"
subtitle: "Today we're announcing: Krypton for Universal 2nd Factor (U2F). This is our first step in bringing usable public-key authentication to the web."
category: posts
when: "July 6, 2018"
date: 2018-06-22 15:23:21
---

At krypt.co, we're all about making public-key crypto more usable and portable by giving developers a convenient and secure place to store their private-key -- on the device you already have, your phone. The focus on developers is for good reason -- we, as developers, use public-key crypto all the time when we sign into servers with SSH or push code with Git.

SSH is a remarkably secure communication and authentication protocol that supports password-less, public-key based authentication. Coupled with easy-to-use and secure private-key storage, SSH gives us a glimpse of what the password-less future of authentication could look like.

Today we're announcing **Krypton for Universal 2nd Factor** -- our first step in bringing usable public-key authentication to the web.

![]({{ site.url }}/static/dist/img/blog/krypton_plus_u2f.svg){:class="img-center sep-image"}

## Welcome U2F!
Universal 2nd Factor or U2F is a newly standardized protocol for two-step verification that is based on strong public-key-based cryptography to create the first [**un-phishable credential** on the web]({{ site.baseurl }}{% post_url 2018-06-22-prevent-phishing-on-the-web-with-crypto %}). 

Typically you see U2F devices as standalone USB fobs that you can buy on amazon or get from your IT department. We're now making it easy for anyone to use U2F and become un-phishable on the web.

Krypton works on the device you already have -- your phone. 
<br>
<br>
<br>
{% include smart_download.html %}

{% include u2f_demo.html %}

## Works with sites you use everyday

{% include supported_sites.html %}
<br>
<div class="center">
    <p>Plus many more!</p>
</div>

