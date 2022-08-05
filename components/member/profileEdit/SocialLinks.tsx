import { ReactElement, useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";
import Link from "next/link";

import {
  ISocailLink,
} from "../../../model/model.typing";
import { useStoreActions } from "../../../model/helpers/hooks";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import styles from './SocialLinks.module.scss';

import imageTrash from "../../../assets/img/trash.svg";

const {
  InputText, InputCheckbox, Button
} = InclusiveComponents;

const emptyLinkState: ISocailLink = {url: "", type: "", mustHide: false};

const SocialLinks: React.FunctionComponent<{
  formData,
  setFormData,
}> = ({
  formData,
  setFormData,
}): ReactElement => {
  const inputSocialLinkRef = useRef<HTMLInputElement>(null);

  const [socialLinks, setSocailLinks] = useState([{...emptyLinkState}])

  useEffect(() => {
    if(!formData) {
      return
    }

    setSocailLinks(formData.social_links);
  }, [formData])

  function handleUrlChange(event) {
    const linkIndex = event.currentTarget.dataset.index;
    const value = event.currentTarget.value;

    formData['social_links'] = [...socialLinks];
    formData['social_links'][linkIndex]['url'] = value;
    setFormData({...formData});
  }

  function handleMustHideChange(event) {
    const linkIndex = event.currentTarget.dataset.index;

    formData['social_links'] = [...socialLinks];
    formData['social_links'][linkIndex]['mustHide'] = event.currentTarget.checked;
    setFormData({...formData});
  }

  return (
    <div className={styles.content}>
      <h5>Ссылки на соцсети</h5>
      {socialLinks.map(({url, mustHide}, i) => {
        return (
          <div key={`KeySocialLink${i}`} className={styles.linkInput}>
            <div className={styles.linkWithTrash}>
              <InputText
                label="Ссылка на профил в соц. сетях"
                type="url"
                name="social_link[]"
                data-index={i}
                value={url}
                placeholder="https://example.com"
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
              label="Не показывать другим пользователям"
              name="social_link_must_hide[]"
              value={i}
              data-index={i}
              checked={mustHide}
              onChange={handleMustHideChange}
            />            
          </div>
        );
      })}

      <div className={styles.action}>
        <Button 
          className="btn_secondary btn_full-width" 
          type="button"
          name="add_social_link"
          onClick={() => {
            socialLinks.push({...emptyLinkState});
            setSocailLinks([...socialLinks]);
          }}
        >
          Добавить ссылку
        </Button>
      </div>
    </div>    
  );
};

export default SocialLinks;
