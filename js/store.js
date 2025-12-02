// AthenaPeX - State Management Store
// Client-side state management with localStorage persistence

class Store {
    constructor() {
        this.state = {
            currentModule: 'analytics',
            selectedProject: null,
            selectedTask: null,
            selectedPrompt: null,
            selectedFolder: null,
            activeBattlePlan: null,
            focusSession: null,
            agentConnected: false,
            
            // Cached data
            projects: [],
            tasks: [],
            prompts: [],
            promptFolders: [],
            youtubeRefs: [],
            templates: [],
            battlePlans: [],
            insights: [],
            
            // UI state
            isLoading: false,
            modalOpen: false,
            toasts: []
        };
        
        this.listeners = new Map();
        this.loadFromStorage();
    }
    
    // State management
    get(key) {
        return this.state[key];
    }
    
    set(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;
        this.notify(key, value, oldValue);
        this.saveToStorage();
    }
    
    update(key, updater) {
        const oldValue = this.state[key];
        const newValue = typeof updater === 'function' ? updater(oldValue) : updater;
        this.state[key] = newValue;
        this.notify(key, newValue, oldValue);
        this.saveToStorage();
    }
    
    // Event system
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);
        
        return () => {
            this.listeners.get(key).delete(callback);
        };
    }
    
    notify(key, newValue, oldValue) {
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(callback => {
                try {
                    callback(newValue, oldValue);
                } catch (error) {
                    console.error(`Error in listener for ${key}:`, error);
                }
            });
        }
    }
    
    // Persistence
    saveToStorage() {
        const persistKeys = ['selectedProject', 'selectedFolder', 'activeBattlePlan', 'currentModule'];
        const data = {};
        persistKeys.forEach(key => {
            data[key] = this.state[key];
        });
        localStorage.setItem('athenaPex_state', JSON.stringify(data));
    }
    
    loadFromStorage() {
        try {
            const data = localStorage.getItem('athenaPex_state');
            if (data) {
                const parsed = JSON.parse(data);
                Object.assign(this.state, parsed);
            }
        } catch (error) {
            console.error('Error loading state from storage:', error);
        }
    }
    
    // Helper methods
    addToast(toast) {
        const id = Date.now().toString();
        const newToast = { ...toast, id };
        this.update('toasts', toasts => [...toasts, newToast]);
        
        setTimeout(() => {
            this.removeToast(id);
        }, toast.duration || 4000);
        
        return id;
    }
    
    removeToast(id) {
        this.update('toasts', toasts => toasts.filter(t => t.id !== id));
    }
    
    setLoading(isLoading) {
        this.set('isLoading', isLoading);
    }
}

// Productivity Rules Engine
class ENTJRulesEngine {
    constructor(store) {
        this.store = store;
        this.rules = [
            {
                id: 'low-roi-alert',
                name: 'Low ROI Alert',
                condition: (task) => task.roi_score < 1.5 && this.getTaskAge(task) > 48 * 60 * 60 * 1000,
                action: (task) => this.createInsight('warning', `Task "${task.title}" has low ROI (${task.roi_score}x) and has been pending for >48 hours. Consider eliminating.`)
            },
            {
                id: 'blocker-pivot',
                name: 'Blocker Pivot Trigger',
                condition: (task) => task.status === 'blocked' && task.blockers?.length > 0 && this.getBlockerAge(task) > 24 * 60 * 60 * 1000,
                action: (task) => this.createInsight('critical', `Task "${task.title}" has been blocked for >24 hours. Suggest pivot or escalation.`)
            },
            {
                id: 'high-roi-recommendation',
                name: 'High ROI Switch',
                condition: (task) => task.roi_score > 3 && task.status === 'pending',
                action: (task) => this.createInsight('success', `High-ROI task detected: "${task.title}" (${task.roi_score}x). Consider prioritizing.`)
            }
        ];
    }
    
    getTaskAge(task) {
        return Date.now() - (task.created_at || Date.now());
    }
    
    getBlockerAge(task) {
        // Simplified - would track actual blocker timestamp in production
        return Date.now() - (task.updated_at || task.created_at || Date.now());
    }
    
    async createInsight(severity, content) {
        const insight = {
            type: severity === 'critical' ? 'warning' : severity === 'success' ? 'optimization' : 'productivity',
            title: this.getTitleForSeverity(severity),
            content,
            severity,
            is_resolved: false
        };
        
        try {
            await API.insights.create(insight);
            this.store.addToast({
                type: severity === 'critical' ? 'error' : severity,
                title: insight.title,
                message: content.substring(0, 100) + (content.length > 100 ? '...' : '')
            });
        } catch (error) {
            console.error('Error creating insight:', error);
        }
    }
    
    getTitleForSeverity(severity) {
        const titles = {
            'warning': 'ENTJ Alert',
            'critical': 'Pivot Required',
            'success': 'High ROI Opportunity',
            'info': 'Productivity Insight'
        };
        return titles[severity] || 'Insight';
    }
    
    async evaluateTasks(tasks) {
        for (const task of tasks) {
            for (const rule of this.rules) {
                if (rule.condition(task)) {
                    await rule.action(task);
                }
            }
        }
    }
    
    calculateROI(impact, effort) {
        if (!effort || effort === 0) return 0;
        return (impact / effort).toFixed(2);
    }
    
    getPriorityScore(task) {
        // ENTJ prioritization: Impact > Effort, ROI > Aesthetics
        const roiWeight = 0.4;
        const impactWeight = 0.3;
        const urgencyWeight = 0.2;
        const effortWeight = 0.1;
        
        const roi = task.roi_score || 1;
        const impact = task.impact_score || 5;
        const urgency = this.getUrgencyScore(task);
        const effort = 10 - (task.effort_score || 5); // Invert effort
        
        return (roi * roiWeight) + (impact * impactWeight) + (urgency * urgencyWeight) + (effort * effortWeight);
    }
    
    getUrgencyScore(task) {
        if (!task.due_date) return 5;
        const daysUntilDue = (new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24);
        if (daysUntilDue < 0) return 10; // Overdue
        if (daysUntilDue < 1) return 9;
        if (daysUntilDue < 3) return 7;
        if (daysUntilDue < 7) return 5;
        return 3;
    }
    
    sortByPriority(tasks) {
        return [...tasks].sort((a, b) => this.getPriorityScore(b) - this.getPriorityScore(a));
    }
    
    getProductivityRecommendation(hour) {
        // Based on typical ENTJ productivity patterns
        const recommendations = {
            morning: { hours: [6, 7, 8], activity: 'Planning and strategy work', intensity: 'medium' },
            peakMorning: { hours: [9, 10, 11], activity: 'High-ROI deep work', intensity: 'high' },
            lunch: { hours: [12, 13], activity: 'Strategic breaks, light tasks', intensity: 'low' },
            peakAfternoon: { hours: [14, 15, 16], activity: 'Complex problem solving', intensity: 'high' },
            lateAfternoon: { hours: [17, 18], activity: 'Communication, meetings', intensity: 'medium' },
            evening: { hours: [19, 20, 21], activity: 'Learning, side projects', intensity: 'medium' },
            night: { hours: [22, 23, 0, 1, 2, 3, 4, 5], activity: 'Rest for maximum productivity', intensity: 'rest' }
        };
        
        for (const [period, data] of Object.entries(recommendations)) {
            if (data.hours.includes(hour)) {
                return { period, ...data };
            }
        }
        
        return { period: 'other', activity: 'Flexible work', intensity: 'medium' };
    }
}

// Focus Session Manager
class FocusManager {
    constructor(store) {
        this.store = store;
        this.timer = null;
        this.startTime = null;
        this.pausedTime = 0;
        this.isPaused = false;
    }
    
    start(duration = 25 * 60, taskName = 'Deep Work Session') {
        this.duration = duration;
        this.taskName = taskName;
        this.startTime = Date.now();
        this.pausedTime = 0;
        this.isPaused = false;
        this.remaining = duration;
        
        this.store.set('focusSession', {
            active: true,
            taskName,
            duration,
            startTime: this.startTime
        });
        
        this.tick();
        this.timer = setInterval(() => this.tick(), 1000);
        
        return this.startTime;
    }
    
    tick() {
        if (this.isPaused) return;
        
        const elapsed = Math.floor((Date.now() - this.startTime - this.pausedTime) / 1000);
        this.remaining = Math.max(0, this.duration - elapsed);
        
        if (this.remaining <= 0) {
            this.complete();
        } else {
            this.updateDisplay();
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.remaining / 60);
        const seconds = this.remaining % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const timerEl = document.getElementById('focusTimer');
        if (timerEl) timerEl.textContent = display;
        
        document.title = `${display} - AthenaPeX Focus`;
    }
    
    pause() {
        if (this.isPaused) {
            // Resume
            this.pausedTime += Date.now() - this.pauseStart;
            this.isPaused = false;
            document.getElementById('focusPauseBtn').innerHTML = '<i class="fas fa-pause mr-2"></i> Pause';
        } else {
            // Pause
            this.pauseStart = Date.now();
            this.isPaused = true;
            document.getElementById('focusPauseBtn').innerHTML = '<i class="fas fa-play mr-2"></i> Resume';
        }
    }
    
    async complete() {
        clearInterval(this.timer);
        
        const durationMinutes = Math.round((Date.now() - this.startTime - this.pausedTime) / 60000);
        
        // Save focus window
        try {
            await API.focusWindows.create({
                start_time: this.startTime,
                end_time: Date.now(),
                duration_minutes: durationMinutes,
                productivity_score: 8, // Could be user-rated
                task_ids: [],
                notes: `Completed ${this.taskName}`,
                interruptions: 0
            });
        } catch (error) {
            console.error('Error saving focus window:', error);
        }
        
        this.store.set('focusSession', null);
        document.title = 'AthenaPeX - ENTJ Productivity System';
        
        // Show completion notification
        this.store.addToast({
            type: 'success',
            title: 'Focus Session Complete!',
            message: `Great work! You focused for ${durationMinutes} minutes.`
        });
        
        // Play completion sound (optional)
        this.playCompletionSound();
        
        return durationMinutes;
    }
    
    end() {
        clearInterval(this.timer);
        this.store.set('focusSession', null);
        document.title = 'AthenaPeX - ENTJ Productivity System';
    }
    
    playCompletionSound() {
        // Create a simple beep using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            // Audio not supported or blocked
        }
    }
}

// Initialize global instances
window.store = new Store();
window.rulesEngine = new ENTJRulesEngine(window.store);
window.focusManager = new FocusManager(window.store);
