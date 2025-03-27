document.addEventListener('DOMContentLoaded', function() {
    let draggedItem = null;

    function handleDragStart(e) {
        draggedItem = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.id); // Cambiado a text/plain para evitar problemas

        setTimeout(() => this.classList.add('dragging'), 0);
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
        draggedItem = null;
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDragEnter(e) {
        e.preventDefault();
        this.classList.add('hovered');
    }

    function handleDragLeave() {
        this.classList.remove('hovered');
    }

    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('hovered');

        if (!draggedItem) return;

        // Verificar si estamos soltando sobre otra tarjeta o en la columna
        if (e.target.classList.contains('kanban-item')) {
            const bounding = e.target.getBoundingClientRect();
            const offset = e.clientY - bounding.top;
            
            if (offset < bounding.height / 2) {
                e.target.parentNode.insertBefore(draggedItem, e.target);
            } else {
                e.target.parentNode.insertBefore(draggedItem, e.target.nextSibling);
            }
        } else if (this.classList.contains('kanban-items')) {
            this.appendChild(draggedItem); // Mover la tarjeta a la columna destino
        }
    }

    function setupDragAndDrop() {
        const items = document.querySelectorAll('.kanban-item');
        const columns = document.querySelectorAll('.kanban-items');

        items.forEach(item => {
            item.setAttribute('draggable', 'true');
            item.removeEventListener('dragstart', handleDragStart);
            item.removeEventListener('dragend', handleDragEnd);
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
        });

        columns.forEach(column => {
            column.removeEventListener('dragover', handleDragOver);
            column.removeEventListener('dragenter', handleDragEnter);
            column.removeEventListener('dragleave', handleDragLeave);
            column.removeEventListener('drop', handleDrop);

            column.addEventListener('dragover', handleDragOver);
            column.addEventListener('dragenter', handleDragEnter);
            column.addEventListener('dragleave', handleDragLeave);
            column.addEventListener('drop', handleDrop);
        });
    }

    setupDragAndDrop();

    // Hacer el tablero Kanban horizontalmente desplazable con el mouse
    const kanbanBoard = document.getElementById('kanban-board');
    let isDown = false;
    let startX;
    let scrollLeft;

    kanbanBoard.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - kanbanBoard.offsetLeft;
        scrollLeft = kanbanBoard.scrollLeft;
    });

    kanbanBoard.addEventListener('mouseleave', () => isDown = false);
    kanbanBoard.addEventListener('mouseup', () => isDown = false);

    kanbanBoard.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - kanbanBoard.offsetLeft;
        const walk = (x - startX) * 2;
        kanbanBoard.scrollLeft = scrollLeft - walk;
    });
});
