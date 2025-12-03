"use strict";exports.id=3590,exports.ids=[3590],exports.modules={3590:(e,t,i)=>{i.d(t,{mi:()=>g});var a=i(551),o=i(5251);let r=()=>`${Date.now()}-${Math.random().toString(36).substr(2,9)}`,s=(e,t)=>0===t?10*e:Math.round(e/t*10)/10,n=()=>new Date().toISOString().split("T")[0],d=[{id:"proj-demo-1",name:"AthenaPeX Core Development",description:"Main development of the AthenaPeX productivity platform",emoji:"\uD83D\uDE80",status:"active",priority:"critical",impactScore:9,roiScore:8.5,owner:"Natasha (ENTJ)",tags:["core","development","priority"],startDate:"2024-01-01",deadline:"2024-03-31",createdAt:Date.now()-2592e6,updatedAt:Date.now(),tasksCount:12,completedTasksCount:5,linkedPrompts:[],linkedYoutubeRefs:[]}],c=[{id:"task-demo-1",projectId:"proj-demo-1",name:"Implement Analytics Dashboard",description:"Create comprehensive productivity analytics with heatmaps and insights",emoji:"\uD83D\uDCCA",status:"in_progress",priority:"high",impactScore:8,effortScore:5,roiScore:1.6,owner:"Natasha (ENTJ)",tags:["analytics","ui","high-impact"],estimatedMinutes:240,blockers:[],dependencies:[],createdAt:Date.now()-432e6,updatedAt:Date.now()},{id:"task-demo-2",projectId:"proj-demo-1",name:"Build ENTJ Battle Plan Generator",description:"Create aggressive sprint planning system with ROI optimization",emoji:"⚔️",status:"pending",priority:"critical",impactScore:9,effortScore:4,roiScore:2.25,owner:"Natasha (ENTJ)",tags:["planning","entj","automation"],estimatedMinutes:180,blockers:[],dependencies:[],createdAt:Date.now()-2592e5,updatedAt:Date.now()}],p=[{id:"bp-demo-1",name:"Q1 Velocity Sprint",description:"Maximum velocity sprint focusing on core feature delivery",type:"sprint",status:"active",startDate:"2024-01-15",endDate:"2024-02-15",objectives:[{id:"obj-1",name:"Complete Analytics Dashboard",description:"Ship full analytics with heatmaps",priority:"critical",status:"in_progress",linkedTasks:["task-demo-1"],impactScore:9,completionCriteria:"Dashboard live with all metrics",blockers:[]}],blockers:[],pivotTriggers:[{id:"pt-1",condition:"Velocity < 3 tasks/day for 3 consecutive days",action:"Review blockers and redistribute tasks",triggered:!1}],metrics:{objectivesTotal:1,objectivesCompleted:0,blockerCount:0,pivotsExecuted:0,progressPercentage:25,velocityScore:4.2},createdAt:Date.now()-864e6,updatedAt:Date.now()}],l=[{id:"tpl-mvp-react",name:"Micro-MVP React App",category:"mvp",description:"Minimal viable product template for React applications",emoji:"⚛️",content:`# {{projectName}} - Micro-MVP

## Core Value Proposition
{{valueProposition}}

## Target User
{{targetUser}}

## MVP Features (Max 3)
1. {{feature1}}
2. {{feature2}}
3. {{feature3}}

## Tech Stack
- React 18 + TypeScript
- {{stateManagement}}
- {{styling}}

## Timeline: {{timeline}} days

## Success Metrics
- {{metric1}}
- {{metric2}}`,variables:[{name:"projectName",description:"Project name",type:"text",required:!0},{name:"valueProposition",description:"Core value proposition",type:"textarea",required:!0},{name:"targetUser",description:"Target user persona",type:"text",required:!0},{name:"feature1",description:"MVP Feature 1",type:"text",required:!0},{name:"feature2",description:"MVP Feature 2",type:"text",required:!1},{name:"feature3",description:"MVP Feature 3",type:"text",required:!1},{name:"stateManagement",description:"State management",type:"select",options:["Zustand","Redux","Context API","Jotai"],required:!0},{name:"styling",description:"Styling solution",type:"select",options:["Tailwind CSS","Styled Components","CSS Modules"],required:!0},{name:"timeline",description:"Timeline in days",type:"number",required:!0},{name:"metric1",description:"Success metric 1",type:"text",required:!0},{name:"metric2",description:"Success metric 2",type:"text",required:!1}],tags:["react","mvp","development"],usageCount:0,avgRating:0,isCustom:!1,createdAt:Date.now(),updatedAt:Date.now()},{id:"tpl-landing-page",name:"High-Conversion Landing Page",category:"landing_page",description:"Landing page template optimized for conversions",emoji:"\uD83C\uDFAF",content:`# {{productName}} Landing Page

## Headline (Max 10 words)
{{headline}}

## Subheadline (Value Proposition)
{{subheadline}}

## Hero Section
- Visual: {{heroVisual}}
- CTA Button: {{ctaText}}

## Pain Points (Address 3)
1. {{pain1}}
2. {{pain2}}
3. {{pain3}}

## Solution Benefits
1. {{benefit1}}
2. {{benefit2}}
3. {{benefit3}}

## Social Proof
- {{socialProof}}

## Final CTA
{{finalCTA}}

## Urgency Element
{{urgency}}`,variables:[{name:"productName",description:"Product name",type:"text",required:!0},{name:"headline",description:"Main headline",type:"text",required:!0},{name:"subheadline",description:"Subheadline with value prop",type:"textarea",required:!0},{name:"heroVisual",description:"Hero image description",type:"text",required:!0},{name:"ctaText",description:"CTA button text",type:"text",required:!0},{name:"pain1",description:"Pain point 1",type:"text",required:!0},{name:"pain2",description:"Pain point 2",type:"text",required:!0},{name:"pain3",description:"Pain point 3",type:"text",required:!1},{name:"benefit1",description:"Benefit 1",type:"text",required:!0},{name:"benefit2",description:"Benefit 2",type:"text",required:!0},{name:"benefit3",description:"Benefit 3",type:"text",required:!1},{name:"socialProof",description:"Social proof element",type:"text",required:!0},{name:"finalCTA",description:"Final call to action",type:"text",required:!0},{name:"urgency",description:"Urgency element",type:"text",required:!1}],tags:["landing","conversion","marketing"],usageCount:0,avgRating:0,isCustom:!1,createdAt:Date.now(),updatedAt:Date.now()},{id:"tpl-cold-email",name:"Cold Email Sequence",category:"cold_email",description:"High-response cold email template for outreach",emoji:"\uD83D\uDCE7",content:`# Cold Email: {{purpose}}

## Email 1 - Initial Contact

**Subject:** {{subject1}}

{{recipientName}},

{{hook}}

{{valueStatement}}

{{credibility}}

{{cta1}}

Best,
{{senderName}}

---

## Email 2 - Follow Up (3 days later)

**Subject:** Re: {{subject1}}

{{recipientName}},

{{followUpHook}}

{{additionalValue}}

{{cta2}}

{{senderName}}

---

## Email 3 - Break Up (5 days later)

**Subject:** Should I close your file?

{{recipientName}},

{{breakUpMessage}}

{{finalCta}}

{{senderName}}`,variables:[{name:"purpose",description:"Purpose of outreach",type:"text",required:!0},{name:"subject1",description:"Subject line",type:"text",required:!0},{name:"recipientName",description:"Recipient name placeholder",type:"text",defaultValue:"{{name}}",required:!0},{name:"hook",description:"Opening hook",type:"textarea",required:!0},{name:"valueStatement",description:"Value statement",type:"textarea",required:!0},{name:"credibility",description:"Credibility element",type:"text",required:!0},{name:"cta1",description:"Call to action 1",type:"text",required:!0},{name:"senderName",description:"Your name",type:"text",required:!0},{name:"followUpHook",description:"Follow up hook",type:"textarea",required:!0},{name:"additionalValue",description:"Additional value",type:"textarea",required:!0},{name:"cta2",description:"Call to action 2",type:"text",required:!0},{name:"breakUpMessage",description:"Break up message",type:"textarea",required:!0},{name:"finalCta",description:"Final CTA",type:"text",required:!0}],tags:["email","outreach","sales"],usageCount:0,avgRating:0,isCustom:!1,createdAt:Date.now(),updatedAt:Date.now()},{id:"tpl-impact-matrix",name:"Impact vs Effort Matrix",category:"matrix",description:"ENTJ-style prioritization matrix",emoji:"\uD83D\uDCC8",content:`# Impact vs Effort Matrix: {{projectName}}

## Quick Wins (High Impact, Low Effort) ⚡
Execute immediately:
{{quickWins}}

## Strategic Projects (High Impact, High Effort) 🎯
Schedule and resource:
{{strategic}}

## Fill-Ins (Low Impact, Low Effort) 📝
Do when time permits:
{{fillIns}}

## Time Wasters (Low Impact, High Effort) 🚫
ELIMINATE or DELEGATE:
{{eliminate}}

---

## ENTJ Decision Rules:
1. Quick Wins first - immediate ROI
2. Strategic Projects - schedule in focused blocks
3. Fill-Ins - delegate or batch
4. Time Wasters - ruthlessly eliminate

## Action Items:
{{actionItems}}`,variables:[{name:"projectName",description:"Project or context name",type:"text",required:!0},{name:"quickWins",description:"Quick wins list",type:"textarea",required:!0},{name:"strategic",description:"Strategic projects list",type:"textarea",required:!0},{name:"fillIns",description:"Fill-in tasks list",type:"textarea",required:!1},{name:"eliminate",description:"Items to eliminate",type:"textarea",required:!0},{name:"actionItems",description:"Immediate action items",type:"textarea",required:!0}],tags:["prioritization","matrix","entj"],usageCount:0,avgRating:0,isCustom:!1,createdAt:Date.now(),updatedAt:Date.now()}],u=[{id:"rule-1",name:"Maximum Productivity Over Comfort",description:"Always prioritize tasks that maximize output over comfortable busywork",category:"productivity",condition:'task.impactScore < 5 && task.status === "in_progress"',action:"Flag for review and suggest higher-impact alternatives",enabled:!0,priority:1,triggerCount:0},{id:"rule-2",name:"Aggressive Velocity Over Perfection",description:"Ship fast, iterate faster. 80% done > 100% planned",category:"velocity",condition:"task.actualMinutes > task.estimatedMinutes * 1.5",action:"Alert: Task taking too long. Consider shipping MVP version",enabled:!0,priority:2,triggerCount:0},{id:"rule-3",name:"Real Impact Over Work Quantity",description:"Measure by outcomes, not hours worked",category:"impact",condition:"dailyMetrics.tasksCompleted > 10 && dailyMetrics.productivityScore < 6",action:"Warning: High activity but low impact. Review task selection",enabled:!0,priority:3,triggerCount:0},{id:"rule-4",name:"Ruthless Elimination of Weak Ideas",description:"Kill ideas with ROI < 1.5 after 48 hours",category:"elimination",condition:"task.roiScore < 1.5 && task.createdAt < Date.now() - 172800000",action:"Flag for elimination or pivot. Low ROI detected",enabled:!0,priority:4,triggerCount:0},{id:"rule-5",name:"Automatic Pivot Recommendations",description:"Suggest pivots when progress stalls",category:"pivot",condition:'task.status === "blocked" && task.blockers.length > 0 && blockerAge > 86400000',action:"Trigger pivot recommendation. Blocker unresolved for 24+ hours",enabled:!0,priority:5,triggerCount:0},{id:"rule-6",name:"Procrastination Pattern Detection",description:"Detect and alert on procrastination patterns",category:"productivity",condition:'hourlyActivity.filter(h => h.activityLevel === "none").length > 4',action:"Warning: Procrastination detected. Suggest focus session",enabled:!0,priority:6,triggerCount:0},{id:"rule-7",name:"ROI Optimization",description:"Continuously optimize for highest ROI tasks",category:"automation",condition:"queue.some(t => t.roiScore > currentTask.roiScore * 1.5)",action:"Higher ROI task available. Consider switching",enabled:!0,priority:7,triggerCount:0}],m={productivityRules:[],focusSettings:{defaultFocusDuration:50,breakDuration:10,autoStartBreaks:!0,blockNotificationsDuringFocus:!0,peakHoursEnabled:!0,preferredWorkHours:{start:9,end:18}},notificationSettings:{deadlineReminders:!0,deadlineReminderHours:24,focusWindowReminders:!0,insightNotifications:!0,agentNotifications:!0,soundEnabled:!1},agentSettings:{autoConnect:!1,endpoint:"ws://localhost:8765",maxConcurrentTasks:3,autoExecuteMacros:!1},displaySettings:{defaultView:"projects",sidebarCollapsed:!1,compactMode:!1,showCompletedTasks:!0,sortTasksBy:"roi"}},g=(0,a.Ue)()((0,o.mW)((0,o.tJ)((e,t)=>({projects:d,tasks:c,taskLogs:[],promptVersions:[],promptAnalyses:[],youtubeRefs:[],focusWindows:[],dailyMetrics:[],insights:[],battlePlans:p,templates:l,neovimConfigs:[],entjRules:u,evaluations:[],agentStatus:{connected:!1,agentName:"Fara-7B",agentVersion:"1.0.0",capabilities:["file_generation","code_refactor","macro_execution"],lastPing:0,queuedTasks:0},agentTasks:[],settings:m,activeSection:"projects",selectedProjectId:null,selectedTaskId:null,currentFocusWindow:null,actions:{addProject:t=>{let i=r(),a={...t,id:i,createdAt:Date.now(),updatedAt:Date.now(),tasksCount:0,completedTasksCount:0,roiScore:s(t.impactScore,5)};return e(e=>({projects:[a,...e.projects]})),i},updateProject:(t,i)=>e(e=>({projects:e.projects.map(e=>e.id===t?{...e,...i,updatedAt:Date.now()}:e)})),deleteProject:t=>e(e=>({projects:e.projects.filter(e=>e.id!==t),tasks:e.tasks.filter(e=>e.projectId!==t)})),archiveProject:t=>e(e=>({projects:e.projects.map(e=>e.id===t?{...e,status:"archived",updatedAt:Date.now()}:e)})),addTask:i=>{let a=r(),o=s(i.impactScore,i.effortScore),n={...i,id:a,roiScore:o,createdAt:Date.now(),updatedAt:Date.now()};return e(e=>({tasks:[n,...e.tasks],projects:e.projects.map(e=>e.id===i.projectId?{...e,tasksCount:e.tasksCount+1,updatedAt:Date.now()}:e)})),t().actions.logTaskAction(a,"created"),a},updateTask:(i,a)=>{e(e=>{let t=e.tasks.find(e=>e.id===i);if(!t)return e;let o=s(a.impactScore??t.impactScore,a.effortScore??t.effortScore);return{tasks:e.tasks.map(e=>e.id===i?{...e,...a,roiScore:o,updatedAt:Date.now()}:e)}}),t().actions.logTaskAction(i,"updated")},deleteTask:i=>{let a=t().tasks.find(e=>e.id===i);e(e=>({tasks:e.tasks.filter(e=>e.id!==i),projects:a?e.projects.map(e=>e.id===a.projectId?{...e,tasksCount:Math.max(0,e.tasksCount-1),updatedAt:Date.now()}:e):e.projects}))},startTask:i=>{e(e=>({tasks:e.tasks.map(e=>e.id===i?{...e,status:"in_progress",startedAt:Date.now(),updatedAt:Date.now()}:e)})),t().actions.logTaskAction(i,"started")},completeTask:(i,a)=>{let o=t().tasks.find(e=>e.id===i);e(e=>({tasks:e.tasks.map(e=>e.id===i?{...e,status:"completed",completedAt:Date.now(),actualMinutes:a??e.actualMinutes,updatedAt:Date.now()}:e),projects:o?e.projects.map(e=>e.id===o.projectId?{...e,completedTasksCount:e.completedTasksCount+1,updatedAt:Date.now()}:e):e.projects})),t().actions.logTaskAction(i,"completed")},blockTask:(i,a)=>{e(e=>({tasks:e.tasks.map(e=>e.id===i?{...e,status:"blocked",blockers:[...e.blockers,a],updatedAt:Date.now()}:e)})),t().actions.logTaskAction(i,"blocked",a)},logTaskAction:(t,i,a)=>{let o={id:r(),taskId:t,action:i,notes:a,timestamp:Date.now()};e(e=>({taskLogs:[o,...e.taskLogs]}))},addPromptVersion:(i,a,o)=>{let s=t().promptVersions.filter(e=>e.promptId===i),n={id:r(),promptId:i,version:s.length+1,content:a,changelog:o,createdAt:Date.now(),createdBy:"Natasha (ENTJ)"};e(e=>({promptVersions:[n,...e.promptVersions]}))},getPromptVersions:e=>t().promptVersions.filter(t=>t.promptId===e),addYoutubeRef:t=>{let i=r(),a={...t,id:i,addedAt:Date.now(),updatedAt:Date.now()};return e(e=>({youtubeRefs:[a,...e.youtubeRefs]})),i},updateYoutubeRef:(t,i)=>e(e=>({youtubeRefs:e.youtubeRefs.map(e=>e.id===t?{...e,...i,updatedAt:Date.now()}:e)})),deleteYoutubeRef:t=>e(e=>({youtubeRefs:e.youtubeRefs.filter(e=>e.id!==t)})),addYoutubeInsight:(t,i)=>{let a={...i,id:r(),referenceId:t,createdAt:Date.now()};e(e=>({youtubeRefs:e.youtubeRefs.map(e=>e.id===t?{...e,insights:[...e.insights,a],updatedAt:Date.now()}:e)}))},startFocusWindow:t=>{e({currentFocusWindow:{id:r(),startTime:Date.now(),endTime:0,duration:0,type:t,tasksCompleted:[],productivityScore:0}})},endFocusWindow:(i=[])=>{let a=t().currentFocusWindow;if(!a)return;let o=Date.now(),r=Math.round((o-a.startTime)/6e4),s={...a,endTime:o,duration:r,tasksCompleted:i,productivityScore:Math.min(10,2*i.length+5)};e(e=>({focusWindows:[s,...e.focusWindows],currentFocusWindow:null}))},updateDailyMetrics:t=>{let i=n();e(e=>e.dailyMetrics.find(e=>e.date===i)?{dailyMetrics:e.dailyMetrics.map(e=>e.date===i?{...e,...t}:e)}:{dailyMetrics:[{date:i,focusMinutes:0,tasksCompleted:0,tasksCreated:0,promptsCreated:0,promptsRefined:0,productivityScore:0,peakHours:[],deadZones:[],hourlyActivity:[],...t},...e.dailyMetrics]})},generateInsight:t=>{let i={...t,id:r(),createdAt:Date.now()};e(e=>({insights:[i,...e.insights]}))},dismissInsight:t=>e(e=>({insights:e.insights.map(e=>e.id===t?{...e,dismissedAt:Date.now()}:e)})),addBattlePlan:t=>{let i=r(),a={...t,id:i,createdAt:Date.now(),updatedAt:Date.now()};return e(e=>({battlePlans:[a,...e.battlePlans]})),i},updateBattlePlan:(t,i)=>e(e=>({battlePlans:e.battlePlans.map(e=>e.id===t?{...e,...i,updatedAt:Date.now()}:e)})),deleteBattlePlan:t=>e(e=>({battlePlans:e.battlePlans.filter(e=>e.id!==t)})),addTemplate:t=>{let i=r(),a={...t,id:i,createdAt:Date.now(),updatedAt:Date.now(),usageCount:0,avgRating:0};return e(e=>({templates:[a,...e.templates]})),i},updateTemplate:(t,i)=>e(e=>({templates:e.templates.map(e=>e.id===t?{...e,...i,updatedAt:Date.now()}:e)})),deleteTemplate:t=>e(e=>({templates:e.templates.filter(e=>e.id!==t)})),useTemplate:t=>e(e=>({templates:e.templates.map(e=>e.id===t?{...e,usageCount:e.usageCount+1}:e)})),addNeovimConfig:t=>{let i=r(),a={...t,id:i,createdAt:Date.now(),updatedAt:Date.now()};return e(e=>({neovimConfigs:[a,...e.neovimConfigs]})),i},updateNeovimConfig:(t,i)=>e(e=>({neovimConfigs:e.neovimConfigs.map(e=>e.id===t?{...e,...i,updatedAt:Date.now()}:e)})),deleteNeovimConfig:t=>e(e=>({neovimConfigs:e.neovimConfigs.filter(e=>e.id!==t)})),setAgentStatus:t=>e(e=>({agentStatus:{...e.agentStatus,...t}})),addAgentTask:t=>{let i=r(),a={...t,id:i,createdAt:Date.now()};return e(e=>({agentTasks:[a,...e.agentTasks],agentStatus:{...e.agentStatus,queuedTasks:e.agentStatus.queuedTasks+1}})),i},updateAgentTask:(t,i)=>e(e=>({agentTasks:e.agentTasks.map(e=>e.id===t?{...e,...i}:e)})),toggleRule:t=>e(e=>({entjRules:e.entjRules.map(e=>e.id===t?{...e,enabled:!e.enabled}:e)})),evaluateItem:(i,a)=>{let o,r;let n=t();if("task"===a?o=n.tasks.find(e=>e.id===i):"project"===a&&(o=n.projects.find(e=>e.id===i)),!o)throw Error("Item not found");let d=o.impactScore||5,c=o.effortScore||5,p=s(d,c);r=p>=2?"execute":p>=1.5?"delegate":p>=1?"defer":"eliminate";let l={itemId:i,itemType:a,impactScore:d,effortScore:c,roiScore:p,recommendation:r,reasoning:`ROI: ${p.toFixed(1)} - ${r.toUpperCase()} recommended`,suggestedPriority:p>=2?"critical":p>=1.5?"high":p>=1?"medium":"low",flaggedForRemoval:p<1,evaluatedAt:Date.now()};return e(e=>({evaluations:[l,...e.evaluations.filter(e=>e.itemId!==i)]})),l},updateSettings:t=>e(e=>({settings:{...e.settings,...t}})),setActiveSection:t=>e({activeSection:t}),setSelectedProject:t=>e({selectedProjectId:t}),setSelectedTask:t=>e({selectedTaskId:t}),getProjectTasks:e=>t().tasks.filter(t=>t.projectId===e),getHighROITasks:(e=10)=>[...t().tasks].filter(e=>"completed"!==e.status&&"cancelled"!==e.status).sort((e,t)=>t.roiScore-e.roiScore).slice(0,e),getTodayMetrics:()=>t().dailyMetrics.find(e=>e.date===n())||null,calculateWeeklyHeatmap:()=>t().dailyMetrics.slice(0,7).map(e=>({date:e.date,activity:e.hourlyActivity,score:e.productivityScore}))}}),{name:"pex-os-productivity",partialize:e=>({projects:e.projects,tasks:e.tasks,taskLogs:e.taskLogs,promptVersions:e.promptVersions,youtubeRefs:e.youtubeRefs,focusWindows:e.focusWindows,dailyMetrics:e.dailyMetrics,insights:e.insights,battlePlans:e.battlePlans,templates:e.templates,neovimConfigs:e.neovimConfigs,entjRules:e.entjRules,settings:e.settings})}),{name:"ProductivityStore"}))}};