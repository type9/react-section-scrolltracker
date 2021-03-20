import { MutableRefObject, useRef, Children} from 'react'
import * as React from 'react'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import defaultVerticalProps from './presets/useDefaultVertical'

//Unexported types from '@n8tb1t/use-scroll-position'
export type ElementRef = MutableRefObject<HTMLElement | undefined>;
export type IPosition = {x: number, y: number};

//Special types for configuration
export type SectionCallback = (index: number) => void;

export interface TriggerParameters {
    sectionRef: ElementRef,
    boundingRef: ElementRef,
    index: number,
    prevPos: IPosition,
    currPos: IPosition,
    callback: SectionCallback
}

type hookProps = {
    sectionRef: ElementRef
    boundingRef: ElementRef
    index: number
    callback: SectionCallback
    options: OptionalProps
}

export type OptionalProps = {
    triggerCallback: (arg0: TriggerParameters) => void
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
        ({prevPos, currPos}) => {options.triggerCallback({
            sectionRef,
            boundingRef,
            index,
            prevPos,
            currPos,
            callback})},
        [],
        sectionRef,
        false,
        100,
        boundingRef
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
    const scrollerEle = useRef(undefined);
    options = options == undefined ? defaultVerticalProps : undefined

    function renderChildren(){
        return Children.map(children, (child, index) => {
            const sectionRef = useRef(undefined);
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