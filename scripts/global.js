/* ======================================================= */
/* --- FUNÇÕES GLOBAIS REUTILIZÁVEIS --- */
/* ======================================================= */
function openModal(modalElement) {
    if (!modalElement) return;
    modalElement.style.display = 'flex';
    setTimeout(() => modalElement.classList.add('show'), 10);
}

function closeModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove('show');
    setTimeout(() => modalElement.style.display = 'none', 400);
}


/* ======================================================= */
/* --- LÓGICA GLOBAL DO TEMA, MODAL DE CONTATO E BOTÃO VOLTAR AO TOPO --- */
/* ======================================================= */
document.addEventListener('DOMContentLoaded', () => {

    const loadHeaderAndScripts = () => {
        fetch('/components/cabecalho.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na rede ao carregar o header. Verifique se o caminho /components/cabecalho.html está correto.');
                }
                return response.text();
            })
            .then(data => {
                const headerPlaceholder = document.getElementById('header-placeholder');
                if (headerPlaceholder) {
                    headerPlaceholder.innerHTML = data;
                    initializeHeaderScripts();
                }
            })
            .catch(error => {
                console.error('Falha ao carregar o cabeçalho:', error);
                const headerPlaceholder = document.getElementById('header-placeholder');
                if (headerPlaceholder) {
                    headerPlaceholder.innerHTML = '<p style="color:red; text-align:center;">Erro ao carregar o menu.</p>';
                }
            });
    };

    const initializeHeaderScripts = () => {
        /* ======================================================= */
        /* --- LÓGICA GLOBAL DO TEMA --- */
        /* ======================================================= */
        const themeToggleButton = document.getElementById('theme-toggle-btn');
        if (themeToggleButton) {
            const body = document.body;
            const currentTheme = localStorage.getItem('theme');

            const applyTheme = (theme) => {
                body.setAttribute('data-theme', theme);
                // Atualiza o ícone/texto do botão se necessário
                // (Adicione sua lógica de ícone aqui se o botão tiver um)
                localStorage.setItem('theme', theme);
            };

            if (currentTheme) {
                applyTheme(currentTheme);
            } else {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                applyTheme(prefersDark ? 'dark' : 'light');
            }

            themeToggleButton.addEventListener('click', () => {
                const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                applyTheme(newTheme);
            });
        }

        /* ======================================================= */
        /* --- LÓGICA GLOBAL DO MODAL DE CONTATO --- */
        /* ======================================================= */
        // const contactLink = document.getElementById('global-contact-link');
        const modalPlaceholder = document.createElement('div');
        modalPlaceholder.id = 'contact-modal-placeholder';
        document.body.appendChild(modalPlaceholder);
        const contactLink = document.querySelector('.main-nav a[href="#contact-modal"]');

        let isModalLoaded = false;
        
        if (contactLink) {
        contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            const contactModal = document.getElementById('contact-modal');

            if (isModalLoaded && contactModal) {
                openModal(contactModal);
            } else if (!isModalLoaded) {
                fetch('/components/modal_contato.html')
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.text();
                    })
                    .then(html => {
                        modalPlaceholder.innerHTML = `<div class="modal" id="contact-modal">${html}</div>`;
                        isModalLoaded = true;
                        const newModal = document.getElementById('contact-modal');
                        
                        newModal.querySelector('.close-button').addEventListener('click', () => closeModal(newModal));
                        newModal.querySelector('.close-modal').addEventListener('click', () => closeModal(newModal));
                        newModal.addEventListener('click', (event) => {
                            if (event.target === newModal) closeModal(newModal);
                        });

                        openModal(newModal);
                    })
                    .catch(error => console.error('Error fetching contact modal:', error));
            }
        });
    }
    };

    /* ======================================================= */
    /* --- LÓGICA GLOBAL PARA O BOTÃO VOLTAR AO TOPO --- */
    /* ======================================================= */
    const backToTopButton = document.getElementById('back-to-top-btn');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            // Se o usuário rolou mais de 300px para baixo
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
    }
    
    loadHeaderAndScripts();

    /* ======================================================= */
    /* --- LÓGICA GLOBAL PARA FECHAR O MODAL --- */
    /* ======================================================= */
    document.addEventListener('click', function(event) {
        const modalToClose = event.target.closest('.modal');
        // Fecha se clicar no botão de fechar
        if (event.target.closest('.close-button, .close-modal')) {
            if (modalToClose) closeModal(modalToClose);
        }
        // Fecha se clicar no overlay (fundo) do modal
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

});
