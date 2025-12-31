import clsx from "clsx";

const Thumbnail = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
}: {
  thumbnail?: string | null;
  // TODO: Fix image typings
  images?: any[] | null;
  size?: "small" | "medium" | "large" | "full" | "square";
  isFeatured?: boolean;
  className?: string;
}) => {
  const initialImage = thumbnail || images?.[0]?.url;

  return (
    <>
      {initialImage && (
        <div
          className={clsx(
            "relative w-full overflow-hidden p-4 rounded-large transition-shadow ease-in-out duration-150",
            className,
            {
              "aspect-[11/14]": isFeatured,
              "aspect-[9/16]": !isFeatured && size !== "square",
              "aspect-[1/1]": size === "square",
              "w-[180px]": size === "small",
              "w-[290px]": size === "medium",
              "w-[440px]": size === "large",
              "w-full": size === "full",
            }
          )}
        >
          <img
            src={initialImage}
            alt="Thumbnail"
            className="absolute inset-0 w-full h-full object-cover object-center"
            draggable={false}
            loading="lazy"
          />
        </div>
      )}
    </>
  );
};

export default Thumbnail;
