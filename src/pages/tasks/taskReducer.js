export const initialState = {
  tasks: [],
  availableTags: [],
  filters: {
    searchQuery: '',
    statusFilter: 'all',
    tagFilter: 'all',
    priorityFilter: 'all',
  },
  editingTask: null,
  isEditModalOpen: false,
  loading: true,
};

export function tasksReducer(state, action) {
  switch (action.type) {
    case 'INITIALIZE_DATA':
      return {
        ...state,
        tasks: action.payload.tasks,
        availableTags: action.payload.tags,
        loading: false,
      };
    case 'CREATE_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => (t.id === action.payload.id ? action.payload : t)),
        isEditModalOpen: false,
        editingTask: null,
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
      };
    case 'COMPLETE_TASK':
        return {
            ...state,
            tasks: state.tasks.map(t =>
                t.id === action.payload ? { ...t, completed: true } : t
            ),
    };
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.filterName]: action.payload.value,
        },
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
      };
    case 'OPEN_EDIT_MODAL':
      return {
        ...state,
        isEditModalOpen: true,
        editingTask: action.payload,
      };
    case 'CLOSE_EDIT_MODAL':
      return {
        ...state,
        isEditModalOpen: false,
        editingTask: null,
      };
    case 'CREATE_TAG':
      return {
        ...state,
        availableTags: [...state.availableTags, action.payload],
      };
    default:
      return state;
  }
}
