// AthenaPeX - Main Application
// Application initialization and event handlers

// ====== Initialization ======
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    // Load initial module
    const currentModule = store.get('currentModule') || 'analytics';
    showModule(currentModule);
    
    // Initialize keyboard shortcuts
    initKeyboardShortcuts();
    
    // Subscribe to toast changes
    store.subscribe('toasts', renderToasts);
    
    // Load initial data
    await loadAllData();
    
    // Check agent status
    updateAgentStatus();
    
    console.log('AthenaPeX initialized');
}

async function loadAllData() {
    try {
        store.setLoading(true);
        
        // Load all data in parallel
        const [projects, tasks, prompts, folders, youtube, templates, battlePlans] = await Promise.all([
            API.projects.list({ limit: 100 }).catch(() => ({ data: [] })),
            API.tasks.list({ limit: 100 }).catch(() => ({ data: [] })),
            API.prompts.list({ limit: 100 }).catch(() => ({ data: [] })),
            API.promptFolders.list({ limit: 100 }).catch(() => ({ data: [] })),
            API.youtube.list({ limit: 100 }).catch(() => ({ data: [] })),
            API.templates.list({ limit: 100 }).catch(() => ({ data: [] })),
            API.battlePlans.list({ limit: 100 }).catch(() => ({ data: [] }))
        ]);
        
        store.set('projects', projects.data || []);
        store.set('tasks', tasks.data || []);
        store.set('prompts', prompts.data || []);
        store.set('promptFolders', folders.data || []);
        store.set('youtubeRefs', youtube.data || []);
        store.set('templates', templates.data || []);
        store.set('battlePlans', battlePlans.data || []);
        
        // Render current module
        renderCurrentModule();
        
    } catch (error) {
        console.error('Error loading data:', error);
        store.addToast({
            type: 'error',
            title: 'Data Load Error',
            message: 'Some data could not be loaded. Working in offline mode.'
        });
    } finally {
        store.setLoading(false);
    }
}

// ====== Module Navigation ======
function showModule(moduleName) {
    // Hide all modules
    document.querySelectorAll('.module').forEach(m => m.classList.add('hidden'));
    
    // Show target module
    const targetModule = document.getElementById(`module-${moduleName}`);
    if (targetModule) {
        targetModule.classList.remove('hidden');
    }
    
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.module === moduleName);
    });
    
    // Update state
    store.set('currentModule', moduleName);
    
    // Render module content
    renderModule(moduleName);
}

function renderCurrentModule() {
    renderModule(store.get('currentModule'));
}

function renderModule(moduleName) {
    switch (moduleName) {
        case 'analytics':
            renderAnalytics();
            break;
        case 'projects':
            renderProjects();
            break;
        case 'tasks':
            renderTasks();
            break;
        case 'prompts':
            renderPrompts();
            break;
        case 'battleplan':
            renderBattlePlan();
            break;
        case 'youtube':
            renderYouTube();
            break;
        case 'templates':
            renderTemplates();
            break;
        case 'neovim':
            // Static content, no rendering needed
            break;
        case 'agent':
            renderAgent();
            break;
        case 'rules':
            // Static content, no rendering needed
            break;
    }
}

// ====== Analytics Rendering ======
async function renderAnalytics() {
    // Get analytics data
    const [heatmap, peakHours, insights, stats] = await Promise.all([
        AnalyticsAPI.getHeatmapData(),
        AnalyticsAPI.getPeakHours(),
        AnalyticsAPI.getInsights(),
        AnalyticsAPI.getWeeklyStats()
    ]);
    
    // Update stats cards
    document.getElementById('velocityScore').textContent = stats.velocityScore;
    document.getElementById('tasksCompleted').textContent = stats.tasksCompleted;
    document.getElementById('totalFocusTime').textContent = `${stats.focusHours}h`;
    document.getElementById('avgRoi').textContent = `${stats.avgRoi}x`;
    
    // Render heatmap
    const heatmapContainer = document.getElementById('heatmapContainer');
    heatmapContainer.innerHTML = Object.entries(heatmap)
        .map(([day, hours]) => Components.heatmapRow(day, hours))
        .join('');
    
    // Render peak hours chart
    document.getElementById('peakHoursChart').innerHTML = Components.peakHoursChart(peakHours);
    
    // Render insights
    document.getElementById('insightsContainer').innerHTML = insights
        .map(i => Components.insightItem(i))
        .join('');
    
    // Render focus windows
    try {
        const focusWindows = await API.focusWindows.list({ limit: 5 });
        const focusWindowsList = document.getElementById('focusWindowsList');
        
        if (focusWindows.data && focusWindows.data.length > 0) {
            focusWindowsList.innerHTML = focusWindows.data
                .map(w => Components.focusWindowItem(w))
                .join('');
        } else {
            focusWindowsList.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-brain text-3xl mb-2"></i>
                    <p>No focus sessions today</p>
                    <button onclick="startFocusSession()" class="mt-2 text-sm text-pex-primary hover:text-pex-primary-hover">
                        Start your first session
                    </button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading focus windows:', error);
    }
    
    // Update sidebar stats
    updateSidebarStats();
}

function updateSidebarStats() {
    const tasks = store.get('tasks') || [];
    const completed = tasks.filter(t => t.status === 'completed').length;
    const total = tasks.length;
    
    document.getElementById('tasksDone').textContent = `${completed}/${total}`;
    
    // Calculate today's ROI (simplified)
    const completedTasks = tasks.filter(t => t.status === 'completed');
    if (completedTasks.length > 0) {
        const avgRoi = completedTasks.reduce((sum, t) => sum + (parseFloat(t.roi_score) || 0), 0) / completedTasks.length;
        document.getElementById('todayRoi').textContent = `${avgRoi.toFixed(1)}x`;
    }
}

// ====== Projects Rendering ======
function renderProjects(filter = 'all') {
    const projects = store.get('projects') || [];
    const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);
    
    const grid = document.getElementById('projectsGrid');
    
    if (filtered.length === 0) {
        grid.innerHTML = Components.emptyState('fa-folder-open', 'No Projects Yet', 'Create your first project to start tracking your work.');
        return;
    }
    
    grid.innerHTML = filtered.map(p => Components.projectCard(p)).join('');
}

// ====== Tasks Rendering ======
function renderTasks() {
    const tasks = store.get('tasks') || [];
    
    // Sort by ROI using rules engine
    const sortedTasks = rulesEngine.sortByPriority(tasks);
    
    // Group by status
    const pending = sortedTasks.filter(t => t.status === 'pending');
    const inProgress = sortedTasks.filter(t => t.status === 'in_progress');
    const blocked = sortedTasks.filter(t => t.status === 'blocked');
    const completed = sortedTasks.filter(t => t.status === 'completed');
    
    // Update counts
    document.getElementById('pendingCount').textContent = pending.length;
    document.getElementById('progressCount').textContent = inProgress.length;
    document.getElementById('blockedCount').textContent = blocked.length;
    document.getElementById('completedCount').textContent = completed.length;
    
    // Render columns
    document.getElementById('pendingTasks').innerHTML = pending.length > 0 
        ? pending.map(t => Components.taskCard(t)).join('') 
        : '<p class="text-center text-gray-500 text-sm py-4">No pending tasks</p>';
        
    document.getElementById('progressTasks').innerHTML = inProgress.length > 0 
        ? inProgress.map(t => Components.taskCard(t)).join('') 
        : '<p class="text-center text-gray-500 text-sm py-4">No tasks in progress</p>';
        
    document.getElementById('blockedTasks').innerHTML = blocked.length > 0 
        ? blocked.map(t => Components.taskCard(t)).join('') 
        : '<p class="text-center text-gray-500 text-sm py-4">No blocked tasks</p>';
        
    document.getElementById('completedTasks').innerHTML = completed.length > 0 
        ? completed.slice(0, 10).map(t => Components.taskCard(t)).join('') 
        : '<p class="text-center text-gray-500 text-sm py-4">No completed tasks</p>';
    
    // Evaluate tasks with rules engine
    rulesEngine.evaluateTasks(tasks);
}

// ====== Prompts Rendering ======
function renderPrompts() {
    const folders = store.get('promptFolders') || [];
    const prompts = store.get('prompts') || [];
    const selectedFolder = store.get('selectedFolder');
    const selectedPrompt = store.get('selectedPrompt');
    
    // Update folder count
    document.getElementById('folderCount').textContent = folders.length;
    
    // Render folders
    const foldersContainer = document.getElementById('promptFolders');
    if (folders.length === 0) {
        foldersContainer.innerHTML = `
            <div class="text-center text-gray-500 py-4">
                <p class="text-sm">No folders yet</p>
                <button onclick="openFolderModal()" class="text-xs text-pex-primary hover:text-pex-primary-hover mt-1">Create one</button>
            </div>
        `;
    } else {
        foldersContainer.innerHTML = folders.map(f => Components.folderItem(f, f.id === selectedFolder)).join('');
        
        // Update folder counts
        folders.forEach(f => {
            const count = prompts.filter(p => p.folder_id === f.id).length;
            const countEl = document.getElementById(`folder-count-${f.id}`);
            if (countEl) countEl.textContent = count;
        });
    }
    
    // Filter prompts by selected folder
    const filteredPrompts = selectedFolder 
        ? prompts.filter(p => p.folder_id === selectedFolder)
        : prompts;
    
    // Update prompt count
    document.getElementById('promptCount').textContent = filteredPrompts.length;
    
    // Render prompts
    const promptsContainer = document.getElementById('promptsList');
    if (filteredPrompts.length === 0) {
        promptsContainer.innerHTML = `
            <div class="text-center text-gray-500 py-4">
                <p class="text-sm">${selectedFolder ? 'No prompts in this folder' : 'Select a folder'}</p>
            </div>
        `;
    } else {
        promptsContainer.innerHTML = filteredPrompts.map(p => Components.promptItem(p, p.id === selectedPrompt)).join('');
    }
    
    // Load selected prompt into editor
    if (selectedPrompt) {
        const prompt = prompts.find(p => p.id === selectedPrompt);
        if (prompt) {
            document.getElementById('editorTitle').textContent = prompt.name;
            document.getElementById('promptEditor').value = prompt.content || '';
        }
    }
}

// ====== Battle Plan Rendering ======
function renderBattlePlan() {
    const battlePlans = store.get('battlePlans') || [];
    const activePlan = battlePlans.find(p => p.status === 'active') || battlePlans[0];
    
    if (activePlan) {
        document.getElementById('battlePlanName').textContent = activePlan.name;
        document.getElementById('battlePlanDates').textContent = `${Components.formatDate(activePlan.start_date)} - ${Components.formatDate(activePlan.end_date)}`;
        document.getElementById('velocityActual').textContent = activePlan.velocity_actual || 0;
        document.getElementById('velocityTarget').textContent = activePlan.velocity_target || 0;
        
        // Render objectives
        const objectives = activePlan.objectives || [];
        document.getElementById('battleObjectives').innerHTML = objectives.length > 0
            ? objectives.map((o, i) => Components.objectiveItem(o, i)).join('')
            : '<p class="text-gray-500 text-sm">No objectives defined</p>';
    }
    
    // Render high ROI tasks
    const tasks = store.get('tasks') || [];
    const highRoiTasks = tasks
        .filter(t => t.status !== 'completed' && parseFloat(t.roi_score) >= 2)
        .sort((a, b) => parseFloat(b.roi_score) - parseFloat(a.roi_score))
        .slice(0, 5);
    
    document.getElementById('highRoiTasks').innerHTML = highRoiTasks.length > 0
        ? highRoiTasks.map(t => Components.highRoiTask(t)).join('')
        : '<p class="text-gray-500 text-sm text-center py-4">No high-ROI tasks found</p>';
    
    // Render blockers
    const blockedTasks = tasks.filter(t => t.status === 'blocked');
    const blockers = blockedTasks.flatMap(t => (t.blockers || []).map(b => ({ description: b, task: t.title })));
    
    document.getElementById('blockersList').innerHTML = blockers.length > 0
        ? blockers.map(b => Components.blockerItem(b)).join('')
        : '<p class="text-gray-500 text-sm text-center py-4">No active blockers</p>';
}

// ====== YouTube Rendering ======
function renderYouTube(filter = 'all') {
    const videos = store.get('youtubeRefs') || [];
    const filtered = filter === 'all' ? videos : videos.filter(v => v.watch_status === filter);
    
    const grid = document.getElementById('youtubeGrid');
    
    if (filtered.length === 0) {
        grid.innerHTML = Components.emptyState('fa-youtube', 'No Videos Yet', 'Add your first YouTube reference to track valuable content.');
        return;
    }
    
    grid.innerHTML = filtered.map(v => Components.youtubeCard(v)).join('');
}

// ====== Templates Rendering ======
function renderTemplates(filter = 'all') {
    const templates = store.get('templates') || [];
    const filtered = filter === 'all' ? templates : templates.filter(t => t.category === filter);
    
    const grid = document.getElementById('templatesGrid');
    
    if (filtered.length === 0) {
        grid.innerHTML = Components.emptyState('fa-file-code', 'No Templates', 'Templates will appear here.');
        return;
    }
    
    grid.innerHTML = filtered.map(t => Components.templateCard(t)).join('');
}

// ====== Agent Rendering ======
function renderAgent() {
    const status = AgentAPI.getStatus();
    
    document.getElementById('agentConnectionStatus').textContent = status.connected ? 'Connected' : 'Disconnected';
    document.getElementById('agentConnectionStatus').className = status.connected ? 'text-pex-success' : 'text-pex-error';
    document.getElementById('agentConnectBtn').innerHTML = status.connected 
        ? '<i class="fas fa-unlink"></i> Disconnect'
        : '<i class="fas fa-plug"></i> Connect';
}

function updateAgentStatus() {
    const status = AgentAPI.getStatus();
    const dot = document.getElementById('agentDot');
    const text = document.getElementById('agentText');
    
    if (status.connected) {
        dot.className = 'w-2 h-2 rounded-full bg-pex-success';
        text.textContent = 'Agent Online';
    } else {
        dot.className = 'w-2 h-2 rounded-full bg-gray-500';
        text.textContent = 'Agent Offline';
    }
}

// ====== Modal Functions ======
function openModal(content) {
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('modalOverlay').classList.remove('hidden');
    store.set('modalOpen', true);
}

function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
    store.set('modalOpen', false);
}

// Project Modal
function openProjectModal() {
    const content = Components.modal('New Project', `
        ${Components.formGroup('Project Name', '<input type="text" id="projectName" class="form-input" placeholder="Enter project name">', 'projectName')}
        ${Components.formGroup('Description', '<textarea id="projectDesc" class="form-textarea h-24" placeholder="Project description"></textarea>', 'projectDesc')}
        <div class="grid grid-cols-2 gap-4">
            ${Components.formGroup('Priority', `
                <select id="projectPriority" class="form-select">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
            `, 'projectPriority')}
            ${Components.formGroup('Impact Score', '<input type="number" id="projectImpact" class="form-input" min="1" max="10" value="5">', 'projectImpact')}
        </div>
    `, `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="createProject()">Create Project</button>
    `);
    openModal(content);
}

async function createProject() {
    const name = document.getElementById('projectName').value;
    const description = document.getElementById('projectDesc').value;
    const priority = document.getElementById('projectPriority').value;
    const impact_score = parseInt(document.getElementById('projectImpact').value) || 5;
    
    if (!name.trim()) {
        store.addToast({ type: 'error', title: 'Error', message: 'Project name is required' });
        return;
    }
    
    try {
        const project = await API.projects.create({
            name,
            description,
            priority,
            impact_score,
            status: 'active',
            progress: 0,
            roi_score: impact_score / 5 // Initial estimate
        });
        
        store.update('projects', projects => [...projects, project]);
        closeModal();
        renderProjects();
        store.addToast({ type: 'success', title: 'Success', message: 'Project created successfully' });
    } catch (error) {
        store.addToast({ type: 'error', title: 'Error', message: 'Failed to create project' });
    }
}

// Task Modal
function openTaskModal() {
    const projects = store.get('projects') || [];
    const projectOptions = projects.map(p => `<option value="${p.id}">${Components.escapeHtml(p.name)}</option>`).join('');
    
    const content = Components.modal('New Task', `
        ${Components.formGroup('Task Title', '<input type="text" id="taskTitle" class="form-input" placeholder="Enter task title">', 'taskTitle')}
        ${Components.formGroup('Description', '<textarea id="taskDesc" class="form-textarea h-20" placeholder="Task description"></textarea>', 'taskDesc')}
        ${Components.formGroup('Project', `<select id="taskProject" class="form-select"><option value="">No Project</option>${projectOptions}</select>`, 'taskProject')}
        <div class="grid grid-cols-3 gap-4">
            ${Components.formGroup('Priority', `
                <select id="taskPriority" class="form-select">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
            `, 'taskPriority')}
            ${Components.formGroup('Impact (1-10)', '<input type="number" id="taskImpact" class="form-input" min="1" max="10" value="5">', 'taskImpact')}
            ${Components.formGroup('Effort (1-10)', '<input type="number" id="taskEffort" class="form-input" min="1" max="10" value="5">', 'taskEffort')}
        </div>
        <div class="mt-2 p-3 bg-pex-tertiary rounded-lg">
            <span class="text-sm text-gray-400">Estimated ROI: </span>
            <span class="font-bold text-pex-success" id="taskRoiPreview">1.0x</span>
        </div>
    `, `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="createTask()">Create Task</button>
    `);
    openModal(content);
    
    // Add ROI preview update
    ['taskImpact', 'taskEffort'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateRoiPreview);
    });
}

function updateRoiPreview() {
    const impact = parseInt(document.getElementById('taskImpact')?.value) || 5;
    const effort = parseInt(document.getElementById('taskEffort')?.value) || 5;
    const roi = rulesEngine.calculateROI(impact, effort);
    const preview = document.getElementById('taskRoiPreview');
    if (preview) {
        preview.textContent = `${roi}x`;
        preview.className = `font-bold ${parseFloat(roi) >= 2 ? 'text-pex-success' : parseFloat(roi) >= 1 ? 'text-pex-warning' : 'text-pex-error'}`;
    }
}

async function createTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDesc').value;
    const project_id = document.getElementById('taskProject').value || null;
    const priority = document.getElementById('taskPriority').value;
    const impact_score = parseInt(document.getElementById('taskImpact').value) || 5;
    const effort_score = parseInt(document.getElementById('taskEffort').value) || 5;
    
    if (!title.trim()) {
        store.addToast({ type: 'error', title: 'Error', message: 'Task title is required' });
        return;
    }
    
    try {
        const task = await API.tasks.create({
            title,
            description,
            project_id,
            priority,
            impact_score,
            effort_score,
            status: 'pending'
        });
        
        store.update('tasks', tasks => [...tasks, task]);
        closeModal();
        renderTasks();
        store.addToast({ type: 'success', title: 'Success', message: 'Task created successfully' });
    } catch (error) {
        store.addToast({ type: 'error', title: 'Error', message: 'Failed to create task' });
    }
}

// Folder Modal
function openFolderModal() {
    const content = Components.modal('New Folder', `
        ${Components.formGroup('Folder Name', '<input type="text" id="folderName" class="form-input" placeholder="Enter folder name">', 'folderName')}
        ${Components.formGroup('Color', `
            <div class="flex gap-2" id="colorPicker">
                <button type="button" class="w-8 h-8 rounded-lg border-2 border-white color-option" data-color="#2979ff" style="background: #2979ff"></button>
                <button type="button" class="w-8 h-8 rounded-lg border-2 border-transparent color-option" data-color="#10b981" style="background: #10b981"></button>
                <button type="button" class="w-8 h-8 rounded-lg border-2 border-transparent color-option" data-color="#f59e0b" style="background: #f59e0b"></button>
                <button type="button" class="w-8 h-8 rounded-lg border-2 border-transparent color-option" data-color="#ef4444" style="background: #ef4444"></button>
                <button type="button" class="w-8 h-8 rounded-lg border-2 border-transparent color-option" data-color="#5b4eff" style="background: #5b4eff"></button>
            </div>
        `, 'folderColor')}
    `, `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="createFolder()">Create Folder</button>
    `);
    openModal(content);
    
    // Add color picker functionality
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(b => b.classList.remove('border-white'));
            btn.classList.add('border-white');
        });
    });
}

async function createFolder() {
    const name = document.getElementById('folderName').value;
    const selectedColor = document.querySelector('.color-option.border-white');
    const color = selectedColor?.dataset.color || '#2979ff';
    
    if (!name.trim()) {
        store.addToast({ type: 'error', title: 'Error', message: 'Folder name is required' });
        return;
    }
    
    try {
        const folder = await API.promptFolders.create({ name, color, icon: 'folder' });
        store.update('promptFolders', folders => [...folders, folder]);
        closeModal();
        renderPrompts();
        store.addToast({ type: 'success', title: 'Success', message: 'Folder created successfully' });
    } catch (error) {
        store.addToast({ type: 'error', title: 'Error', message: 'Failed to create folder' });
    }
}

// Prompt Modal
function openPromptModal() {
    const folders = store.get('promptFolders') || [];
    const folderOptions = folders.map(f => `<option value="${f.id}">${Components.escapeHtml(f.name)}</option>`).join('');
    
    const content = Components.modal('New Prompt', `
        ${Components.formGroup('Prompt Name', '<input type="text" id="promptName" class="form-input" placeholder="Enter prompt name">', 'promptName')}
        ${Components.formGroup('Folder', `<select id="promptFolder" class="form-select"><option value="">Select folder</option>${folderOptions}</select>`, 'promptFolder')}
        ${Components.formGroup('Category', `
            <select id="promptCategory" class="form-select">
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="analysis">Analysis</option>
                <option value="strategy">Strategy</option>
                <option value="templates">Templates</option>
            </select>
        `, 'promptCategory')}
        ${Components.formGroup('Content', '<textarea id="promptContent" class="form-textarea h-40 font-mono text-sm" placeholder="Enter your prompt content..."></textarea>', 'promptContent')}
        <div class="flex items-center gap-2">
            <input type="checkbox" id="promptIsTemplate" class="form-checkbox">
            <label for="promptIsTemplate" class="text-sm text-gray-400">Mark as ENTJ Template</label>
        </div>
    `, `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="createPrompt()">Create Prompt</button>
    `);
    openModal(content);
}

async function createPrompt() {
    const name = document.getElementById('promptName').value;
    const folder_id = document.getElementById('promptFolder').value || null;
    const category = document.getElementById('promptCategory').value;
    const content = document.getElementById('promptContent').value;
    const is_template = document.getElementById('promptIsTemplate').checked;
    
    if (!name.trim()) {
        store.addToast({ type: 'error', title: 'Error', message: 'Prompt name is required' });
        return;
    }
    
    try {
        const prompt = await API.prompts.create({ name, folder_id, category, content, is_template });
        store.update('prompts', prompts => [...prompts, prompt]);
        closeModal();
        renderPrompts();
        store.addToast({ type: 'success', title: 'Success', message: 'Prompt created successfully' });
    } catch (error) {
        store.addToast({ type: 'error', title: 'Error', message: 'Failed to create prompt' });
    }
}

// YouTube Modal
function openYouTubeModal() {
    const content = Components.modal('Add YouTube Video', `
        ${Components.formGroup('YouTube URL', '<input type="text" id="youtubeUrl" class="form-input" placeholder="https://youtube.com/watch?v=...">', 'youtubeUrl')}
        ${Components.formGroup('Title', '<input type="text" id="youtubeTitle" class="form-input" placeholder="Video title">', 'youtubeTitle')}
        ${Components.formGroup('Channel', '<input type="text" id="youtubeChannel" class="form-input" placeholder="Channel name">', 'youtubeChannel')}
        ${Components.formGroup('Notes', '<textarea id="youtubeNotes" class="form-textarea h-24" placeholder="Why is this video useful?"></textarea>', 'youtubeNotes')}
        ${Components.formGroup('Tags', '<input type="text" id="youtubeTags" class="form-input" placeholder="productivity, coding, strategy (comma separated)">', 'youtubeTags')}
    `, `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="createYouTube()">Add Video</button>
    `);
    openModal(content);
}

async function createYouTube() {
    const url = document.getElementById('youtubeUrl').value;
    const title = document.getElementById('youtubeTitle').value;
    const channel = document.getElementById('youtubeChannel').value;
    const notes = document.getElementById('youtubeNotes').value;
    const tags = document.getElementById('youtubeTags').value.split(',').map(t => t.trim()).filter(Boolean);
    
    if (!url.trim()) {
        store.addToast({ type: 'error', title: 'Error', message: 'YouTube URL is required' });
        return;
    }
    
    // Extract video ID for thumbnail
    const videoId = extractYouTubeId(url);
    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
    
    try {
        const video = await API.youtube.create({ url, title, channel, notes, tags, thumbnail });
        store.update('youtubeRefs', refs => [...refs, video]);
        closeModal();
        renderYouTube();
        store.addToast({ type: 'success', title: 'Success', message: 'Video added successfully' });
    } catch (error) {
        store.addToast({ type: 'error', title: 'Error', message: 'Failed to add video' });
    }
}

function extractYouTubeId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Battle Plan Modal
function openBattlePlanModal() {
    const content = Components.modal('New Battle Plan', `
        ${Components.formGroup('Plan Name', '<input type="text" id="battlePlanName" class="form-input" placeholder="Q1 Sprint, MVP Push, etc.">', 'battlePlanName')}
        <div class="grid grid-cols-2 gap-4">
            ${Components.formGroup('Start Date', '<input type="date" id="battlePlanStart" class="form-input">', 'battlePlanStart')}
            ${Components.formGroup('End Date', '<input type="date" id="battlePlanEnd" class="form-input">', 'battlePlanEnd')}
        </div>
        ${Components.formGroup('Velocity Target', '<input type="number" id="battlePlanVelocity" class="form-input" value="10" min="1">', 'battlePlanVelocity')}
        ${Components.formGroup('Objectives (one per line)', '<textarea id="battlePlanObjectives" class="form-textarea h-32" placeholder="Ship MVP\nGet 10 users\nValidate pricing"></textarea>', 'battlePlanObjectives')}
    `, `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="createBattlePlan()">Create Plan</button>
    `);
    openModal(content);
    
    // Set default dates
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.getElementById('battlePlanStart').valueAsDate = today;
    document.getElementById('battlePlanEnd').valueAsDate = nextWeek;
}

async function createBattlePlan() {
    const name = document.getElementById('battlePlanName').value;
    const start_date = new Date(document.getElementById('battlePlanStart').value).getTime();
    const end_date = new Date(document.getElementById('battlePlanEnd').value).getTime();
    const velocity_target = parseInt(document.getElementById('battlePlanVelocity').value) || 10;
    const objectivesText = document.getElementById('battlePlanObjectives').value;
    const objectives = objectivesText.split('\n').filter(Boolean).map(text => ({ text, completed: false }));
    
    if (!name.trim()) {
        store.addToast({ type: 'error', title: 'Error', message: 'Plan name is required' });
        return;
    }
    
    try {
        const plan = await API.battlePlans.create({ name, start_date, end_date, velocity_target, objectives, status: 'active' });
        store.update('battlePlans', plans => [...plans, plan]);
        closeModal();
        renderBattlePlan();
        store.addToast({ type: 'success', title: 'Battle Plan Created', message: 'Time to execute!' });
    } catch (error) {
        store.addToast({ type: 'error', title: 'Error', message: 'Failed to create battle plan' });
    }
}

// ====== Selection Handlers ======
function selectFolder(folderId) {
    store.set('selectedFolder', folderId);
    store.set('selectedPrompt', null);
    renderPrompts();
}

async function selectPrompt(promptId) {
    store.set('selectedPrompt', promptId);
    
    const prompts = store.get('prompts') || [];
    const prompt = prompts.find(p => p.id === promptId);
    
    if (prompt) {
        document.getElementById('editorTitle').textContent = prompt.name;
        document.getElementById('promptEditor').value = prompt.content || '';
        
        // Load version history
        try {
            const versions = await API.promptVersions.list({ search: promptId });
            const versionHistory = document.getElementById('versionHistory');
            if (versions.data && versions.data.length > 0) {
                versionHistory.innerHTML = versions.data.map(v => Components.versionPill(v)).join('');
            } else {
                versionHistory.innerHTML = '<span class="text-xs text-gray-500">No version history</span>';
            }
        } catch (error) {
            console.error('Error loading versions:', error);
        }
    }
    
    renderPrompts();
}

async function savePrompt() {
    const promptId = store.get('selectedPrompt');
    if (!promptId) {
        store.addToast({ type: 'warning', title: 'Warning', message: 'No prompt selected' });
        return;
    }
    
    const content = document.getElementById('promptEditor').value;
    const prompts = store.get('prompts') || [];
    const prompt = prompts.find(p => p.id === promptId);
    
    if (!prompt) return;
    
    try {
        // Save version
        await API.promptVersions.create({
            prompt_id: promptId,
            version_number: (prompt.version || 0) + 1,
            content: prompt.content,
            changes: 'Manual save'
        });
        
        // Update prompt
        const updated = await API.prompts.update(promptId, {
            ...prompt,
            content,
            version: (prompt.version || 0) + 1
        });
        
        store.update('prompts', prompts => prompts.map(p => p.id === promptId ? updated : p));
        store.addToast({ type: 'success', title: 'Saved', message: 'Prompt saved with new version' });
        renderPrompts();
    } catch (error) {
        store.addToast({ type: 'error', title: 'Error', message: 'Failed to save prompt' });
    }
}

function analyzePrompt() {
    const content = document.getElementById('promptEditor').value;
    if (!content.trim()) {
        store.addToast({ type: 'warning', title: 'Warning', message: 'No content to analyze' });
        return;
    }
    
    // Simple prompt analysis (in production, this would use AI)
    const analysis = {
        wordCount: content.split(/\s+/).length,
        hasPlaceholders: /\{\{.*?\}\}/.test(content),
        hasStructure: /^#+\s/m.test(content) || content.includes('1.') || content.includes('-'),
        isSpecific: content.length > 100 && !content.includes('something') && !content.includes('stuff')
    };
    
    let score = 5;
    let suggestions = [];
    
    if (analysis.hasPlaceholders) { score += 1; } else { suggestions.push('Add template variables like {{variable}}'); }
    if (analysis.hasStructure) { score += 1; } else { suggestions.push('Add structure with headers or numbered lists'); }
    if (analysis.isSpecific) { score += 2; } else { suggestions.push('Be more specific - avoid vague terms'); }
    if (analysis.wordCount > 50) { score += 1; } else { suggestions.push('Add more detail for better results'); }
    
    store.addToast({
        type: score >= 7 ? 'success' : score >= 5 ? 'warning' : 'error',
        title: `Prompt Score: ${score}/10`,
        message: suggestions[0] || 'Prompt looks good!',
        duration: 6000
    });
}

// ====== View Functions ======
function viewProject(projectId) {
    store.addToast({ type: 'info', title: 'Project View', message: 'Project details coming soon!' });
}

function viewYouTube(videoId) {
    const videos = store.get('youtubeRefs') || [];
    const video = videos.find(v => v.id === videoId);
    if (video && video.url) {
        window.open(video.url, '_blank');
    }
}

function viewTemplate(templateId) {
    const templates = store.get('templates') || [];
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
        const content = Components.modal(template.name, `
            <div class="prose prose-invert max-w-none">
                <div class="category-badge mb-4" style="background: #5b4eff20; color: #5b4eff">${template.category?.replace('-', ' ')}</div>
                <pre class="bg-pex-dark p-4 rounded-lg text-sm overflow-auto max-h-96 whitespace-pre-wrap">${Components.escapeHtml(template.content)}</pre>
            </div>
        `, `
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            <button class="btn btn-primary" onclick="useTemplate('${templateId}')">Use Template</button>
        `);
        openModal(content);
    }
}

function useTemplate(templateId) {
    const templates = store.get('templates') || [];
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
        // Copy to clipboard
        navigator.clipboard.writeText(template.content).then(() => {
            store.addToast({ type: 'success', title: 'Copied!', message: 'Template copied to clipboard' });
            
            // Update usage count
            API.templates.update(templateId, { ...template, usage_count: (template.usage_count || 0) + 1 });
        });
    }
    closeModal();
}

// ====== Focus Session ======
function startFocusSession() {
    document.getElementById('focusOverlay').classList.remove('hidden');
    focusManager.start(25 * 60, 'Deep Work Session');
}

function pauseFocusSession() {
    focusManager.pause();
}

function endFocusSession() {
    focusManager.end();
    document.getElementById('focusOverlay').classList.add('hidden');
}

// ====== Agent Functions ======
async function connectAgent() {
    const endpoint = document.getElementById('agentEndpoint')?.value || 'ws://localhost:8765';
    
    try {
        await AgentAPI.connect(endpoint);
        store.set('agentConnected', true);
        updateAgentStatus();
        renderAgent();
        store.addToast({ type: 'success', title: 'Connected', message: 'Agent connected successfully' });
    } catch (error) {
        store.addToast({ type: 'warning', title: 'Agent Offline', message: error.message });
    }
}

async function sendAgentCommand() {
    const command = document.getElementById('agentCommand')?.value;
    if (!command?.trim()) return;
    
    const responseEl = document.getElementById('agentResponse');
    responseEl.innerHTML = '<span class="text-pex-primary"><i class="fas fa-spinner animate-spin mr-2"></i>Processing...</span>';
    
    const result = await AgentAPI.sendCommand(command);
    
    if (result.queued) {
        responseEl.innerHTML = `<span class="text-pex-warning">// Command queued: ${result.message}</span>`;
    } else if (result.success) {
        responseEl.innerHTML = `<span class="text-pex-success">// ${result.response}</span>`;
    } else {
        responseEl.innerHTML = `<span class="text-pex-error">// Error: ${result.message}</span>`;
    }
}

// ====== Neovim Config Generator ======
function generateNeovimConfig() {
    const base = document.querySelector('input[name="nvim-base"]:checked')?.value || 'lazyvim';
    const lsps = Array.from(document.querySelectorAll('[data-lsp]:checked')).map(el => el.dataset.lsp);
    const plugins = Array.from(document.querySelectorAll('[data-plugin]:checked')).map(el => el.dataset.plugin);
    
    let config = `-- AthenaPeX Neovim Configuration
-- Base: ${base}
-- Generated: ${new Date().toISOString()}

`;

    if (base === 'lazyvim') {
        config += `-- LazyVim Bootstrap
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable", lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

-- ENTJ Leader Key
vim.g.mapleader = " "
vim.g.maplocalleader = "\\\\"

`;
    }

    config += `-- Plugins
require("lazy").setup({
  { "LazyVim/LazyVim", import = "lazyvim.plugins" },
`;

    if (plugins.includes('telescope')) {
        config += `  
  -- Telescope with ENTJ presets
  {
    "nvim-telescope/telescope.nvim",
    keys = {
      { "<leader>ff", "<cmd>Telescope find_files<cr>", desc = "Find Files" },
      { "<leader>fg", "<cmd>Telescope live_grep<cr>", desc = "Grep" },
      { "<leader>fb", "<cmd>Telescope buffers<cr>", desc = "Buffers" },
      { "<leader>fr", "<cmd>Telescope oldfiles<cr>", desc = "Recent Files" },
    },
  },
`;
    }

    if (plugins.includes('harpoon')) {
        config += `
  -- Harpoon v2 for quick navigation
  {
    "ThePrimeagen/harpoon",
    branch = "harpoon2",
    keys = {
      { "<leader>ha", function() require("harpoon"):list():append() end, desc = "Harpoon Add" },
      { "<leader>hh", function() require("harpoon").ui:toggle_quick_menu(require("harpoon"):list()) end, desc = "Harpoon Menu" },
      { "<leader>1", function() require("harpoon"):list():select(1) end, desc = "Harpoon 1" },
      { "<leader>2", function() require("harpoon"):list():select(2) end, desc = "Harpoon 2" },
      { "<leader>3", function() require("harpoon"):list():select(3) end, desc = "Harpoon 3" },
      { "<leader>4", function() require("harpoon"):list():select(4) end, desc = "Harpoon 4" },
    },
  },
`;
    }

    if (plugins.includes('copilot')) {
        config += `
  -- GitHub Copilot
  {
    "github/copilot.vim",
    event = "InsertEnter",
  },
`;
    }

    if (plugins.includes('nvim-cmp')) {
        config += `
  -- Aggressive Autocomplete
  {
    "hrsh7th/nvim-cmp",
    opts = function(_, opts)
      local cmp = require("cmp")
      opts.completion = { autocomplete = { cmp.TriggerEvent.TextChanged } }
      opts.experimental = { ghost_text = true }
    end,
  },
`;
    }

    config += `})

-- LSP Configurations
`;

    if (lsps.includes('typescript')) {
        config += `-- TypeScript/JavaScript LSP
require("lspconfig").tsserver.setup({})
`;
    }

    if (lsps.includes('python')) {
        config += `-- Python LSP
require("lspconfig").pyright.setup({})
`;
    }

    if (lsps.includes('rust')) {
        config += `-- Rust LSP
require("lspconfig").rust_analyzer.setup({})
`;
    }

    if (lsps.includes('go')) {
        config += `-- Go LSP
require("lspconfig").gopls.setup({})
`;
    }

    if (lsps.includes('bash')) {
        config += `-- Bash LSP
require("lspconfig").bashls.setup({})
`;
    }

    config += `
-- ENTJ Productivity Keymaps
vim.keymap.set("n", "<leader>w", "<cmd>w<cr>", { desc = "Quick Save" })
vim.keymap.set("n", "<leader>q", "<cmd>q<cr>", { desc = "Quick Quit" })
vim.keymap.set("n", "<leader>x", "<cmd>x<cr>", { desc = "Save & Quit" })

-- ENTJ Macros
vim.keymap.set("n", "<leader>rc", function()
  -- Create React Component
  vim.ui.input({ prompt = "Component Name: " }, function(name)
    if name then
      vim.cmd("e " .. name .. ".tsx")
      vim.api.nvim_put({
        "import React from 'react';",
        "",
        "interface " .. name .. "Props {}",
        "",
        "export const " .. name .. ": React.FC<" .. name .. "Props> = ({}) => {",
        "  return (",
        "    <div>",
        "      {/* " .. name .. " */}",
        "    </div>",
        "  );",
        "};",
      }, "l", true, true)
    end
  end)
end, { desc = "Create React Component" })

-- Options
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.expandtab = true
vim.opt.smartindent = true
vim.opt.wrap = false
vim.opt.termguicolors = true
`;

    document.getElementById('neovimConfigPreview').textContent = config;
}

function copyNeovimConfig() {
    const config = document.getElementById('neovimConfigPreview').textContent;
    navigator.clipboard.writeText(config).then(() => {
        store.addToast({ type: 'success', title: 'Copied!', message: 'Configuration copied to clipboard' });
    });
}

// ====== Drag and Drop for Tasks ======
function dragTask(event, taskId) {
    event.dataTransfer.setData('text/plain', taskId);
    event.target.classList.add('dragging');
}

// Enable drop on task columns
document.querySelectorAll('.task-column').forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        column.classList.add('bg-pex-tertiary/50');
    });
    
    column.addEventListener('dragleave', () => {
        column.classList.remove('bg-pex-tertiary/50');
    });
    
    column.addEventListener('drop', async (e) => {
        e.preventDefault();
        column.classList.remove('bg-pex-tertiary/50');
        
        const taskId = e.dataTransfer.getData('text/plain');
        const newStatus = column.dataset.status;
        
        try {
            const tasks = store.get('tasks') || [];
            const task = tasks.find(t => t.id === taskId);
            
            if (task && task.status !== newStatus) {
                await API.tasks.patch(taskId, { status: newStatus });
                store.update('tasks', tasks => tasks.map(t => 
                    t.id === taskId ? { ...t, status: newStatus } : t
                ));
                
                // Log the status change
                await API.taskLogs.create({
                    task_id: taskId,
                    action: newStatus === 'completed' ? 'completed' : 'updated',
                    details: `Status changed to ${newStatus}`
                });
                
                renderTasks();
                store.addToast({ type: 'success', title: 'Task Updated', message: `Moved to ${newStatus.replace('_', ' ')}` });
            }
        } catch (error) {
            store.addToast({ type: 'error', title: 'Error', message: 'Failed to update task' });
        }
    });
});

// ====== Filter Handlers ======
document.querySelectorAll('.project-filter').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.project-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(btn.dataset.filter);
    });
});

document.querySelectorAll('.youtube-filter').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.youtube-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderYouTube(btn.dataset.filter);
    });
});

document.querySelectorAll('.template-filter').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.template-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTemplates(btn.dataset.filter);
    });
});

// ====== Toast Rendering ======
function renderToasts(toasts) {
    const container = document.getElementById('toastContainer');
    container.innerHTML = toasts.map(t => Components.toast(t)).join('');
}

function dismissToast(toastId) {
    const toastEl = document.getElementById(`toast-${toastId}`);
    if (toastEl) {
        toastEl.classList.remove('animate-toast-in');
        toastEl.classList.add('animate-toast-out');
        setTimeout(() => store.removeToast(toastId), 300);
    }
}

// ====== Keyboard Shortcuts ======
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ignore if typing in input
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
        
        // Ctrl/Cmd + K: Global search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('globalSearch').focus();
        }
        
        // Escape: Close modal or focus overlay
        if (e.key === 'Escape') {
            if (store.get('modalOpen')) {
                closeModal();
            }
            if (store.get('focusSession')) {
                // Don't close focus session on escape
            }
        }
        
        // Number keys for module switching
        if (e.key === '1' && !e.ctrlKey && !e.metaKey) showModule('analytics');
        if (e.key === '2' && !e.ctrlKey && !e.metaKey) showModule('projects');
        if (e.key === '3' && !e.ctrlKey && !e.metaKey) showModule('tasks');
        if (e.key === '4' && !e.ctrlKey && !e.metaKey) showModule('prompts');
        if (e.key === '5' && !e.ctrlKey && !e.metaKey) showModule('battleplan');
    });
}

// Close modal on overlay click
document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) {
        closeModal();
    }
});

// Auto-save prompt content
let promptAutoSaveTimer;
document.getElementById('promptEditor')?.addEventListener('input', () => {
    clearTimeout(promptAutoSaveTimer);
    promptAutoSaveTimer = setTimeout(() => {
        // Visual indicator of auto-save
        const editor = document.getElementById('promptEditor');
        editor.style.borderColor = '#10b981';
        setTimeout(() => {
            editor.style.borderColor = '';
        }, 500);
    }, 2000);
});
