import {
  ReactElement,
  useEffect,
  useContext,
  useState,
  FormEvent,
} from "react";
import * as _ from "lodash";
import { useRouter } from "next/router";
import Link from "next/link";

import { ISocailLink } from "../../../model/model.typing";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import Avatar from "../../member/profileEdit/Avatar";
import GeneralInfo from "../../member/profileEdit/GeneralInfo";
import SocialLinks from "../../member/profileEdit/SocialLinks";
import BorderUnderHeader from "../../common/BorderUnderHeader";

import styles from "./ProfileEdit.module.scss";
import { resourceLimits } from "worker_threads";

const { Button, SnackbarContext } = InclusiveComponents;

const ProfileEdit: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const { dispatch: snackbarDispatch } = useContext(SnackbarContext);

  const profile = useStoreState(
    (state) => state.components.profileEditPage.profile
  );
  const session = useStoreState((state) => state.session);
  const updateProfileRequest = useStoreActions(
    (state) => state.components.profileEditPage.profile.updateProfileRequest
  );

  const [formData, setFormData] = useState<{
    first_name: string;
    last_name: string;
    description: string;
    profile_city: string;
    social_links: Array<ISocailLink>;
  }>(null);

  useEffect(() => {
    if (!profile.id || !session.isLoaded) {
      return;
    }

    if (profile.id !== session.user.id) {
      router.push(`/members/${profile.slug}`);
    }
  }, [profile, session]);

  useEffect(() => {
    if (!profile.id) {
      return;
    }

    // console.log("profile.socialLinks:", profile.socialLinks);

    setFormData({
      first_name: profile.firstName,
      last_name: profile.lastName,
      description: profile.description,
      profile_city: profile.city,
      social_links: profile.socialLinks,
    });
  }, [profile]);

  function handleInputChange(event: FormEvent<HTMLInputElement>) {
    const name = event.currentTarget.name;
    const value = event.currentTarget.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function formValidity(event: FormEvent<HTMLFormElement>): { valid: boolean } {
    const formElements = event.currentTarget.elements;
    const messages = {
      first_name: "Введите имя.",
      last_name: "Введите фамилию.",
      "social_link[]": "Неверный формат ссылки на социальную сеть.",
    };
    let isValid: {
      first_name?: boolean | undefined;
      last_name?: boolean | undefined;
      profile_city?: boolean | undefined;
      description?: boolean | undefined;
      "social_link[]"?: Array<boolean> | boolean | undefined;
    } = {
      first_name: formElements["first_name"]?.validity.valid,
      last_name: formElements["last_name"]?.validity.valid,
      profile_city: formElements["profile_city"]?.validity.valid,
      description: formElements["description"]?.validity.valid,
      "social_link[]":
        (formElements["social_link[]"] instanceof RadioNodeList &&
          Array.from(formElements["social_link[]"]).reduce(
            (valid: Array<boolean>, element: HTMLInputElement) =>
              (element && [...valid, element.validity.valid]) || valid,
            []
          )) ||
        formElements["social_link[]"]?.validity.valid,
    };

    isValid = Object.fromEntries(
      Object.entries(isValid).filter(
        ([elementName, isValid]) => typeof isValid !== "undefined"
      )
    );

    const invalid = Object.entries(isValid).filter(
      ([elementName, valid]) =>
        (typeof valid === "boolean" && !valid) ||
        (Array.isArray(valid) && valid.includes(false))
    );

    Object.keys(isValid).forEach((elementName) => {
      const list: Array<{
        element: HTMLElement;
        type: "add" | "delete";
        text: string;
      }> = [];
      const isMultiValue = formElements[elementName] instanceof RadioNodeList;

      if (isMultiValue) {
        Array.from<HTMLElement>(formElements[elementName]).forEach(
          (element, i) => {
            element &&
              list.push({
                element,
                type: isValid[elementName].some(
                  (isElementValid: boolean) => isElementValid === false
                )
                  ? "add"
                  : "delete",
                text: messages[elementName],
              });
          }
        );
      } else {
        list.push({
          element: formElements[elementName],
          type: isValid[elementName] ? "delete" : "add",
          text: messages[elementName],
        });
      }
      list.forEach(({ element, type, text }) => {
        element.focus();

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
    });

    if (invalid.length > 0) {
      const focusedElement = formElements[invalid[0][0]];

      if (focusedElement instanceof RadioNodeList) {
        (
          Array.from(focusedElement).filter(
            (element: HTMLInputElement) => !element.validity.valid
          )[0] as HTMLElement
        ).focus();
      } else {
        focusedElement.focus();
      }
    } else {
      formElements["submit"].focus();
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

    updateProfileRequest({
      profile,
      formData,
      doneCallback: (params = {}) => {
        if (params.error) {
          snackbarDispatch({
            type: "add",
            payload: {
              messages: [
                {
                  context: "error",
                  text: params.error,
                },
              ],
            },
          });
          return;
        } else {
          snackbarDispatch({
            type: "add",
            payload: {
              messages: [
                {
                  context: "success",
                  text: "Изменения сохранены",
                },
              ],
            },
          });
          return;
        }
      },
    });
  }

  return (
    <>
      <BorderUnderHeader />

      <div className={styles.content}>
        <Avatar profile={profile} />
        <form onSubmit={handleSubmit} noValidate={true}>
          <GeneralInfo
            handleInputChange={handleInputChange}
            formData={formData}
          />
          <SocialLinks setFormData={setFormData} formData={formData} />
          <div className={styles.actions}>
            <Button className="btn_primary" type="submit" name="submit">
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileEdit;
