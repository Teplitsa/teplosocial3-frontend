import { ReactElement } from "react";

const HomeSkeleton: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="home-skeleton">
      <div className="home-skeleton__banner" />
      <div className="home-skeleton__inner">
        <div className="home-skeleton__stats">
          <div className="home-skeleton__stats-inner">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <div
                  key={`StatsItem-${i}`}
                  className="home-skeleton__stats-item"
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
