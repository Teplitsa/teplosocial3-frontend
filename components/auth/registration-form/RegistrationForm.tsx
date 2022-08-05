import {
  ReactElement,
  useState,
  useContext,
  useRef,
  FormEvent,
  cloneElement,
  MouseEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStoreActions } from "../../../model/helpers/hooks";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import PrivacyPolicy from "../../PrivacyPolicy";
import formStyles from "../../../inclusive-components/form/Form.module.scss";
import linkStyles from "../../../inclusive-components/typography/link/Link.module.scss";

const { InputText, InputPassword, Button, SnackbarContext, ModalContext } =
  InclusiveComponents;

const RegistrationForm: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const { dispatch: snackbarDispatch } = useContext(SnackbarContext);
  const { dispatch: modalDispatch } = useContext(ModalContext);

  const inputPasswordRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }>(null);
  const register = useStoreActions((state) => state.session.register);

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
      first_name: "Введите имя.",
      last_name: "Введите фамилию.",
      email:
        "Пожалуйста, проверьте, правильно ли вы ввели email. Он должен быть в формате vasha@pochta.ru",
      password: "Введите пароль.",
    };
    const isValid = {
      first_name: event.currentTarget.elements["first_name"].validity.valid,
      last_name: event.currentTarget.elements["last_name"].validity.valid,
      email: event.currentTarget.elements["email"].validity.valid,
      password: event.currentTarget.elements["password"].validity.valid,
    };
    const invalid = Object.entries(isValid).filter(
      ([elementName, valid]) => !valid
    );

    Object.entries(messages).forEach(([elementName, text]) => {
      event.currentTarget.elements[elementName].focus();

      const type = isValid[elementName] ? "delete" : "add";

      snackbarDispatch({
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

    register({
      formData,
      successCallbackFn: () => router.push("/"),
      errorCallbackFn: (messageText) =>
        snackbarDispatch({
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

  const handlePrivacyPolicyModalOpen = (
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();

    modalDispatch({
      type: "template",
      payload: {
        size: "lg",
        title: "Политика обработки персональных данных",
        content: PrivacyPolicy,
      },
    });

    modalDispatch({ type: "open" });
  };

  return (
    <form
      className={formStyles["form"]}
      onSubmit={handleSubmit}
      noValidate={true}
    >
      <InputText
        label="Имя"
        name="first_name"
        value={formData?.first_name ?? ""}
        placeholder="Имя"
        required={true}
        autoComplete="on"
        onChange={handleInputChange}
      />
      <InputText
        label="Фамилия"
        name="last_name"
        value={formData?.last_name ?? ""}
        placeholder="Фамилия"
        required={true}
        autoComplete="on"
        onChange={handleInputChange}
      />
      <InputText
        label="Email"
        type="email"
        name="email"
        value={formData?.email ?? ""}
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
        Зарегистрироваться
      </Button>
      <div className={formStyles["form__footer"]}>
        <div className={formStyles["form__footer-text"]} role="paragraph">
          Нажимая на кнопку, вы даете{" "}
          <a
            href="#"
            className={`${linkStyles["link"]} ${linkStyles["link_color-initial"]}`}
            onClick={handlePrivacyPolicyModalOpen}
          >
            согласие
            <br />
            на обработку своих персональных данных
          </a>
        </div>
        <Link href="/auth/login">
          <a
            className={`${linkStyles["link"]} ${linkStyles["link_bold"]} ${linkStyles["link_align-center"]}`}
          >
            У меня уже есть аккаунт
          </a>
        </Link>
      </div>
    </form>
  );
};

export default RegistrationForm;
