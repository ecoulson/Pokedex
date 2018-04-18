const API_URL = 'https://pokeapi.co/api/v2/';
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
	}

	init() {
		this.root = document.querySelector(this.selector);
	}

	addListener(selector, event, listener) {
		let node = document.querySelector(selector);
		node.addEventListener(event, listener);
	}
}

class Container extends Component {
	constructor(rootSelector) {
		super(rootSelector);
	}

	showPokemon(pokemonName) {
		let url = API_URL + 'pokemon/' + pokemonName;
		this.requestHandler.makeRequest('GET', url, function(data) {
			let pokemon = JSON.parse(data);
		});
	}
}

class Search extends Container {
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
			super.showPokemon(this.input);
		} else {
			// similar results
		}
	}
}

let app = new App();
app.start();