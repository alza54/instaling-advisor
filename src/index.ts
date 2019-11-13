import Overlay from './Overlay';

class Solver {

  private static readonly APP_PATH = '/ling2/html_app/app.php';

  protected readonly overlay = new Overlay();

  protected readonly click = (selector: HTMLInputElement) => selector.click();

  protected selectors: { [key: string]: HTMLInputElement } = {
    continueSessionButton: null,
    audioElement: null
  };

  protected hookedFunctions: { [key: string]: Function } = {
    loadAudio: null
  };

  constructor () {
    Solver.checkPath();
    try {
      // @ts-ignore
      $("#answer").off('paste');
      this.bindSelectors();
      this.ensureSelectorsExist();
      this.initialiseHooks();
      this.initialiseSession();
      this.showAnswer(this.selectors.audioElement.src);
    } catch (e) {
      console.error(e);
      console.warn('Skrypt może być nieaktualny. Zgłoś problem na e-mail expl0it@shellcode.team lub w Github issue.');
      return;
    }
  }

  private bindSelectors () {
    this.selectors.continueSessionButton = document.querySelector<HTMLInputElement>('#continue_session_button');
    this.selectors.audioElement = document.querySelector<HTMLInputElement>('#jquery_audioPlayer audio');
  }

  private ensureSelectorsExist () {
    for (const key in this.selectors) {
      if (!this.selectors[key]) {
        throw `Element ${key} nie został znaleziony na stronie.`;
      }
    }
  }

  private initialiseHooks ({ continueSessionButton } = this.selectors) {
    if (continueSessionButton) {
      this.hookedFunctions.loadAudio = (window as any).loadAudio;
      (window as any).loadAudio = (url: string) => {
        this.showAnswer(url);
        if (url !== '/mp3/_empty.mp3') {
          this.hookedFunctions.loadAudio('http://s3.shellcode.team/insta/jp.mp3'); // w końcu jp player
        } else {
          this.hookedFunctions.loadAudio(url);
        }
      }
    } else {

    }
  }

  private initialiseSession ({ continueSessionButton } = this.selectors) {
    continueSessionButton && this.click(continueSessionButton);
  }

  private showAnswer (audioSource: string) {
    const answer = audioSource.match(/^https:\/\/instaling\.pl\/?\/mp3\/[0-9]+\/(.+?)\.mp3$/)?.[1];
    if (!answer) return;
    this.overlay.setAnswer(answer);
  }

  public static checkPath () {
    if (window.location.pathname !== Solver.APP_PATH) {
      alert('Skrypt powinien zostać uruchomiony na stronie sesji. Otwórz stronę sesji, a następnie uruchom skrypt ponownie.');
      window.location.href = '/login';
    }
  }

}

export default new Solver();
