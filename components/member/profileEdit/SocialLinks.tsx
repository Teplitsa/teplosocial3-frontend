import { Fragment, ReactElement, useState, ChangeEvent } from "react";
import useIsomorphicLayoutEffect from "../../../custom-hooks/use-isomorphic-layout-effect";

import { ISocailLink } from "../../../model/model.typing";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import styles from "./SocialLinks.module.scss";

// import imageTrash from "../../../assets/img/trash.svg";

const { InputText /* InputCheckbox, Button */ } = InclusiveComponents;

const emptyTelegramLinkState: ISocailLink = {
  url: "",
  type: "telegram",
  mustHide: false,
};

const SocialLinks: React.FunctionComponent<{
  formData;
  setFormData;
}> = ({ formData, setFormData }): ReactElement => {
  const [socialLinks, setSocailLinks] = useState([]);

  useIsomorphicLayoutEffect(() => {
    if (!formData) return;

    setSocailLinks(
      formData.social_links.findIndex(
        (socialLink: ISocailLink | undefined) => socialLink?.type === "telegram"
      ) !== -1
        ? formData.social_links
        : [...formData.social_links, { ...emptyTelegramLinkState }]
    );
  }, [formData]);

  function handleTelegramLinkInput(event: ChangeEvent<HTMLInputElement>) {
    const linkIndex = event.currentTarget.dataset.index;
    const value = event.currentTarget.value;

    if (/^@/.test(value) || value === "") return;

    setSocailLinks((prevSocailLinks) => {
      const newSocailLinks = [...prevSocailLinks];
      newSocailLinks[linkIndex].url = `@${value}`;

      return newSocailLinks;
    });
  }

  function handleLinkChange(event: ChangeEvent<HTMLInputElement>) {
    const linkIndex = event.currentTarget.dataset.index;
    const value = event.currentTarget.value;

    formData.social_links = [...socialLinks];
    formData.social_links[linkIndex].url = value;

    setFormData({ ...formData });
  }

  // function handleMustHideChange(event) {
  //   const linkIndex = event.currentTarget.dataset.index;
  //   formData["social_links"] = [...socialLinks];
  //   formData["social_links"][linkIndex]["mustHide"] =
  //     event.currentTarget.checked;
  //   setFormData({ ...formData });
  // }

  // useLayoutEffect(() => {
  //   if (socialLinks.length < 1) {
  //     socialLinks.push({ ...emptyTelegramLinkState });
  //   }
  // });

  return (
    <div className={styles.content}>
      <h5 className={styles.telegram}>???????????????? ?????? ??????????</h5>
      {/* {socialLinks.map(({ url, mustHide }, i) => {
        return (
          <div key={`KeySocialLink${i}`} className={styles.linkInput}>
            <div className={styles.linkWithTrash}>
              <InputText
                label="???????????? ???? ???????????? ?? ??????. ??????????"
                type="url"
                name="social_link[]"
                data-index={i}
                value={url}
                placeholder="+7 555 55 5555"
                required={false}
                autoComplete="on"
                onChange={handleUrlChange}
              />
              <img
                src={imageTrash}
                onClick={() => {
                  socialLinks.splice(i, 1);
                  setSocailLinks([...socialLinks]);
                }}
              />
            </div>
            <InputCheckbox
              label="???? ???????????????????? ???????????? ??????????????????????????"
              name="social_link_must_hide[]"
              value={i}
              data-index={i}
              checked={mustHide}
              onChange={handleMustHideChange}
            />
          </div>
        );
      })} */}

      {socialLinks.map(({ url, type }, i) => {
        return type === "telegram" ? (
          <Fragment key={`KeySocialLink${i}`}>
            <InputText
              label="?????? ?? ??????????????????"
              type="text"
              pattern="@[_a-zA-Z0-9]+"
              name="social_link[]"
              data-index={i}
              value={url}
              placeholder="?????? ?? ??????????????????"
              required={false}
              autoComplete="on"
              onChange={handleLinkChange}
              onInput={handleTelegramLinkInput}
            />

            <a
              href="https://telegram.org/faq#q-what-are-usernames-how-do-i-get-one"
              target="_blank"
              className={styles.howToLink}
            >
              ?????? ???????????????? ?????????? ???????????????? ???? ?????? ???????????????????????? ?? ???????????????????
            </a>
          </Fragment>
        ) : null;
      })}

      {/* <div className={styles.action}>
        <Button
          className="btn_secondary btn_full-width"
          type="button"
          name="add_social_link"
          onClick={() => {
            socialLinks.push({ ...emptyTelegramLinkState });
            setSocailLinks([...socialLinks]);
          }}
        >
          ???????????????? ????????????
        </Button>
      </div> */}
    </div>
  );
};

export default SocialLinks;
