import {
  ReactElement,
  useState,
  useContext,
  FormEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { useStoreActions } from "../../../model/helpers/hooks";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import formStyles from "../../../inclusive-components/form/Form.module.scss";

const {
  InputPasswordGroup,
  InputPassword,
  Button,
  SnackbarContext,
} = InclusiveComponents;

const ChangePasswordForm: React.FunctionComponent<{
  setIsPasswordSent: Dispatch<SetStateAction<boolean>>;
  setProcessing: Dispatch<SetStateAction<boolean>>;
}> = ({ setIsPasswordSent, setProcessing }): ReactElement => {
  const { dispatch } = useContext(SnackbarContext);
  const [formData, setFormData] = useState<{
    old_password: string;
    new_password: string;
    new_password_repeat: string;
  }>(null);
  const changePasswordByAuthorizedUser = useStoreActions(
    (state) => state.session.changePasswordByAuthorizedUser
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
      old_password: "Введите текущий пароль.",
      new_password: "Введите новый пароль.",
      new_password_repeat: "Пароли не совпадают.",
    };
    const isValid = {
      old_password: event.currentTarget.elements["old_password"].validity.valid,
      new_password: event.currentTarget.elements["new_password"].validity.valid,
      new_password_repeat: event.currentTarget.elements["new_password_repeat"].validity.valid && event.currentTarget.elements["new_password"].value === event.currentTarget.elements["new_password_repeat"].value,
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

    setProcessing(true);

    changePasswordByAuthorizedUser({
      formData,
      successCallbackFn: () => {
        setProcessing(false);
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
      <InputPassword
        label="Текущий пароль"
        name="old_password"
        value={formData?.old_password ?? ""}
        placeholder="Текущий пароль"
        required={true}
        onChange={handleInputChange}
      />
      <InputPasswordGroup>
        <InputPassword
          label="Новый пароль"
          name="new_password"
          value={formData?.new_password ?? ""}
          placeholder="Новый пароль"
          required={true}
          onChange={handleInputChange}
        />
        <InputPassword
          label="Повторите новый пароль"
          name="new_password_repeat"
          value={formData?.new_password_repeat ?? ""}
          placeholder="Повторите новый пароль"
          required={true}
          onChange={handleInputChange}
        />
      </InputPasswordGroup>
      <Button className="btn_primary" type="submit" name="submit">
        Сохранить
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
