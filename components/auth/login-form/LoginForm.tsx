import {
  ReactElement,
  useState,
  useContext,
  useRef,
  FormEvent,
  cloneElement,
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStoreActions } from "../../../model/helpers/hooks";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import formStyles from "../../../inclusive-components/form/Form.module.scss";
import linkStyles from "../../../inclusive-components/typography/link/Link.module.scss";

const { InputText, InputPassword, Button, SnackbarContext } =
  InclusiveComponents;

const LoginForm: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const { dispatch } = useContext(SnackbarContext);
  const inputPasswordRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<{
    login: string;
    password: string;
  }>(null);
  const login = useStoreActions((state) => state.session.login);

  function handleInputChange(event: FormEvent<HTMLInputElement>) {
    const name = event.currentTarget.name;
    const value = event.currentTarget.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function formValidity(event: FormEvent<HTMLFormElement>): { valid: boolean } {
    const messages = {
      login: "Пожалуйста, проверьте, правильно ли вы ввели email. Он должен быть в формате vasha@pochta.ru",
      password: "Введите пароль.",
    };
    const isValid = {
      login: event.currentTarget.elements["login"].validity.valid,
      password: event.currentTarget.elements["password"].validity.valid,
    };
    const invalid = Object.entries(isValid).filter(
      ([elementName, valid]) => !valid
    );

    Object.entries(messages).forEach(([elementName, text]) => {
      event.currentTarget.elements[elementName].focus();

      const type = isValid[elementName] ? "delete" : "add";

      dispatch({
        type,
        payload: {
          messages: [
            {
              context: "error",
              text,
            },
          ],
        },
      });
    });

    if (invalid.length > 0) {
      event.currentTarget.elements[invalid[0][0]].focus();
    } else {
      event.currentTarget.elements["submit"].focus();
    }

    return {
      valid: invalid.length === 0,
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formValidity(event).valid) {
      return;
    }

    login({
      formData,
      successCallbackFn: () => router.push("/"),
      errorCallbackFn: (messageText) =>
        dispatch({
          type: "add",
          payload: {
            messages: [
              {
                context: "error",
                text: messageText,
              },
            ],
          },
        }),
    });
  }

  return (
    <form
      className={formStyles["form"]}
      onSubmit={handleSubmit}
      noValidate={true}
    >
      <InputText
        label="Email"
        type="email"
        name="login"
        value={formData?.login ?? ""}
        placeholder="Email"
        required={true}
        autoComplete="on"
        onChange={handleInputChange}
      />
      {cloneElement(
        <InputPassword
          label="Пароль"
          name="password"
          value={formData?.password ?? ""}
          placeholder="Пароль"
          required={true}
          autoComplete="off"
          onChange={handleInputChange}
        />,
        {
          ref: inputPasswordRef,
        }
      )}
      <Button className="btn_primary" type="submit" name="submit">
        Войти
      </Button>
      <div className={formStyles["form__footer"]}>
        <ul className={formStyles["form__footer-links"]}>
          <li>
            <Link href="/auth/registration">
              <a className={`${linkStyles["link"]} ${linkStyles["link_bold"]}`}>
                Зарегистрироваться
              </a>
            </Link>
          </li>
          <li>
            <Link href="/auth/forgot-password">
              <a className={linkStyles["link"]}>Забыли пароль?</a>
            </Link>
          </li>
        </ul>
      </div>
    </form>
  );
};

export default LoginForm;
