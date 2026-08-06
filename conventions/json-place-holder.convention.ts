export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default interface JsonPlaceHolderEndpoints {
  'GET: https://jsonplaceholder.typicode.com/todos': {
    query: { _limit?: number; _start?: number }
    data: Todo[]
  }
  'GET: https://jsonplaceholder.typicode.com/todos/:id': {
    query: {}
    data: Todo
  }
}

