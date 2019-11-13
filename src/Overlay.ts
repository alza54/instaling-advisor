const css = require('./overlay.css').toString();

export default class Overlay {

  protected overlay: HTMLElement = null;

  protected static readonly randomID = Math.random().toString(36).substring(2, 15).replace(/[0-9]/g, '');

  constructor () {
    Overlay.appendStyles();
    this.createOverlayElement();
    console.clear();
    console.log('%c UWAGA!', 'background: #222; color: #f00; font-size: 20px;', 'Tadek');
  }

  private static appendStyles () {
    const head = document.head || document.getElementsByTagName('head')[0];
    const styleElement = document.createElement('style');
    head.appendChild(styleElement);
    styleElement.appendChild(document.createTextNode(css.replace('#overlay', '#' + Overlay.randomID)));
  }

  private createOverlayElement () {
    this.overlay = document.createElement('div');
    this.overlay.id = Overlay.randomID;
    this.overlay.innerText = `Odpowiedź: -`;
    document.body.appendChild(this.overlay);
  }

  public setAnswer (answer: string) {
    this.overlay.innerText = `Odpowiedź: ${answer}`;
  }

}
