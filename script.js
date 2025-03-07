let currentMonth = new Date().getMonth(); 
let currentYear = new Date().getFullYear();

// Funções para navegação entre meses
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

// Adiciona eventos para as setas de navegação
document.getElementById('next-month').addEventListener('click', nextMonth);
document.getElementById('prev-month').addEventListener('click', prevMonth);


// Função para renderizar o calendário
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // Atualiza o nome do mês
    const monthNameDisplay = document.getElementById('month-name');
    monthNameDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    calendar.innerHTML = ''; 

    // Criando os cabeçalhos dos dias da semana
    const header = document.createElement('div');
    header.classList.add('calendar-header');

    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        header.appendChild(dayHeader);
    });
    calendar.appendChild(header);

    // Preenchendo os dias do mês
    const calendarGrid = document.createElement('div');
    calendarGrid.classList.add('calendar-grid');

    // Adiciona espaços vazios até o primeiro dia do mês
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }

    // Adiciona os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        dayCell.classList.add('calendar-day');
        dayCell.dataset.date = `${day < 10 ? '0' + day : day}-${currentMonth + 1 < 10 ? '0' + (currentMonth + 1) : currentMonth + 1}-${currentYear}`;

        // Marca a data selecionada
        dayCell.addEventListener('click', () => {
            const selected = document.querySelector('.calendar-day.selected');
            if (selected) {
                selected.classList.remove('selected');
            }
            dayCell.classList.add('selected');
        });

        // Marca o dia atual
        const today = new Date();
        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayCell.classList.add('today');
        }

        calendarGrid.appendChild(dayCell);
    }

    calendar.appendChild(calendarGrid);
}

// Função para renderizar os compromissos
function renderCompromissos() {
    const listaCompromissos = document.getElementById('lista-compromissos');
    listaCompromissos.innerHTML = ''; 

    const compromissos = JSON.parse(localStorage.getItem('compromissos')) || [];

    compromissos.forEach((compromisso, index) => {
        const li = document.createElement('li');
        li.textContent = `${compromisso.compromisso} - ${compromisso.data} - Prioridade: ${compromisso.prioridade}`;

        // Botão para editar compromisso
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', () => editCompromisso(index));

        // Botão para excluir compromisso
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => deleteCompromisso(index));

        li.appendChild(editButton);
        li.appendChild(deleteButton);

        listaCompromissos.appendChild(li);
    });
}

// Função para adicionar um novo compromisso
document.getElementById('form-compromisso').addEventListener('submit', (e) => {
    e.preventDefault();

    const compromissoInput = document.getElementById('compromisso');
    const prioridadeSelect = document.getElementById('prioridade');
    const dataSelecionada = document.querySelector('.selected');
    const data = dataSelecionada ? dataSelecionada.dataset.date : null;

    if (!compromissoInput.value || !data) {
        alert('Por favor, selecione uma data e adicione um compromisso!');
        return;
    }

    const novoCompromisso = {
        compromisso: compromissoInput.value,
        prioridade: prioridadeSelect.value,
        data: data
    };

    const compromissos = JSON.parse(localStorage.getItem('compromissos')) || [];
    
    // Insere o novo compromisso na posição correta, de acordo com a data
    compromissos.push(novoCompromisso);

    // Ordena a lista de compromissos por data (mais próximo primeiro)
    compromissos.sort((a, b) => new Date(a.data) - new Date(b.data));

    // Salva a lista de compromissos novamente no localStorage
    localStorage.setItem('compromissos', JSON.stringify(compromissos));

    compromissoInput.value = '';
    renderCompromissos();
});

// Função para editar um compromisso
function editCompromisso(index) {
    const compromissos = JSON.parse(localStorage.getItem('compromissos')) || [];
    const compromisso = compromissos[index];
    
    document.getElementById('compromisso').value = compromisso.compromisso;
    document.getElementById('prioridade').value = compromisso.prioridade;

    // Exclui o compromisso atual para permitir a atualização
    compromissos.splice(index, 1);
    localStorage.setItem('compromissos', JSON.stringify(compromissos));

    renderCompromissos();
}

// Função para excluir um compromisso
function deleteCompromisso(index) {
    const compromissos = JSON.parse(localStorage.getItem('compromissos')) || [];
    compromissos.splice(index, 1);
    localStorage.setItem('compromissos', JSON.stringify(compromissos));
    renderCompromissos();
}

// Função para adicionar uma anotação
document.getElementById('form-anotacoes').addEventListener('submit', (e) => {
    e.preventDefault();

    const anotacoesInput = document.getElementById('anotacoes');
    const novaAnotacao = anotacoesInput.value;

    if (!novaAnotacao) {
        alert('Por favor, adicione uma anotação!');
        return;
    }

    const anotacoes = JSON.parse(localStorage.getItem('anotacoes')) || [];
    anotacoes.push(novaAnotacao);
    localStorage.setItem('anotacoes', JSON.stringify(anotacoes));
    anotacoesInput.value = ''; 

    renderAnotacoes();
});

// Função para renderizar as anotações
function renderAnotacoes() {
    const listaAnotacoes = document.getElementById('lista-anotacoes');
    listaAnotacoes.innerHTML = ''; 

    const anotacoes = JSON.parse(localStorage.getItem('anotacoes')) || [];

    anotacoes.forEach((anotacao, index) => {
        const li = document.createElement('li');
        li.textContent = anotacao;

        // Botão para editar anotação
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', () => editAnotacao(index));

        // Botão para excluir anotação
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => deleteAnotacao(index));

        li.appendChild(editButton);
        li.appendChild(deleteButton);

        listaAnotacoes.appendChild(li);
    });
}

// Função para editar uma anotação
function editAnotacao(index) {
    const anotacoes = JSON.parse(localStorage.getItem('anotacoes')) || [];
    const anotacao = anotacoes[index];

    document.getElementById('anotacoes').value = anotacao;

    // Exclui a anotação atual para permitir a atualização
    anotacoes.splice(index, 1);
    localStorage.setItem('anotacoes', JSON.stringify(anotacoes));

    renderAnotacoes();
}

// Função para excluir uma anotação
function deleteAnotacao(index) {
    const anotacoes = JSON.parse(localStorage.getItem('anotacoes')) || [];
    anotacoes.splice(index, 1);
    localStorage.setItem('anotacoes', JSON.stringify(anotacoes));
    renderAnotacoes();
}

// Inicialização
window.onload = () => {
    renderCalendar(); // Renderiza o calendário
    renderCompromissos(); // Renderiza os compromissos
    renderAnotacoes(); // Renderiza as anotações
};
