import {TriggerParameters} from "../sectionScrollTracker";

function triggerHalfway({sectionRef, boundingRef, index, prevPos, currPos, callback}: TriggerParameters){
    let triggerHeight = -(boundingRef?.current.clientHeight/2)

    let isTriggeredGoingDown = (prevPos.y < triggerHeight) &&  (triggerHeight < currPos.y)
    let isTriggeredGoingUp = (currPos.y < triggerHeight) &&  (triggerHeight < prevPos.y)

    if(isTriggeredGoingDown){
        callback(index);
    } else if(isTriggeredGoingUp){
        callback(index);
    }
}

export default {
    triggerCallback: triggerHalfway
}
