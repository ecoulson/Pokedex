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
		console.log(this.search);
	}
}

class Component {
	/**
	 * takes in basic information about the component
	 * @param {String} rootSelector 
	 */
	constructor(rootSelector) {
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

	}

	showPokemon() {

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
			// update the main display panel
			this.handleSearchInput(this.input);
		}
	}
}

const app = new App();
app.start();