import { ReactElement, useState, useContext, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStoreActions } from "../../../model/helpers/hooks";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import formStyles from "../../../inclusive-components/form/Form.module.scss";
import linkStyles from "../../../inclusive-components/typography/link/Link.module.scss";

const { InputText, Button, SnackbarContext } = InclusiveComponents;

const ForgotPasswordForm: React.FunctionComponent<{
  setIsPasswordSent;
  setActionLoading;
}> = ({ setIsPasswordSent, setActionLoading }): ReactElement => {
  const router = useRouter();
  const { dispatch } = useContext(SnackbarContext);
  const [formData, setFormData] = useState<{
    email: string;
  }>(null);
  const retrievePassword = useStoreActions(
    (state) => state.session.retrievePassword
  );

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
      email:
        "Пожалуйста, проверьте, правильно ли вы ввели email. Он должен быть в формате vasha@pochta.ru",
    };
    const isValid = {
      email: event.currentTarget.elements["email"].validity.valid,
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

    setActionLoading(true);

    retrievePassword({
      formData,
      successCallbackFn: () => {
        setActionLoading(false);
        setIsPasswordSent(true);
      },
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
        name="email"
        value={formData?.email ?? ""}
        placeholder="Email"
        required={true}
        autoComplete="on"
        onChange={handleInputChange}
      />
      <Button className="btn_primary" type="submit" name="submit">
        Отправить
      </Button>
      <div className={formStyles["form__footer"]}>
        <Link href="/auth/registration">
          <a className={`${linkStyles["link"]} ${linkStyles["link_bold"]}`}>
            Зарегистрироваться
          </a>
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
