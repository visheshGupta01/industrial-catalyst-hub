import { Spinner } from "../ui/spinner";

export function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
