import {
  ReactElement,
  useState,
  useEffect,
  useContext,
  ChangeEvent,
} from "react";

import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";

import InclusiveComponents from "../inclusive-components/inclusive-components";
import { ISnackbarMessage } from "../inclusive-components/inclusive-components.typing";
import formStyles from "../inclusive-components/form/Form.module.scss";
import commonStyles from "../inclusive-components/A11y-common.module.scss";
import { convertObjectToClassName } from "../utilities/utilities";
import QuestionImage from "../inclusive-components/tooltip/img/icon-question.svg";
import articleStyles from "../inclusive-components/typography/article/Article.module.scss";
import linkStyles from "../inclusive-components/typography/link/Link.module.scss";

const {
  ProgressBar,
  Accordion,
  Button,
  ButtonGroup,
  InputText,
  InputPassword,
  InputPasswordGroup,
  SnackbarContext,
  ModalContext,
  InputCheckbox,
  InputRadio,
  Select,
  Tooltip,
  TextArea,
  Carousel,
  Matrix,
} = InclusiveComponents;

const InclusiveComponentsPage: React.FunctionComponent = (): ReactElement => {
  const { dispatch: snackbarDispatch } = useContext(SnackbarContext);
  const { dispatch: modalDispatch } = useContext(ModalContext);
  const [progressValue, setProgressValue] = useState(0);
  const [personName, setPersonName] = useState("Мария");
  const [personSurname, setPersonSurname] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [personURL, setPersonURL] = useState("https://www.facebook.com/");
  const [personPassword, setPersonPassword] = useState("");
  const [personPassword2, setPersonPassword2] = useState("");
  const [personPasswordRepeat, setPersonPasswordRepeat] = useState("");
  const [whatIsHosting1, setWhatIsHosting1] = useState(false);
  const [whatIsHosting2, setWhatIsHosting2] = useState(false);
  const [whatIsHosting2_1, setWhatIsHosting2_1] = useState(false);
  const [whatIsHosting2_2, setWhatIsHosting2_2] = useState(false);
  const [question1, setQuestion1] = useState<string>("");
  const [question2, setQuestion2] = useState<Array<string>>([]);
  const [userResumeText, setUserResumeText] = useState<string>("");

  const progress = {
    valueNow: progressValue,
    valueText: `Прогресс обучения ${progressValue}%`,
    label: "Прогресс обучения",
    visibleText: `Пройдено ${progressValue}%`,
  };

  const terms = [
    {
      text: "Документ стратегического развития, который определяет план развития территории на ближайшие 20 лет",
    },
    {
      text: "Утверждается на местном уровне, устанавливает правовой режим использования земельных участков",
    },
    {
      text: "Устанавливает зоны размещения существующих объектов и их параметры, а также зоны размещения объектов, строительство которых может быть разрешено",
    },
    {
      text: "Сводная выписка из всей градостроительной документации в отношении конкретного земельного участка",
    },
  ];
  const definitions = [
    {
      slug: "slug-1",
      text: "Генеральный план",
    },
    {
      slug: "slug-2",
      text: "План землепользования и застройки",
    },
    {
      slug: "slug-3",
      text: "Проект планировки территории (ППТ)",
    },
    {
      slug: "slug-4",
      text: "Градостроительный план земельного участка",
    },
  ];

  useEffect(() => {
    if (progressValue >= 100) return;

    const progressValueId = setTimeout(() => {
      const currentValue = progressValue + 10;

      setProgressValue(currentValue);
    }, 2000);

    return () => clearTimeout(progressValueId);
  }, [progressValue]);

  return (
    <>
      <DocumentHead />
      <Main>
        <main
          style={{
            margin: "0 auto",
            padding: "0 15px",
            width: "970px",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
          className="site-main"
          role="main"
        >
          <h1>Инклюзивные компоненты</h1>
          <section>
            <h2>Компонент Progressbar</h2>
            <ProgressBar {...progress} />
          </section>
          <section>
            <h2>Компонент Accordion</h2>
            <Accordion theme="arrow-control" initIndex={0}>
              <section>
                <h2 data-accordion-title={true}>
                  <Button
                    className="btn_reset"
                    data-accordion-control={true}
                    aria-label="Структура модуля «Как выглядит качественный сайт НКО»"
                  >
                    Как выглядит качественный сайт НКО
                  </Button>
                </h2>
                <div data-accordion-content={true}>
                  <h3>1. Как начать работать в соцсетях</h3>
                  <p>
                    Описание первого модуля. Разнообразный и богатый опыт
                    сложившаяся структура организации влечет за собой процесс.
                  </p>
                  <Accordion>
                    <section>
                      <h4 data-accordion-title={true}>
                        <Button
                          className="btn_reset"
                          data-accordion-control={true}
                          aria-label="Структура модуля «Как начать работать в соцсетях»"
                        >
                          Структура модуля
                        </Button>
                      </h4>
                      <div data-accordion-content={true}>
                        <h5>Введение</h5>
                        <p>
                          Для чего нужен сектор «гуманитарная грамотность» и
                          почему мы решили его включить в Теплосеть?
                        </p>
                        <h5>Что такое социальная справедливость. Часть 1</h5>
                        <p>
                          В этом видео мы познакомим тебя с понятием «социальная
                          справедливость».
                        </p>
                        <h5>Что такое социальная справедливость. Часть 2</h5>
                        <p>
                          Статья 7 российской Конституции провозглашает, что
                          Российская Федерация является социальным государством
                        </p>
                        <h5>Что такое социальная справедливость. Тест</h5>
                        <p>
                          В заключительном видео ты познакомишься с теорией
                          Джона Роулза о социальной справедливости.
                        </p>
                        <h5>Итоговый тест </h5>
                      </div>
                    </section>
                  </Accordion>
                </div>
              </section>
              <section>
                <h2 data-accordion-title={true}>
                  <Button
                    className="btn_reset"
                    data-accordion-control={true}
                    aria-label="Структура модуля «Как начать работать в соцсетях»"
                  >
                    Курс SMM
                  </Button>
                </h2>
                <div data-accordion-content={true}>
                  <h3>1. Как начать работать в соцсетях</h3>
                  <p>
                    Описание первого модуля. Разнообразный и богатый опыт
                    сложившаяся структура организации влечет за собой процесс.
                  </p>
                  <Accordion>
                    <section>
                      <h4 data-accordion-title={true}>
                        <Button
                          className="btn_reset"
                          data-accordion-control={true}
                          aria-label="Структура модуля «Как начать работать в соцсетях»"
                        >
                          Структура модуля
                        </Button>
                      </h4>
                      <div data-accordion-content={true}>
                        <h5>Введение</h5>
                        <p>
                          Для чего нужен сектор «гуманитарная грамотность» и
                          почему мы решили его включить в Теплосеть?
                        </p>
                        <h5>Что такое социальная справедливость. Часть 1</h5>
                        <p>
                          В этом видео мы познакомим тебя с понятием «социальная
                          справедливость».
                        </p>
                        <h5>Что такое социальная справедливость. Часть 2</h5>
                        <p>
                          Статья 7 российской Конституции провозглашает, что
                          Российская Федерация является социальным государством
                        </p>
                        <h5>Что такое социальная справедливость. Тест</h5>
                        <p>
                          В заключительном видео ты познакомишься с теорией
                          Джона Роулза о социальной справедливости.
                        </p>
                        <h5>Итоговый тест </h5>
                      </div>
                    </section>
                    <section>
                      <h4 data-accordion-title={true}>
                        <Button
                          className="btn_reset"
                          data-accordion-control={true}
                          aria-label="Структура модуля «Как начать работать в соцсетях»"
                        >
                          Структура модуля
                        </Button>
                      </h4>
                      <div data-accordion-content={true}>
                        <h5>Введение</h5>
                        <p>
                          Для чего нужен сектор «гуманитарная грамотность» и
                          почему мы решили его включить в Теплосеть?
                        </p>
                        <h5>Что такое социальная справедливость. Часть 1</h5>
                        <p>
                          В этом видео мы познакомим тебя с понятием «социальная
                          справедливость».
                        </p>
                        <h5>Что такое социальная справедливость. Часть 2</h5>
                        <p>
                          Статья 7 российской Конституции провозглашает, что
                          Российская Федерация является социальным государством
                        </p>
                        <h5>Что такое социальная справедливость. Тест</h5>
                        <p>
                          В заключительном видео ты познакомишься с теорией
                          Джона Роулза о социальной справедливости.
                        </p>
                        <h5>Итоговый тест </h5>
                      </div>
                    </section>
                  </Accordion>
                </div>
              </section>
            </Accordion>
          </section>
          <br />
          <br />
          <section>
            <h2>Кнопки</h2>
            <h3>.btn_primary</h3>
            <Button
              className="btn_primary"
              aria-label="Начать обучение по курсу SMM"
            >
              Начать обучение
            </Button>
            <br />
            <br />
            <Button
              className="btn_primary"
              aria-label="Начать обучение по курсу SMM"
              disabled={true}
            >
              Начать обучение
            </Button>
            <br />
            <br />
            <h3>.btn_default</h3>
            <Button className="btn_default">Пропустить</Button>
            <br />
            <br />
            <Button className="btn_default" disabled={true}>
              Пропустить
            </Button>
            <br />
            <br />
            <h3>.btn_secondary</h3>
            <Button className="btn_secondary">Начать курс</Button>
            <br />
            <br />
            <Button className="btn_secondary" disabled={true}>
              Начать курс
            </Button>
            <br />
            <br />
            <h3>.btn_full-width</h3>
            <Button className="btn_primary btn_full-width">
              Начать обучение
            </Button>
            <br />
            <br />
            <h3>.btn_group</h3>
            <ButtonGroup>
              <Button className="btn_default">Пропустить</Button>
              <Button className="btn_primary">Ответить</Button>
            </ButtonGroup>
          </section>
          <br />
          <br />
          <section>
            <h2>Компонент InputText</h2>
            <InputText
              label="Имя"
              value={personName}
              placeholder="Имя"
              onChange={(event) => setPersonName(event.currentTarget.value)}
            />
            <br />
            <br />
            <InputText
              label="Фамилия"
              value={personSurname}
              placeholder="Фамилия"
              required={true}
              onChange={(event) => setPersonSurname(event.currentTarget.value)}
            />
            <br />
            <br />
            <InputText
              label="Email"
              type="email"
              value={personEmail}
              placeholder="Email"
              onChange={(event) => setPersonEmail(event.currentTarget.value)}
            />
            <br />
            <br />
            <InputText
              label="URL"
              type="url"
              value={personURL}
              placeholder="URL"
              onChange={(event) => setPersonURL(event.currentTarget.value)}
            />
          </section>
          <br />
          <br />
          <section>
            <h2>Компонент InputPassword</h2>
            <InputPassword
              label="Пароль"
              value={personPassword}
              placeholder="Пароль"
              required={true}
              onChange={(event) => setPersonPassword(event.currentTarget.value)}
            />
          </section>
          <br />
          <br />
          <section>
            <h2>Компонент InputPasswordGroup</h2>
            <InputPasswordGroup>
              <InputPassword
                label="Пароль"
                value={personPassword2}
                placeholder="Пароль"
                required={true}
                onChange={(event) =>
                  setPersonPassword2(event.currentTarget.value)
                }
              />
              <InputPassword
                label="Пароль ещё раз"
                value={personPasswordRepeat}
                placeholder="Пароль ещё раз"
                required={true}
                onChange={(event) =>
                  setPersonPasswordRepeat(event.currentTarget.value)
                }
              />
            </InputPasswordGroup>
          </section>
          <br />
          <br />
          <section>
            <h2>Компонент Snackbar</h2>
            <h3>Сообщение об успешной операции</h3>
            <Button
              className="btn_primary"
              onClick={() => {
                const message: ISnackbarMessage = {
                  context: "success",
                  title: "Спасибо, что выбрали нас!",
                  text: "Мы отправили вам на почту письмо. Чтобы начать работу с сайтом подтвердите адрес электронной почты.",
                };

                snackbarDispatch({
                  type: "add",
                  payload: { messages: [message] },
                });
              }}
            >
              Показать
            </Button>
            <br />
            <br />
            <h3>Сообщение об ошибке</h3>
            <Button
              className="btn_primary"
              onClick={() => {
                const message: ISnackbarMessage = {
                  context: "error",
                  title: "ОЙ!",
                  text: "При попытке сохранения данных произошла ошибка.",
                };

                snackbarDispatch({
                  type: "add",
                  payload: { messages: [message] },
                });
              }}
            >
              Показать
            </Button>
          </section>
          <br />
          <br />
          <section>
            <h2>Компонент Modal</h2>
            <Button
              className="btn_primary"
              onClick={() => {
                modalDispatch({
                  type: "template",
                  payload: {
                    size: "sm",
                    title: "Вы точно хотите удалить заметку?",
                    content: ({ closeModal }) => (
                      <>
                        <p>
                          Lorem ipsum dolor sit amet, consectetuer adipiscing
                          elit. Aenean commodo ligula eget dolor. Aenean massa.
                          Cum sociis natoque penatibus et magnis dis parturient
                          montes, nascetur ridiculus mus. Donec quam felis,
                          ultricies nec, pellentesque eu, pretium quis, sem.
                          Nulla consequat massa quis enim.
                        </p>
                        <ButtonGroup>
                          <Button className="btn_default" onClick={closeModal}>
                            Оставить
                          </Button>
                          <Button
                            className="btn_secondary"
                            onClick={closeModal}
                          >
                            Удалить
                          </Button>
                        </ButtonGroup>
                      </>
                    ),
                  },
                });
                modalDispatch({ type: "open" });
              }}
            >
              Показать
            </Button>
          </section>
          <br />
          <br />
          <section>
            <h2>Компонент InputCheckbox</h2>
            <form
              className={`${formStyles["form"]} ${formStyles["form_gap-30px"]}`}
            >
              <InputCheckbox
                label="Услуга предоставления сервера для размещения вашего сайта"
                name="what_is_hosting"
                value={1}
                checked={whatIsHosting1}
                onChange={(event) =>
                  setWhatIsHosting1(event.currentTarget.checked)
                }
              />
              <InputCheckbox
                label="Подключенный к сети компьютер, на котором лежат файлы сайта"
                name="what_is_hosting"
                value={2}
                checked={whatIsHosting2}
                onChange={(event) =>
                  setWhatIsHosting2(event.currentTarget.checked)
                }
              />
            </form>
          </section>
          <br />
          <br />
          <section>
            <h2>Компонент InputRadio</h2>
            <form
              className={`${formStyles["form"]} ${formStyles["form_gap-30px"]}`}
            >
              <InputRadio
                label="Услуга предоставления сервера для размещения вашего сайта"
                name="what_is_hosting2"
                value={1}
                checked={whatIsHosting2_1}
                onChange={(event) =>
                  setWhatIsHosting2_1(event.currentTarget.checked)
                }
              />
              <InputRadio
                label="Подключенный к сети компьютер, на котором лежат файлы сайта"
                name="what_is_hosting2"
                value={2}
                checked={whatIsHosting2_2}
                onChange={(event) =>
                  setWhatIsHosting2_2(event.currentTarget.checked)
                }
              />
            </form>
          </section>
          <br />
          <br />
          <section>
            <h2>Компонент Select</h2>
            <h3>Not multiple</h3>
            <Select
              label="Выберите ответ"
              name="question1"
              multiple={false}
              onInput={(event: ChangeEvent<HTMLSelectElement>) =>
                setQuestion1(event.currentTarget.selectedOptions.item(0).value)
              }
              onQuasiOptionSelect={(selectedOption) => {
                setQuestion1(selectedOption.value);
              }}
            >
              {[
                {
                  label: "1. Место для длинного предложения",
                  value: "value-1",
                  selected: question1 === "value-1",
                },
                {
                  label: "2. Место для длинного предложения",
                  value: "value-2",
                  selected: question1 === "value-2",
                },
                {
                  label: "3. Место для длинного предложения",
                  value: "value-3",
                  selected: question1 === "value-3",
                },
              ]}
            </Select>
            <br />
            <br />
            <h3>Multiple</h3>
            <Select
              label="Выберите ответ"
              name="question2"
              value={question2}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                setQuestion2(
                  Array.from(event.currentTarget.selectedOptions).map(
                    (option) => option.value
                  )
                )
              }
              multiple={true}
              onQuasiOptionSelect={(selectedOption) => {
                setQuestion2((prevState) => {
                  const newState = prevState.includes(selectedOption.value)
                    ? prevState.filter(
                        (value) => value !== selectedOption.value
                      )
                    : [selectedOption.value, ...prevState];

                  return newState;
                });
              }}
            >
              {[
                {
                  label: "1. Место для длинного предложения",
                  value: "value-1",
                  selected: question2.includes("value-1"),
                },
                {
                  label: "2. Место для длинного предложения",
                  value: "value-2",
                  selected: question2.includes("value-2"),
                },
                {
                  label: "3. Место для длинного предложения",
                  value: "value-3",
                  selected: question2.includes("value-3"),
                },
              ]}
            </Select>
          </section>
          <br />
          <br />
          <section>
            <h2>Компонент Tooltip</h2>
            <Tooltip
              content={() => (
                <p>
                  Разнообразный и богатый опыт дальнейшее развитие различных
                  форм деятельности требуют от нас анализа позиций, занимаемых
                  участниками в отношении поставленных задач. Повседневная
                  практика показывает, что укрепление и развитие структуры
                  играет важную роль в формировании направлений прогрессивного
                  развития.
                </p>
              )}
            >
              <Button
                style={{ display: "flex" }}
                className={convertObjectToClassName({
                  btn_reset: true,
                  [commonStyles["focusable"]]: true,
                })}
              >
                <span
                  style={{
                    background: `url(${QuestionImage}) 50% 50% no-repeat #2f59e7`,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                  }}
                  aria-hidden={true}
                />
                <span className={commonStyles["visually-hidden"]}>
                  Подробнее о курсе
                </span>
              </Button>
            </Tooltip>
          </section>
          <br />
          <br />
          <section>
            <h2>Компонент TextArea</h2>
            <TextArea
              label="О себе"
              name="user-resume"
              value={userResumeText}
              placeholder="О себе"
              required={true}
              onChange={(event) => setUserResumeText(event.target.value)}
            />
          </section>
          <br />
          <br />
          <section>
            <h2>Компонент Carousel</h2>
            <br />
            <br />
            <Carousel
              topContent={() => (
                <div className={articleStyles["article"]}>
                  <h2
                    style={{
                      margin: "0 0 16px",
                      textTransform: "uppercase",
                    }}
                  >
                    Курсы
                  </h2>
                  <a
                    style={{
                      display: "inline-block",
                      margin: "0 0 16px",
                    }}
                    className={`${linkStyles["link"]} ${linkStyles["link_underlined"]}`}
                    href="#"
                  >
                    Библиотека курсов
                  </a>
                  <p>
                    Возможно тут нужен короткий но понятный пояснительный текст
                    про треки.
                  </p>
                </div>
              )}
            >
              <div className="course-list">
                <div
                  style={{
                    backgroundColor: "red",
                    minHeight: "305px",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                  }}
                  className="course-list__item"
                />
                <div
                  style={{
                    backgroundColor: "orange",
                    minHeight: "315px",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                  }}
                  className="course-list__item"
                />
                <div
                  style={{
                    backgroundColor: "yellow",
                    minHeight: "385px",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                  }}
                  className="course-list__item"
                />
                <div
                  style={{
                    backgroundColor: "green",
                    minHeight: "385px",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                  }}
                  className="course-list__item"
                />
                <div
                  style={{
                    backgroundColor: "lightblue",
                    minHeight: "385px",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                  }}
                  className="course-list__item"
                />
                <div
                  style={{
                    backgroundColor: "blue",
                    minHeight: "385px",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                  }}
                  className="course-list__item"
                />
                <div
                  style={{
                    backgroundColor: "purple",
                    minHeight: "385px",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                  }}
                  className="course-list__item"
                />
              </div>
            </Carousel>
          </section>
          <br />
          <br />
          <section>
            <h2>Компонент Matrix</h2>
            <br />
            <br />
            <Matrix {...{ terms, definitions }} />
          </section>
          <br />
          <br />
        </main>
      </Main>
    </>
  );
};

export default InclusiveComponentsPage;
