import {ActorTerminal} from './ActorTerminal';
import {ActorPhone} from './ActorPhone';

const ACTORS = {
    'Terminal': ActorTerminal,
    'Phone': ActorPhone
}

export class Animator {
    constructor () {}

    performActionSet (actionSet) {
        let i = -1;

        while( i++ < actionSet.length - 1 ) {
            let action = actionSet[i];
            this.dispatchToActor(action)
            .then(nextAction);
        }

        let nextAction = () => {
            i++;

            let action = actionSet[i];

            this.dispatchToActor(action)
            .then(nextAction)
        }
    }

    dispatchToActor (action) {
        let actor = ACTORS[action.actor];
        return actor.perform (action.action);
        // this should return a promise
    }
}
