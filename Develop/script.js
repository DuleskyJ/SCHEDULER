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

  // Event listener for setting custom colors
  $('#setColors').on('click', function () {
    const pastColor = $('#pastColor').val();
    const presentColor = $('#presentColor').val();
    const futureColor = $('#futureColor').val();

    $('.past').css('background-color', pastColor);
    $('.present').css('background-color', presentColor);
    $('.future').css('background-color', futureColor);

    localStorage.setItem('pastColor', pastColor);
    localStorage.setItem('presentColor', presentColor);
    localStorage.setItem('futureColor', futureColor);
  });

  // Load saved colors from local storage
  function loadSavedColors() {
    const pastColor = localStorage.getItem('pastColor') || '#d3d3d3';
    const presentColor = localStorage.getItem('presentColor') || '#ff6961';
    const futureColor = localStorage.getItem('futureColor') || '#77dd77';

    $('#pastColor').val(pastColor);
    $('#presentColor').val(presentColor);
    $('#futureColor').val(futureColor);

    $('.past').css('background-color', pastColor);
    $('.present').css('background-color', presentColor);
    $('.future').css('background-color', futureColor);
  }

  loadSavedColors();

  // Reminder function
  function reminderNotification() {
    $('.time-block').each(function () {
      const blockHour = parseInt($(this).attr('id').split('-')[1]);
      const text = $(this).find('textarea').val();
      const currentHour = dayjs().hour();

      if (blockHour === currentHour && text.trim() !== '') {
        alert(`Reminder: You have an event at ${blockHour < 12 ? `${blockHour} AM` : blockHour === 12 ? '12 PM' : `${blockHour - 12} PM`} - "${text}"`);
      }
    });
  }

  // Set interval for reminders (every 15 minutes)
  setInterval(reminderNotification, 900000);
});