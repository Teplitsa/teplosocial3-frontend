import { ReactElement } from "react";

const Error50X: React.FunctionComponent<{ statusCode: number }> = ({
  statusCode,
}): ReactElement => {
  return (
    <main id="site-main" className="site-main error-page error-page-500" role="main">
      <div style={{
        marginTop: '100px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '72px',
          lineHeight: '1.0em',
        }}>Ошибка!</h1>
        <p style={{
          fontSize: '18px',
          lineHeight: '1.0em',
        }}>          
          Что-то пошло не так...
        </p>
      </div>
    </main>
  );
};

export default Error50X;
