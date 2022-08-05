import { ReactElement } from "react";
import HeaderSearch from "../layout/partials/HeaderSearch";
import InclusiveComponents from "../../inclusive-components/inclusive-components";
import { ISnackbarMessage } from "../../inclusive-components/inclusive-components.typing";

const { SnackbarContext } = InclusiveComponents;

const Error404: React.FunctionComponent = (): ReactElement => {
  return (
    <main className="site-main error-page error-page-404" role="main">
      <div style={{
        marginTop: '100px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '72px',
          lineHeight: '1.0em',
        }}>404 ошибка</h1>
        <p style={{
          fontSize: '18px',
          lineHeight: '1.0em',
        }}>
          Мы не смогли найти такую страницу :(
        </p>
      </div>
    </main>
  );
};

export default Error404;
