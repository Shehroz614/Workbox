import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSkin } from '@hooks/useSkin'

const SkeletonComponent = ({ count }) => {

  //#region States
  const { skin } = useSkin()
  //#endregion
    
  return (
    <div
      className="w-100"
      style={{ backgroundColor: skin === "dark" ? "#283046" : "white" }}
    >
      <SkeletonTheme baseColor="#6e6b7b" highlightColor="#2EC5A8" >
        <Skeleton count={count || 10} />
      </SkeletonTheme>
    </div>
  );
};

export default SkeletonComponent;
