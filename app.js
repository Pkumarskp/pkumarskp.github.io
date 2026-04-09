document.addEventListener('alpine:init', () => {
    Alpine.data('crmApp', () => ({
        currentModule: 'dashboard',
        sidebarOpen: false,
        modalOpen: false,
        todayDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        
        navItems: [
            { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
            { id: 'leads', label: 'Leads', icon: 'users' },
            { id: 'pipeline', label: 'Pipeline', icon: 'trello' },
            { id: 'payments', label: 'Payments', icon: 'credit-card' },
        ],
        
        systemNavItems: [
            { id: 'team', label: 'Team', icon: 'users-2' },
            { id: 'services', label: 'Services', icon: 'settings' },
            { id: 'reports', label: 'Reports', icon: 'bar-chart-3' },
        ],

        stats: [
            { label: 'Total Leads', value: '1,284', trend: 12.5, icon: 'user-plus', bg: 'bg-indigo-50', color: 'text-indigo-600' },
            { label: 'Active Deals', value: '342', trend: -4.2, icon: 'briefcase', bg: 'bg-emerald-50', color: 'text-emerald-600' },
            { label: 'Conversions', value: '24.8%', trend: 8.1, icon: 'target', bg: 'bg-amber-50', color: 'text-amber-600' },
            { label: 'Total Revenue', value: '$124,500', trend: 15.3, icon: 'dollar-sign', bg: 'bg-sky-50', color: 'text-sky-600' },
        ],

        // Lead Management Data
        leads: [],
        leadFilters: { search: '', status: 'All' },
        showAddLeadModal: false,
        leadStatuses: ['Follow-up', 'Not Interested', 'Voice Mail', 'Closed', 'In Pipeline'],
        
        // Candidate Detail State
        selectedLead: null,
        activeDetailTab: 'overview',
        hasFinancialPermission: false,

        // Kanban Board
        kanbanStages: ['Profile', 'Job Application', 'Assessment', 'Screening', 'Technical Round', 'HR Round', 'Closed'],
        
        // Payments Data
        payments: [],
        paymentFilters: { search: '', status: 'All' },

        // Team Management
        team: [],
        teamFilters: { search: '', role: 'All' },
        showAddTeamModal: false,

        generateRemainingDummyData() {
            const roles = ['Admin', 'Recruiter', 'Executive'];
            const names = ['Alex Sterling', 'Sarah Jenkins', 'Michael Chen', 'Emma Wilson', 'David Ross'];
            for (let i = 1; i <= 5; i++) {
                this.team.push({
                    id: i,
                    name: names[i-1],
                    email: names[i-1].toLowerCase().replace(' ', '.') + '@recruithub.com',
                    role: roles[(i-1) % 3],
                    status: 'Active',
                    avatar: `https://i.pravatar.cc/150?u=team${i}`,
                    joined: '2023-0' + i + '-15'
                });
            }
        },

        init() {
            this.generateDummyLeads();
            this.generateDummyPayments();
            this.generateRemainingDummyData();
            this.$watch('currentModule', () => {
                this.$nextTick(() => {
                    lucide.createIcons();
                    if (this.currentModule === 'dashboard' || this.currentModule === 'reports') {
                        initCharts();
                    }
                    if (this.currentModule === 'pipeline') {
                        this.initSortable();
                    }
                });
            });
            if (this.currentModule === 'pipeline') {
                this.$nextTick(() => this.initSortable());
            }
        },

        initSortable() {
            const columns = document.querySelectorAll('.kanban-column');
            columns.forEach(column => {
                new Sortable(column, {
                    group: 'pipeline',
                    animation: 150,
                    ghostClass: 'opacity-50',
                    dragClass: 'rotate-2',
                    onEnd: (evt) => {
                        const leadId = parseInt(evt.item.getAttribute('data-id'));
                        const newStage = evt.to.getAttribute('data-stage');
                        
                        // Update data
                        const leadIndex = this.leads.findIndex(l => l.id === leadId);
                        if (leadIndex !== -1) {
                            this.leads[leadIndex].pipelineStage = newStage;
                            // Trigger counts update (Alpine will react to array change)
                            this.leads = [...this.leads];
                        }
                    }
                });
            });
        },

        generateDummyLeads() {
            const sources = ['LinkedIn', 'Referral', 'Website', 'Indeed', 'Cold Call'];
            const countries = ['USA', 'UK', 'Canada', 'India', 'Germany'];
            const priorities = ['High', 'Medium', 'Low'];
            
            for (let i = 1; i <= 50; i++) {
                const stage = this.kanbanStages[Math.floor(Math.random() * this.kanbanStages.length)];
                this.leads.push({
                    id: i,
                    firstName: `John`,
                    lastName: `Doe ${i}`,
                    name: `John Doe ${i}`,
                    contact: `+1 (555) 00${i}-${i+10}`,
                    email: `john.doe${i}@example.com`,
                    location: `${countries[Math.floor(Math.random() * countries.length)]}, State ${i}`,
                    status: this.leadStatuses[Math.floor(Math.random() * this.leadStatuses.length)],
                    pipelineStage: stage,
                    priority: priorities[Math.floor(Math.random() * priorities.length)],
                    lastActive: ['2h ago', '1d ago', '4h ago', 'Present', '3d ago'][Math.floor(Math.random() * 5)],
                    assignedTo: ['Alex S.', 'Sarah K.', 'Mike J.'][Math.floor(Math.random() * 3)],
                    source: sources[Math.floor(Math.random() * sources.length)],
                    avatar: `https://i.pravatar.cc/150?u=${i}`,
                    linkedin: 'linkedin.com/in/johndoe' + i,
                    visa: 'H1B',
                    ead: 'Yes',
                    appliedAt: '2024-03-15',
                    remarks: 'Highly skilled senior developer with experience in React and Node.js.'
                });
            }
        },

        generateDummyPayments() {
            const services = ['Premium Headhunting', 'Standard Recruitment', 'Resume Optimization'];
            for (let i = 1; i <= 50; i++) {
                this.payments.push({
                    id: i,
                    candidate: `Candidate ${Math.floor(Math.random() * 50) + 1}`,
                    service: services[Math.floor(Math.random() * services.length)],
                    amount: Math.floor(Math.random() * 5000) + 500,
                    date: '2024-04-' + (Math.floor(Math.random() * 30) + 1).toString().padStart(2, '0'),
                    status: Math.random() > 0.3 ? 'Paid' : 'Pending',
                    method: ['Stripe', 'PayPal', 'Bank Transfer'][Math.floor(Math.random() * 3)],
                    installments: Math.random() > 0.5 ? '3/4' : 'Paid'
                });
            }
        },

        filteredLeads() {
            return this.leads.filter(lead => {
                const matchesSearch = lead.name.toLowerCase().includes(this.leadFilters.search.toLowerCase()) || 
                                     lead.email.toLowerCase().includes(this.leadFilters.search.toLowerCase());
                const matchesStatus = this.leadFilters.status === 'All' || lead.status === this.leadFilters.status;
                return matchesSearch && matchesStatus;
            });
        },

        filteredPayments() {
            return this.payments.filter(payment => {
                const matchesSearch = payment.candidate.toLowerCase().includes(this.paymentFilters.search.toLowerCase()) || 
                                     `#TRX-${1000 + payment.id}`.toLowerCase().includes(this.paymentFilters.search.toLowerCase());
                const matchesStatus = this.paymentFilters.status === 'All' || payment.status === this.paymentFilters.status;
                return matchesSearch && matchesStatus;
            });
        },

        filteredTeam() {
            return this.team.filter(member => {
                const matchesSearch = member.name.toLowerCase().includes(this.teamFilters.search.toLowerCase()) || 
                                     member.email.toLowerCase().includes(this.teamFilters.search.toLowerCase());
                const matchesRole = this.teamFilters.role === 'All' || member.role === this.teamFilters.role;
                return matchesSearch && matchesRole;
            });
        },

        getStatusColor(status) {
            const colors = {
                'Follow-up': 'bg-indigo-100 text-indigo-700 border-indigo-200',
                'Closed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
                'Not Interested': 'bg-slate-100 text-slate-700 border-slate-200',
                'Voice Mail': 'bg-amber-100 text-amber-700 border-amber-200',
                'In Pipeline': 'bg-sky-100 text-sky-700 border-sky-200'
            };
            return colors[status] || 'bg-gray-100 text-gray-700';
        },

        openLeadDetail(lead) {
            this.selectedLead = lead;
            this.currentModule = 'candidate-detail';
            this.activeDetailTab = 'overview';
        }
    }));
});

function initCharts() {
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#6366f1',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                        ticks: { color: '#94a3b8', font: { size: 11 } }
                    },
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#94a3b8', font: { size: 11 } }
                    }
                }
            }
        });
    }

    const reportsRevenueCtx = document.getElementById('reportsRevenueChart');
    if (reportsRevenueCtx) {
        new Chart(reportsRevenueCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue Growth',
                    data: [45000, 52000, 48000, 61000, 55000, 72000],
                    backgroundColor: '#6366f1',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}
