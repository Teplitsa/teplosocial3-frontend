import { ReactElement } from "react";

const Error401: React.FunctionComponent = (): ReactElement => {
  return (
    <main id="site-main" className="site-main error-page error-page-401" role="main">
      <div style={{
        marginTop: '100px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '72px',
          lineHeight: '1.0em',
        }}>Доступ к странице ограничен :(</h1>
        <p style={{
          fontSize: '18px',
          lineHeight: '1.0em',
        }}>          
          У вас недостаточно прав!
        </p>
      </div>
    </main>
  );
};

export default Error401;
