$(function () {
  // Displaying the current date in header
  const currentDate = dayjs().format('dddd, MMMM D, YYYY');
  $('#currentDay').text(currentDate);

  // Generating time blocks for each hour 9-5
  const container = $('.container-fluid');
  const workHours = [
    '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'
  ];

  workHours.forEach((hour, index) => {
    const hour24 = index + 9; // Convert index to 24-hour format

    const timeBlock = $(`
      <div id="hour-${hour24}" class="row time-block">
        <div class="col-2 col-md-1 hour text-center py-3">${hour}</div>
        <textarea class="col-8 col-md-10 description" rows="3"></textarea>
        <button class="btn saveBtn col-2 col-md-1" aria-label="save">
          <i class="fas fa-save" aria-hidden="true"></i>
        </button>
      </div>
    `);

    container.append(timeBlock);
  });

  // Apply past, present, or future class to each time block
  function updateTimeBlocks() {
    const currentHour = dayjs().hour();

    $('.time-block').each(function () {
      const blockHour = parseInt($(this).attr('id').split('-')[1]);

      if (blockHour < currentHour) {
        $(this).addClass('past').removeClass('present future');
      } else if (blockHour === currentHour) {
        $(this).addClass('present').removeClass('past future');
      } else {
        $(this).addClass('future').removeClass('past present');
      }
    });
  }

  updateTimeBlocks();
  setInterval(updateTimeBlocks, 60000); // Updating every minute

  // Save events to local storage
  $('.saveBtn').on('click', function () {
    const timeBlock = $(this).closest('.time-block');
    const hour = timeBlock.attr('id');
    const description = timeBlock.find('.description').val();

    localStorage.setItem(hour, description);
  });

  // Load events from local storage
  $('.time-block').each(function () {
    const hour = $(this).attr('id');
    const description = localStorage.getItem(hour);

    if (description) {
      $(this).find('.description').val(description);
    }
  });
});
