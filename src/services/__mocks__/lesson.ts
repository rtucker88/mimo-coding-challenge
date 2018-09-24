import { ILesson } from "../lesson";

export const lessons: ILesson[] = [{
    content: [{
        color: '#fff',
        text: 'hello'
    }],
    id: 0
},
{
    content: [{
        color: '#e4e4e4',
        text: 'world'
    }],
    id: 1
}];

export function getLessons(): Promise<ILesson[]> {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            resolve(lessons);
        });
    });
}
