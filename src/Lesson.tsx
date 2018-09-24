import * as classnames from 'classnames';
import { flatten, isUndefined } from 'lodash';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { StateHandler, StateHandlerMap, withStateHandlers } from 'recompose';
import { ILesson } from './services/lesson';

import './lesson.css';

interface ILessonProps {
    lesson: ILesson;
    nextLesson: number | 'DONE';
    completeLesson: () => void;
}

interface ILessonState {
    isLessonFinished: boolean;
}

interface ILessonStateHandlers extends StateHandlerMap<ILessonState> {
    onInputChange: StateHandler<ILessonState>;
}

export const enhance = withStateHandlers<ILessonState, ILessonStateHandlers, ILessonProps>((props) => ({
    isLessonFinished: isUndefined(props.lesson.input),
}), {
    onInputChange: (_, props) => (event: React.ChangeEvent<HTMLInputElement>) => {
        return {
            isLessonFinished: getSolutionValue(props.lesson) === event.target.value
        };
    }
});

export type CombinedLessonProps = ILessonProps & ILessonState & ILessonStateHandlers;

const Lesson: React.StatelessComponent<CombinedLessonProps> = ({ lesson, nextLesson, completeLesson, onInputChange, isLessonFinished }) => {
    return (<div>
        {createLesson(lesson, onInputChange)}
        <Link to={`/${nextLesson}`} className={classnames({'disabled-link': !isLessonFinished})}><button disabled={!isLessonFinished} onClick={completeLesson}>Continue</button></Link>
    </div>);
};

export default enhance(Lesson);

export function getSolutionValue({ content, input }: ILesson): string {
    return content.map(cnt => cnt.text).join('').substr(input!.startIndex, input!.endIndex - input!.startIndex);
}

// Assuming valid data when going through this process. The error cases quickly result in a broken UI and 
// I'm unsure how we would recover from that state
function createLesson(lesson: ILesson, onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => Partial<ILessonState> | undefined) {
    let textCounter = 0; // Use this to figure out where we replace text with an input
    
    const elems = lesson.content.map(entry => {
        const style: React.CSSProperties = {color: entry.color};
        const retElems: JSX.Element[] = [];

        const startIndex = textCounter;
        const endIndex = textCounter + entry.text.length;

        // Tokenize around the input
        if (lesson.input && lesson.input.startIndex >= startIndex && lesson.input.endIndex < endIndex) {
            // Before Input
            retElems.push(<span style={style} key={`${textCounter}-before`}>{entry.text.substr(0, lesson.input.startIndex - startIndex)}</span>)
            // Input
            retElems.push(<input style={style} key={textCounter} maxLength={lesson.input.endIndex - lesson.input.startIndex} onChange={onInputChange} />);
            // After Input
            retElems.push(<span style={style} key={`${textCounter}-after`}>{entry.text.substr(lesson.input.endIndex - startIndex, entry.text.length)}</span>)
        } else {
            retElems.push(<span style={style} key={textCounter}>{entry.text}</span>)
        }
        
        textCounter += entry.text.length;

        return retElems;
    });

    return flatten(elems);
}