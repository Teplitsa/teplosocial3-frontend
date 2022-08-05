/* eslint-disable react/display-name */
import DocumentHead from "../DocumentHead";
import MainSkeleton from "../skeletons/MainSkeleton";
//import HomeSkeleton from "../skeletons/HomeSkeleton";
import CommonSkeleton from "../skeletons/CommonSkeleton";

const withSkeleton = ({
  pathname,
}: {
  pathname: string;
}): React.FunctionComponent => {
  const MainSkeletonContent = () => <CommonSkeleton />;

  return () => (
    <>
      <DocumentHead />
      <MainSkeleton>
        <MainSkeletonContent />
      </MainSkeleton>
    </>
  );
};

export default withSkeleton;
