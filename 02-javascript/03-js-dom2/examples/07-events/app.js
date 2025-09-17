// Double click event
document.getElementById('dblBtn').addEventListener('dblclick', function() {
	alert('Button double-clicked!');
});

// Mouseover event
document.getElementById('hoverDiv').addEventListener('mouseover', function(e) {
	e.target.style.background = '#b2eaff';
	e.target.textContent = 'Mouse is over!';
	console.log(e.clientX);
	console.log(e.clientY);

});
document.getElementById('hoverDiv').addEventListener('mouseout', function() {
	this.style.background = '#eaf1fb';
	this.textContent = 'Hover over me';
});

// Input event
document.getElementById('inputField').addEventListener('input', function() {
	document.getElementById('inputResult').textContent = 'You typed: ' + this.value;
});

// Form submit event
document.getElementById('demoForm').addEventListener('submit', function(e) {
	e.preventDefault();
	document.getElementById('formResult').textContent = 'Form submitted: ' + this.demo.value;
});

// Change event (select)
document.getElementById('selectExample').addEventListener('change', function() {
	document.getElementById('selectResult').textContent = 'Selected: ' + this.value;
});

// Focus and blur events
document.getElementById('focusInput').addEventListener('focus', function() {
	document.getElementById('focusResult').textContent = 'Input focused!';
});
document.getElementById('focusInput').addEventListener('blur', function() {
	document.getElementById('focusResult').textContent = '';
});

// Keydown event
document.getElementById('keydownArea').addEventListener('keydown', function(e) {
	document.getElementById('keydownResult').textContent = 'Key pressed: ' + e.key;
});

// Context menu (right-click) event
document.getElementById('contextDiv').addEventListener('contextmenu', function(e) {
	e.preventDefault();
	document.getElementById('contextResult').textContent = 'Right-clicked!';
});
