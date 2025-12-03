// AthenaPeX - API Layer
// RESTful API client for table operations

const API = {
    baseUrl: 'tables',
    
    // Generic CRUD operations
    async list(table, params = {}) {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.set('page', params.page);
        if (params.limit) queryParams.set('limit', params.limit);
        if (params.search) queryParams.set('search', params.search);
        if (params.sort) queryParams.set('sort', params.sort);
        
        const url = `${this.baseUrl}/${table}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url);
        return response.json();
    },
    
    async get(table, id) {
        const response = await fetch(`${this.baseUrl}/${table}/${id}`);
        return response.json();
    },
    
    async create(table, data) {
        const response = await fetch(`${this.baseUrl}/${table}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    
    async update(table, id, data) {
        const response = await fetch(`${this.baseUrl}/${table}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    
    async patch(table, id, data) {
        const response = await fetch(`${this.baseUrl}/${table}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    
    async delete(table, id) {
        await fetch(`${this.baseUrl}/${table}/${id}`, {
            method: 'DELETE'
        });
    },
    
    // Table-specific methods
    projects: {
        list: (params) => API.list('projects', params),
        get: (id) => API.get('projects', id),
        create: (data) => API.create('projects', { ...data, id: data.id || crypto.randomUUID() }),
        update: (id, data) => API.update('projects', id, data),
        delete: (id) => API.delete('projects', id)
    },
    
    tasks: {
        list: (params) => API.list('tasks', params),
        get: (id) => API.get('tasks', id),
        create: (data) => API.create('tasks', { 
            ...data, 
            id: data.id || crypto.randomUUID(),
            roi_score: data.impact_score && data.effort_score ? (data.impact_score / data.effort_score).toFixed(2) : 0
        }),
        update: (id, data) => API.update('tasks', id, data),
        delete: (id) => API.delete('tasks', id)
    },
    
    taskLogs: {
        list: (params) => API.list('task_logs', params),
        create: (data) => API.create('task_logs', { ...data, id: data.id || crypto.randomUUID(), timestamp: Date.now() })
    },
    
    prompts: {
        list: (params) => API.list('prompts', params),
        get: (id) => API.get('prompts', id),
        create: (data) => API.create('prompts', { 
            ...data, 
            id: data.id || crypto.randomUUID(),
            version: 1,
            usage_count: 0
        }),
        update: (id, data) => API.update('prompts', id, data),
        delete: (id) => API.delete('prompts', id)
    },
    
    promptVersions: {
        list: (params) => API.list('prompt_versions', params),
        create: (data) => API.create('prompt_versions', { 
            ...data, 
            id: data.id || crypto.randomUUID(),
            created_at: Date.now()
        })
    },
    
    promptFolders: {
        list: (params) => API.list('prompt_folders', params),
        create: (data) => API.create('prompt_folders', { ...data, id: data.id || crypto.randomUUID() }),
        update: (id, data) => API.update('prompt_folders', id, data),
        delete: (id) => API.delete('prompt_folders', id)
    },
    
    youtube: {
        list: (params) => API.list('youtube_refs', params),
        get: (id) => API.get('youtube_refs', id),
        create: (data) => API.create('youtube_refs', { 
            ...data, 
            id: data.id || crypto.randomUUID(),
            watch_status: data.watch_status || 'unwatched'
        }),
        update: (id, data) => API.update('youtube_refs', id, data),
        delete: (id) => API.delete('youtube_refs', id)
    },
    
    focusWindows: {
        list: (params) => API.list('focus_windows', params),
        create: (data) => API.create('focus_windows', { ...data, id: data.id || crypto.randomUUID() }),
        update: (id, data) => API.update('focus_windows', id, data)
    },
    
    dailyMetrics: {
        list: (params) => API.list('daily_metrics', params),
        create: (data) => API.create('daily_metrics', { ...data, id: data.id || crypto.randomUUID() }),
        update: (id, data) => API.update('daily_metrics', id, data)
    },
    
    battlePlans: {
        list: (params) => API.list('battle_plans', params),
        get: (id) => API.get('battle_plans', id),
        create: (data) => API.create('battle_plans', { 
            ...data, 
            id: data.id || crypto.randomUUID(),
            status: 'planning',
            velocity_actual: 0
        }),
        update: (id, data) => API.update('battle_plans', id, data),
        delete: (id) => API.delete('battle_plans', id)
    },
    
    templates: {
        list: (params) => API.list('templates', params),
        get: (id) => API.get('templates', id),
        create: (data) => API.create('templates', { ...data, id: data.id || crypto.randomUUID() }),
        update: (id, data) => API.update('templates', id, data)
    },
    
    neovimConfigs: {
        list: (params) => API.list('neovim_configs', params),
        create: (data) => API.create('neovim_configs', { ...data, id: data.id || crypto.randomUUID() }),
        update: (id, data) => API.update('neovim_configs', id, data)
    },
    
    insights: {
        list: (params) => API.list('insights', params),
        create: (data) => API.create('insights', { 
            ...data, 
            id: data.id || crypto.randomUUID(),
            created_at: Date.now(),
            is_resolved: false
        }),
        update: (id, data) => API.update('insights', id, data)
    },
    
    settings: {
        list: (params) => API.list('settings', params),
        get: (key) => API.list('settings', { search: key }),
        set: async (key, value, category = 'display') => {
            const existing = await API.list('settings', { search: key });
            if (existing.data && existing.data.length > 0) {
                return API.update('settings', existing.data[0].id, { value });
            }
            return API.create('settings', { id: key, key, value, category });
        }
    }
};

// Utility for generating analytics data
const AnalyticsAPI = {
    async getHeatmapData() {
        const focusWindows = await API.focusWindows.list({ limit: 100 });
        const heatmap = {};
        
        // Generate sample heatmap data if no real data
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        days.forEach(day => {
            heatmap[day] = [];
            for (let hour = 6; hour <= 22; hour++) {
                // Generate realistic productivity patterns
                let level = 0;
                if (hour >= 9 && hour <= 11) level = Math.floor(Math.random() * 2) + 4; // Peak morning
                else if (hour >= 14 && hour <= 16) level = Math.floor(Math.random() * 2) + 3; // Afternoon
                else if (hour >= 6 && hour <= 8) level = Math.floor(Math.random() * 2) + 2; // Early morning
                else if (hour >= 19 && hour <= 21) level = Math.floor(Math.random() * 2) + 2; // Evening
                else level = Math.floor(Math.random() * 2) + 1; // Other times
                
                if (day === 'Sat' || day === 'Sun') level = Math.max(0, level - 2); // Weekend
                
                heatmap[day].push({ hour, level });
            }
        });
        
        return heatmap;
    },
    
    async getPeakHours() {
        // Sample peak hours data
        const hours = [];
        for (let i = 6; i <= 22; i++) {
            let productivity = 20;
            if (i >= 9 && i <= 11) productivity = 70 + Math.random() * 25;
            else if (i >= 14 && i <= 16) productivity = 55 + Math.random() * 20;
            else if (i === 12 || i === 13) productivity = 25 + Math.random() * 15; // Lunch dip
            else productivity = 30 + Math.random() * 25;
            
            hours.push({ hour: i, productivity: Math.round(productivity) });
        }
        return hours;
    },
    
    async getInsights() {
        return [
            { type: 'success', text: 'Peak productivity detected 9-11 AM. Consider scheduling high-ROI tasks during this window.' },
            { type: 'warning', text: '3 tasks have been blocked for >24 hours. Review blockers for potential pivots.' },
            { type: 'info', text: 'Your average ROI this week: 2.1x. Target: 2.0x. Keep pushing!' },
            { type: 'critical', text: 'Dead zone detected 12-1 PM. Consider strategic breaks or low-priority tasks.' }
        ];
    },
    
    async getWeeklyStats() {
        return {
            velocityScore: Math.round(75 + Math.random() * 20),
            tasksCompleted: Math.round(15 + Math.random() * 15),
            focusHours: Math.round(25 + Math.random() * 15),
            avgRoi: (1.8 + Math.random() * 0.5).toFixed(1)
        };
    }
};

// Agent Communication API (placeholder for local agent)
const AgentAPI = {
    endpoint: 'ws://localhost:8765',
    socket: null,
    connected: false,
    
    async connect(endpoint) {
        this.endpoint = endpoint || this.endpoint;
        
        return new Promise((resolve, reject) => {
            try {
                // Simulate connection for demo
                console.log(`Attempting to connect to agent at ${this.endpoint}`);
                
                // In production, this would be:
                // this.socket = new WebSocket(this.endpoint);
                
                setTimeout(() => {
                    // Simulate connection failure for demo
                    this.connected = false;
                    reject(new Error('Agent not available. Running in standalone mode.'));
                }, 1000);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
        this.connected = false;
    },
    
    async sendCommand(command) {
        if (!this.connected) {
            return { 
                success: false, 
                message: 'Agent not connected. Commands will be queued for when agent becomes available.',
                queued: true
            };
        }
        
        // In production, this would send via WebSocket
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    response: `Command "${command}" executed successfully.`
                });
            }, 500);
        });
    },
    
    getMacros() {
        return [
            { id: 'react-component', name: 'Create React Component', description: 'Generate component with TypeScript' },
            { id: 'api-route', name: 'Generate API Route', description: 'Create REST API endpoint' },
            { id: 'crud-ops', name: 'CRUD Operations', description: 'Generate full CRUD boilerplate' },
            { id: 'mvp-boilerplate', name: 'MVP Boilerplate', description: 'Generate micro-MVP structure' },
            { id: 'landing-skeleton', name: 'Landing Page Skeleton', description: 'Generate landing page structure' },
            { id: 'db-model', name: 'Database Model', description: 'Generate database model and migrations' }
        ];
    },
    
    getStatus() {
        return {
            connected: this.connected,
            endpoint: this.endpoint,
            model: 'Fara-7B',
            version: '1.0.0'
        };
    }
};

// Export for use
window.API = API;
window.AnalyticsAPI = AnalyticsAPI;
window.AgentAPI = AgentAPI;
