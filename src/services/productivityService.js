import { localStorageService } from '../lib/localStorage';

export const productivityService = {
  // Projects CRUD
  async getProjects() {
    try {
      const projects = localStorageService.getProjects();
      return projects.map(project => ({
        ...project,
        owner: { id: '1', full_name: 'Demo User', email: 'demo@example.com' }
      }));
    } catch (error) {
      throw error;
    }
  },

  async createProject(projectData) {
    try {
      return localStorageService.addProject(projectData);
    } catch (error) {
      throw error;
    }
  },

  async updateProject(projectId, updates) {
    try {
      return localStorageService.updateProject(projectId, updates);
    } catch (error) {
      throw error;
    }
  },

  async deleteProject(projectId) {
    try {
      localStorageService.deleteProject(projectId);
    } catch (error) {
      throw error;
    }
  },

  // Tasks CRUD
  async getTasks(projectId = null) {
    try {
      let tasks = localStorageService.getTasks();

      if (projectId) {
        tasks = tasks.filter(task => task.project_id === projectId);
      }

      return tasks.map(task => ({
        ...task,
        project: { id: task.project_id, name: 'Demo Project', color_hex: '#3B82F6' },
        assignee: { id: '1', full_name: 'Demo User', email: 'demo@example.com' }
      }));
    } catch (error) {
      throw error;
    }
  },

  async createTask(taskData) {
    try {
      const task = localStorageService.addTask(taskData);
      return {
        ...task,
        project: { id: task.project_id, name: 'Demo Project', color_hex: '#3B82F6' },
        assignee: { id: '1', full_name: 'Demo User', email: 'demo@example.com' }
      };
    } catch (error) {
      throw error;
    }
  },

  async updateTask(taskId, updates) {
    try {
      const task = localStorageService.updateTask(taskId, updates);
      return task ? {
        ...task,
        project: { id: task.project_id, name: 'Demo Project', color_hex: '#3B82F6' },
        assignee: { id: '1', full_name: 'Demo User', email: 'demo@example.com' }
      } : null;
    } catch (error) {
      throw error;
    }
  },

  async deleteTask(taskId) {
    try {
      localStorageService.deleteTask(taskId);
    } catch (error) {
      throw error;
    }
  },

  // Time Sessions
  async getTimeSessions(userId = null, limit = 50) {
    try {
      let sessions = localStorageService.getTimeSessions();

      if (userId) {
        sessions = sessions.filter(session => session.user_id === userId);
      }

      return sessions.slice(0, limit).map(session => ({
        ...session,
        project: { id: session.project_id, name: 'Demo Project', color_hex: '#3B82F6' },
        task: { id: session.task_id, title: 'Demo Task', status: 'todo' }
      }));
    } catch (error) {
      throw error;
    }
  },

  async startTimeSession(sessionData) {
    try {
      const session = localStorageService.addTimeSession(sessionData);
      return {
        ...session,
        project: { id: session.project_id, name: 'Demo Project', color_hex: '#3B82F6' },
        task: { id: session.task_id, title: 'Demo Task', status: 'todo' }
      };
    } catch (error) {
      throw error;
    }
  },

  async stopTimeSession(sessionId, notes = '') {
    try {
        const sessions = localStorageService.getTimeSessions();
        const session = sessions.find(s => s.id === sessionId);
        if (!session) return null;

        const endTime = new Date();
        const startTime = new Date(session.start_time);
        const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

        const updatedSession = localStorageService.updateTimeSession(sessionId, {
            end_time: endTime.toISOString(),
            status: 'completed',
            notes: notes,
            duration_minutes: durationMinutes
        });

        return updatedSession ? {
            ...updatedSession,
            project: { id: updatedSession.project_id, name: 'Demo Project', color_hex: '#3B82F6' },
            task: { id: updatedSession.task_id, title: 'Demo Task', status: 'todo' }
        } : null;
    } catch (error) {
        throw error;
    }
},

  // Analytics functions
  async getProductivityStats(userId, dateRange = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);

      const sessions = localStorageService.getTimeSessions();
      const filteredSessions = sessions.filter(session =>
        session.user_id === userId &&
        session.status === 'completed' &&
        new Date(session.start_time) >= startDate
      );

      return filteredSessions.map(session => ({
        duration_minutes: session.duration_minutes || 0,
        start_time: session.start_time,
        project: { name: 'Demo Project' }
      }));
    } catch (error) {
      throw error;
    }
  },

  async getDashboardSummary(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get today's time sessions
      const sessions = localStorageService.getTimeSessions();
      const todaySessions = sessions.filter(session =>
        session.user_id === userId &&
        session.status === 'completed' &&
        session.start_time.startsWith(today)
      );

      // Get active tasks count
      const tasks = localStorageService.getTasks();
      const activeTasks = tasks.filter(task =>
        task.assigned_to === userId &&
        ['todo', 'in_progress'].includes(task.status)
      ).length;

      // Get completed tasks this week
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      const completedThisWeek = tasks.filter(task =>
        task.assigned_to === userId &&
        task.status === 'completed' &&
        task.completed_at &&
        new Date(task.completed_at) >= weekStart
      ).length;

      // Calculate total time today
      const totalTimeToday = todaySessions.reduce((sum, session) =>
        sum + (session.duration_minutes || 0), 0);

      return {
        totalTimeToday: Math.round(totalTimeToday / 60 * 10) / 10, // Hours with 1 decimal
        activeTasks: activeTasks || 0,
        completedThisWeek: completedThisWeek || 0
      };
    } catch (error) {
      throw error;
    }
  }
};

export default productivityService;
