class Toaster {
  constructor(message, settings) {
    this.settings = settings;
    this.message = message;
    this.icon = this.settings.icon;
    this.type = this.settings.type;

    let _this = this;
    this.timeout = undefined;

    this.messageContainer = document.createElement('div');
    this.iconHolder = document.createElement('img');
    this.close = document.createElement('img');
    this.messageHolder = document.createElement('span');
    this.readMore = document.createElement('span');
    this.line = document.createElement('span');

    this.messageContainer.classList.add('toast');
    this.messageHolder.classList.add('message');
    this.iconHolder.classList.add('icon');
    this.close.classList.add('close');
    this.line.classList.add('line');
    this.readMore.classList.add('read-more');

    let iconType = (this.type == 'error' && this.icon == undefined) ? 'https://png.icons8.com/office/2x/error.png'
    : (this.type == 'warning' && this.icon == undefined) ? 'https://png.icons8.com/office/2x/warning-shield.png'
    : (this.type == 'danger' && this.icon == undefined) ? 'https://png.icons8.com/cotton/2x/electricity.png'
    : this.type == undefined ? 'https://png.icons8.com/nolan/2x/bell.png'
    : this.type == 'normal' ? 'https://png.icons8.com/nolan/2x/bell.png' : this.icon;

    this.iconHolder.setAttribute('src', iconType);
    this.iconHolder.setAttribute('alt', 'icon');
    this.close.setAttribute('src', 'https://png.icons8.com/ios/100/ffffff/delete-sign.png');
    this.close.setAttribute('alt', 'close');

    let domCheck = document.querySelector('.toast');
    if (domCheck == null) {
      document.body.appendChild(this.messageContainer);
    } else {
      document.body.removeChild(domCheck);
      document.body.appendChild(this.messageContainer);
    }
    this.messageContainer.appendChild(this.iconHolder);
    this.messageContainer.appendChild(this.line);
    this.messageContainer.appendChild(this.messageHolder);
    this.messageContainer.appendChild(this.close);

    this.delimit();

    this.close.addEventListener('click', () => {
      _this.messageContainer.style.transitionDuration = '1.05s';
      _this.messageContainer.classList.remove('show');
      removeToaster(_this.messageContainer);
    });

    raf(() => _this.messageContainer.classList.add('show'));
  }
}

Toaster.prototype.create = function () {
  let _this = this;
  this.timeout = setTimeout(() => {
    this.messageContainer.classList.remove('show');
    removeToaster(_this.messageContainer);
  }, _this.settings.duration);
};

Toaster.prototype.delimit = function () {
  let _this = this;
  let messageLimit = 50;
  let posNegFactor = 20;

  if (this.message.length > messageLimit) {
    let shortMessage = this.message.substr(0, messageLimit) + '......';

    this.messageHolder.innerHTML = shortMessage;
    this.readMore.innerHTML = 'Read more';
    this.messageHolder.appendChild(this.readMore);

    this.readMore.addEventListener('click', (e) => {
      clearTimeout(this.timeout);

      if (window.innerWidth < 600) {
        _this.messageContainer.style.transform = `translateY(-${window.innerHeight - getElementPos(_this.messageContainer).bottom}px)`;
      } else {
        _this.messageContainer.style.transform = `translateY(-${getElementPos(_this.messageContainer).top}px)`;
      }
      _this.messageContainer.classList.add('enlarged');

      _this.messageContainer.addEventListener('transitionend', (e) => {
        if (e.target.classList.contains('toast')) {
          let translateDistance = getElementPos(_this.iconHolder).top;
          _this.iconHolder.style.transform = `translateY(-${translateDistance - posNegFactor}px)`;
          _this.close.style.transform = `translateY(-${translateDistance - posNegFactor}px)`;

          _this.messageHolder.style.width = `${getElementPos(this.messageContainer).width}px`;
          _this.messageHolder.innerHTML = this.message;
        }
      });

      _this.iconHolder.addEventListener('transitionend', (e) => {
        _this.line.style.top = `${getElementPos(_this.iconHolder).top + 30}px`;
        _this.line.addEventListener('transitionend', (e) => {
          _this.line.classList.add('show');
        });
      });
    });

  } else {
    this.messageHolder.innerHTML = this.message;
  }
};

let getElementPos = (element) => element.getBoundingClientRect();

let removeToaster = (toaster) => {
  toaster.addEventListener('transitionend', () => document.body.removeChild(toaster));
};

let raf = (value, duration = 1000) => setTimeout(value, duration);