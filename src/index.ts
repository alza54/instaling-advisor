import Overlay from './Overlay';

interface Task {
  audio_file_name: string
  has_audio: string
  id: string
  speech_part: string
  translations: string
  type: string
  usage_example: string;
  word: string;
}

interface NextTask extends Task {
  audio_file_available: string;
  audio_filename: string;
  difficulty: string;
  exp_easier_count: string;
  global_id: string;
  language_id: string;
  maxWords: string;
  meaning: null|string;
}

class Solver {

  private static readonly APP_PATH = '/ling2/html_app/app.php';

  protected readonly overlay = new Overlay();

  protected readonly click = (selector: HTMLInputElement) => selector.click();

  protected selectors: { [key: string]: HTMLInputElement } = {
    startSessionPage: null,
    startSessionButton: null,
    continueSessionPage: null,
    continueSessionButton: null
  };

  constructor () {
    Solver.checkPath();
    Solver.enablePasting();
    try {
      this.bindSelectors();
      this.ensureSelectorsExist();
      this.initialiseProxies();
      this.initialiseSession();
    } catch (e) {
      console.error(e);
      console.warn('Skrypt może być nieaktualny. Zgłoś problem na e-mail expl0it@shellcode.team lub w Github issue.');
      return;
    }
  }

  private bindSelectors () {
    this.selectors.startSessionPage = document.querySelector<HTMLInputElement>('#start_session_page');
    this.selectors.startSessionButton = document.querySelector<HTMLInputElement>('#start_session_button');
    this.selectors.continueSessionPage = document.querySelector<HTMLInputElement>('#continue_session_page');
    this.selectors.continueSessionButton = document.querySelector<HTMLInputElement>('#continue_session_button');
  }

  private ensureSelectorsExist () {
    for (const key in this.selectors) {
      if (!this.selectors[key]) {
        throw `Element ${key} nie został znaleziony na stronie.`;
      }
    }
  }

  private initialiseProxies () {
    $(document).ajaxSuccess((_event, xhr, settings) => {
      if (settings.url === '../server/actions/generate_next_word.php') {
        let json = {} as NextTask;
        try {
          json = JSON.parse(xhr.responseText);
        } catch {
          throw `Nie można sparsować odpowiedzi serwera.`;
        }
        json.word ? this.overlay.setAnswer(json.word, json.speech_part) : this.overlay.setAnswer('-', '-');
        json.difficulty ? this.overlay.setInfo(json.difficulty, json.exp_easier_count) : this.overlay.setInfo('-', '-');
      }
    });
  }

  private initialiseSession ({ startSessionPage, startSessionButton, continueSessionPage, continueSessionButton } = this.selectors) {
    if (continueSessionPage.style.display !== 'none') {
      this.click(continueSessionButton);
    } else if (startSessionPage.style.display !== 'none') {
      this.click(startSessionButton);
    } else {
      $('#learning_page').hide();
      this.click(continueSessionButton);
      this.click(startSessionButton);
    }
  }

  public static enablePasting () {
    $('#answer').off('paste');
  }

  public static checkPath () {
    if (window.location.pathname !== Solver.APP_PATH) {
      alert('Skrypt powinien zostać uruchomiony na stronie sesji. Otwórz stronę sesji, a następnie uruchom skrypt ponownie.');
      window.location.href = '/login';
    }
  }

}

export default new Solver();
