$(function () {
  // Current Date Display
  $('#currentDay').text(dayjs().format('dddd, MMMM D, YYYY'));

  // Function for timeblock creation
  function createTimeBlocks(startHour, endHour) {
    const container = $('.container-fluid');
    container.find('.time-block').remove(); // Clear existing time blocks

    // Helper function to format hour string
    function formatHour(hour) {
      return hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`;
    }

    // Function to add time blocks for a given range
    function addTimeBlocks(start, end) {
      for (let hour = start; hour <= end; hour++) {
        const hourStr = formatHour(hour);
        const timeBlock = $(`
          <div id="hour-${hour}" class="row time-block">
            <div class="col-2 col-md-1 hour text-center py-3">${hourStr}</div>
            <div class="description-container col-8 col-md-10">
              <textarea class="description" rows="3"></textarea>
            </div>
            <button class="btn saveBtn col-2 col-md-1" aria-label="save">
              <i class="fas fa-save" aria-hidden="true"></i>
            </button>
          </div>
        `);
        container.append(timeBlock);
      }
    }

    // Handle case where end hour is less than start hour (spans over midnight)
    if (endHour < startHour) {
      addTimeBlocks(startHour, 23); // From startHour to end of day
      addTimeBlocks(0, endHour);    // From start of day to endHour
    } else {
      addTimeBlocks(startHour, endHour); // Regular case
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
    const text = $(this).siblings('.description-container').find('.description').val();
    localStorage.setItem(timeBlockId, text);
  });

  // Load saved events from local storage
  function loadSavedEvents() {
    $('.time-block').each(function () {
      const timeBlockId = $(this).attr('id');
      const savedText = localStorage.getItem(timeBlockId);
      if (savedText) {
        $(this).find('.description').val(savedText);
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

  // Event listener for setting custom colors
  $('#setColors').on('click', function () {
    const pastColor = $('#pastColor').val();
    const presentColor = $('#presentColor').val();
    const futureColor = $('#futureColor').val();
    $('.past').css('background-color', pastColor);
    $('.present').css('background-color', presentColor);
    $('.future').css('background-color', futureColor);
  });
});