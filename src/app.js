import './styles.css';

class ZenDash {
    constructor() {
        this.folders = [];
        this.notes = [];
        this.settings = {};
        this.currentFolderId = null;
        this.isDragging = false;
        this.currentDragNote = null;
        this.dragOffset = { x: 0, y: 0 };
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.updateClock();
        this.updateGreeting();
        this.renderFolders();
        this.renderNotes();
        this.loadWallpaper();
        this.loadQuote();
        
        // Update clock every second
        setInterval(() => this.updateClock(), 1000);
        
        // Update greeting every minute
        setInterval(() => this.updateGreeting(), 60000);
        
        // Change wallpaper every hour
        setInterval(() => this.loadWallpaper(), 3600000);
    }

    async loadData() {
        try {
            const data = await this.getStorageData();
            this.folders = data.folders || [
                { id: 'f1', name: 'Pekerjaan', todos: [], expanded: false },
                { id: 'f2', name: 'Pribadi', todos: [], expanded: false },
                { id: 'f3', name: 'Belajar', todos: [], expanded: false }
            ];
            this.notes = data.notes || [];
            this.settings = data.settings || {
                userName: 'User',
                theme: 'auto'
            };
        } catch (error) {
            console.error('Error loading data:', error);
            this.folders = [
                { id: 'f1', name: 'Pekerjaan', todos: [], expanded: false },
                { id: 'f2', name: 'Pribadi', todos: [], expanded: false },
                { id: 'f3', name: 'Belajar', todos: [], expanded: false }
            ];
            this.notes = [];
            this.settings = { userName: 'User', theme: 'auto' };
        }
    }

    async saveData() {
        try {
            await this.setStorageData({
                folders: this.folders,
                notes: this.notes,
                settings: this.settings
            });
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    getStorageData() {
        return new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                chrome.storage.local.get(['folders', 'notes', 'settings'], (result) => {
                    resolve(result);
                });
            } else {
                // Fallback to localStorage for development
                const folders = localStorage.getItem('zendash_folders');
                const notes = localStorage.getItem('zendash_notes');
                const settings = localStorage.getItem('zendash_settings');
                resolve({
                    folders: folders ? JSON.parse(folders) : null,
                    notes: notes ? JSON.parse(notes) : null,
                    settings: settings ? JSON.parse(settings) : null
                });
            }
        });
    }

    setStorageData(data) {
        return new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                chrome.storage.local.set(data, () => {
                    resolve();
                });
            } else {
                // Fallback to localStorage for development
                if (data.folders) localStorage.setItem('zendash_folders', JSON.stringify(data.folders));
                if (data.notes) localStorage.setItem('zendash_notes', JSON.stringify(data.notes));
                if (data.settings) localStorage.setItem('zendash_settings', JSON.stringify(data.settings));
                resolve();
            }
        });
    }

    updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }

    updateGreeting() {
        const hour = new Date().getHours();
        const name = this.settings.userName || 'User';
        let greeting = 'Selamat ';
        
        if (hour < 10) greeting += 'Pagi';
        else if (hour < 15) greeting += 'Siang';
        else if (hour < 18) greeting += 'Sore';
        else greeting += 'Malam';
        
        greeting += `, ${name}`;
        
        const greetingElement = document.getElementById('greeting');
        if (greetingElement) {
            greetingElement.textContent = greeting;
        }
    }

    async loadWallpaper() {
        try {
            // First try: Picsum Photos (reliable, fast, no key required)
            // Use a specific seed based on the hour to keep it consistent for the hour but changing
            const hour = new Date().getHours();
            const date = new Date().getDate();
            const seed = `zendash-${date}-${hour}`;
            const imageUrl = `https://picsum.photos/seed/${seed}/1920/1080?grayscale&blur=2`; // Add blur for better text visibility
            
            // Preload image to avoid flash
            const img = new Image();
            img.onload = () => {
                 const wallpaperElement = document.getElementById('wallpaper');
                 if (wallpaperElement) {
                     wallpaperElement.style.backgroundImage = `url(${imageUrl})`;
                     console.log('Wallpaper loaded from Picsum');
                 }
            };
            img.onerror = () => { throw new Error('Picsum failed'); };
            img.src = imageUrl;

        } catch (error) {
            console.log('Wallpaper fetch failed, using gradient fallback:', error);
            this.setGradientFallback();
        }
    }

    setGradientFallback() {
         const gradients = [
            'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e8ba3 100%)', // Blue sky theme
            'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', // Mosque dome theme
            'linear-gradient(135deg, #232526 0%, #414345 100%)', // Night mosque theme
            'linear-gradient(135deg, #8b0000 0%, #dc143c 50%, #ff6b6b 100%)', // Red Islamic pattern
            'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', // Islamic blue
            'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5e35b1 100%)', // Royal Islamic
            'linear-gradient(135deg, #263238 0%, #37474f 50%, #455a64 100%)', // Dark mosque theme
            'linear-gradient(135deg, #3e2723 0%, #5d4037 50%, #8d6e63 100%)' // Brown desert theme
        ];
        
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
        const wallpaperElement = document.getElementById('wallpaper');
        if (wallpaperElement) {
            wallpaperElement.style.background = randomGradient;
        }
    }

    async loadQuote() {
        try {
            // Valid public API
            const response = await fetch('https://dummyjson.com/quotes/random');
            if (response.ok) {
                const data = await response.json();
                this.updateQuote(data.quote, data.author);
                return;
            }
            throw new Error('Quote API failed');
        } catch (error) {
             console.log('Quote API failed, using local fallback:', error);
             const quotes = [
                { text: "Kesuksesan adalah kemampuan untuk bangkit kembali dari kegagalan.", author: "Winston Churchill" },
                { text: "Jangan menunggu kesempurnaan. Mulai dengan apa yang Anda miliki.", author: "Anonymous" },
                { text: "Kegagalan adalah bumbu yang membuat kesuksesan terasa lebih manis.", author: "Anonymous" },
                { text: "Hari ini adalah hadiah, itulah mengapa disebut sebagai masa kini.", author: "Eleanor Roosevelt" },
                { text: "Satu langkah kecil setiap hari akan membawa Anda ke tempat yang Anda inginkan.", author: "Anonymous" }
            ];
            
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            this.updateQuote(randomQuote.text, randomQuote.author);
        }
    }

    updateQuote(text, author) {
        const quoteTextElement = document.getElementById('quote-text');
        const quoteAuthorElement = document.getElementById('quote-author');
        
        if (quoteTextElement) {
            quoteTextElement.textContent = `"${text}"`;
            quoteTextElement.classList.add('animate-slide-up');
        }
        
        if (quoteAuthorElement) {
            quoteAuthorElement.textContent = `— ${author}`;
        }
    }

    renderFolders() {
        const container = document.getElementById('folders-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.folders.forEach(folder => {
            const folderElement = this.createFolderElement(folder);
            container.appendChild(folderElement);
        });
    }

    createFolderElement(folder) {
        const folderDiv = document.createElement('div');
        folderDiv.className = 'folder-item mb-2';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'glass rounded-lg p-3 cursor-pointer flex items-center justify-between';
        headerDiv.innerHTML = `
            <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 transition-transform ${folder.expanded ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <span class="font-medium">${folder.name}</span>
                <span class="ml-2 text-sm opacity-70">(${folder.todos.filter(t => !t.completed).length}/${folder.todos.length})</span>
            </div>
            <div class="flex space-x-2">
                <button class="add-todo-btn p-1 hover:bg-white hover:bg-opacity-20 rounded" data-folder-id="${folder.id}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                </button>
                <button class="delete-folder-btn p-1 hover:bg-white hover:bg-opacity-20 rounded" data-folder-id="${folder.id}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        `;
        
        const todosDiv = document.createElement('div');
        todosDiv.className = `mt-2 space-y-1 ${folder.expanded ? 'block' : 'hidden'}`;
        
        folder.todos.forEach(todo => {
            const todoElement = this.createTodoElement(folder.id, todo);
            todosDiv.appendChild(todoElement);
        });
        
        headerDiv.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                folder.expanded = !folder.expanded;
                this.saveData();
                this.renderFolders();
            }
        });
        
        folderDiv.appendChild(headerDiv);
        folderDiv.appendChild(todosDiv);
        
        return folderDiv;
    }

    createTodoElement(folderId, todo) {
        const todoDiv = document.createElement('div');
        todoDiv.className = 'todo-item flex items-center p-2 glass rounded';
        todoDiv.innerHTML = `
            <input type="checkbox" class="mr-3" ${todo.completed ? 'checked' : ''} data-folder-id="${folderId}" data-todo-id="${todo.id}">
            <span class="${todo.completed ? 'line-through opacity-60' : ''}">${todo.text}</span>
            <button class="ml-auto delete-todo-btn p-1 hover:bg-white hover:bg-opacity-20 rounded" data-folder-id="${folderId}" data-todo-id="${todo.id}">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;
        
        return todoDiv;
    }

    renderNotes() {
        const container = document.getElementById('notes-grid');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.notes.forEach(note => {
            const noteElement = this.createNoteElement(note);
            container.appendChild(noteElement);
        });
    }

    createNoteElement(note) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'sticky-note relative bg-yellow-200 p-3 rounded-lg shadow-lg cursor-move w-48 min-h-[120px] transition-transform hover:scale-105';
        noteDiv.dataset.noteId = note.id;
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'flex justify-between items-start mb-2';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'font-semibold text-gray-800 text-sm flex-1';
        titleDiv.textContent = note.title || 'Note';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'text-red-500 hover:text-red-700 text-xs ml-1';
        deleteBtn.innerHTML = '×';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteNote(note.id);
        });
        
        headerDiv.appendChild(titleDiv);
        headerDiv.appendChild(deleteBtn);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'text-gray-700 text-sm whitespace-pre-wrap break-words';
        contentDiv.textContent = note.content;
        
        noteDiv.appendChild(headerDiv);
        noteDiv.appendChild(contentDiv);
        
        // Add drag functionality
        noteDiv.addEventListener('mousedown', (e) => this.startDrag(e, note.id));
        
        return noteDiv;
    }

    startDrag(e, noteId) {
        if (e.target.tagName === 'BUTTON') return;
        
        this.isDragging = true;
        this.currentDragNote = noteId;
        
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;
        
        const noteElement = e.currentTarget;
        const rect = noteElement.getBoundingClientRect();
        
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        
        // Create dragging clone
        const clone = noteElement.cloneNode(true);
        clone.id = 'dragging-clone';
        clone.className = clone.className.replace('relative', 'fixed') + ' opacity-75 z-50 pointer-events-none';
        clone.style.left = (e.clientX - this.dragOffset.x) + 'px';
        clone.style.top = (e.clientY - this.dragOffset.y) + 'px';
        clone.style.width = rect.width + 'px';
        
        document.body.appendChild(clone);
        noteElement.style.opacity = '0.3';
        
        // Add global mouse events
        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.stopDrag);
        
        e.preventDefault();
    }

    handleDrag = (e) => {
        if (!this.isDragging) return;
        
        const clone = document.getElementById('dragging-clone');
        if (clone) {
            clone.style.left = (e.clientX - this.dragOffset.x) + 'px';
            clone.style.top = (e.clientY - this.dragOffset.y) + 'px';
        }
    }

    stopDrag = () => {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const clone = document.getElementById('dragging-clone');
        if (clone) {
            clone.remove();
        }
        
        // Restore opacity
        document.querySelectorAll('.sticky-note').forEach(note => {
            note.style.opacity = '';
        });
        
        // Remove global listeners
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.stopDrag);
    }

    setupEventListeners() {
        // Refresh quote button
        const refreshQuoteBtn = document.getElementById('refresh-quote');
        if (refreshQuoteBtn) {
            refreshQuoteBtn.addEventListener('click', () => this.loadQuote());
        }
        
        // Add folder button
        const addFolderBtn = document.getElementById('add-folder');
        if (addFolderBtn) {
            addFolderBtn.addEventListener('click', () => this.showFolderModal());
        }
        
        // Folder modal
        const saveFolderBtn = document.getElementById('save-folder');
        const cancelFolderBtn = document.getElementById('cancel-folder');
        const folderModal = document.getElementById('folder-modal');
        
        if (saveFolderBtn) {
            saveFolderBtn.addEventListener('click', () => this.saveFolder());
        }
        
        if (cancelFolderBtn) {
            cancelFolderBtn.addEventListener('click', () => this.hideFolderModal());
        }
        
        // Todo modal
        const saveTodoBtn = document.getElementById('save-todo');
        const cancelTodoBtn = document.getElementById('cancel-todo');
        
        if (saveTodoBtn) {
            saveTodoBtn.addEventListener('click', () => this.saveTodo());
        }
        
        if (cancelTodoBtn) {
            cancelTodoBtn.addEventListener('click', () => this.hideTodoModal());
        }
        
        // Sticky notes functionality
        const notesToggleBtn = document.getElementById('notes-toggle');
        const notesPanel = document.getElementById('notes-panel');
        const notesToggleText = document.getElementById('notes-toggle-text');
        const addNoteBtn = document.getElementById('add-note');
        
        if (notesToggleBtn && notesPanel && notesToggleText) {
            notesToggleBtn.addEventListener('click', () => {
                const isHidden = notesPanel.classList.contains('hidden');
                if (isHidden) {
                    notesPanel.classList.remove('hidden');
                    notesToggleText.textContent = '📝 Hide Notes';
                } else {
                    notesPanel.classList.add('hidden');
                    notesToggleText.textContent = '📝 Show Notes';
                }
            });
        }
        
        if (addNoteBtn) {
            addNoteBtn.addEventListener('click', () => this.showNoteModal());
        }
        
        // Note modal
        const saveNoteBtn = document.getElementById('save-note');
        const cancelNoteBtn = document.getElementById('cancel-note');
        
        if (saveNoteBtn) {
            saveNoteBtn.addEventListener('click', () => this.saveNote());
        }
        
        if (cancelNoteBtn) {
            cancelNoteBtn.addEventListener('click', () => this.hideNoteModal());
        }
        
        // Event delegation for dynamically created elements
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.add-todo-btn, .delete-folder-btn, .delete-todo-btn, input[type="checkbox"]');
            
            if (target && target.matches('.add-todo-btn')) {
                e.preventDefault();
                this.currentFolderId = target.dataset.folderId;
                console.log('Add todo clicked for folder:', this.currentFolderId);
                this.showTodoModal();
            } else if (target && target.matches('.delete-folder-btn')) {
                e.preventDefault();
                this.deleteFolder(target.dataset.folderId);
            } else if (target && target.matches('.delete-todo-btn')) {
                e.preventDefault();
                this.deleteTodo(target.dataset.folderId, target.dataset.todoId);
            } else if (target && target.matches('input[type="checkbox"]')) {
                e.preventDefault();
                this.toggleTodo(target.dataset.folderId, target.dataset.todoId);
            }
        });
        
        // Enter key support for modals
        const folderNameInput = document.getElementById('folder-name');
        const todoTextInput = document.getElementById('todo-text');
        const noteTitleInput = document.getElementById('note-title');
        const noteContentInput = document.getElementById('note-content');
        
        if (folderNameInput) {
            folderNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.saveFolder();
            });
        }
        
        if (todoTextInput) {
            todoTextInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.saveTodo();
            });
        }
        
        if (noteContentInput) {
            noteContentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.saveNote();
                }
            });
        }
    }

    showFolderModal() {
        const modal = document.getElementById('folder-modal');
        const input = document.getElementById('folder-name');
        if (modal && input) {
            modal.classList.remove('hidden');
            input.value = '';
            input.focus();
        }
    }

    hideFolderModal() {
        const modal = document.getElementById('folder-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showTodoModal() {
        const modal = document.getElementById('todo-modal');
        const input = document.getElementById('todo-text');
        if (modal && input) {
            modal.classList.remove('hidden');
            input.value = '';
            input.focus();
        }
    }

    hideTodoModal() {
        const modal = document.getElementById('todo-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.currentFolderId = null;
    }

    async saveFolder() {
        const input = document.getElementById('folder-name');
        if (!input || !input.value.trim()) return;
        
        const newFolder = {
            id: 'f' + Date.now(),
            name: input.value.trim(),
            todos: [],
            expanded: false
        };
        
        this.folders.push(newFolder);
        await this.saveData();
        this.renderFolders();
        this.hideFolderModal();
    }

    async saveTodo() {
        const input = document.getElementById('todo-text');
        if (!input || !input.value.trim() || !this.currentFolderId) {
            console.warn('Cannot save todo: missing input, folder ID, or empty text');
            return;
        }
        
        const folder = this.folders.find(f => f.id === this.currentFolderId);
        if (!folder) {
            console.warn('Cannot save todo: folder not found with ID', this.currentFolderId);
            return;
        }
        
        const newTodo = {
            id: 't' + Date.now(),
            text: input.value.trim(),
            completed: false
        };
        
        folder.todos.push(newTodo);
        await this.saveData();
        this.renderFolders();
        this.hideTodoModal();
        
        // Auto expand the folder to show the new todo
        folder.expanded = true;
        await this.saveData();
        this.renderFolders();
    }

    async deleteFolder(folderId) {
        if (!confirm('Apakah Anda yakin ingin menghapus folder ini?')) return;
        
        this.folders = this.folders.filter(f => f.id !== folderId);
        await this.saveData();
        this.renderFolders();
    }

    async deleteTodo(folderId, todoId) {
        const folder = this.folders.find(f => f.id === folderId);
        if (!folder) return;
        
        folder.todos = folder.todos.filter(t => t.id !== todoId);
        await this.saveData();
        this.renderFolders();
    }

    async toggleTodo(folderId, todoId) {
        const folder = this.folders.find(f => f.id === folderId);
        if (!folder) return;
        
        const todo = folder.todos.find(t => t.id === todoId);
        if (!todo) return;
        
        todo.completed = !todo.completed;
        await this.saveData();
        this.renderFolders();
    }

    showNoteModal() {
        const modal = document.getElementById('note-modal');
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');
        if (modal && titleInput && contentInput) {
            modal.classList.remove('hidden');
            titleInput.value = '';
            contentInput.value = '';
            contentInput.focus();
        }
    }

    hideNoteModal() {
        const modal = document.getElementById('note-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    async saveNote() {
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');
        
        if (!contentInput || !contentInput.value.trim()) {
            console.warn('Cannot save note: missing content or empty');
            return;
        }
        
        const newNote = {
            id: 'n' + Date.now(),
            title: titleInput ? titleInput.value.trim() : '',
            content: contentInput.value.trim(),
            createdAt: new Date().toISOString()
        };
        
        this.notes.push(newNote);
        await this.saveData();
        this.renderNotes();
        this.hideNoteModal();
        
        // Auto show the notes panel if hidden
        const notesPanel = document.getElementById('notes-panel');
        const notesToggleText = document.getElementById('notes-toggle-text');
        if (notesPanel && notesPanel.classList.contains('hidden')) {
            notesPanel.classList.remove('hidden');
            if (notesToggleText) {
                notesToggleText.textContent = '📝 Hide Notes';
            }
        }
    }

    async deleteNote(noteId) {
        if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return;
        
        this.notes = this.notes.filter(n => n.id !== noteId);
        await this.saveData();
        this.renderNotes();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ZenDash();
});
