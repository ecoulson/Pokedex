const API_URL = 'https://pokeapi.co/api/v2/';
const RETURN_KEYCODE = 13;
const COUNT_URL = 'https://pokeapi.co/api/v2/pokemon/?limit=1';

class App {
	start() {
		this.container = new Container('.pokedex');
	}
}

class RequestHandler {
	makeRequest(method, url, handler) {
		let request = new XMLHttpRequest();
		request.onreadystatechange = function handleReady() {
			if (this.readyState == 4 && this.status == 200) {
				handler(this.responseText);
			}
		}
		request.open(method, url, true);
		request.send();
	}
}

class Component {
	constructor(selector) {
		this.selector = selector;
		this.requestHandler = new RequestHandler();
		this.actions = new Map();
		this.root = document.querySelector(this.selector);
	}

	addListener(selector, event, listener) {
		let node = document.querySelector(selector);
		node.addEventListener(event, listener);
	}

	addAction(key, action, context) {
		action = action.bind(context);
		this.actions.set(key, action);
	}

	toElement() {
		return '<div></div>';
	}
}

class Container extends Component {
	constructor(rootSelector) {
		super(rootSelector);

		this.search = new Search('.pokedex__searchbar');
		this.display = new Display('.pokedex__pokemon_container');
		this.autofill = new Autofill('.pokedex__autofill');

		this.getPokemonNames = this.getPokemonNames.bind(this);

		this.search.addAction('pokemon', this.display.displayPokemon, this.display);
		this.search.addAction('update', this.autofill.update, this.autofill);
		this.search.addAction('list', this.display.displayList, this.display);

		this.display.addAction('list', this.autofill.toElement, this.autofill);
		this.display.addAction('handlers', this.autofill.addListHandlers, this.autofill);

		this.autofill.addAction('pokemon', this.search.displayPokemon, this.search);

		this.requestHandler.makeRequest("GET", COUNT_URL, this.getPokemonNames);
	}

	getPokemonNames(data) {
		let pokemonCount = JSON.parse(data).count;
		let url = API_URL +  'pokemon/?limit=' + pokemonCount;
		this.requestHandler.makeRequest("GET", url, function handleNames(data) {
			let pokemons = JSON.parse(data);
			this.display.hasFetchedNames = true;
			this.autofill.setNames(pokemons.results);
			this.display.render();
		}.bind(this));
	}
}

class Loader {
	toElement() {
		return (
			'<div class="loader">Loading...</div>'
		);
	}
}

class Display extends Component {
	constructor(rootSelector) {
		super(rootSelector);
		this.displayTypes = {
			LIST: 0,
			POKEMON: 1,
		};
		this.loader = new Loader();

		this.display = this.displayTypes.LIST;
		this.hasFetchedNames = false;
		this.render();
	}

	render() {
		if (this.display == this.displayTypes.POKEMON) {
			this.root.innerHTML = this.currentPokemon.toElement();
		} else {
			if (this.hasFetchedNames) {
				let toEle = this.actions.get('list');
				this.root.innerHTML = toEle();
				let action = this.actions.get('handlers');
				action();
			} else {
				// display loader
				this.root.innerHTML = this.loader.toElement();
			}
		}
	}

	displayPokemon(data) {
		this.display = this.displayTypes.POKEMON;
		let pokemon = new Pokemon(data);
		this.currentPokemon = pokemon;
		this.render();
	}

	displayList() {
		this.display = this.displayTypes.LIST;
		this.render();
	}
}

class Autofill extends Component {
	constructor(rootSelector) {
		super(rootSelector);
		this.hasFetchedNames = false;
	}

	update(input) {
		if (this.hasFetchedNames) {
			this.filteredNames = this.names.filter((x) => {
				return x.name.includes(input.toLowerCase());
			});
		}
	}

	setNames(names) {
		this.names = names;
		this.hasFetchedNames = true;
		this.filteredNames = names;
	}

	toElement() {
		let list = this.listToElement();
		return (
			`<div class="pokedex__autofill">
				<h1 class="pokedex__autofill-list-title">Pokémon</h1>
				${list}
			</div>`
		);
	}

	listToElement() {
		if (this.hasFetchedNames) {
			let ele = '';
			for (let i = 0; i < this.filteredNames.length; i++) {
				ele += (
					`<div class="pokedex__autofill-pokemon">
						<h3 class="pokedex__autofill-pokemon-name">
							${this.filteredNames[i].name}
						</h3>
					</div>`
				);
			}
			return ele;
		} else {
			return '';
		}
	}

	addListHandlers() {
		let nodes = document.querySelectorAll('.pokedex__autofill-pokemon');
		for (let i = 0; i < nodes.length; i++) {
			nodes[i].addEventListener('click', function (event) {
				let pokemon = event.target.textContent.trim().toLowerCase();
				let action = this.actions.get('pokemon');
				action(pokemon);
			}.bind(this));
		}
	}
}

class Pokemon {
	constructor(data) {
		this.data = data;
	}

	toElement() {
		return (
			`<div class="pokedex__pokemon">
				<h1 class="pokedex__pokemon_name">${this.data.name}</h1>
				<img src="${this.data.sprites.front_default}" class="pokedex__pokemon_sprite"/>
			</div>`
		);
	}
}

class Search extends Component {
	constructor(rootSelector) {
		super(rootSelector);

		this.input = '';

		//bind listeners
		this.handleKeyPress = this.handleKeyPress.bind(this);

		//add listener
		this.addListener('.pokedex__search', 'keyup', this.handleKeyPress);
	}

	handleKeyPress() {
		this.input = event.target.value;
		
		let code = event.keyCode;
		if (code == RETURN_KEYCODE) {
			// direct to pokemon
			this.displayPokemon(this.input);
		} else {
			let action = this.actions.get('update');
			action(this.input);
			let render = this.actions.get('list');
			render();
		}
	}

	displayPokemon(input) {
		let url = API_URL + 'pokemon/' + input;
		this.requestHandler.makeRequest('GET', url, (data) => {
			let pokemon = JSON.parse(data);
			let action = this.actions.get('pokemon');
			action(pokemon);
		})
	}
}

let app = new App();
app.start();