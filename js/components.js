// AthenaPeX - UI Components
// Reusable UI rendering functions

const Components = {
    // ====== Project Components ======
    projectCard(project) {
        const priorityColors = {
            critical: 'text-pex-error',
            high: 'text-pex-warning',
            medium: 'text-pex-primary',
            low: 'text-gray-400'
        };
        
        const statusColors = {
            active: 'bg-pex-success',
            completed: 'bg-pex-primary',
            archived: 'bg-gray-500',
            'on-hold': 'bg-pex-warning'
        };
        
        return `
            <div class="project-card" onclick="viewProject('${project.id}')">
                <div class="flex items-center justify-between mb-3">
                    <span class="w-2 h-2 rounded-full ${statusColors[project.status] || 'bg-gray-500'}"></span>
                    <span class="text-xs ${priorityColors[project.priority] || 'text-gray-400'} font-medium uppercase">${project.priority || 'medium'}</span>
                </div>
                <h3 class="font-semibold text-lg mb-2">${this.escapeHtml(project.name)}</h3>
                <p class="text-sm text-gray-400 mb-4 line-clamp-2">${this.escapeHtml(project.description || 'No description')}</p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="text-center">
                            <div class="text-lg font-bold text-pex-success">${project.impact_score || 0}</div>
                            <div class="text-xs text-gray-500">Impact</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-pex-warning">${project.roi_score || 0}x</div>
                            <div class="text-xs text-gray-500">ROI</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-medium">${project.progress || 0}%</div>
                        <div class="w-16 h-1 bg-pex-tertiary rounded-full overflow-hidden">
                            <div class="h-full bg-pex-primary rounded-full" style="width: ${project.progress || 0}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // ====== Task Components ======
    taskCard(task) {
        const roiClass = task.roi_score >= 2 ? 'roi-high' : task.roi_score >= 1 ? 'roi-medium' : 'roi-low';
        const priorityIcons = {
            critical: '<i class="fas fa-fire text-pex-error"></i>',
            high: '<i class="fas fa-arrow-up text-pex-warning"></i>',
            medium: '<i class="fas fa-minus text-pex-primary"></i>',
            low: '<i class="fas fa-arrow-down text-gray-400"></i>'
        };
        
        return `
            <div class="task-card" draggable="true" ondragstart="dragTask(event, '${task.id}')" data-task-id="${task.id}">
                <div class="flex items-center justify-between mb-2">
                    <span class="roi-badge ${roiClass}">${task.roi_score || 0}x ROI</span>
                    ${priorityIcons[task.priority] || ''}
                </div>
                <h4 class="font-medium text-sm mb-1">${this.escapeHtml(task.title)}</h4>
                <p class="text-xs text-gray-400 mb-3 line-clamp-2">${this.escapeHtml(task.description || '')}</p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-500">Impact: ${task.impact_score || 0}</span>
                        <span class="text-xs text-gray-500">Effort: ${task.effort_score || 0}</span>
                    </div>
                    <button onclick="event.stopPropagation(); openTaskMenu('${task.id}')" class="text-gray-500 hover:text-gray-300">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                ${task.blockers && task.blockers.length > 0 ? `
                    <div class="mt-2 pt-2 border-t border-gray-700">
                        <span class="text-xs text-pex-error"><i class="fas fa-exclamation-triangle mr-1"></i>${task.blockers.length} blocker(s)</span>
                    </div>
                ` : ''}
            </div>
        `;
    },
    
    // ====== Prompt Components ======
    folderItem(folder, isActive = false) {
        const iconMap = {
            code: 'fa-code',
            edit: 'fa-edit',
            target: 'fa-crosshairs',
            zap: 'fa-bolt',
            chart: 'fa-chart-bar',
            default: 'fa-folder'
        };
        const icon = iconMap[folder.icon] || iconMap.default;
        
        return `
            <div class="folder-item ${isActive ? 'active' : ''}" onclick="selectFolder('${folder.id}')" data-folder-id="${folder.id}">
                <i class="fas ${icon}" style="color: ${folder.color || '#2979ff'}"></i>
                <span class="flex-1 truncate">${this.escapeHtml(folder.name)}</span>
                <span class="text-xs text-gray-500" id="folder-count-${folder.id}">0</span>
            </div>
        `;
    },
    
    promptItem(prompt, isActive = false) {
        return `
            <div class="prompt-item ${isActive ? 'active' : ''}" onclick="selectPrompt('${prompt.id}')" data-prompt-id="${prompt.id}">
                <div class="flex items-center justify-between">
                    <span class="prompt-name truncate">${this.escapeHtml(prompt.name)}</span>
                    ${prompt.is_template ? '<span class="text-xs bg-pex-purple/20 text-pex-purple px-1.5 py-0.5 rounded">ENTJ</span>' : ''}
                </div>
                <div class="prompt-meta flex items-center gap-2">
                    <span>v${prompt.version || 1}</span>
                    <span>•</span>
                    <span>${prompt.usage_count || 0} uses</span>
                    ${prompt.efficiency_score ? `<span>• ${prompt.efficiency_score}/10</span>` : ''}
                </div>
            </div>
        `;
    },
    
    versionPill(version, isActive = false) {
        return `
            <div class="version-pill ${isActive ? 'active' : ''}" onclick="loadVersion('${version.id}')">
                v${version.version_number}
            </div>
        `;
    },
    
    // ====== YouTube Components ======
    youtubeCard(video) {
        const statusColors = {
            unwatched: { bg: 'bg-gray-500', text: 'Unwatched' },
            watching: { bg: 'bg-pex-warning', text: 'Watching' },
            watched: { bg: 'bg-pex-success', text: 'Watched' },
            revisit: { bg: 'bg-pex-purple', text: 'Revisit' }
        };
        const status = statusColors[video.watch_status] || statusColors.unwatched;
        
        return `
            <div class="youtube-card" onclick="viewYouTube('${video.id}')">
                <div class="thumbnail">
                    ${video.thumbnail ? `<img src="${video.thumbnail}" alt="${this.escapeHtml(video.title)}" onerror="this.style.display='none'">` : ''}
                    <span class="duration">${video.duration || '0:00'}</span>
                    <span class="watch-status ${status.bg}">${status.text}</span>
                </div>
                <div class="p-4">
                    <h4 class="font-medium text-sm mb-1 line-clamp-2">${this.escapeHtml(video.title || 'Untitled')}</h4>
                    <p class="text-xs text-gray-400 mb-2">${this.escapeHtml(video.channel || 'Unknown channel')}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex gap-1">
                            ${(video.tags || []).slice(0, 2).map(tag => `
                                <span class="text-xs bg-pex-tertiary px-2 py-0.5 rounded">${this.escapeHtml(tag)}</span>
                            `).join('')}
                        </div>
                        <span class="text-xs text-gray-500">${(video.insights || []).length} insights</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    // ====== Template Components ======
    templateCard(template) {
        const categoryColors = {
            mvp: '#2979ff',
            'landing-page': '#10b981',
            'cold-email': '#f59e0b',
            pitch: '#ef4444',
            'impact-matrix': '#5b4eff',
            'execution-blueprint': '#8b5cf6'
        };
        
        return `
            <div class="template-card" onclick="viewTemplate('${template.id}')">
                <div class="flex items-center justify-between mb-4">
                    <span class="category-badge" style="background: ${categoryColors[template.category]}20; color: ${categoryColors[template.category]}">${template.category?.replace('-', ' ')}</span>
                    <span class="text-xs text-gray-400">${template.usage_count || 0} uses</span>
                </div>
                <h3 class="font-semibold text-lg mb-2">${this.escapeHtml(template.name)}</h3>
                <p class="text-sm text-gray-400 mb-4 line-clamp-3">${this.escapeHtml(template.content?.substring(0, 150) || '')}...</p>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-pex-success">${template.success_rate || 0}% success rate</span>
                    <button class="text-xs bg-pex-primary hover:bg-pex-primary-hover px-3 py-1.5 rounded transition-colors" onclick="event.stopPropagation(); useTemplate('${template.id}')">
                        Use Template
                    </button>
                </div>
            </div>
        `;
    },
    
    // ====== Analytics Components ======
    heatmapRow(day, hours) {
        return `
            <div class="heatmap-row">
                <span class="heatmap-label">${day}</span>
                ${hours.map(h => `
                    <div class="heatmap-cell" data-level="${h.level}" title="${day} ${h.hour}:00 - Level ${h.level}"></div>
                `).join('')}
            </div>
        `;
    },
    
    insightItem(insight) {
        const icons = {
            success: '<i class="fas fa-check-circle text-pex-success"></i>',
            warning: '<i class="fas fa-exclamation-triangle text-pex-warning"></i>',
            critical: '<i class="fas fa-times-circle text-pex-error"></i>',
            info: '<i class="fas fa-info-circle text-pex-primary"></i>'
        };
        
        return `
            <div class="insight-item ${insight.type}">
                ${icons[insight.type] || icons.info}
                <span class="insight-text">${this.escapeHtml(insight.text)}</span>
            </div>
        `;
    },
    
    focusWindowItem(window) {
        const startTime = new Date(window.start_time);
        const timeStr = startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="focus-window-item">
                <span class="time-badge">${timeStr}</span>
                <span class="duration">${window.duration_minutes || 0} min</span>
                <span class="score"><i class="fas fa-star mr-1"></i>${window.productivity_score || 0}/10</span>
            </div>
        `;
    },
    
    peakHoursChart(hours) {
        const maxProductivity = Math.max(...hours.map(h => h.productivity));
        
        return `
            <div class="h-full flex flex-col justify-end">
                <div class="peak-bar flex items-end gap-1 h-36">
                    ${hours.map(h => `
                        <div class="peak-bar-item" style="height: ${(h.productivity / maxProductivity) * 100}%" title="${h.hour}:00 - ${h.productivity}%"></div>
                    `).join('')}
                </div>
                <div class="peak-bar-label">
                    <span>6AM</span>
                    <span>12PM</span>
                    <span>6PM</span>
                    <span>10PM</span>
                </div>
            </div>
        `;
    },
    
    // ====== Battle Plan Components ======
    objectiveItem(objective, index) {
        return `
            <div class="objective-item">
                <div class="checkbox ${objective.completed ? 'completed' : ''}" onclick="toggleObjective(${index})">
                    ${objective.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <span class="text ${objective.completed ? 'completed' : ''}">${this.escapeHtml(objective.text)}</span>
            </div>
        `;
    },
    
    highRoiTask(task) {
        return `
            <div class="flex items-center gap-3 p-3 bg-pex-tertiary rounded-lg">
                <div class="w-8 h-8 bg-pex-success/20 rounded-lg flex items-center justify-center">
                    <span class="text-pex-success font-bold text-sm">${task.roi_score || 0}x</span>
                </div>
                <div class="flex-1">
                    <div class="font-medium text-sm">${this.escapeHtml(task.title)}</div>
                    <div class="text-xs text-gray-400">Impact: ${task.impact_score || 0} | Effort: ${task.effort_score || 0}</div>
                </div>
                <button onclick="startTask('${task.id}')" class="text-xs bg-pex-primary/20 text-pex-primary px-2 py-1 rounded hover:bg-pex-primary/30 transition-colors">
                    Start
                </button>
            </div>
        `;
    },
    
    blockerItem(blocker) {
        return `
            <div class="flex items-center gap-3 p-3 bg-pex-error/10 rounded-lg border border-pex-error/30">
                <i class="fas fa-exclamation-triangle text-pex-error"></i>
                <div class="flex-1">
                    <div class="font-medium text-sm">${this.escapeHtml(blocker.description || blocker)}</div>
                    ${blocker.task ? `<div class="text-xs text-gray-400">Blocking: ${this.escapeHtml(blocker.task)}</div>` : ''}
                </div>
                <button class="text-xs text-pex-error hover:text-pex-error/80">Resolve</button>
            </div>
        `;
    },
    
    // ====== Modal Components ======
    modal(title, content, footer = '') {
        return `
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-btn" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
        `;
    },
    
    formGroup(label, input, id) {
        return `
            <div class="form-group">
                <label class="form-label" for="${id}">${label}</label>
                ${input}
            </div>
        `;
    },
    
    // ====== Toast Component ======
    toast(toast) {
        const icons = {
            success: '<i class="fas fa-check-circle text-pex-success text-xl"></i>',
            error: '<i class="fas fa-times-circle text-pex-error text-xl"></i>',
            warning: '<i class="fas fa-exclamation-triangle text-pex-warning text-xl"></i>',
            info: '<i class="fas fa-info-circle text-pex-primary text-xl"></i>'
        };
        
        return `
            <div class="toast ${toast.type} animate-toast-in" id="toast-${toast.id}">
                <div class="toast-icon">${icons[toast.type] || icons.info}</div>
                <div class="toast-content">
                    <div class="toast-title">${this.escapeHtml(toast.title)}</div>
                    <div class="toast-message">${this.escapeHtml(toast.message)}</div>
                </div>
                <button class="toast-close" onclick="dismissToast('${toast.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    },
    
    // ====== Empty States ======
    emptyState(icon, title, message) {
        return `
            <div class="empty-state">
                <i class="fas ${icon}"></i>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    },
    
    // ====== Utility ======
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    formatDate(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    
    formatTime(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
};

// Export for global use
window.Components = Components;
