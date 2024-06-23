$(function () {
  // Display the current date in the header
  $('#currentDay').text(dayjs().format('dddd, MMMM D'));

  // listener for click events on save button
  $('.saveBtn').on('click', function () {
    var timeBlockId = $(this).parent().attr('id');
    var value = $(this).siblings('.description').val();
    localStorage.setItem(timeBlockId, value);
  });

  // Apply the past, present, or future class to each time block
  function updateTimeBlocks() {
    var currentHour = dayjs().hour();
    $('.time-block').each(function () {
      var blockHour = parseInt($(this).attr('id').split('-')[1]);

      if (blockHour < currentHour) {
        $(this).addClass('past').removeClass('present future');
      } else if (blockHour === currentHour) {
        $(this).addClass('present').removeClass('past future');
      } else {
        $(this).addClass('future').removeClass('past present');
      }
    });
  }

  // Get any user input that was saved in localStorage and set the values of the corresponding textarea elements
  $('.time-block').each(function () {
    var timeBlockId = $(this).attr('id');
    var value = localStorage.getItem(timeBlockId);
    if (value) {
      $(this).find('.description').val(value);
    }
  });

  updateTimeBlocks();
});
