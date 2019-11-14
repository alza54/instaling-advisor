const css = require('./overlay.css').toString();

export default class Overlay {

  protected overlay: HTMLElement = null;
  protected secondOverlay: HTMLElement = null;

  protected static readonly overlayID = Math.random().toString(36).substring(2, 15).replace(/[0-9]/g, '');
  protected static readonly overlayTwoID = Math.random().toString(36).substring(2, 15).replace(/[0-9]/g, '');

  constructor () {
    Overlay.appendStyles();
    this.createOverlayElement();
    this.createSecondOverlayElement();
    console.clear();
    console.log('%c UWAGA!', 'background: #222; color: #f00; font-size: 20px;', 'Tadek');
  }

  private static appendStyles () {
    const head = document.head || document.getElementsByTagName('head')[0];
    const styleElement = document.createElement('style');
    head.appendChild(styleElement);
    styleElement.appendChild(document.createTextNode(Overlay.prepareCSS()));
  }

  private createOverlayElement () {
    this.overlay = document.createElement('div');
    this.overlay.id = Overlay.overlayID;
    this.overlay.innerText = `Odpowiedź: -`;
    document.body.appendChild(this.overlay);
  }

  public createSecondOverlayElement () {
    this.secondOverlay = document.createElement('div');
    this.secondOverlay.id = Overlay.overlayTwoID;
    this.secondOverlay.innerText = `Trudność: -, exp: -`;
    document.body.appendChild(this.secondOverlay);
  }

  private static prepareCSS () {
    return css.replace('#overlay', '#' + Overlay.overlayID).replace('#overlay-two', '#' + Overlay.overlayTwoID);
  }

  public setAnswer (answer: string, speechPart: string) {
    this.overlay.innerText = `Odpowiedź: ${answer} (${speechPart})`;
  }

  public setInfo (difficulty: string, exp: string) {
    this.secondOverlay.innerText = `Trudność: ${difficulty}, exp: ${exp}`;
  }

}
