const API_URL = 'https://pokeapi.co/api/v2';
const RETURN_KEYCODE = 13;

class App {
	constructor() {
		this.search = new Search('.pokedex__search-bar');
	}

	start() {
		this.initComponents();
	}

	initComponents() {
		this.search.init();
	}
}

class RequestHandler {
	makeRequest(method, url, handler) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				handler(this.responseText);
			}
		};
		xhttp.open(method, url, true);
		xhttp.send();
	}
}

class Component {
	/**
	 * takes in basic information about the component
	 * @param {String} rootSelector 
	 */
	constructor(rootSelector) {
		this.requestHandler = new RequestHandler();
		this.rootSelector = rootSelector;
	}

	/**
	 * inits the component
	 */
	init() {
		this.root = document.querySelector(this.rootSelector);
	}

	/**
	 * 
	 * @param {Node} node 
	 * @param {String} event 
	 * @param {Function} listener 
	 */
	addListener(selector, event, listener) {
		let node = document.querySelector(selector);
		node.addEventListener(event, listener);
	}
}

class Container extends Component {
	constructor(rootSelector) {
		super(rootSelector);
	}

	handleSearchInput() {
		console.log('here1');
	}

	showPokemon(pokemonName) {
		let url = `${API_URL}/pokemon/${pokemonName}`;
		this.requestHandler.makeRequest('GET', url, function (pokemon) {
			
		});
	}
}

class Search extends Container {
	constructor(rootSelector) {
		super(rootSelector);

		//state
		this.input = '';

		//bind listeners
		this.handleKeyPress = this.handleKeyPress.bind(this);

		//add listeners
		this.addListener('.pokedex__search', 'keyup', this.handleKeyPress);
	}

	handleKeyPress(event) {
		this.input = event.target.value;

		let code = event.keyCode;
		if (code == RETURN_KEYCODE) {
			super.showPokemon(this.input);
		} else {
			super.handleSearchInput(this.input);
		}
	}
}

const app = new App();
app.start();