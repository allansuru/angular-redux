import { tassign } from 'tassign'; 
import { ADD_TODO, TOGGLE_TODO, REMOVE_TODO, CLEAR_TODOS } from './actions'; 

export interface IAppState {
  todos: any[];
  lastUpdate: Date; 
  itemDeletado: any;
  itemAdicionado: any;
}

export const INITIAL_STATE: IAppState = {
  todos: [],
  lastUpdate: null,
  itemDeletado: [],
  itemAdicionado: []
}

 function AddTodo(state, action) {
  var newTodo = { id: state.todos.length + 1, title: action.title };
  console.log('newTodo: ', newTodo);
  return tassign(state, {
    // Instead of the push() method, we use the concat() method because the former mutates
    // the original array, whereas the latter returns a new array. 
    todos: state.todos.concat(newTodo),
    lastUpdate: new Date(),
    itemAdicionado: newTodo
  });
}

function ToggleTodo(state, action) {
  // When modifying an item in an array, we should create a new array, and copy 
      // all other item from the source array (except the item to be modified). At the same time
      // we should create a copy of the item to be modified and apply the mutations using tassing.

      // So, first we need to find the item to be modified. Here, we are finding it by it's id. 
      var todo = state.todos.find(t => t.id === action.id);
      console.log('TODO: ', todo);
      
      // Now, we need to find the position of this item in the array. 
      var index = state.todos.indexOf(todo);
      return tassign(state, {
        todos: [
          // Using the slice() method, we can slice an array. This method does not mutate the 
          // original array, and returns a new array. So here, we're getting all the items from 
          // the beginning to the index of the item we're going to modiy. 
          // 
          // We use the spread operator (...) to enumerate an array. This is a clean way to 
          // concat two arrays. Instead of 
          // 
          // var newArray = [];
          // newArray.concat(sourceArray1).concat(sourceArray2);
          // 
          // We can write: 
          // 
          // var newArray = [...sourceArray1, ...sourceArray2];
          ...state.todos.slice(0, index),

          // So, we have copied all the items before the item to be modified. Now, we take a copy
          // of this item and apply the mutation (isCompleted).
          tassign(todo, { isCompleted: !todo.isCompleted }),

          // Now, we need to copy all the items after this item. Again, we use the slice() method
          // to get all the items following that item, and use the spread operator to enumerate 
          // them and put them in our target array. 
          ...state.todos.slice(index + 1),
        ],
        lastUpdate: new Date()
      });

}

function RemoveTodo(state, action) {
  var deletado = state.todos.find(t => t.id === action.id);
  // var index = state.todos.indexOf(todo);
     return tassign(state, {
       todos: state.todos.filter(t => t.id !== action.id),
       lastUpdate: new Date(),
       itemDeletado: deletado
     });
}

function ClearTodo(state, action) {
  return tassign(state, {
    todos: [],
    lastUpdate: new Date()
  });
}

export function rootReducer(state: IAppState, action): IAppState {
  console.log('state: ', state);
  console.log('Action: ', action);
  switch (action.type) {
    case ADD_TODO: return AddTodo(state, action);
    case TOGGLE_TODO: return ToggleTodo(state, action);
    case REMOVE_TODO: return RemoveTodo(state, action);
    case CLEAR_TODOS: return ClearTodo(state, action);
  }
  return state;
}