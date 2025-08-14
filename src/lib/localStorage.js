// Local Storage Service to replace Supabase
export const localStorageService = {
  // User Management
  setUser(user) {
    localStorage.setItem('focusflow_user', JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem('focusflow_user');
    return user ? JSON.parse(user) : null;
  },

  removeUser() {
    localStorage.removeItem('focusflow_user');
  },

  // User Profile Management
  setUserProfile(profile) {
    localStorage.setItem('focusflow_user_profile', JSON.stringify(profile));
  },

  getUserProfile() {
    const profile = localStorage.getItem('focusflow_user_profile');
    return profile ? JSON.parse(profile) : null;
  },

  removeUserProfile() {
    localStorage.removeItem('focusflow_user_profile');
  },

  // Projects Management
  getProjects() {
    const projects = localStorage.getItem('focusflow_projects');
    return projects ? JSON.parse(projects) : [];
  },

  setProjects(projects) {
    localStorage.setItem('focusflow_projects', JSON.stringify(projects));
  },

  addProject(project) {
    const projects = this.getProjects();
    const newProject = {
      ...project,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      is_active: true
    };
    projects.unshift(newProject);
    this.setProjects(projects);
    return newProject;
  },

  updateProject(projectId, updates) {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      this.setProjects(projects);
      return projects[index];
    }
    return null;
  },

  deleteProject(projectId) {
    const projects = this.getProjects();
    const updatedProjects = projects.map(p =>
      p.id === projectId ? { ...p, is_active: false } : p
    );
    this.setProjects(updatedProjects);
  },

  // Tasks Management
  getTasks() {
    const tasks = localStorage.getItem('focusflow_tasks');
    return tasks ? JSON.parse(tasks) : [];
  },

  setTasks(tasks) {
    localStorage.setItem('focusflow_tasks', JSON.stringify(tasks));
  },

  addTask(task) {
    const tasks = this.getTasks();
    const newTask = {
      ...task,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      status: 'todo'
    };
    tasks.unshift(newTask);
    this.setTasks(tasks);
    return newTask;
  },

  updateTask(taskId, updates) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.setTasks(tasks);
      return tasks[index];
    }
    return null;
  },

  deleteTask(taskId) {
    const tasks = this.getTasks();
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    this.setTasks(updatedTasks);
  },

  // Time Sessions Management
  getTimeSessions() {
    const sessions = localStorage.getItem('focusflow_time_sessions');
    return sessions ? JSON.parse(sessions) : [];
  },

  setTimeSessions(sessions) {
    localStorage.setItem('focusflow_time_sessions', JSON.stringify(sessions));
  },

  addTimeSession(session) {
    const sessions = this.getTimeSessions();
    const newSession = {
      ...session,
      id: Date.now().toString(),
      start_time: new Date().toISOString(),
      status: 'active'
    };
    sessions.unshift(newSession);
    this.setTimeSessions(sessions);
    return newSession;
  },

  updateTimeSession(sessionId, updates) {
    const sessions = this.getTimeSessions();
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates };
      this.setTimeSessions(sessions);
      return sessions[index];
    }
    return null;
  },

  // Initialize with sample data if empty
  initializeSampleData() {
    if (!this.getProjects().length) {
      const sampleProjects = [
        {
          id: '1',
          name: 'Personal Website',
          description: 'Building my portfolio website',
          color_hex: '#3B82F6',
          created_at: new Date().toISOString(),
          is_active: true
        },
        {
          id: '2',
          name: 'Mobile App',
          description: 'React Native productivity app',
          color_hex: '#10B981',
          created_at: new Date().toISOString(),
          is_active: true
        }
      ];
      this.setProjects(sampleProjects);
    }

    if (!this.getTasks().length) {
      const sampleTasks = [
        {
          id: '1',
          title: 'Design homepage layout',
          description: 'Create wireframes for the main page',
          project_id: '1',
          status: 'in_progress',
          priority: 'high',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Implement authentication',
          description: 'Add user login and registration',
          project_id: '2',
          status: 'todo',
          priority: 'medium',
          created_at: new Date().toISOString()
        }
      ];
      this.setTasks(sampleTasks);
    }

    if (!this.getTimeSessions().length) {
      const sampleSessions = [
        {
          id: '1',
          project_id: '1',
          task_id: '1',
          start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          end_time: new Date().toISOString(),
          duration_minutes: 120,
          status: 'completed',
          notes: 'Worked on layout design'
        }
      ];
      this.setTimeSessions(sampleSessions);
    }
  }
};
