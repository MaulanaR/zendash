// Background service worker for ZenDash extension

// Install event - set up initial storage
chrome.runtime.onInstalled.addListener(() => {
    console.log('ZenDash extension installed');
    
    // Initialize default data
    chrome.storage.local.get(['folders', 'settings'], (result) => {
        if (!result.folders) {
            const defaultFolders = [
                { id: 'f1', name: 'Pekerjaan', todos: [], expanded: false },
                { id: 'f2', name: 'Pribadi', todos: [], expanded: false },
                { id: 'f3', name: 'Belajar', todos: [], expanded: false }
            ];
            chrome.storage.local.set({ folders: defaultFolders });
        }
        
        if (!result.settings) {
            const defaultSettings = {
                userName: 'User',
                theme: 'auto'
            };
            chrome.storage.local.set({ settings: defaultSettings });
        }
    });
});

// Set up alarm for daily wallpaper updates
chrome.alarms.create('dailyUpdate', {
    periodInMinutes: 1440 // 24 hours
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'dailyUpdate') {
        console.log('Daily update triggered');
        // Could trigger background tasks here if needed
    }
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
        console.log('Storage changed:', changes);
    }
});
