<script lang="ts">
    import type { PageData } from "./$types"
    import { onMount } from 'svelte';
    
    interface ProjectFile {
        id: string;
        name: string;
        type: 'image' | 'file' | 'link';
        url: string;
        uploadDate: Date;
        description?: string;
    }
    
    interface Project {
        id: string;
        name: string;
        description: string;
        files: ProjectFile[];
        createdDate: Date;
        tags: string[];
    }
    
    let projects: Project[] = [];
    let selectedProject: Project | null = null;
    let showNewProjectForm = false;
    let showAddFileForm = false;
    let fileInput: HTMLInputElement;
    let dragOver = false;
    let loading = false;
    let error = '';
    
    // New project form
    let newProjectName = '';
    let newProjectDescription = '';
    let newProjectTags = '';
    
    // Add file form
    let fileDescription = '';
    let linkUrl = '';
    let linkName = '';
    
    onMount(() => {
        loadProjects();
    });
    
    async function loadProjects() {
        loading = true;
        try {
            const response = await fetch('/api/projects');
            if (response.ok) {
                const data = await response.json();
                projects = data.map((proj: any) => ({
                    ...proj,
                    createdDate: new Date(proj.createdDate),
                    files: proj.files.map((file: any) => ({
                        ...file,
                        uploadDate: new Date(file.uploadDate)
                    }))
                }));
            } else {
                throw new Error('Failed to load projects');
            }
        } catch (err) {
            error = 'Failed to load projects. Using local storage as fallback.';
            loadFromLocalStorage();
        } finally {
            loading = false;
        }
    }
    
    function loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('projectsData');
            if (stored) {
                const parsed = JSON.parse(stored);
                projects = parsed.map((proj: any) => ({
                    ...proj,
                    createdDate: new Date(proj.createdDate),
                    files: proj.files.map((file: any) => ({
                        ...file,
                        uploadDate: new Date(file.uploadDate)
                    }))
                }));
            }
        } catch (err) {
            console.error('Error loading from localStorage:', err);
        }
    }
    
    async function saveProjects() {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projects)
            });
            
            if (!response.ok) {
                throw new Error('Failed to save to server');
            }
        } catch (err) {
            error = 'Failed to save to server. Saved locally instead.';
            localStorage.setItem('projectsData', JSON.stringify(projects));
        }
    }
    
    async function createProject() {
        if (!newProjectName.trim()) return;
        
        const project: Project = {
            id: crypto.randomUUID(),
            name: newProjectName.trim(),
            description: newProjectDescription.trim(),
            files: [],
            createdDate: new Date(),
            tags: newProjectTags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        projects = [...projects, project];
        await saveProjects();
        
        newProjectName = '';
        newProjectDescription = '';
        newProjectTags = '';
        showNewProjectForm = false;
        selectedProject = project;
    }
    
    async function deleteProject(projectId: string) {
        if (!confirm('Are you sure you want to delete this project?')) return;
        
        projects = projects.filter(p => p.id !== projectId);
        if (selectedProject?.id === projectId) {
            selectedProject = null;
        }
        await saveProjects();
    }
    
    async function handleFileUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && selectedProject) {
            await processFiles(target.files);
        }
    }
    
    async function processFiles(files: FileList) {
        if (!selectedProject) return;
        
        for (const file of Array.from(files)) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('projectId', selectedProject.id);
                formData.append('description', fileDescription);
                
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const result = await response.json();
                    const newFile: ProjectFile = {
                        id: crypto.randomUUID(),
                        name: file.name,
                        type: file.type.startsWith('image/') ? 'image' : 'file',
                        url: result.url,
                        uploadDate: new Date(),
                        description: fileDescription
                    };
                    
                    selectedProject.files = [...selectedProject.files, newFile];
                    await saveProjects();
                } else {
                    // Fallback to base64 for images
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                            const newFile: ProjectFile = {
                                id: crypto.randomUUID(),
                                name: file.name,
                                type: 'image',
                                url: e.target?.result as string,
                                uploadDate: new Date(),
                                description: fileDescription
                            };
                            selectedProject!.files = [...selectedProject!.files, newFile];
                            await saveProjects();
                        };
                        reader.readAsDataURL(file);
                    }
                }
            } catch (err) {
                error = `Failed to upload ${file.name}`;
            }
        }
        
        fileDescription = '';
        showAddFileForm = false;
    }
    
    async function addLink() {
        if (!linkUrl.trim() || !linkName.trim() || !selectedProject) return;
        
        const newFile: ProjectFile = {
            id: crypto.randomUUID(),
            name: linkName.trim(),
            type: 'link',
            url: linkUrl.trim(),
            uploadDate: new Date(),
            description: fileDescription
        };
        
        selectedProject.files = [...selectedProject.files, newFile];
        await saveProjects();
        
        linkUrl = '';
        linkName = '';
        fileDescription = '';
        showAddFileForm = false;
    }
    
    async function removeFile(fileId: string) {
        if (!selectedProject) return;
        
        selectedProject.files = selectedProject.files.filter(f => f.id !== fileId);
        await saveProjects();
    }
    
    function handleDrop(event: DragEvent) {
        event.preventDefault();
        dragOver = false;
        if (event.dataTransfer?.files && selectedProject) {
            processFiles(event.dataTransfer.files);
        }
    }
    
    function handleDragOver(event: DragEvent) {
        event.preventDefault();
        dragOver = true;
    }
    
    function handleDragLeave() {
        dragOver = false;
    }
</script>

<svelte:head>
    <title>site@adabit.org ~/projects</title>
</svelte:head>

<div class="content">
    <header class="page-header">
        <h1>Project Manager</h1>
        <button class="btn btn-primary" on:click={() => showNewProjectForm = true}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Project
        </button>
    </header>
    
    {#if error}
        <div class="error-banner">
            <span>{error}</span>
            <button on:click={() => error = ''}>&times;</button>
        </div>
    {/if}
    
    {#if loading}
        <div class="loading">Loading projects...</div>
    {/if}
    
    <div class="layout">
        <aside class="sidebar">
            <h3>Projects ({projects.length})</h3>
            <div class="project-list">
                {#each projects as project}
                    <div 
                        class="project-item"
                        class:active={selectedProject?.id === project.id}
                        on:click={() => selectedProject = project}
                        role="button"
                        tabindex="0"
                        on:keydown={(e) => e.key === 'Enter' && (selectedProject = project)}
                    >
                        <h4>{project.name}</h4>
                        <p>{project.files.length} files</p>
                        <div class="project-tags">
                            {#each project.tags as tag}
                                <span class="tag">{tag}</span>
                            {/each}
                        </div>
                        <button 
                            class="delete-btn"
                            on:click|stopPropagation={() => deleteProject(project.id)}
                            title="Delete project"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"/>
                                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                            </svg>
                        </button>
                    </div>
                {/each}
            </div>
        </aside>
        
        <main class="main-content">
            {#if selectedProject}
                <div class="project-header">
                    <div>
                        <h2>{selectedProject.name}</h2>
                        <p>{selectedProject.description}</p>
                        <small>Created: {selectedProject.createdDate.toLocaleDateString()}</small>
                    </div>
                    <button class="btn btn-secondary" on:click={() => showAddFileForm = true}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add Files
                    </button>
                </div>
                
                {#if selectedProject.files.length === 0}
                    <div 
                        class="drop-zone"
                        class:drag-over={dragOver}
                        on:drop={handleDrop}
                        on:dragover={handleDragOver}
                        on:dragleave={handleDragLeave}
                        on:click={() => fileInput?.click()}
                        role="button"
                        tabindex="0"
                    >
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17,8 12,3 7,8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <h3>No files yet</h3>
                        <p>Drag and drop files here or click to add files and links</p>
                    </div>
                {:else}
                    <div class="files-grid">
                        {#each selectedProject.files as file}
                            <div class="file-card">
                                <div class="file-preview">
                                    {#if file.type === 'image'}
                                        <img src={file.url} alt={file.name} />
                                    {:else if file.type === 'link'}
                                        <div class="link-preview">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                                            </svg>
                                        </div>
                                    {:else}
                                        <div class="file-preview-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"/>
                                                <polyline points="14,2 14,8 20,8"/>
                                            </svg>
                                        </div>
                                    {/if}
                                    <button 
                                        class="remove-btn"
                                        on:click={() => removeFile(file.id)}
                                        title="Remove file"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"/>
                                            <line x1="6" y1="6" x2="18" y2="18"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="file-info">
                                    <h4>
                                        {#if file.type === 'link'}
                                            <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                                        {:else}
                                            {file.name}
                                        {/if}
                                    </h4>
                                    {#if file.description}
                                        <p class="file-description">{file.description}</p>
                                    {/if}
                                    <small>{file.uploadDate.toLocaleDateString()}</small>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
                
                <input 
                    bind:this={fileInput}
                    type="file" 
                    multiple 
                    on:change={handleFileUpload}
                    style="display: none;"
                />
            {:else}
                <div class="empty-state">
                    <h2>Select a project or create a new one</h2>
                    <p>Choose a project from the sidebar to view and manage its files</p>
                </div>
            {/if}
        </main>
    </div>
</div>

<!-- New Project Modal -->
{#if showNewProjectForm}
    <div class="modal-overlay" on:click={() => showNewProjectForm = false}>
        <div class="modal" on:click|stopPropagation>
            <h3>Create New Project</h3>
            <form on:submit|preventDefault={createProject}>
                <input 
                    bind:value={newProjectName}
                    placeholder="Project name"
                    required
                    autofocus
                />
                <textarea 
                    bind:value={newProjectDescription}
                    placeholder="Project description (optional)"
                    rows="3"
                ></textarea>
                <input 
                    bind:value={newProjectTags}
                    placeholder="Tags (comma-separated)"
                />
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" on:click={() => showNewProjectForm = false}>
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">Create Project</button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Add File Modal -->
{#if showAddFileForm && selectedProject}
    <div class="modal-overlay" on:click={() => showAddFileForm = false}>
        <div class="modal" on:click|stopPropagation>
            <h3>Add Files to {selectedProject.name}</h3>
            
            <div class="add-file-tabs">
                <button 
                    class="tab-btn active" 
                    on:click={() => fileInput?.click()}
                >
                    Upload Files
                </button>
                <span class="tab-divider">or</span>
                <div class="link-form">
                    <input 
                        bind:value={linkName}
                        placeholder="Link name"
                        required
                    />
                    <input 
                        bind:value={linkUrl}
                        placeholder="https://..."
                        type="url"
                        required
                    />
                </div>
            </div>
            
            <textarea 
                bind:value={fileDescription}
                placeholder="Description (optional)"
                rows="2"
            ></textarea>
            
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" on:click={() => showAddFileForm = false}>
                    Cancel
                </button>
                <button 
                    type="button" 
                    class="btn btn-primary" 
                    disabled={!linkUrl.trim() || !linkName.trim()}
                    on:click={addLink}
                >
                    Add Link
                </button>
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    .content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2em;
        min-height: 100vh;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2em;
        
        h1 {
            color: #ffffff;
            margin: 0;
        }
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5em;
        padding: 0.75em 1.5em;
        border: none;
        border-radius: 6px;
        font-size: 0.9em;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &.btn-primary {
            background: #4CAF50;
            color: white;
            
            &:hover {
                background: #45a049;
            }
        }
        
        &.btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            
            &:hover {
                background: rgba(255, 255, 255, 0.15);
            }
        }
    }

    .error-banner {
        background: rgba(255, 69, 69, 0.1);
        border: 1px solid rgba(255, 69, 69, 0.3);
        color: #ff6b6b;
        padding: 1em;
        border-radius: 6px;
        margin-bottom: 1em;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        button {
            background: none;
            border: none;
            color: #ff6b6b;
            font-size: 1.5em;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .loading {
        text-align: center;
        padding: 2em;
        color: #aaa;
    }

    .layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2em;
        min-height: 600px;
    }

    .sidebar {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 1.5em;
        
        h3 {
            color: #ffffff;
            margin: 0 0 1em 0;
        }
    }

    .project-list {
        display: flex;
        flex-direction: column;
        gap: 0.75em;
    }

    .project-item {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 1em;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        
        &:hover, &.active {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(4px);
        }
        
        h4 {
            color: #ffffff;
            margin: 0 0 0.5em 0;
            font-size: 0.9em;
        }
        
        p {
            color: #aaa;
            margin: 0 0 0.5em 0;
            font-size: 0.8em;
        }
    }

    .project-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25em;
    }

    .tag {
        background: rgba(76, 175, 80, 0.2);
        color: #4CAF50;
        padding: 0.2em 0.5em;
        border-radius: 4px;
        font-size: 0.7em;
    }

    .delete-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(255, 69, 69, 0.1);
        border: none;
        border-radius: 4px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        color: #ff6b6b;
        
        &:hover {
            background: rgba(255, 69, 69, 0.2);
        }
    }

    .project-item:hover .delete-btn {
        opacity: 1;
    }

    .main-content {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 2em;
    }

    .project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2em;
        padding-bottom: 1em;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        
        h2 {
            color: #ffffff;
            margin: 0 0 0.5em 0;
        }
        
        p {
            color: #aaa;
            margin: 0 0 0.5em 0;
        }
        
        small {
            color: #666;
        }
    }

    .drop-zone {
        border: 2px dashed #666;
        border-radius: 12px;
        padding: 4em 2em;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover, &.drag-over {
            border-color: #4CAF50;
            background: rgba(76, 175, 80, 0.05);
        }
        
        svg {
            color: #888;
            margin-bottom: 1em;
        }
        
        h3 {
            color: #ffffff;
            margin: 0 0 0.5em 0;
        }
        
        p {
            color: #aaa;
            margin: 0;
        }
    }

    .files-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5em;
    }

    .file-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        overflow: hidden;
        transition: transform 0.3s ease;
        
        &:hover {
            transform: translateY(-5px);
        }
    }

    .file-preview {
        position: relative;
        aspect-ratio: 16/10;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.05);
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .link-preview, .file-preview-icon {
            color: #888;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        }
    }

    .remove-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        
        &:hover {
            background: #ff4444;
            color: white;
        }
    }

    .file-card:hover .remove-btn {
        opacity: 1;
    }

    .file-info {
        padding: 1em;
        
        h4 {
            color: #ffffff;
            margin: 0 0 0.5em 0;
            font-size: 0.9em;
            
            a {
                color: #4CAF50;
                text-decoration: none;
                
                &:hover {
                    text-decoration: underline;
                }
            }
        }
        
        .file-description {
            color: #aaa;
            font-size: 0.8em;
            margin: 0 0 0.5em 0;
        }
        
        small {
            color: #666;
        }
    }

    .empty-state {
        text-align: center;
        padding: 4em 2em;
        color: #aaa;
        
        h2 {
            color: #ffffff;
            margin: 0 0 1em 0;
        }
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal {
        background: #2a2a2a;
        border-radius: 12px;
        padding: 2em;
        width: 90%;
        max-width: 500px;
        
        h3 {
            color: #ffffff;
            margin: 0 0 1.5em 0;
        }
        
        input, textarea {
            width: 100%;
            padding: 0.75em;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            margin-bottom: 1em;
            
            &::placeholder {
                color: #aaa;
            }
            
            &:focus {
                outline: none;
                border-color: #4CAF50;
            }
        }
    }

    .add-file-tabs {
        margin-bottom: 1em;
        
        .tab-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 0.75em 1.5em;
            border-radius: 6px;
            cursor: pointer;
            margin-bottom: 1em;
            
            &:hover {
                background: #45a049;
            }
        }
        
        .tab-divider {
            color: #aaa;
            margin: 0 1em;
        }
        
        .link-form {
            display: flex;
            gap: 0.5em;
            
            input {
                margin-bottom: 0;
            }
        }
    }

    .modal-actions {
        display: flex;
        gap: 1em;
        justify-content: flex-end;
        margin-top: 1.5em;
    }

    @media (max-width: 1024px) {
        .layout {
            grid-template-columns: 1fr;
            
            .sidebar {
                order: 2;
            }
        }
    }

    @media (max-width: 768px) {
        .content {
            padding: 1em;
        }
        
        .page-header {
            flex-direction: column;
            gap: 1em;
            align-items: flex-start;
        }
        
        .project-header {
            flex-direction: column;
            gap: 1em;
            align-items: flex-start;
        }
        
        .files-grid {
            grid-template-columns: 1fr;
        }
        
        .modal {
            padding: 1.5em;
        }
        
        .add-file-tabs .link-form {
            flex-direction: column;
        }
    }
</style>

