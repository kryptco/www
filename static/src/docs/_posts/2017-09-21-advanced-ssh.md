---
layout: page
title: "Advanced SSH"
category: use-kryptonite-with
date: 2017-09-21 16:06:36
---

# Using Kryptonite with Advanced SSH (`assh`)
Change the `ProxyCommand` directive added by Kryptonite inside the `Host *` block in `~/.ssh/config` to:

```bash
    ProxyCommand krssh -p "assh connect --port=%p %h" -h %h
```

Currently each time `kr pair` is used, `kr` adds the default `ssh` configuration to `~/.ssh/config`, which will overwrite the above change. To prevent this from happening, add `export KR_SKIP_SSH_CONFIG=1` to your `~/.bashrc` and `kr` will skip checking your `ssh` configuration on every `kr pair`.