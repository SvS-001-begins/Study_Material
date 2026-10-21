(function () {
    const DATA = window.STUDY_DATA;
    let currentView = 'overview'; // 'overview' | 'oop' | 'all-files' | file.id
    let currentMode = 'split';    // 'split' | 'code' | 'study'
    let searchQuery = '';

    const navContainer = document.getElementById('sidebarNav');
    const searchInput = document.getElementById('fileSearch');
    const workspaceBody = document.getElementById('workspaceBody');
    const breadcrumbPkg = document.getElementById('breadcrumbPkg');
    const topbarTitle = document.getElementById('topbarTitle');
    const viewSwitcher = document.getElementById('viewSwitcher');
    const fileActions = document.getElementById('fileActions');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const rawFileLink = document.getElementById('rawFileLink');
    const standaloneLink = document.getElementById('standaloneLink');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const toastEl = document.getElementById('toast');

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function highlightLine(line, pkg) {
        const tokens = [];
        let working = line.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, function (m) {
            const idx = tokens.length;
            tokens.push('<span class="syn-str">' + escapeHtml(m) + '</span>');
            return '___TOKEN_' + idx + '___';
        });

        working = escapeHtml(working);

        if (pkg === 'sql') {
            working = working.replace(/\b(CREATE|DATABASE|IF|NOT|EXISTS|USE|TABLE|PRIMARY|KEY|AUTO_INCREMENT|UNIQUE|DEFAULT|CONSTRAINT|CHECK|FOREIGN|REFERENCES|ON|DELETE|CASCADE|INDEX|INSERT|INTO|VALUES|SELECT|AS|COUNT|FROM|AND|INT|VARCHAR|DATE|TIME|DOUBLE|TIMESTAMP|CURRENT_TIMESTAMP)\b/g,
                '<span class="syn-kw">$1</span>');
        } else {
            working = working.replace(/(@Override)/g, function (m) {
                const idx = tokens.length;
                tokens.push('<span class="syn-ann">' + m + '</span>');
                return '___TOKEN_' + idx + '___';
            });
            working = working.replace(/\b(package|import|public|private|protected|class|interface|abstract|extends|implements|static|final|synchronized|void|return|new|if|else|switch|case|default|for|while|try|catch|finally|throw|throws|this|super|boolean|int|double|null|true|false)\b/g,
                '<span class="syn-kw">$1</span>');
            working = working.replace(/\b(String|Vector|HashMap|Integer|Math|System|Exception|SQLException|ClassNotFoundException|IOException|NumberFormatException|Connection|DriverManager|PreparedStatement|Statement|ResultSet|FileWriter|StringBuilder|SimpleDateFormat|Date|JFrame|JPanel|JButton|JLabel|JTextField|JComboBox|JTable|DefaultTableModel|JScrollPane|JSplitPane|JTabbedPane|JMenuBar|JMenu|JMenuItem|JOptionPane|JFileChooser|GridBagLayout|GridBagConstraints|BorderLayout|FlowLayout|BoxLayout|BorderFactory|SwingConstants|SwingUtilities|UIManager|Color|Font|Dimension|Insets|Component|Box|ActionListener|ActionEvent|ChangeListener|ChangeEvent|Runnable|Flight|Seat|EconomySeat|BusinessSeat|FirstClassSeat|Passenger|Booking|Bookable|FlightDAO|BookingDAO|DatabaseConnection|SeatMapPanel|BookingPanel|FlightManagementPanel|ViewBookingsPanel|MainWindow|InvalidPassengerException|SeatAlreadyBookedException|FlightNotFoundException)\b/g,
                '<span class="syn-ty">$1</span>');
        }

        working = working.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="syn-num">$1</span>');

        working = working.replace(/___TOKEN_(\d+)___/g, function (_, idx) {
            return tokens[Number(idx)];
        });

        return working;
    }

    function showToast(msg) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(function () {
            toastEl.classList.remove('show');
        }, 2200);
    }

    function getFileById(id) {
        return DATA.files.find(function (f) { return f.id === id; });
    }

    function renderSidebar() {
        if (!navContainer) return;
        const q = searchQuery.trim().toLowerCase();
        const isStandalone = Boolean(window.STANDALONE_FILE_ID);
        const prefix = isStandalone ? '../index.html' : '';

        let html = '';

        // Study Guides section
        html += '<div class="nav-section">';
        html += '<div class="nav-section-title"><span>Study Modules</span></div>';
        const guides = [
            { id: 'overview', icon: 'architecture', label: 'Architecture & Overview' },
            { id: 'oop', icon: 'hub', label: '10 OOP Concepts Guide' },
            { id: 'all-files', icon: 'folder_Copy', label: 'All 20 Separate Files' }
        ];
        guides.forEach(function (g) {
            const active = (!isStandalone && currentView === g.id) ? 'active' : '';
            html += '<button class="nav-item ' + active + '" data-nav="' + g.id + '">';
            html += '<div class="nav-item-left"><span class="material-symbols-outlined">' + g.icon + '</span><span class="label">' + g.label + '</span></div>';
            html += '</button>';
        });
        html += '</div>';

        const pkgGroups = [
            { key: 'sql', title: 'Database Script (SQL)', icon: 'database' },
            { key: 'model', title: 'model/ Package (8)', icon: 'category' },
            { key: 'db', title: 'db/ Package (3)', icon: 'storage' },
            { key: 'exceptions', title: 'exceptions/ Package (3)', icon: 'warning' },
            { key: 'ui', title: 'ui/ Package (5)', icon: 'desktop_windows' }
        ];

        pkgGroups.forEach(function (group) {
            const matching = DATA.files.filter(function (f) {
                if (f.pkg !== group.key) return false;
                if (!q) return true;
                return f.name.toLowerCase().includes(q) ||
                       f.role.toLowerCase().includes(q) ||
                       f.concepts.some(function (c) { return c.toLowerCase().includes(q); }) ||
                       f.walkthrough.some(function (w) { return w.sig.toLowerCase().includes(q); });
            });

            if (matching.length === 0) return;

            html += '<div class="nav-section">';
            html += '<div class="nav-section-title"><span>' + group.title + '</span></div>';
            matching.forEach(function (f) {
                const active = (currentView === f.id) ? 'active' : '';
                const lineCount = f.code.split('\n').length;
                html += '<button class="nav-item ' + active + '" data-nav="' + f.id + '">';
                html += '<div class="nav-item-left"><span class="material-symbols-outlined">description</span><span class="label">' + f.name + '</span></div>';
                html += '<span class="pkg-badge">' + lineCount + 'L</span>';
                html += '</button>';
            });
            html += '</div>';
        });

        navContainer.innerHTML = html;

        navContainer.querySelectorAll('[data-nav]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const target = btn.getAttribute('data-nav');
                if (window.STANDALONE_FILE_ID) {
                    const targetFile = getFileById(target);
                    if (targetFile) {
                        window.location.href = '../' + targetFile.page;
                    } else {
                        window.location.href = '../index.html#' + target;
                    }
                    return;
                }
                navigateTo(target);
            });
        });
    }

    function renderOverview() {
        breadcrumbPkg.textContent = 'STUDY GUIDE';
        topbarTitle.textContent = 'Project Architecture & Complete Study Overview';
        viewSwitcher.style.display = 'none';
        fileActions.style.display = 'none';

        let html = '<div class="guide-scroll"><div class="guide-container">';

        // Hero
        html += '<div class="hero-card">';
        html += '<div class="hero-badge"><span class="material-symbols-outlined">flight_takeoff</span> Java Swing + MySQL JDBC</div>';
        html += '<h2>' + DATA.projectMeta.title + '</h2>';
        html += '<p>Complete interactive study guide and comment-free code repository for the Airline Ticket Management System. Explore all <strong>20 source files</strong> (19 Java classes across 4 packages + 1 MySQL setup script) with side-by-side line-by-line explanations, OOP concepts, and downloadable comment-free files.</p>';
        html += '</div>';

        // Stats
        html += '<div class="stats-grid">';
        html += '<div class="stat-card"><span class="stat-label"><span class="material-symbols-outlined">code</span> Total Source Files</span><span class="stat-value">20</span><span class="stat-sub">19 Java + 1 SQL (0 comments)</span></div>';
        html += '<div class="stat-card"><span class="stat-label"><span class="material-symbols-outlined">folder</span> Java Packages</span><span class="stat-value">4</span><span class="stat-sub">model, db, exceptions, ui</span></div>';
        html += '<div class="stat-card"><span class="stat-label"><span class="material-symbols-outlined">hub</span> OOP & Design Patterns</span><span class="stat-value">10</span><span class="stat-sub">Singleton, DAO, Polymorphism, Threading</span></div>';
        html += '<div class="stat-card"><span class="stat-label"><span class="material-symbols-outlined">airline_seat_recline_extra</span> Cabin Allocation</span><span class="stat-value">60/25/15%</span><span class="stat-sub">Economy (1x), Business (1.5x), First (2x)</span></div>';
        html += '</div>';

        // End-to-End Execution Flow
        html += '<div class="section-card">';
        html += '<h3><span class="material-symbols-outlined">route</span> End-to-End Application Execution Flow</h3>';
        html += '<div class="cards-grid">';
        DATA.architectureFlow.forEach(function (item) {
            html += '<div class="info-card">';
            html += '<div class="info-card-header"><span class="concept-tag">' + item.step + '</span></div>';
            html += '<h4>' + item.title + '</h4>';
            html += '<p>' + item.desc + '</p>';
            html += '</div>';
        });
        html += '</div></div>';

        // Package Directory Quick Jump
        html += '<div class="section-card">';
        html += '<h3><span class="material-symbols-outlined">account_tree</span> Package Breakdown & Comment-Free Files</h3>';
        html += '<div class="cards-grid">';
        DATA.files.forEach(function (f) {
            const lines = f.code.split('\n').length;
            html += '<div class="info-card">';
            html += '<div class="info-card-header"><h4>' + f.name + '</h4><span class="pkg-badge">' + f.pkg + ' · ' + lines + 'L</span></div>';
            html += '<p>' + f.role + '</p>';
            html += '<div style="display:flex;gap:0.45rem;flex-wrap:wrap;margin-top:auto;">';
            html += '<button class="file-jump-chip" data-open-file="' + f.id + '"><span class="material-symbols-outlined">menu_book</span> Study & Explain</button>';
            html += '<a class="file-jump-chip" href="' + f.path + '" target="_blank"><span class="material-symbols-outlined">code</span> Raw File</a>';
            html += '<a class="file-jump-chip" href="' + f.page + '"><span class="material-symbols-outlined">open_in_new</span> Standalone Page</a>';
            html += '</div></div>';
        });
        html += '</div></div>';

        // Compile & Run Commands
        html += '<div class="section-card">';
        html += '<h3><span class="material-symbols-outlined">terminal</span> Compilation & Execution Commands</h3>';
        html += '<div class="study-table-wrap"><table class="study-table"><thead><tr><th>Step</th><th>Command (Windows)</th><th>Explanation</th></tr></thead><tbody>';
        html += '<tr><td><strong>1. Database Setup</strong></td><td><code>mysql -u root -p &lt; database_setup.sql</code></td><td>Creates <code>airline_management</code> database, <code>flights</code> and <code>bookings</code> tables, indexes, and 5 sample flights.</td></tr>';
        html += '<tr><td><strong>2. Compile All Packages</strong></td><td><code>' + escapeHtml(DATA.projectMeta.compileCmd) + '</code></td><td>Compiles all 19 Java files across <code>model</code>, <code>db</code>, <code>exceptions</code>, and <code>ui</code> with the MySQL JDBC driver on the classpath.</td></tr>';
        html += '<tr><td><strong>3. Launch Swing GUI</strong></td><td><code>' + escapeHtml(DATA.projectMeta.runCmd) + '</code></td><td>Starts <code>ui.MainWindow</code> on the Swing Event Dispatch Thread.</td></tr>';
        html += '</tbody></table></div></div>';

        html += '</div></div>';
        workspaceBody.innerHTML = html;

        workspaceBody.querySelectorAll('[data-open-file]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                navigateTo(btn.getAttribute('data-open-file'));
            });
        });
    }

    function renderOopGuide() {
        breadcrumbPkg.textContent = 'OOP & PATTERNS';
        topbarTitle.textContent = '10 OOP Concepts & Design Patterns Mapped to Code';
        viewSwitcher.style.display = 'none';
        fileActions.style.display = 'none';

        let html = '<div class="guide-scroll"><div class="guide-container">';
        html += '<div class="hero-card">';
        html += '<div class="hero-badge"><span class="material-symbols-outlined">school</span> Exam & Viva Reference</div>';
        html += '<h2>Object-Oriented Programming & Design Patterns</h2>';
        html += '<p>Every core Java OOP principle and architectural pattern demonstrated in this project, mapped directly to the exact classes and methods where it is implemented.</p>';
        html += '</div>';

        html += '<div class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));">';
        DATA.oopConcepts.forEach(function (c) {
            html += '<div class="info-card">';
            html += '<div class="info-card-header"><h4>' + c.title + '</h4><span class="concept-tag">' + c.badge + '</span></div>';
            html += '<p><strong>What it does:</strong> ' + c.summary + '</p>';
            html += '<p>' + c.details + '</p>';
            html += '<div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:0.35rem;">';
            c.files.forEach(function (fid) {
                html += '<button class="file-jump-chip" data-open-file="' + fid + '"><span class="material-symbols-outlined">arrow_forward</span> ' + fid + '</button>';
            });
            html += '</div></div>';
        });
        html += '</div></div></div>';

        workspaceBody.innerHTML = html;
        workspaceBody.querySelectorAll('[data-open-file]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                navigateTo(btn.getAttribute('data-open-file'));
            });
        });
    }

    function renderAllFilesDirectory() {
        breadcrumbPkg.textContent = 'SEPARATE FILES';
        topbarTitle.textContent = 'All 20 Comment-Free Source Files & Standalone Study Pages';
        viewSwitcher.style.display = 'none';
        fileActions.style.display = 'none';

        let html = '<div class="guide-scroll"><div class="guide-container">';
        html += '<div class="section-card">';
        html += '<h3><span class="material-symbols-outlined">folder_open</span> Complete Comment-Free File Index</h3>';
        html += '<p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:1rem;">Every file below has been stripped of all comments and saved both as a standalone raw source file in <code>website/code/</code> and as an individual study page in <code>website/pages/</code>.</p>';
        html += '<div class="study-table-wrap"><table class="study-table"><thead><tr><th>#</th><th>Package</th><th>File Name</th><th>Lines</th><th>Role & Purpose</th><th>Separate Files</th></tr></thead><tbody>';

        DATA.files.forEach(function (f, idx) {
            const lines = f.code.split('\n').length;
            html += '<tr>';
            html += '<td>' + (idx + 1) + '</td>';
            html += '<td><code>' + f.pkg + '</code></td>';
            html += '<td><strong>' + f.name + '</strong></td>';
            html += '<td><code>' + lines + '</code></td>';
            html += '<td>' + f.role + '</td>';
            html += '<td style="white-space:nowrap;">';
            html += '<button class="file-jump-chip" data-open-file="' + f.id + '" style="margin-right:0.35rem;"><span class="material-symbols-outlined">visibility</span> Split View</button>';
            html += '<a class="file-jump-chip" href="' + f.path + '" target="_blank" style="margin-right:0.35rem;"><span class="material-symbols-outlined">description</span> Raw (' + f.path + ')</a>';
            html += '<a class="file-jump-chip" href="' + f.page + '"><span class="material-symbols-outlined">open_in_new</span> Standalone HTML</a>';
            html += '</td></tr>';
        });

        html += '</tbody></table></div></div></div></div>';
        workspaceBody.innerHTML = html;

        workspaceBody.querySelectorAll('[data-open-file]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                navigateTo(btn.getAttribute('data-open-file'));
            });
        });
    }

    function renderFileStudy(file) {
        const isStandalone = Boolean(window.STANDALONE_FILE_ID);
        const relPrefix = isStandalone ? '../' : '';

        breadcrumbPkg.textContent = file.pkg.toUpperCase();
        topbarTitle.textContent = file.id;
        viewSwitcher.style.display = 'inline-flex';
        fileActions.style.display = 'inline-flex';

        if (rawFileLink) rawFileLink.href = relPrefix + file.path;
        if (standaloneLink) {
            if (isStandalone) {
                standaloneLink.href = '../index.html#file=' + encodeURIComponent(file.id);
                standaloneLink.innerHTML = '<span class="material-symbols-outlined">dashboard</span><span>Full Portal</span>';
            } else {
                standaloneLink.href = file.page;
                standaloneLink.innerHTML = '<span class="material-symbols-outlined">open_in_new</span><span>Standalone Page</span>';
            }
        }

        const lines = file.code.split('\n');
        const modeClass = currentMode === 'code' ? 'mode-code' : (currentMode === 'study' ? 'mode-study' : '');

        let html = '<div class="file-study-workspace ' + modeClass + '" id="fileWorkspace">';

        // Left Pane: Comment-Free Code
        html += '<section class="code-pane" aria-label="Comment-free source code">';
        html += '<div class="pane-Banner">';
        html += '<div class="pane-banner-left"><span class="material-symbols-outlined" style="font-size:1rem;color:var(--primary)">code</span> <strong>' + file.id + '</strong> <span>(' + lines.length + ' lines · 0 comments)</span></div>';
        html += '<div class="pane-banner-right"><span>Click any explanation card on the right to highlight lines</span></div>';
        html += '</div>';
        html += '<div class="code-scroll-container" id="codeScrollContainer">';
        html += '<table class="code-table"><tbody>';
        lines.forEach(function (lineText, i) {
            const lineNum = i + 1;
            html += '<tr class="code-line" id="code-line-' + lineNum + '" data-line="' + lineNum + '">';
            html += '<td class="line-num">' + lineNum + '</td>';
            html += '<td class="line-code">' + (lineText.length ? highlightLine(lineText, file.pkg) : ' ') + '</td>';
            html += '</tr>';
        });
        html += '</tbody></table></div></section>';

        // Right Pane: Study & Explanation
        html += '<section class="study-pane" aria-label="Code explanation and study guide">';
        html += '<div class="pane-Banner">';
        html += '<div class="pane-banner-left"><span class="material-symbols-outlined" style="font-size:1rem;color:var(--primary)">menu_book</span> <strong>Detailed Code Walkthrough & Study Guide</strong></div>';
        html += '<div class="pane-banner-right"><a class="file-jump-chip" href="' + relPrefix + file.path + '" download="' + file.name + '" style="margin:0;"><span class="material-symbols-outlined" style="font-size:0.9rem;">download</span> Download ' + file.name + '</a></div>';
        html += '</div>';
        html += '<div class="study-scroll-container">';

        // 1. Summary & Concepts Card
        html += '<div class="study-summary-card">';
        html += '<h2>' + file.name + '</h2>';
        html += '<p>' + file.role + '</p>';
        html += '<div class="concept-tags">';
        file.concepts.forEach(function (tag) {
            html += '<span class="concept-tag">' + tag + '</span>';
        });
        html += '</div></div>';

        // 2. Fields / State Table
        if (file.fields && file.fields.length > 0) {
            html += '<div class="section-card">';
            html += '<h3><span class="material-symbols-outlined">data_object</span> Class Attributes / Schema Fields</h3>';
            html += '<div class="study-table-wrap"><table class="study-table"><thead><tr><th>Identifier</th><th>Type / Modifier</th><th>Purpose in System</th></tr></thead><tbody>';
            file.fields.forEach(function (fld) {
                html += '<tr><td><code>' + escapeHtml(fld.name) + '</code></td><td><code>' + escapeHtml(fld.type) + '</code></td><td>' + escapeHtml(fld.desc) + '</td></tr>';
            });
            html += '</tbody></table></div></div>';
        }

        // 3. Method-by-Method & Line-by-Line Walkthrough
        html += '<div class="section-card">';
        html += '<h3><span class="material-symbols-outlined">plagiarism</span> Method-by-Method & Line-by-Line Walkthrough</h3>';
        html += '<div class="walkthrough-list">';
        file.walkthrough.forEach(function (w, idx) {
            const startL = w.lines[0];
            const endL = w.lines[1];
            html += '<div class="walkthrough-card" data-start="' + startL + '" data-end="' + endL + '">';
            html += '<div class="walkthrough-header">';
            html += '<span class="walkthrough-sig">' + escapeHtml(w.sig) + '</span>';
            html += '<span class="line-badge">Lines ' + startL + '–' + endL + '</span>';
            html += '</div>';
            html += '<p class="walkthrough-desc">' + escapeHtml(w.desc) + '</p>';
            html += '<ul class="walkthrough-points">';
            w.points.forEach(function (pt) {
                html += '<li>' + escapeHtml(pt) + '</li>';
            });
            html += '</ul></div>';
        });
        html += '</div></div>';

        // 4. Key Viva / Exam Questions
        if (file.viva && file.viva.length > 0) {
            html += '<div class="viva-box">';
            html += '<h4><span class="material-symbols-outlined">quiz</span> Key Viva & Exam Takeaways</h4>';
            html += '<ul>';
            file.viva.forEach(function (v) {
                html += '<li>' + escapeHtml(v) + '</li>';
            });
            html += '</ul></div>';
        }

        html += '</div></section></div>';
        workspaceBody.innerHTML = html;

        // Interactive line highlighting on walkthrough card click
        const cards = workspaceBody.querySelectorAll('.walkthrough-card');
        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                cards.forEach(function (c) { c.classList.remove('active'); });
                card.classList.add('active');

                const start = parseInt(card.getAttribute('data-start'), 10);
                const end = parseInt(card.getAttribute('data-end'), 10);

                workspaceBody.querySelectorAll('.code-line.line-active').forEach(function (row) {
                    row.classList.remove('line-active');
                });

                for (let l = start; l <= end; l++) {
                    const row = document.getElementById('code-line-' + l);
                    if (row) row.classList.add('line-active');
                }

                const firstRow = document.getElementById('code-line-' + start);
                const scrollContainer = document.getElementById('codeScrollContainer');
                if (firstRow && scrollContainer) {
                    scrollContainer.scrollTo({
                        top: Math.max(0, firstRow.offsetTop - 60),
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function navigateTo(targetId, skipHash) {
        currentView = targetId;
        renderSidebar();

        const file = getFileById(targetId);
        if (file) {
            renderFileStudy(file);
            if (!skipHash && !window.STANDALONE_FILE_ID) {
                history.replaceState(null, '', '#file=' + encodeURIComponent(file.id));
            }
        } else if (targetId === 'oop') {
            renderOopGuide();
            if (!skipHash && !window.STANDALONE_FILE_ID) history.replaceState(null, '', '#oop');
        } else if (targetId === 'all-files') {
            renderAllFilesDirectory();
            if (!skipHash && !window.STANDALONE_FILE_ID) history.replaceState(null, '', '#all-files');
        } else {
            currentView = 'overview';
            renderOverview();
            if (!skipHash && !window.STANDALONE_FILE_ID) history.replaceState(null, '', '#overview');
        }
    }

    // View mode switcher (Split / Code / Study)
    if (viewSwitcher) {
        viewSwitcher.querySelectorAll('[data-mode]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentMode = btn.getAttribute('data-mode');
                viewSwitcher.querySelectorAll('[data-mode]').forEach(function (b) {
                    b.classList.toggle('active', b === btn);
                });
                const ws = document.getElementById('fileWorkspace');
                if (ws) {
                    ws.classList.remove('mode-code', 'mode-study');
                    if (currentMode === 'code') ws.classList.add('mode-code');
                    if (currentMode === 'study') ws.classList.add('mode-study');
                }
            });
        });
    }

    // Copy code button
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', function () {
            const file = getFileById(currentView);
            if (!file) return;
            navigator.clipboard.writeText(file.code).then(function () {
                showToast('Copied comment-free ' + file.name + ' to clipboard!');
            });
        });
    }

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            searchQuery = e.target.value || '';
            renderSidebar();
        });
    }

    // Theme toggle
    function initTheme() {
        const saved = localStorage.getItem('airline_study_theme');
        if (saved === 'light') {
            document.documentElement.classList.remove('dark');
            if (themeIcon) themeIcon.textContent = 'light_mode';
        } else {
            document.documentElement.classList.add('dark');
            if (themeIcon) themeIcon.textContent = 'dark_mode';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('airline_study_theme', isDark ? 'dark' : 'light');
            if (themeIcon) themeIcon.textContent = isDark ? 'dark_mode' : 'light_mode';
        });
    }

    function initFromHash() {
        if (window.STANDALONE_FILE_ID) {
            navigateTo(window.STANDALONE_FILE_ID, true);
            return;
        }
        const hash = window.location.hash || '';
        if (hash.startsWith('#file=')) {
            const fid = decodeURIComponent(hash.slice(6));
            if (getFileById(fid)) {
                navigateTo(fid, true);
                return;
            }
        } else if (hash === '#oop') {
            navigateTo('oop', true);
            return;
        } else if (hash === '#all-files') {
            navigateTo('all-files', true);
            return;
        }
        navigateTo('overview', true);
    }

    window.addEventListener('hashchange', initFromHash);
    initTheme();
    initFromHash();
})();
