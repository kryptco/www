---
layout: page
title: "Krypton for Google's Advanced Protection Program"
subtitle: "Krypton is now compatible with Google's Advanced Protection Program. Use your phone instead/or in addition to a hardware security key" 
category: posts
when: "August 23rd, 2018"
image: "blog/google_u2f_krypton.png"
date: 2018-08-23 16:30:00
---

One of the most effective ways that a hacker can get into your accounts is by **phishing you**. Google's [Advanced Protection Program](https://landing.google.com/advancedprotection/){:target="_blank"} aims to defend your Google account against phishing.

## Two Security Keys
In order to enroll in the advanced protection program, you previously had to purchase **two hardware security keys and carry at least one with you at all times**. One of these security keys needs to use BLE if you ever hope to login to Google on an iOS device. 

<br/>

![]({{ site.url }}/static/dist/img/blog/hardware_keys.png){:class="img-responsive img-center"}{:style="border: 14px solid #e6e6e6; border-radius: 4px;"}

<p class="img-center"><i>Hardware previously necessary to use U2F.</i></p>
<br/>

## Meet Krypton: your new security key for Google
[Krypton](https://get.krypt.co) is an app that turns your mobile phone into a U2F authenticator, providing unphishable, zero-touch two-factor logins without the need to purchase a separate piece of hardware. This means that Krypton can become one or both (using another phone or tablet) of the required security keys for Google's Advanced Protection Program. As long as you have your phone on you, your daily carry doesn't need to change.

<br/>
{% include u2f_demo_google.html %}
{% include smart_download.html %}                          

*Note that you can add more than two security keys to your google account. If you have a hardware fob key like a Feitian or YubiKey, then we recommend adding it to your account as the secondary or tertiary backup key and storing it safely somewhere.*

## Full Support for Advanced Protection
Krypton (version 2.5.3 and higher) now **fully supports Google's Advanced Protection program** by now allowing you to sign-in to Google on an iOS or Android device with U2F. This means that when you sign-in to Google on a mobile device, it will open Krypton to ask for your second-factor (U2F) approval.

<br/>
<div class="phone blog-phone blog-phone-small">
    <div class="ear"></div>
    <video autoplay loop muted playsinline class="app-screencast" id="iosgoogle-demo" >
        <source src="{{ site.url }}/static/dist/img/blog/ios_google_demo.mp4" type="video/mp4">            
        Your browser does not support the Krypton screen cast.
    </video>
    <div class="home"></div>
</div>
<br/>
<br/>


You can now safely replace one (or both) of these required security keys with a phone running the Krypton app. No bluetooth hardware key required. No extra hardware keys required. 

**We hope this will make Google's Advanced Protection Program more accessible and easier to get started with.**

> Krypton works on regular Google accounts and GSuite accounts (even when advanced protection is not enabled.) This means you can use Krypton as your secure, unphishable 2FA for logging into Google.

### Setup Instructions
1. Download [Krypton](https://get.krypt.co) and the [Browser Extension](https://krypt.co/krext)
2. Ensure that you have two-step verification enabled on your Google account.
3. On your desktop browser, [register your Krypton Security Key for Google](https://myaccount.google.com/signinoptions/two-step-verification)
4. On your iOS device, open **Safari** and go to `accounts.google.com`
5. Enter your login credentials
6. When you get to the Smart Lock screen, tap "Already Installed". This will ask you to open Krypton to complete the login flow.

Notes on usage and support:
- You can also sign-in to Google in iOS settings. This will give you the option to open the sign-in flow with Safari, which is compatible with Krypton.
- Ensure that you sign-in through Safari. Google apps should inherit this session and work properly.
- Logging in through Chrome iOS is not yet supported (coming soon).
- Logging in to the Google Smart Lock app is not yet supported.

> Note: Krypton for Android also fully supports Google Advanced Protection and phone-based U2F logins.


