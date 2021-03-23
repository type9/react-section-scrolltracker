import { MutableRefObject, useRef, Children} from 'react'
import * as React from 'react'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import defaultProps from './presets/useVertical'

//Unexported types from '@n8tb1t/use-scroll-position'
export type ElementRef = MutableRefObject<HTMLElement | undefined>
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
    options?: OptionalProps
}

export type OptionalProps = {
    triggerCallback: (arg0: TriggerParameters) => void
}

function convRefTypes(ref: DivElementRef): ElementRef{
    // @n8tb1t uses a ref type that can be undefined, whereas proper typescript is possibly null
    let newRef = useRef(undefined);
    if(ref.current !== null){newRef.current == ref.current}
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
    options?: OptionalProps
}){
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

            <div ref={sectionRef} key={index}>
                {child}
            </div>
        });
    }

    return(
        <div ref={scrollerEle}>
            {renderChildren()}
        </div>
    );
}