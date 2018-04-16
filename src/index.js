const SEARCHBAR = document.getElementsByClassName('pokedex__search')[0];
const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const RETURN_KEYCODE = 13;

SEARCHBAR.addEventListener('keyup', function handleChange(event) {
	let code = event.keyCode;
	if (code == RETURN_KEYCODE) {
		
	} else {
		// autofill results
	}
});