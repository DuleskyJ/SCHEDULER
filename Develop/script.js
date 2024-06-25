$(function () {
  // Current Date Display
  $('#currentDay').text(dayjs().format('dddd, MMMM D, YYYY'));

  // Function for timeblock creation
  function createTimeBlocks(startHour, endHour) {
    const container = $('.container-fluid');
    container.find('.time-block').remove(); // Clear existing time blocks
    for (let hour = startHour; hour <= endHour; hour++) {
      const hourStr = hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`;
      const timeBlock = $(`
        <div id="hour-${hour}" class="row time-block">
          <div class="col-2 col-md-1 hour text-center py-3">${hourStr}</div>
          <textarea class="col-8 col-md-10 description" rows="3"></textarea>
          <button class="btn saveBtn col-2 col-md-1" aria-label="save">
            <i class="fas fa-save" aria-hidden="true"></i>
          </button>
        </div>
      `);

      container.append(timeBlock);
    }
  }

  // Function to update time block classes based on current time
  function updateTimeBlocks() {
    const currentHour = dayjs().hour();
    $('.time-block').each(function () {
      const blockHour = parseInt($(this).attr('id').split('-')[1]);
      $(this).removeClass('past present future');

      if (blockHour < currentHour) {
        $(this).addClass('past');
      } else if (blockHour === currentHour) {
        $(this).addClass('present');
      } else {
        $(this).addClass('future');
      }
    });
  }

  // Event listener for save buttons
  $('.container-fluid').on('click', '.saveBtn', function () {
    const timeBlockId = $(this).closest('.time-block').attr('id');
    const text = $(this).siblings('textarea').val();
    localStorage.setItem(timeBlockId, text);
  });

  // Load saved events from local storage
  function loadSavedEvents() {
    $('.time-block').each(function () {
      const timeBlockId = $(this).attr('id');
      const savedText = localStorage.getItem(timeBlockId);
      if (savedText) {
        $(this).find('textarea').val(savedText);
      }
    });
  }

  // Initialize with default time range of 9-5
  createTimeBlocks(9, 17); 
  updateTimeBlocks();
  loadSavedEvents();

  // Update every minute
  setInterval(updateTimeBlocks, 60000);

  // Event listener for setting custom time range
  $('#setTimeRange').on('click', function () {
    const startTime = parseInt($('#startTime').val().split(':')[0]);
    const endTime = parseInt($('#endTime').val().split(':')[0]);
    createTimeBlocks(startTime, endTime);
    updateTimeBlocks();
    loadSavedEvents();
  });
});