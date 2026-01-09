import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import useToggleState from "@/lib/hooks/use-toggle-state";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { useEffect } from "react";

type AccountInfoProps = {
  label: string;
  currentInfo: string | React.ReactNode;
  isSuccess?: boolean;
  isError?: boolean;
  errorMessage?: string;
  clearState: () => void;
  children?: React.ReactNode;
};

const AccountInfo = ({
  label,
  currentInfo,
  children,
  clearState,
  isSuccess,
  isError,
  errorMessage,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState();

  const handleToggle = () => {
    clearState();
    toggle();
  };

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess]);

  return (
    <>
      <div className="">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="uppercase">{label}</span>
            <div className="flex items-center flex-1 basis-0 justify-end gap-x-4">
              {typeof currentInfo === "string" ? (
                <span className="font-semibold">{currentInfo}</span>
              ) : (
                currentInfo
              )}
            </div>
          </div>
          <div>
            {/* <CollapsibleTrigger asChild> */}
            <Button
              size="sm"
              variant="secondary"
              onClick={handleToggle}
              type={state ? "reset" : "button"}
            >
              {state ? "Cancel" : "Edit"}
            </Button>
            {/* </CollapsibleTrigger> */}
          </div>
        </div>

        {isSuccess && (
          <Alert className="text-green-600 my-4">
            <CheckCircle2Icon />
            <AlertTitle>Success! Your changes have been saved</AlertTitle>
          </Alert>
        )}

        {isError && (
          <Alert className="text-destructive my-4">
            <AlertCircleIcon />
            <AlertTitle>{errorMessage}</AlertTitle>
          </Alert>
        )}

        <Collapsible open={state}>
          <CollapsibleContent>
            <div className="flex flex-col gap-y-2 py-4">
              <div>{children}</div>
              <div className="flex items-center justify-end mt-2">
                <Button size="sm" type="submit">
                  Save Changes
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
};

export default AccountInfo;
