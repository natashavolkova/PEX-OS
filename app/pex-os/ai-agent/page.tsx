'use client';

import { useState } from 'react';
import { Bot, Send, Settings, Play, Zap, Code, FileCode, Terminal } from 'lucide-react';

export default function AIAgentPage() {
    const [status, setStatus] = useState<'disconnected' | 'connected' | 'running'>('disconnected');
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent', content: string }>>([]);

    return (
        <div className="h-full bg-athena-navy-deep">
            {/* Header */}
            <div className="h-20 bg-gradient-to-r from-athena-navy/90 to-athena-navy-deep/90 backdrop-blur-xl border-b border-athena-gold/30 flex items-center justify-between px-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-athena-gold to-athena-gold-dark rounded-xl flex items-center justify-center shadow-athena-glow">
                        <Bot className="w-7 h-7 text-athena-navy-deep" />
                    </div>
                    <div>
                        <h1 className="font-cinzel text-2xl text-athena-gold">AI Agent</h1>
                        <p className="text-athena-silver/70 text-sm">Fara-7B Local Assistant</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`
            px-5 py-2.5 rounded-lg flex items-center gap-2 border
            ${status === 'connected'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }
          `}>
                        <div className={`w-2.5 h-2.5 rounded-full ${status === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                        <span className="font-medium text-sm">{status === 'connected' ? 'Connected' : 'Disconnected'}</span>
                    </div>

                    <button className="p-3 hover:bg-athena-gold/10 rounded-lg transition-all border border-transparent hover:border-athena-gold/30">
                        <Settings className="w-5 h-5 text-athena-silver hover:text-athena-gold transition-colors" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="h-[calc(100%-5rem)] p-8 flex gap-6">
                {/* Main Panel */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Connection Panel */}
                    <div className="bg-gradient-to-br from-athena-navy/80 to-athena-navy-deep/80 backdrop-blur-sm border border-athena-gold/20 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-5">
                            <Zap className="w-5 h-5 text-athena-gold" />
                            <h2 className="font-cinzel text-xl text-athena-gold">Connection</h2>
                        </div>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="ws://localhost:8080"
                                defaultValue="ws://localhost:8080"
                                className="flex-1 bg-athena-navy-deep/80 border border-athena-gold/30 rounded-lg px-5 py-3 text-athena-platinum placeholder:text-athena-silver/30 focus:border-athena-gold focus:ring-2 focus:ring-athena-gold/20 outline-none transition-all"
                            />
                            <button
                                onClick={() => setStatus(status === 'connected' ? 'disconnected' : 'connected')}
                                className="bg-gradient-to-r from-athena-gold to-athena-gold-dark hover:from-athena-gold-dark hover:to-athena-gold text-athena-navy-deep px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-athena-glow"
                            >
                                {status === 'connected' ? 'Disconnect' : 'Connect'}
                            </button>
                        </div>
                    </div>

                    {/* Chat/Commands */}
                    <div className="flex-1 bg-gradient-to-br from-athena-navy/80 to-athena-navy-deep/80 backdrop-blur-sm border border-athena-gold/20 rounded-xl p-6 flex flex-col shadow-lg">
                        <div className="flex items-center gap-3 mb-5">
                            <Terminal className="w-5 h-5 text-athena-gold" />
                            <h2 className="font-cinzel text-xl text-athena-gold">Commands & Output</h2>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 bg-athena-navy-deep/60 rounded-lg p-5 mb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-athena-gold/30 scrollbar-track-transparent">
                            {messages.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-athena-silver/40 text-sm">Agent output will appear here...</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                            <div className={`
                        inline-block px-4 py-2 rounded-lg max-w-[80%]
                        ${msg.role === 'user'
                                                    ? 'bg-athena-gold/20 text-athena-platinum border border-athena-gold/30'
                                                    : 'bg-athena-navy/60 text-athena-silver border border-athena-silver/20'
                                                }
                      `}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Send command to Fara-7B..."
                                className="flex-1 bg-athena-navy-deep/80 border border-athena-gold/30 rounded-lg px-5 py-3 text-athena-platinum placeholder:text-athena-silver/30 focus:border-athena-gold focus:ring-2 focus:ring-athena-gold/20 outline-none transition-all"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.currentTarget.value) {
                                        setMessages([...messages, { role: 'user', content: e.currentTarget.value }]);
                                        e.currentTarget.value = '';
                                    }
                                }}
                            />
                            <button className="bg-gradient-to-r from-athena-gold to-athena-gold-dark hover:from-athena-gold-dark hover:to-athena-gold text-athena-navy-deep px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-athena-glow">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-96 space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-athena-navy/80 to-athena-navy-deep/80 backdrop-blur-sm border border-athena-gold/20 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-5">
                            <Zap className="w-5 h-5 text-athena-gold" />
                            <h3 className="font-cinzel text-lg text-athena-gold">Quick Actions</h3>
                        </div>

                        <div className="space-y-3">
                            {[
                                { icon: Code, label: 'Generate Code', color: 'text-blue-400' },
                                { icon: FileCode, label: 'Refactor File', color: 'text-green-400' },
                                { icon: Terminal, label: 'Run Macro', color: 'text-purple-400' },
                                { icon: Play, label: 'Execute Task', color: 'text-orange-400' }
                            ].map((action, i) => {
                                const Icon = action.icon;
                                return (
                                    <button key={i} className="w-full bg-athena-navy-deep/60 hover:bg-athena-gold/10 border border-athena-gold/20 hover:border-athena-gold/40 text-athena-silver hover:text-athena-gold px-5 py-3 rounded-lg transition-all text-left flex items-center gap-3 group">
                                        <Icon className={`w-5 h-5 ${action.color} group-hover:text-athena-gold transition-colors`} />
                                        <span className="font-medium">{action.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Agent Status */}
                    <div className="bg-gradient-to-br from-athena-navy/80 to-athena-navy-deep/80 backdrop-blur-sm border border-athena-gold/20 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-5">
                            <Bot className="w-5 h-5 text-athena-gold" />
                            <h3 className="font-cinzel text-lg text-athena-gold">Agent Status</h3>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Model', value: 'Fara-7B', color: 'text-athena-gold' },
                                { label: 'Tasks Completed', value: '0', color: 'text-green-400' },
                                { label: 'Active Tasks', value: '0', color: 'text-blue-400' },
                                { label: 'Uptime', value: '--', color: 'text-athena-platinum' },
                                { label: 'Response Time', value: '~0ms', color: 'text-purple-400' }
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-athena-gold/10 last:border-0">
                                    <span className="text-athena-silver text-sm">{stat.label}</span>
                                    <span className={`${stat.color} font-semibold text-sm`}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance */}
                    <div className="bg-gradient-to-br from-athena-navy/80 to-athena-navy-deep/80 backdrop-blur-sm border border-athena-gold/20 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-5">
                            <Zap className="w-5 h-5 text-athena-gold" />
                            <h3 className="font-cinzel text-lg text-athena-gold">Performance</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-athena-silver">CPU Usage</span>
                                    <span className="text-athena-gold font-semibold">0%</span>
                                </div>
                                <div className="w-full h-2 bg-athena-navy-deep rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-athena-gold to-athena-gold-dark w-0 transition-all" />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-athena-silver">Memory</span>
                                    <span className="text-green-400 font-semibold">0 MB</span>
                                </div>
                                <div className="w-full h-2 bg-athena-navy-deep rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-green-500 to-green-400 w-0 transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
