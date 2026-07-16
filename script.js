/**
 * ==========================================================================
 * PORTFOLIO ARCHITECTURE INJECTOR (MODULAR JS)
 * Menangani Dark Mode & Koneksi API Database Tanpa Mengubah Berkas HTML Utama.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. DINAMISASI TOMBOL TOGGLE DARK MODE KE NAVBAR
    // ----------------------------------------------------------------------
    const navLinks = document.querySelector('.navbar .links');
    const htmlElement = document.documentElement;

    if (navLinks) {
        // Buat tombol toggle secara runtime via DOM agar HTML bersih
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'dark-toggle';
        toggleBtn.className = 'cursor-pointer font-mono text-xs px-2.5 py-1 border border-neutral-400 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all mr-2';
        
        // Inisialisasi state awal berdasarkan cache browser atau preferensi sistem operasi
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            htmlElement.classList.add('dark');
            toggleBtn.innerText = '// Mode: Dark';
        } else {
            htmlElement.classList.remove('dark');
            toggleBtn.innerText = '// Mode: Light';
        }

        // Sisipkan tombol di awal deretan link navigasi
        navLinks.insertBefore(toggleBtn, navLinks.firstChild);

        // Handler interaksi klik toggle
        toggleBtn.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark')) {
                htmlElement.classList.remove('dark');
                localStorage.theme = 'light';
                toggleBtn.innerText = '// Mode: Light';
            } else {
                htmlElement.classList.add('dark');
                localStorage.theme = 'dark';
                toggleBtn.innerText = '// Mode: Dark';
            }
        });
    }

    // ----------------------------------------------------------------------
    // 2. KONEKSI DATA KE API DATABASE (FETCH PROJECTS STATE)
    // ----------------------------------------------------------------------
    const projectContainer = document.querySelector('.projects-list');

    async function fetchDatabaseProjects() {
        try {
            // Arahkan ke URL API Endpoint backend C# / Java milikmu
            const response = await fetch('http://localhost:5000/api/projects'); 
            const data = await response.json();

            if (data && data.length > 0) {
                // Hapus item proyek statis (hardcoded) bawaan jika server berhasil mengembalikan data ter-update
                projectContainer.innerHTML = '';

                data.forEach(project => {
                    const article = document.createElement('article');
                    article.className = 'project-item';

                    // Parse data tag dari relational database
                    const tagsArray = project.tags ? (Array.isArray(project.tags) ? project.tags : project.tags.split(', ')) : [];
                    const tagsHTML = tagsArray.map(t => `<span>${t}</span>`).join('');

                    article.innerHTML = `
                        <div class="project-header">
                            <span class="mono-tag">${project.type_tag || project.typeTag}</span>
                            <h3>${project.title}</h3>
                        </div>
                        <p class="project-detail">${project.description}</p>
                        <div class="project-tags">
                            ${tagsHTML}
                        </div>
                    `;
                    projectContainer.appendChild(article);
                });
            }
        } catch (error) {
            // Quality Assurance Error Handling: Jika server mati, data HTML asli kamu aman dan menjadi fallback otomatis
            console.warn('[QA Info] Sinkronisasi API database gagal. Menggunakan data cadangan bawaan HTML.', error);
        }
    }

    fetchDatabaseProjects();
});