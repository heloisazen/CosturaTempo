// Função para renderizar os compromissos
function renderCompromissos() {
    const listaCompromissos = document.getElementById('lista-compromissos');
    listaCompromissos.innerHTML = '';  // Limpa a lista antes de renderizar

    const compromissos = JSON.parse(localStorage.getItem('compromissos')) || [];

    compromissos.forEach(compromisso => {
        const li = document.createElement('li');
        li.textContent = `${compromisso.compromisso} - ${compromisso.data} - Prioridade: ${compromisso.prioridade}`;
        listaCompromissos.appendChild(li);
    });
}

// Função para adicionar um novo compromisso
document.getElementById('form-compromisso').addEventListener('submit', (e) => {
    e.preventDefault();

    const compromissoInput = document.getElementById('compromisso');
    const prioridadeSelect = document.getElementById('prioridade');
    const dataSelecionada = document.querySelector('.selected'); // Aqui pegamos a data selecionada no calendário
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

    compromissoInput.value = ''; // Limpa o campo de compromisso
    renderCompromissos(); // Atualiza a lista de compromissos
});

// Função para renderizar as anotações
function renderAnotacoes() {
    const listaAnotacoes = document.getElementById('lista-anotacoes');
    listaAnotacoes.innerHTML = '';  // Limpa a lista de anotações antes de renderizar

    const anotacoes = JSON.parse(localStorage.getItem('anotacoes')) || [];

    anotacoes.forEach(anotacao => {
        const li = document.createElement('li');
        li.textContent = anotacao;
        listaAnotacoes.appendChild(li);
    });
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

    anotacoesInput.value = ''; // Limpa o campo de anotações
    renderAnotacoes(); // Atualiza a lista de anotações
});

// Função para renderizar o calendário
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    date.setMonth(currentMonth);
    date.setFullYear(currentYear);

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();
    
    calendar.innerHTML = ''; // Limpa o calendário antes de renderizar

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
            dayCell.classList.add('today'); // Adiciona a classe 'today' ao dia atual
        }

        calendarGrid.appendChild(dayCell);
    }

    calendar.appendChild(calendarGrid);
}

// Inicialização
window.onload = () => {
    renderCalendar(); // Renderiza o calendário
    renderCompromissos(); // Renderiza os compromissos
    renderAnotacoes(); // Renderiza as anotações
};
