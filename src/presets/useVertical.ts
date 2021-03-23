import {TriggerParameters} from "../sectionScrollTracker";

function triggerHalfway({sectionRef, boundingRef, index, prevPos, currPos, callback}: TriggerParameters){
    const elementsNotLoaded = !boundingRef && !sectionRef;
    if(elementsNotLoaded) return; //catches undefined refs which can happen on the intial render

    let triggerHeight = 0;
    if(boundingRef && boundingRef.current){
        triggerHeight = -(boundingRef.current.clientHeight/2)
    }

    const isTriggeredGoingDown = (prevPos.y < triggerHeight) &&  (triggerHeight < currPos.y)
    const isTriggeredGoingUp = (currPos.y < triggerHeight) &&  (triggerHeight < prevPos.y)

    if(isTriggeredGoingDown){
        callback(index);
    } else if(isTriggeredGoingUp){
        callback(index - 1);
    }
}

export default {
    triggerCallback: triggerHalfway
}
