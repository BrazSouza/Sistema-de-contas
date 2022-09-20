const tbody = document.querySelector('tbody');
const descItem = document.querySelector('#desc');
const amount = document.querySelector('#amount');
const type = document.querySelector('#type');
const btnNew = document.querySelector('#btnNew');

/* PEGANDO OS SPANS */
const incomes = document.querySelector('.incomes');
const expenses = document.querySelector('.expenses');
const total = document.querySelector('.total');

/* ARMAZENANDO OS ITEMS */
let items;

btnNew.onclick = () => {
	if (descItem.value === '' || amount.value === '' || type.value === '') {
		return alert('Preencha todos os campos!');
	}

	items.push({
		desc: descItem.value,
		amount: Math.abs(amount.value).toFixed(2),
		type: type.value,
	});

	setItensBD();

	loadItens();

	descItem.value = '';
	amount.value = '';
};

/* PEGANDO O INDICE DO ITEM QUE ESTOU EXCLUINDO */
function deleteItem(index) {
	items.splice(index, 1); // 1 POSIÇÃO PARA NÃO EXCLUIR MAIS NENHUM ITEM
	setItensBD(); // ATUALIZANDO A FUNÇÃO (BANCO) PARA SETAR NO BANCO AS INFORMAÇÕES DOS ITEMS
	loadItens(); // CARREGANDO EM TELA AS ALTERAÇÕES
}

function insertItem(item, index) {
	let tr = document.createElement('tr');

	tr.innerHTML = `
	<td>${item.desc}</td>
	<td>R$ ${item.amount}</td>
	<td class="type">
	  ${item.type === 'Entrada' ? "<i class='fa fa-arrow-up'></i>" : '<i class="fa fa-arrow-down"></i>'}
	</td>
	<td class="action">
	  <button onclick="deleteItem(${index})" style="border: transparent; background: transparent"><i class="fa fa-trash-can"></i></button>
	</td>
	`;
	tbody.appendChild(tr);
}

/* CARREGANDO INFORMAÇÕES QUE TEM DENTRO DO BANCO */
function loadItens() {
	items = getItensBD();
	tbody.innerHTML = ''; /* LIMPANDO PARA NÃO DUPLICAR ITEMS NA TELA */
	items.forEach((item, index) => {
		insertItem(item, index);
	});
	getTotals();
}

/* CARREGANDO OS TOTAIS */
// PEGANDO O ARRAY DE ITEMS E FILTRANDO APENAS ITEMS QUE TEM O TIPO DE ENTRADAS
// TRAZENDO UMA NOVA ARRAY E PEGANDO AS INFORMAÇÕES DE VALORES E CONVERTENDO PARA NUMERICOS
function getTotals() {
	const amountIncomes = items.filter((item) => item.type === 'Entrada').map((transaction) => Number(transaction.amount));

	const amountExpenses = items.filter((item) => item.type === 'Saída').map((transaction) => Number(transaction.amount));
	//PEGANDO TOTAL DE ENTRADAS E REDUZINDO A UMA UNICA VARIAVEL
	const totalIncomes = amountIncomes.reduce((acc, cur) => acc + cur, 0).toFixed(2);
	const totalExpenses = Math.abs(amountExpenses.reduce((acc, cur) => acc + cur, 0)).toFixed(2);
	const totalItems = (totalIncomes - totalExpenses).toFixed(2);

	incomes.innerHTML = totalIncomes; // ATRIBUINDO AS INFORMAÇÕES DE ENTRADAS
	expenses.innerHTML = totalExpenses; // ATRIBUINDO AS INFORMAÇÕES DE SAÍDAS
	total.innerHTML = totalItems;
}

// /* PEGANDO OS ITEMS DO BANCO */
const getItensBD = () => JSON.parse(localStorage.getItem('db_items')) ?? []; // MEU BANCO

/* INSERINDO NO BANCO AS INFORMAÇÕES QUE TEM NA VARIAVEL ITEMS */
const setItensBD = () => localStorage.setItem('db_items', JSON.stringify(items));
/* LOADiTEMS -> INIALIZA QUANDOCARREGAR O DOCUMENTO */
loadItens();
