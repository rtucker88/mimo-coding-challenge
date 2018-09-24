import { mount } from 'enzyme';
import * as lolex from 'lolex';
import * as React from 'react';

import App from './App';
import Lesson from './Lesson';

jest.mock('./services/lesson');

import { lessons as mockLessons } from './services/__mocks__/lesson';

describe('App', () => {
  const saveLessonMock = jest.fn();

  afterEach(() => {
    saveLessonMock.mockReset();
  });

  it('renders correctly', () => {
    const wrapper = mount(<App saveLesson={saveLessonMock} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should set the initial state', (done) => {
    const wrapper = mount(<App saveLesson={saveLessonMock} />);
    expect(wrapper.state('isLoading')).toEqual(true);

    setImmediate(() => {
      const currentLesson = wrapper.state('currentLesson');
      const isLoading = wrapper.state('isLoading');
      const lessons = wrapper.state('lessons');

      expect(currentLesson).toEqual(mockLessons[0].id);
      expect(isLoading).toEqual(false);
      expect(lessons).toEqual(mockLessons);
      done();
    });
  });

  describe('lesson progression', () => {
    it('should progress to the next lesson', (done) => {
      const wrapper = mount(<App saveLesson={saveLessonMock} />);
      
      setImmediate(() => {
        wrapper.update();
        const lesson = wrapper.find(Lesson);
        lesson.prop('completeLesson')();

        setImmediate(() => {
          wrapper.update();
          expect(wrapper.state('currentLesson')).toEqual(1);
          done();
        });
      });
    });

    it('should complete the lessons', (done) => {
      const wrapper = mount(<App saveLesson={saveLessonMock} />);
      
      setImmediate(() => {
        wrapper.update();
        const lesson = wrapper.find(Lesson);
        wrapper.setState({ currentLesson: 1 });
        lesson.prop('completeLesson')();

        setImmediate(() => {
          wrapper.update();
          expect(wrapper.state('currentLesson')).toEqual('DONE');
          done();
        });
      });
    });
  });

  it('should call saveLesson', (done) => {
    const clock = lolex.install({ toFake: ['Date']});

    const wrapper = mount(<App saveLesson={saveLessonMock} />);
    
    setImmediate(() => {
      wrapper.update();
      const lesson = wrapper.find(Lesson);
      clock.setSystemTime(15);
      lesson.prop('completeLesson')();

      setImmediate(() => {
        wrapper.update();
        expect(wrapper.state('currentLesson')).toEqual(1);

        expect(saveLessonMock.mock.calls[0][0]).toEqual({
          end: "15",
          id: 0,
          start: "0",
        });

        clock.uninstall();
        done();
      });
    });
  });
});
