import {MutableRefObject, useRef, Children} from 'react'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

function sectionPositionHook({
    boundingRef,
    sectionRef,
    sectionIndex,
    setSection
}: {
    boundingRef: MutableRefObject<HTMLElement>
    sectionRef: MutableRefObject<HTMLElement>
    sectionIndex: number
    setSection: (arg0: number) => void;
}){
    useScrollPosition(
        ({prevPos, currPos }) => {
            let triggerHeight = -(boundingRef?.current.clientHeight/2)

            let isTriggeredGoingDown = (prevPos.y < triggerHeight) &&  (triggerHeight < currPos.y)
            let isTriggeredGoingUp = (currPos.y < triggerHeight) &&  (triggerHeight < prevPos.y)
            if(isTriggeredGoingDown){
                setSection(sectionIndex);
            } else if(isTriggeredGoingUp){
                setSection(sectionIndex - 1);
            }
        },
        [],
        sectionRef,
        false,
        150,
        boundingRef
    );
};

export default function Scroller({
    children,
    setSection
}: {
    children,
    setSection: (section: number) => void;
}){
    const scrollerEle = useRef(null);

    function renderChildren(){
        let sectionIndex = 0;
        return Children.map(children, child, => {
            const sectionRef = useRef();

            let args = {
                boundingRef: scrollerEle,
                sectionRef: sectionRef,
                sectionIndex: sectionIndex,
                setSection: setSection
            };
            sectionPositionHook(args);

            sectionIndex += 1;
                <div ref={sectionRef} key={sectionIndex - 1}>
                    {child}
                </div>
            );
        });
    }
    return(
        <div ref={scrollerEle}>
            {renderChildren()}
        </div>
    );
}