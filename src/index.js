const API_URL = 'https://pokeapi.co/api/v2/';
const RETURN_KEYCODE = 13;

class App {
	constructor() {
	}

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
		this.bridges = new Map();
		this.root = document.querySelector(this.selector);
	}

	addListener(selector, event, listener) {
		let node = document.querySelector(selector);
		node.addEventListener(event, listener);
	}

	addBridge(key, dispatcher, context) {
		dispatcher = dispatcher.bind(context);
		this.bridges.set(key, dispatcher);
	}
}

class Container extends Component {
	constructor(rootSelector) {
		super(rootSelector);
		this.search = new Search('.pokedex__search-bar');
		this.display = new Display('.pokedex__display');

		this.search.addBridge('pokemon', this.display.displayPokemon, this.display);
	}
}

class Display extends Component {
	constructor(rootSelector) {
		super(rootSelector);
		this.displayTypes = {
			LIST: 0,
			POKEMON: 1,
		};
		this.display = this.displayTypes.LIST;
	}

	render() {
		if (this.display == this.displayTypes.POKEMON) {
			this.root.innerHTML = '<h1>hello</h1>';
		}
	}	

	displayPokemon(pokemon) {
		this.display = this.displayTypes.POKEMON;
		this.render();
	}

	displayPokemonList(pokemonList) {

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
			this.displayPokemon();
		} else {
			// similar results
		}
	}

	displayPokemon() {
		let url = API_URL + 'pokemon/' + this.input + '/';
		this.requestHandler.makeRequest('GET', url, (data) => {
			let pokemon = JSON.parse(data);
			let action = this.bridges.get('pokemon');
			action(pokemon);
		});
	}
}

let app = new App();
app.start();