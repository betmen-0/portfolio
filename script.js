document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');

    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.classList.remove('loading');
        setTimeout(() => {
            loadingScreen.remove();
        }, 300);
    }, 500);
});

let currentIndex = 0;
const initCarousel = () => {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    const inner = carousel.querySelector('.carousel-inner');
    const items = inner.querySelectorAll('.carousel-item');

    inner.computedStyleMap.transition = 'transform .45s ease';

    const update = () => {
        inner.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    window.moveCarousel = (direction) => {
        currentIndex = (currentIndex + direction + items.length) % items.length;
        update();
    };

    window.addEventListener('resize' , update);
    update();
};

document.addEventListener('DOMContentLoaded',() =>{
    initCarousel();
    initNoteEditor();
});

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const inner = carousel.querySelector('.carousel-inner');
    const items = Array.from(carousel.querySelectorAll('.carousel-item'));
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');

    let currentIndex = 0;

    const updateCarousel = () => {
        inner.style.transform = `translateX(-${currentIndex * 100}%)`;
        items.forEach((item, i) => {
            item.setAttribute('aria-hidden' , i === currentIndex ? 'false' : 'true');
        });
    };

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });

    updateCarousel();
});

const initNoteEditor = () => {
    const addBtn = document.querySelector('#addNoteBtn');
    const modal = document.querySelector('.note-editor-modal');
    const cork = document.querySelector('.corkboard-surface');
    let noteZIndex = 1000;

    const colors = ['#FFF7E6', '#FFECF2', '#E6FFFA', '#EAF6FF', '#F3E8FF'];
    const palette = modal.querySelector('.color-palette');

    colors.forEach((color, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'color-btn' + (i === 0 ? ' selected' : '');
        btn.style.backgroundColor = color;
        btn.dataset.color = color;
        palette.appendChild(btn);
    });

    addBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        const noteText = modal.querySelector('#noteText');
        noteText.value = '';
        noteText.focus();
        modal.querySelector('#noteName').value = '';
    });

    modal.querySelector('#cancelNote').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    palette.addEventListener('click' , (e) => {
        const btn = e.target.closest('.color-btn');
        if (!btn) return;
        palette.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });

    const saveNote = () => {
        const text = modal.querySelector('#noteText').value.trim();
        const name = modal.querySelector('#noteName').value.trim();
        const color = modal.querySelector('.color-btn.selected')?.dataset.color || colors[0];
    
        if (!text && !name) {
            alert('Please enter a message or name');
            return;
        }

        const note = document.createElement('div');
        note.className = 'sticky-note';

        const rotation = (Math.random() * 6 - 3);
        noteZIndex += 1;

        const bounds = cork.querySelector('.corkboard-bounds');
        const boundsRect = bounds.getBoundingClientRect();

        const noteWidth = 240;
        const noteHeight = 240;

        const topPadding = 20;
        const leftPadding = 20;
        const bottomPadding = 60;
        const rightPadding = 60;

        const maxX = boundsRect.width - noteWidth - rightPadding;
        const maxY = boundsRect.height - noteHeight - bottomPadding;

        const randomX = Math.max(leftPadding, Math.random() * maxX);
        const randomY = Math.max(topPadding , Math.random() * maxY);

        note.style.cssText = `
        background: ${color};
        transform: rotate(${rotation}deg);
        z-index: ${noteZIndex};
        position: absolute;
        left: ${randomX}px;
        top: ${randomY}px;
        width: ${noteWidth}px;
        border-radius: 0px;
        `;

        note.innerHTML = `
        <button type="button" class="note-delete" aria-label="Delete note">×</button>
        <div class="note-content">
        <div class="note-date">
        ${new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })}
        </div>
        <div class="note-msg">${text}</div>
        ${name ? `<div class="note-signer">${name}</div>` : ''}
        </div>
        `;

        cork.appendChild(note);
        note.querySelector('.note-delete')?.addEventListener('click', (e) => {
            e.stopPropagation();
            note.remove();
        });

        (function createRoughBorder() {
        try {
            const rect = note.getBoundingClientRect();
            const nw = Math.max(80, Math.round(rect.width));
            const nh = Math.max(60, Math.round(rect.height));
            const padOut = 14;
            const outerW = nw + padOut * 2;
            const outerH = nh + padOut * 2;

            const svgNS = 'http://www.w3.org/2000/svg';
            const borderSvg = document.createElementNS(svgNS, 'svg');
            borderSvg.className = 'note-rough';
            borderSvg.setAttribute('width', outerW);
            borderSvg.setAttribute('height', outerH);
            borderSvg.setAttribute('viewBox', `0 0 ${outerW} ${outerH}`);
            borderSvg.setAttribute('preserveAspectRatio', 'xMinYMin meet');

            borderSvg.style.position = 'absolute';
            borderSvg.style.top = `-${padOut}px`;
            borderSvg.style.left = `${padOut}px`;
            borderSvg.style.width = `${outerW}px`;
            borderSvg.style.height = `${outerH}px`;
            borderSvg.style.pointerEvents = 'none';
            borderSvg.style.zIndex = '0';
            note.appendChild(borderSvg);

            const rc = typeof rough !== 'undefined' && rough && typeof rough.svg === 'function'
                ? rough.svg(borderSvg)
                : null;
            const padDraw = 16;
            if (rc) {
                const roughNode = rc.rectangle(padDraw, padDraw, outerW - padDraw * 2, outerH - padDraw * 2, {
                    stroke: 'rgba(0,0,0,0.56)',
                    strokeWidth: 2,
                    roughness: 1.4,
                    fill: 'transparent'
                });
                borderSvg.appendChild(roughNode);
            }
        } catch (e) {
            console.error('Failed to create rough border', e);
        }
        })();

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        note.addEventListener('pointerdown', (e) => {
            if (e.target.closest('.note-delete')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(note.style.left, 10);
            startTop = parseInt(note.style.top, 10);
            note.style.zIndex = ++noteZIndex;
            note.classList.add('dragging');
            note.setPointerCapture(e.pointerId);
        });

        note.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            newLeft = Math.max(leftPadding, Math.min(maxX, newLeft));
            newTop = Math.max(topPadding, Math.min(maxY, newTop));

            note.style.left = `${newLeft}px`;
            note.style.top = `${newTop}px`;
        });

        note.addEventListener('pointerup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            note.classList.remove('dragging');
            note.releasePointerCapture(e.pointerId);
        });

        modal.classList.add('hidden');
        modal.querySelector('#noteText').value = '';
        modal.querySelector('#noteName').value = '';
    };

    modal.querySelector('#saveNote').addEventListener('click', saveNote);
};

