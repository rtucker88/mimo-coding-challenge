import * as React from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import Lesson from './Lesson';
import { saveCompletedLesson } from './services/database';
import { getLessons, ILesson } from './services/lesson';

interface IAppState {
  currentLesson: number | 'DONE';
  isLoading: boolean;
  lessons: ILesson[];
}

class App extends React.Component<{}, IAppState> {
  // Keep this out of state since it's in no-way tied to rendering or updating
  private currentLessonStart: string;

  constructor(props: {}) {
    super(props);

    this.state = {
      currentLesson: 0,
      isLoading: true,
      lessons: [],
    };
  }

  public componentWillMount() {
    // Assuming we always start at the first lesson and aren't trying to "continue from the last lesson"
    getLessons()
      .then(lessons => {
        this.setState({
          currentLesson: lessons[0].id,
          isLoading: false,
          lessons,
        });

        this.currentLessonStart = Date.now().toString();
      })
  }

  public render() {
    const { isLoading, lessons } = this.state;

    return (
      <Router>
        <div>
          <Switch>
            <Route path="/done" exact={true} component={Done} />
            <Route path="/:id" render={this.renderLesson} />
            { !isLoading ? <Redirect to={`/${lessons[0].id}`} /> : null } 
          </Switch>
        </div>
      </Router>
    );
  }

  private renderLesson = ({ match }: RouteComponentProps<{ id: string }>) => {
    const { lessons } = this.state;
    const lesson = lessons.find(lsn => lsn.id === parseInt(match.params.id, 10));

    return lesson ? (<Lesson lesson={lesson} key={lesson.id} nextLesson={this.getNextLesson(lesson.id)} completeLesson={this.completeLesson(lesson.id)} />) : null;
  }

  private getNextLesson = (id: number) => {
    const { lessons } = this.state;
    const currentIndex = lessons.findIndex(lesson => lesson.id === id);

    return currentIndex !== lessons.length - 1 ? lessons[currentIndex + 1].id : 'DONE'
  };

  private completeLesson = (id: number) => () => {
    // Unhandled error case here, if an error would result when adding to the DB
    saveCompletedLesson({
      end: Date.now().toString(),
      id,
      start: this.currentLessonStart,
    }).then(() => {
      this.currentLessonStart = Date.now().toString();
    });
  }
}

const Done: React.StatelessComponent<{}> = () => {
  return (<div>Done</div>);
}

export default App;
