import { ReactElement, useContext, useRef, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";
import Link from "next/link";

import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import styles from './GeneralInfo.module.scss';

const {
  InputText, TextArea
} = InclusiveComponents;

const GeneralInfo: React.FunctionComponent<{
  formData,
  handleInputChange,
}> = ({
  formData,
  handleInputChange,
}): ReactElement => {

  return (
    <div className={styles.content}>
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
        label="Город"
        name="profile_city"
        value={formData?.profile_city ?? ""}
        placeholder="Город"
        required={false}
        autoComplete="on"
        onChange={handleInputChange}
      />
      <TextArea
        label="О себе"
        name="description"
        value={formData?.description ?? ""}
        placeholder="О себе"
        required={false}
        autoComplete="on"
        onChange={handleInputChange}
      />
    </div>    
  );
};

export default GeneralInfo;
