import {
  ReactElement,
  useState,
  useEffect,
  useContext,
  FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as _ from "lodash";

import { useStoreActions, useStoreState } from "../../../model/helpers/hooks";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import * as utils from "../../../utilities/utilities";
import formStyles from "../../../inclusive-components/form/Form.module.scss";
import linkStyles from "../../../inclusive-components/typography/link/Link.module.scss";

const { InputPasswordGroup, InputPassword, Button, SnackbarContext } =
  InclusiveComponents;

const ResetPasswordForm: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const { dispatch } = useContext(SnackbarContext);
  const [isSuccessfullyReset, setIsSuccessfullyReset] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<{
    pass1: string;
    pass2: string;
    rp_key: string;
  }>(null);
  const changePassword = useStoreActions(
    (state) => state.session.changePassword
  );
  const session = useStoreState(store => store.session);

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
      pass1: "Введите новый пароль.",
      pass2: "Пароли не совпадают.",
    };
    const isValid = {
      pass1: event.currentTarget.elements["pass1"].validity.valid,
      pass2: event.currentTarget.elements["pass2"].validity.valid,
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

    changePassword({
      formData,
      successCallbackFn: () => {
        setIsSuccessfullyReset(true);

        dispatch({
          type: "add",
          payload: {
            messages: [
              {
                context: "success",
                text: `Пароль успешно изменён. Вы будете автоматически перенаправлены на страницу входа в систему через 10 секунд.`,
              },
            ],
          },
        });
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

  useEffect(() => {
    setFormData({
      ...formData,
      rp_key: (router.query?.key as string) ?? "",
    });
  }, [router]);

  useEffect(() => {
    if (isSuccessfullyReset) {
      const timerId = setTimeout(() => router.push("/auth/login"), 10000);

      return () => clearTimeout(timerId);
    }
  }, [isSuccessfullyReset]);

  useEffect(() => {
    if (!session.isLoaded) {
      return;
    }

    if(session.isLoggedIn) {
      router.push("/");
    } else {
      utils.tokenFetch(
        utils.getLoginUrl() + "?action=rp&key=" +
          _.get(router, "query.key", "") +
          "&login=" +
          _.get(router, "query.login", "")
      );
    }
  }, [session]);  

  return (
    <form
      className={formStyles["form"]}
      onSubmit={handleSubmit}
      noValidate={true}
    >
      <input
        type="hidden"
        name="rp_key"
        value={formData?.rp_key ?? ""}
        required={true}
      />
      <InputPasswordGroup>
        <InputPassword
          label="Введите новый пароль"
          name="pass1"
          value={formData?.pass1 ?? ""}
          placeholder="Введите новый пароль"
          required={true}
          onChange={handleInputChange}
        />
        <InputPassword
          label="Пароль ещё раз"
          name="pass2"
          value={formData?.pass2 ?? ""}
          placeholder="Пароль ещё раз"
          required={true}
          onChange={handleInputChange}
        />
      </InputPasswordGroup>
      <Button className="btn_primary" type="submit" name="submit">
        Изменить
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

export default ResetPasswordForm;
