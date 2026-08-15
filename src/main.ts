import { $ } from './mini-jquery';

$('button')
  .addClass('btn-primary')
  .css({ color: 'white', backgroundColor: 'blue' })
  .on('click', function () {
    // this は HTMLButtonElement 型
    console.log('Button clicked:', this.tagName);
  });

// $<HTMLInputElement>("#username").val("John Doe").css("borderColor", "green");
