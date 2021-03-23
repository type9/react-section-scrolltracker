import { MutableRefObject, useRef, Children} from 'react'
import * as React from 'react'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import defaultProps from './presets/useVertical'

//Unexported types from '@n8tb1t/use-scroll-position'
type ElementRef = MutableRefObject<HTMLElement | undefined>
type IPosition = {x: number, y: number};

//the type this hook will use
type DivElementRef = MutableRefObject<HTMLElement | undefined | null>

//Special types for configuration
type SectionCallback = (index: number) => void;

export interface TriggerParameters {
    sectionRef: DivElementRef,
    boundingRef: DivElementRef,
    index: number,
    prevPos: IPosition,
    currPos: IPosition,
    callback: SectionCallback
}

type hookProps = {
    sectionRef: DivElementRef
    boundingRef: DivElementRef
    index: number
    callback: SectionCallback
    options?: OptionalSectionProps
}

export interface OptionalSectionProps {
    triggerCallback: (arg0: TriggerParameters) => void
    styles: any
}

function convRefTypes(ref: DivElementRef): ElementRef{
    // @n8tb1t uses a ref type that can be undefined, whereas proper typescript is possibly null
    let newRef = useRef(undefined);
    if(ref.current !== null){newRef.current == ref.current}
    console.log(newRef)
    return newRef;
}

//Main Components
function sectionPositionHook({
    sectionRef,
    boundingRef,
    index,
    callback,
    options,
}: hookProps){
    useScrollPosition(
        ({prevPos, currPos}) => {options?.triggerCallback({
            sectionRef,
            boundingRef,
            index,
            prevPos,
            currPos,
            callback})
        },
        [],
        convRefTypes(sectionRef),
        false,
        100,
        convRefTypes(boundingRef)
    );
};

export function sectionScrollTracker({
    children,
    callback,
    options,
}: {
    children: any
    callback: SectionCallback
    options?: OptionalSectionProps
}) {
    const scrollerEle = useRef<HTMLDivElement>(null);
    options = options == undefined ? defaultProps : options

    function renderChildren(){
        return Children.map(children, (child, index) => {
            const sectionRef = useRef<HTMLDivElement>(null);
            const sectionProps = {
                boundingRef: scrollerEle,
                sectionRef: sectionRef,
                index: index,
                callback: callback,
                options: options
            };

            sectionPositionHook(sectionProps);

            return(
                <div ref={sectionRef} key={index}>
                    {child}
                </div>
            );
        });
    }

    return(
        <div style={{overflow: 'scroll', height:'inherit'}} ref={scrollerEle}>
            {renderChildren()}
        </div>
    );
}