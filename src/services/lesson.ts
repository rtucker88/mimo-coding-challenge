export interface IContent {
    color: string;
    text: string;
  }
  
interface ILessonInput {
    startIndex: number;
    endIndex: number;
}

export interface ILesson {
    id: number;
    content: IContent[];
    input?: ILessonInput;
}

export function getLessons(): Promise<ILesson[]> {
    return fetch('https://file-bzxjxfhcyh.now.sh/')
      .then(res => res.json())
      .then(res => res.lessons);
}
