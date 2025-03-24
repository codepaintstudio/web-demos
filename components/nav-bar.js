class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.wrapper = document.createElement('div');
        this.link = document.createElement('a');

        this.wrapper.appendChild(this.link);
        this.shadowRoot.appendChild(this.wrapper);

        // 默认样式
        Object.assign(this.wrapper.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            backgroundColor: '#333',
            padding: '15px',
            textAlign: 'left',
            zIndex: '1000',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        });

        Object.assign(this.link.style, {
            color: '#fff',
            textDecoration: 'none',
            fontSize: '16px',
            transition: 'color 0.3s',
        });

        this.link.addEventListener('mouseover', () => {
            this.link.style.color = '#4CAF50';
        });

        this.link.addEventListener('mouseout', () => {
            this.link.style.color = '#fff';
        });
    }

    static get observedAttributes() {
        return ['href', 'text', 'bg-color', 'text-color', 'hover-color'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'href':
                this.link.setAttribute('href', newValue || '../index.html');
                break;
            case 'text':
                this.link.textContent = newValue || '← 返回主页';
                break;
            case 'bg-color':
                this.wrapper.style.backgroundColor = newValue || '#333';
                break;
            case 'text-color':
                this.link.style.color = newValue || '#fff';
                break;
            case 'hover-color':
                this.link.addEventListener('mouseover', () => {
                    this.link.style.color = newValue || '#4CAF50';
                });
                this.link.addEventListener('mouseout', () => {
                    this.link.style.color = this.getAttribute('text-color') || '#fff';
                });
                break;
        }
    }

    connectedCallback() {
        if (!this.hasAttribute('href')) this.setAttribute('href', '../index.html');
        if (!this.hasAttribute('text')) this.setAttribute('text', '← 返回主页');
    }
}

customElements.define('nav-bar', NavBar);
