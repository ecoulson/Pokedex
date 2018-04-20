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
}

class Container extends Component {
	constructor(rootSelector) {
		super(rootSelector);

		this.search = new Search('.pokedex__searchbar');
		this.display = new Display('.pokedex__display');

		this.getPokemonNames = this.getPokemonNames.bind(this);

		this.search.addAction('pokemon', this.display.displayPokemon, this.display);
		this.requestHandler.makeRequest("GET", COUNT_URL, this.getPokemonNames);
	}

	getPokemonNames(data) {
		let pokemonCount = JSON.parse(data).count;
		let url = API_URL +  'pokemon/?limit=' + pokemonCount;
		this.requestHandler.makeRequest("GET", url, function handleNames(data) {
			let pokemons = JSON.parse(data);
			this.names = pokemons.results;
			this.display.hasFetchedNames = true;
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
				// display autofill
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
			this.displayPokemon();
		} else {
			// similar results
		}
	}

	displayPokemon() {
		let url = API_URL + 'pokemon/' + this.input;
		this.requestHandler.makeRequest('GET', url, (data) => {
			let pokemon = JSON.parse(data);
			let action = this.actions.get('pokemon');
			action(pokemon);
		})
	}
}

let app = new App();
app.start();