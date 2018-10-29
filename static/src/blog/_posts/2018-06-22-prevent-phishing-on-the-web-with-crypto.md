---
layout: page
title: "Prevent phishing on the web with cryptography"
subtitle: "What's the deal with phishing and universal 2nd factor? Make yourself un-phishable on the web by using a strong, cryptographic second-factor." 
category: posts
when: "June 22nd, 2018"
date: 2018-06-22 14:39:52
---

**Universal 2nd Factor (U2F)** is a protocol for doing two-factor authentication that constructively prevents phishing on the web using cryptography.

![]({{ site.url }}/static/dist/img/blog/phishing_password.svg){:class=" img-center"}


## How does phishing work?
It's very simple -- an attacker gets you to click on a fake link like `http://facebo0k.com` or `http://dropobox.com`, and the page looks exactly like the real thing.

<div class="browser blog-browser">
    <div class="header">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span>f</span>
        <span>Facebook</span>
    </div>
    <div class="tabbar">
        <i class="arrow"></i>
        <i class="arrow"></i>
        <div class="search">
            <p>https://facebo0k.com/login</p>
        </div>
        <div></div>
    </div>
    <div class="screen">
        <div class="header"> 
            <p>facebook</p>
            <div class="login" id="demo-login">
                <div class="input">
                    <p>Email</p>
                    <input class="box username" value="alex@gmail.com">
                </div>
                <div class="input">
                    <p>Password</p>
                    <input class="box password" value="********">
                </div>
                <div class="button" id="login-button">
                    Log in
                </div>
            </div>  
        </div>
        <div class="welcome" id="demo-welcome">
            <p>Welcome!</p>
            <p>Please sign in</p>
        </div> 
    </div>       
</div>

Next, the attacker's site asks for your username + password. And you enter it. Because it looks legitimate and you're just trying to browse the web like you do everyday. You might think you'll never click on a suspicious link, but what if it comes from a trusted source? Like a compromised facebook or email account of one of your friends?

When you click enter, you will send your username + password to your attacker and it's game over!


## I already use two-factor -- I'm invincible!
I've talked to a bunch of folks about this, and the gut reaction is often *"I use two-factor so I can't be phished!"* This is actually very wrong, two-factor is just as easy to phish as a username and password -- especially since people are now even more used to entering 2FA codes all the time.

![]({{ site.url }}/static/dist/img/blog/phishing_attack.svg){:class="img-responsive"}

After asking for your username + password, the attacker will simply show you another dialogue to get your two-factor code. It's true that the attacker has minimal time to use the 2nd factor code as it expires quickly, but this can all be automated.

### Even push-to-approve 2FA like Duo or Google Prompt can be phished
An attacker doesn't need you to enter a code to phish you. They just need to convince you to hit approve on a Duo or Google Prompt style push notification, and you will tap approve because **you think you are logging into the real site and you've been trained to do this**. Once you tap approve, you will sign the attacker in to your account on their session.

## U2F Stops Phishing with Crypto
Universal 2nd Factor (U2F) uses public-key cryptography to prevent phishing, automatically. Many sites you use today already support it like: **Facebook, Google, Dropbox, Salesforce, Stripe, GitHub, GitLab, and more.** 

There are many different forms of phishing and some are very hard to prevent. However -- credential phishing is something we absolutely can prevent using cryptography. The trick is that the "credential" becomes cryptographically bound to the website that you're **actually** on.

![]({{ site.url }}/static/dist/img/blog/u2f_step_one.svg){:class="img-responsive"}


There are two steps to U2F:
1. **Registration** Generate a new key pair on an *authenticator*. Register the public key with a website, say facebook.com.
2. **Authentication** 
    - The website's server sends a random `challenge` token. 
    - The **browser** tells the authenticator the domain that the user is viewing
    - Using the private key, the authenticator creates a digital signature of both the `challenge` and, most importantly, the domain of the website **that you are actually on** -- this comes directly, and securely from the browser itself.

The phishing protection is built in -- the credential that the authenticator spits out is only useful for the owner of the website. A signature for `"facebook.com"` cannot be used on `"google.com"`. Likewise, a signature for `"facebo0k.com"` cannot be used on `"facebook.com"`.

![]({{ site.url }}/static/dist/img/blog/u2f_during_phishing.svg){:class="img-responsive"}

Even if the attacker tricked you into producing a signature for their fake website `http://facebo0k.com` -- this signature would be useless to them! The real facebook.com would never accept a signature that contains an invalid domain. 

> That's the point of U2F -- it makes the domain you've visited a part of the cryptographic credential you need to login. 

## How do I get started?
The first step is to get an authenticator. There are several options. We built Krypton to make it easy for anyone to get become un-phishable on the web. Krypton works on the device you already have -- your phone.

{% include smart_download.html %}                          

<div class="phone blog-phone">
    <div class="ear"></div>
    <div class="screen">
        <div class="notification notification-blur">
            <div class="header">
                <img src="/static/dist/img/apple-touch-icon.png"/>
                <p>Krypton</p>
                <p>now</p>        
            </div>
            <p class="title">facebook.com</p>
            <p class="body">Do you want to sign in?</p>
        </div>
        <div class="notification-buttons notification-blur">
            <div class="allow"> <p>Yes</p> </div>
            <div class="reject"> <p>No</p> </div>
        </div>
    </div>
    <div class="home"></div>
</div>


### Other options
If you don't want to use your phone, you can buy a standalone USB device. I recommend [this wonderful guide](https://github.com/hillbrad/U2FReviews){:target="_blank"} for comparing different standalone U2F keys.

