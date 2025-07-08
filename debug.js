// Debug script to test if elements exist
console.log('=== Element Check ===');

var elements = [
    'board', 'search', 'searchStop', 'searchStep', 
    'randomize', 'customInput', 'themeToggle',
    'timeLimit', 'heuristicFunction'
];

elements.forEach(function(id) {
    var element = document.getElementById(id);
    console.log(id + ':', element ? 'Found' : 'NOT FOUND');
});

console.log('=== Button Event Test ===');
var searchButton = document.getElementById('search');
if (searchButton) {
    console.log('Search button found, adding test event listener...');
    searchButton.addEventListener('click', function() {
        console.log('SEARCH BUTTON CLICKED!');
        alert('Search button çalışıyor!');
    });
} else {
    console.log('Search button NOT FOUND!');
}