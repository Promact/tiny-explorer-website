type AccountInfoProps = {
  label: string;
  currentInfo: string | React.ReactNode;
  isSuccess?: boolean;
  isError?: boolean;
  errorMessage?: string;
  clearState: () => void;
  children?: React.ReactNode;
  "data-testid"?: string;
};

const AccountInfo = ({ label, currentInfo }: AccountInfoProps) => {
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
          <div></div>
        </div>
      </div>
    </>
  );
};

export default AccountInfo;
