# react-section-scrolltracking

A modifiable component for tracking what components are currently in viewport as a user scrolls

## How to install

`npm install react-section-scrolltracking`

## Usage

### Out of the box section tracking
By default this component is setup to update a state variable when a particular section comes into view.

Take for example this page setup
```typescript
import {useState} from 'react';
import {sectionScrollTracker as Scroller} from 'react-section-scrolltracking';

//The arbitrary sections I want to to be able to tell which one is currently in view
import ProjectSection from '../components/index/projects_section';
import AboutMeSection from '../components/index/aboutme_section';
import DevBlogSection from '../components/index/devblog_section';

export default function Index(){
    const [section, setSection] = useState(0)
    return (
        <div id="index">
            <Scroller callback={setSection}>
                  <ProjectSection/>
                  <AboutMeSection/>
                  <DevBlogSection/>
            </Scroller>
        </div>
    );
}
```
Here we provide the component with the callback, in this case the setSection state mutator, to change the state variable everytime it scrolls past the midpoint. Now we can tie any effects we like to the changing of our state variable such as updating a nav component.

### Additional configuration
By default the component is configured to do a vertical tracking section by section.

This component is setup to be configured at a deeper level if the preset functionality is not sufficient. You can pass an additional "options" prop into the component in this format.
```typescript
export interface OptionalSectionProps {
    triggerCallback: (arg0: TriggerParameters) => void
}
```

Here is the source code for how we track vertical position and decide when to trigger the callback.
```typescript
function triggerHalfway({sectionRef, boundingRef, index, prevPos, currPos, callback}: TriggerParameters){
    const elementsNotLoaded = !boundingRef.current && !sectionRef.current;
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
```
