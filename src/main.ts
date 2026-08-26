import { $ } from './lib';

$('button')
  .addClass('btn-primary')
  .css({ color: 'white', backgroundColor: 'blue' })
  .on('click', function () {
    // this は HTMLButtonElement 型
    console.log('Button clicked');
  });

$<HTMLInputElement>('#username').val('John Doe').css('borderColor', 'green');
