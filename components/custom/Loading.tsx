import Loader from "react-spinners/PuffLoader";

function Loading() {
  // Dark Theme to update
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Loader
        color="hsl(0 0% 20%)"
        loading={true}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Loading
