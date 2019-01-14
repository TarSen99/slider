let slider = document.querySelector('.slider');
let sliderPickers = document.querySelectorAll('.slider-picker');
let inputButton = document.querySelector('#input-button');
let lastClicked;
let activeSliderPicker;
let sliderWidth = 600;
let sliderIsTouching = false;
let maxRange = 500;


function setPosition(object, x, y) {
	if(y) {
		object.style.top = `${y}px`;
	}

	if(!x) {
		return;
	}

	let sliderX = slider.getBoundingClientRect().left;
	x = x - sliderX - object.clientWidth / 2;
	let maxPicker= slider.querySelector('#max');
	let maxPickerPosWindow
	let maxPickerPositionX;
	let minPicker = slider.querySelector('#min');
	let minPickerPositionX;

	if(object.dataset.type === 'min') {
		maxPickerPosWindow = maxPicker.getBoundingClientRect().left;
		maxPickerPositionX = maxPickerPosWindow - sliderX - 1;

	} else if(object.dataset.type === 'max') {
		minPickerPositionX = minPicker.getBoundingClientRect().left - sliderX;
	}

	let minX = 0;
	let maxXPosSlider = sliderWidth - object.clientWidth - 1;
	let maxX = maxXPosSlider;

	if(minPickerPositionX) {
		minX = minPickerPositionX;
	}

	if(maxPickerPositionX) {
		maxX = maxPickerPositionX - 1;
	}

	if(maxX > maxXPosSlider) {
		maxX = maxXPosSlider;
	}

	if(x < minX) {
		x = minX;
	} else if(x  > maxX) {
		x = maxX;
	}

	object.style.left = `${x}px`;
	configureMeasureLine();
	UpdateTextInputs(x, object.dataset.type, object.clientWidth);
}

function configureMeasureLine() {
	let measureLine = document.querySelector('.line');
	let maxPicker= slider.querySelector('#max');
	let minPicker = slider.querySelector('#min');

	let linePosX = minPicker.getBoundingClientRect().left - minPicker.clientWidth / 2;
	measureLine.style.left = `${linePosX}px`;

	let lineWidth = maxPicker.getBoundingClientRect().left - linePosX - maxPicker.clientWidth;

	if(lineWidth < 0) {
		lineWidth = 0;
	}

	measureLine.style.width = `${lineWidth}px`;
}

function init() {

	slider.style.width = `${sliderWidth}px`;
	let sliderHeight = slider.clientHeight;
	let sliderPickerHeight = sliderPickers[0].clientHeight;
	let sliderPickerWidth = sliderPickers[0].clientWidth;

	let minSliderPickerPos;
	let maxSliderPickerPos = sliderWidth - sliderWidth / 5;

	let sliderPickerYPos = Math.round(sliderHeight / 2 - sliderPickerHeight / 2);

	for(let i = 0; i < sliderPickers.length; i++) {
		if(sliderPickers[i].dataset.type === 'min') {
			minSliderPickerPos = sliderPickers[i].clientWidth / 2;
			setPosition(sliderPickers[i], null, sliderPickerYPos);
			lastClicked = sliderPickers[i];
		} else {
			setPosition(sliderPickers[i], null, sliderPickerYPos);
		}
	}
	setRange(sliderPickerWidth);
	configureMeasureLine();
}

function resetPickerClass() {
	let activePicker = document.querySelector('.slider-picker__active');
	if(activePicker) {
		activePicker.classList.remove('slider-picker__active');
	}
}

function resetPickersZIndex() {
	for(let i = 0; i < sliderPickers.length; i++) {
		sliderPickers[i].style.zIndex = 1;
		sliderPickers[i].classList.remove('slider-picker__active');
	}
}

function setSliderPosOnClick(e) {
	let target = e.target;	

	if(target.matches('.slider') || target.matches('.line')) {
		setPosition(lastClicked, e.clientX);
	} else if(target.matches('.slider-picker')) {
		setPosition(target, e.clientX);
		lastClicked = target;
		resetPickersZIndex();
	}

	lastClicked.style.zIndex = 2;
	lastClicked.classList.add('slider-picker__active');

	activeSliderPicker = lastClicked;
}

function setSliderPickerPosition(e) {
	if(!activeSliderPicker) {
		return;
	}
	
	setPosition(lastClicked, e.clientX);
}

function setRange() {
	let minPicker = slider.querySelector('#min');
	let maxPicker= slider.querySelector('#max');
	let width = minPicker.clientWidth;

	let minInput = document.querySelector('#input-min');
	let maxInput= document.querySelector('#input-max');

	let minPickerValue = parseInt(minInput.value);
	let maxPickerValue = parseInt(maxInput.value);

	let point = sliderWidth / maxRange;
	let sliderX = slider.getBoundingClientRect().left;
	setPosition(minPicker, (minPickerValue * point) + sliderX + width / 2);
	setPosition(maxPicker, (maxPickerValue * point) + sliderX + width / 2 - width - 1);
}

function UpdateTextInputs(x, type, width) {
	let point = sliderWidth / maxRange;

	if(type === 'min') {
		let minInput = document.querySelector('#input-min');
		minInput.value = Math.ceil(x / point);
	} else {
		let maxInput= document.querySelector('#input-max');
		maxInput.value = Math.ceil((x + width) / point);
	}
}

document.addEventListener('DOMContentLoaded', init);
slider.addEventListener('mousedown', setSliderPosOnClick);
document.addEventListener('mousemove', setSliderPickerPosition);
inputButton.addEventListener('click', setRange);
document.addEventListener('mouseup', function() {
	resetPickerClass();
	activeSliderPicker = null;
});

