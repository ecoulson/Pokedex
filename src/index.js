const API_URL = 'https://pokeapi.co/api/v2/';
const RETURN_KEYCODE = 13;

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

		this.search.addAction('pokemon', this.display.displayPokemon, this.display);
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
			this.root.innerHTML = this.currentPokemon.toElement();
		} else {

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