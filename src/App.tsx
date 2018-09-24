import * as React from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { ILessonCompletion } from './services/database';
import { getLessons, ILesson } from './services/lesson';

import Done from './Done';
import Lesson from './Lesson';

interface IAppProps {
  saveLesson: (lesson: ILessonCompletion) => Promise<any>;
}

interface IAppState {
  currentLesson: number | 'DONE';
  isLoading: boolean;
  lessons: ILesson[];
}

class App extends React.Component<IAppProps, IAppState> {
  // Keep this out of state since it's in no-way tied to rendering or updating
  private currentLessonStart: string;

  constructor(props: IAppProps) {
    super(props);

    this.state = {
      currentLesson: 0,
      isLoading: true,
      lessons: [],
    };
  }

  public async componentDidMount() {
    // Assuming we always start at the first lesson and aren't trying to "continue from the last lesson"
    const lessons = await getLessons();
  
    this.setState({
      currentLesson: lessons[0].id,
      isLoading: false,
      lessons,
    });

    this.currentLessonStart = Date.now().toString();
  }

  public render() {
    const { isLoading, lessons } = this.state;

    return (
      <Router>
        <Switch>
          <Route path="/done" exact={true} component={Done} />
          <Route path="/:id" render={this.renderLesson} />
          { !isLoading ? <Redirect to={`/${lessons[0].id}`} /> : null } 
        </Switch>
      </Router>
    );
  }

  private renderLesson = ({ match }: RouteComponentProps<{ id: string }>) => {
    const { lessons } = this.state;
    const lesson = lessons.find(lsn => lsn.id === parseInt(match.params.id, 10));

    // This conditional deals with a sane default for the loading state
    return lesson ? (<Lesson lesson={lesson} key={lesson.id} nextLesson={this.getNextLesson(lesson.id)} completeLesson={this.completeLesson} />) : null;
  }

  private getNextLesson = (id: number) => {
    const { lessons } = this.state;
    const currentIndex = lessons.findIndex(lesson => lesson.id === id);

    return currentIndex !== lessons.length - 1 ? lessons[currentIndex + 1].id : 'DONE'
  };

  private completeLesson = async () => {
    // Unhandled error case here, if an error would result when adding to the DB
    await this.props.saveLesson({
      end: Date.now().toString(),
      id: this.state.currentLesson as number,
      start: this.currentLessonStart,
    });
    this.currentLessonStart = Date.now().toString();

    this.setState((prevState) => ({
      currentLesson: this.getNextLesson(prevState.currentLesson as number),
    }));
  }
}

export default App;
