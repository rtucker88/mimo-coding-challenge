import { mount } from 'enzyme';
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Lesson, { CombinedLessonProps, enhance } from './Lesson';

describe('Lesson', () => {
    class MockComponent extends React.Component<CombinedLessonProps> {
        public render() {
            return (<div/>);
        }
    }

    const lesson = {
        content: [{
            color: '#FFF',
            text: 'var number =',
        }],
        id: 1,
    };

    const lessonWithInput = {
        content: [{
            color: '#FFF',
            text: 'var number =',
        }],
        id: 1,
        input: {
            endIndex: 2,
            startIndex: 1,
        }
    };

    const completeLessonMock = jest.fn();

    beforeEach(() => {
        completeLessonMock.mockReset();
    });

    describe('renders correctly', () => {
        it('without inputs', () => {
            const wrapper = mount((
                <Router>
                    <Lesson lesson={lesson} nextLesson={2} completeLesson={completeLessonMock} />
                </Router>)
            );
            expect(wrapper).toMatchSnapshot();
        });
        
        it('with inputs', () => {
            const wrapper = mount((
                <Router>
                    <Lesson lesson={lessonWithInput} nextLesson={2} completeLesson={completeLessonMock} />
                </Router>)
            );
            expect(wrapper).toMatchSnapshot();
        });
    });

    it('handles an correct input change correctly', () => {
        const Enhanced = enhance(MockComponent);
        const wrapper = mount(<Enhanced lesson={lessonWithInput} nextLesson={2} completeLesson={completeLessonMock} />);
        expect(wrapper.state('isLessonFinished')).toEqual(false);

        const subject = wrapper.find(MockComponent);
        subject.prop('onInputChange')({ target: { value: 'a' }});
    
        expect(wrapper.state('isLessonFinished')).toEqual(true);
    });

    it('handles an incorrect input change correctly', () => {
        const Enhanced = enhance(MockComponent);
        const wrapper = mount(<Enhanced lesson={lessonWithInput} nextLesson={2} completeLesson={completeLessonMock} />);
        expect(wrapper.state('isLessonFinished')).toEqual(false);

        const subject = wrapper.find(MockComponent);
        subject.prop('onInputChange')({ target: { value: 'b' }});
    
        expect(wrapper.state('isLessonFinished')).toEqual(false);
    });

    it('should always have a valid solution value if there is no input', () => {
        const Enhanced = enhance(MockComponent);
        const wrapper = mount(<Enhanced lesson={lesson} nextLesson={2} completeLesson={completeLessonMock} />);
        expect(wrapper.state('isLessonFinished')).toEqual(true);
    });
});
