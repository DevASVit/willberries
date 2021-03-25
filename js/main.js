const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// Cart
const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');

const openModal = () => {
	modalCart.classList.add('show');
};

const closeModal = () => {
	modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal);

modalCart.addEventListener('click', event => {
	const target = event.target;
	if (target.classList.contains('overlay') || 
			target.classList.contains('modal-close')) {
		closeModal();
	}
});

// Scroll Smooth
{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', event => {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		});
	}
}

// Goods
const more = document.querySelector('.more');
const navigationLinks = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async () => {
	const result = await fetch('db/db.json');
	if(!result.ok) {
		throw 'Вышла ошибочка: ' + result.status;
	}
	return await result.json();
};

const createCard = objCard => {
	const card =  document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	card.innerHTML = `
		<div class="goods-card">
			${objCard.label ? 
				`<span class="label">${objCard.label}</span>` : 
				''}
			<img src="db/${objCard.img}" alt="${objCard.name}" class="goods-image">
			<h3 class="goods-title">${objCard.name}</h3>
			<p class="goods-description">${objCard.description}</p>
			<button class="button goods-card-btn add-to-cart" data-id=${objCard.id}>
				<span class="button-price">$${objCard.price}</span>
			</button>
		</div>
	`;

	return card;
};

const renderCards = (data) => {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);
	document.body.classList.add('show-goods');
};

more.addEventListener('click',(event) => {
	event.preventDefault();
	getGoods().then(renderCards);
});

const filterCards = (field, value) => {
	getGoods()
		.then((data) => {
			const filteredGoods = data.filter((good) => {
				return good[field] === value;
			});
			return filteredGoods;
		})
		.then(renderCards);
};

navigationLinks.forEach((link) => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	});
});