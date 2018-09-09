/* eslint linebreak-style: ['error', 'windows'] */

class StopWatch {
  constructor(parentNode) {
    const item = document.createElement('div');
    item.className = 'stopwatch';
    parentNode.appendChild(item);

    const timeField = document.createElement('p');
    timeField.className = 'stopwatch__timefield';
    timeField.textContent = '00:00.0';
    item.appendChild(timeField);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'stopwatch__buttons';
    item.appendChild(buttonContainer);

    const startButton = document.createElement('button');
    startButton.className = 'stopwatch__button';
    startButton.textContent = 'Start';
    buttonContainer.appendChild(startButton);

    const lapButton = document.createElement('button');
    lapButton.className = 'stopwatch__button';
    lapButton.textContent = 'Lap';
    buttonContainer.appendChild(lapButton);

    const resetButton = document.createElement('button');
    resetButton.className = 'stopwatch__button';
    resetButton.setAttribute('disabled', ' ');
    resetButton.textContent = 'Reset';
    buttonContainer.appendChild(resetButton);

    let lapContainer = null; // сам элемент создастся позже в функции lapHandler

    const timer = {
      startTime: 0,
      id: null,
      onPause: true,
      onPauseTime: 0,

      start(callback) {
        this.onPause = false;
        if (!this.id) { // чтобы второй раз случайно не инициировать таймер
          this.startTime = Date.now();
          this.id = setInterval(() => {
            callback(Date.now() - this.startTime + this.onPauseTime);
          }, 100);
        }
      },
      pause() {
        this.onPause = true;
        this.onPauseTime = Date.now() - this.startTime + this.onPauseTime;
        clearInterval(this.id);
        this.id = null;
      },

      reset() {
        clearInterval(this.id);
        this.startTime = 0;
        this.onPause = true;
        this.onPauseTime = 0;
        this.id = null;
      },
    };

    let isRunning = false;
    // --------------------------------------------Events------------------------------------------
    function startHandler() {
      if (!isRunning) {
        isRunning = true;
        resetButton.removeAttribute('disabled');
        this.textContent = 'Pause';
        // resetButton.classList.remove('button-inactive');
        timer.start(
          (data) => { timeField.textContent = getFormattedTime(data); }
        );
      } else {
        isRunning = false;
        this.textContent = 'Continue';
        timer.pause();
      }

    }

    startButton.addEventListener('click', startHandler);
    // -------------------------------------------------------------------------------
    function lapHandler() {
      if (!isRunning) { return; }
      if (!lapContainer) {
        lapContainer = document.createElement('ul');
        lapContainer.className = 'laps-list stopwatch__laps-list';
        item.appendChild(lapContainer);
      }
      buttonContainer.style.marginBottom = '10px';
      const lapItem = document.createElement('li');
      lapItem.className = 'laps-item';
      lapItem.textContent = timeField.textContent;
      lapContainer.appendChild(lapItem);
    }
    lapButton.addEventListener('click', lapHandler);

    // ------------------------------------------------------------------------------

    function resetHandler() {
      timeField.textContent = '00:00.0';
      isRunning = false;
      startButton.textContent = 'Start';
      timer.reset();
      buttonContainer.style.marginBottom = '0px';
      resetButton.setAttribute('disabled', ' ');
      if (lapContainer) {
        item.removeChild(lapContainer);
      }
      lapContainer = null;
    }
    resetButton.addEventListener('click', resetHandler);
  }
}

const container_1 = document.getElementById('#stopwatch_1');
const stopWatch_1 = new StopWatch(container_1);

const container_2 = document.getElementById('#stopwatch_2');
const stopWatch_2 = new StopWatch(container_2);

function getFormattedTime(time) {
  const timeObj = new Date(time);
  
  return (timeObj.getMinutes()<10? '0'+timeObj.getMinutes(): timeObj.getMinutes())
  + ':'
  + (timeObj.getSeconds()<10? '0'+timeObj.getSeconds(): timeObj.getSeconds())
  + '.'
  + Number.parseInt(timeObj.getMilliseconds()/100);
}
