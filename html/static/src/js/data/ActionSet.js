let actionSet = [];

actionSet[0] = [
{
    actor: 'Terminal',
    action: {
        type: 'typeOutLine',
        line: ['$', 'ssh root@server'],
    },
},
{
    actor: 'Phone',
    action: {
        type: 'showNotification',
        notificationText: 'Your private key was used: <br> <span style="">ssh root@server</span>'
    },
},
{
    actor: 'Terminal',
    action: {
        type: 'typeOutLine',
        line: ['root:~#', '']
    },
    delayAfterFinish: 4000
}];

actionSet[1] = [{
    actor: 'Terminal',
    action: {
        type: 'typeOutLine',
        line: ['$', 'git pull origin master'],
    },
},
{
    actor: 'Phone',
    action: {
        type: 'showNotification',
        notificationText: 'Your private key was used: <br> <span style="">git pull github:hello.git</span>'
    },
},
{
    actor: 'Terminal',
    action: {
        type: 'typeOutLine',
        line: ['', 'Updating c21fc5a..3b8a0a5'],
        showCursor: false,
        shouldTypeOut: false
    },
    delayAfterFinish: 10
},
{
    actor: 'Terminal',
    action: {
        type: 'typeOutLine',
        line: ['', '7 files changed, done.'],
        showCursor: false,
        shouldTypeOut: false
    }
},
{
    actor: 'Terminal',
    action: {
        type: 'typeOutLine',
        line: ['$', ''],
    },
    delayAfterFinish: 4000
}];

export {actionSet};
