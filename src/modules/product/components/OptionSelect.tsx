import type { HttpTypes } from "@medusajs/types";
import type React from "react";
import { Button } from "@/components/ui/button";

type OptionSelectProps = {
	option: HttpTypes.StoreProductOption;
	current: string | undefined;
	updateOption: (title: string, value: string) => void;
	title: string;
	disabled: boolean;
	"data-testid"?: string;
};

const OptionSelect: React.FC<OptionSelectProps> = ({
	option,
	current,
	updateOption,
	title,
	"data-testid": dataTestId,
	disabled,
}) => {
	const filteredOptions = (option.values ?? []).map((v) => v.value);

	return (
		<div className="flex flex-col gap-y-3">
			<span className="text-lg font-semibold">Select {title}:</span>
			<div className="flex flex-wrap gap-2" data-testid={dataTestId}>
				{filteredOptions?.map((v) => (
					<Button
						onClick={() => updateOption(option.id, v)}
						key={v}
						variant={current === v ? "default" : "outline"}
						disabled={disabled}
					>
						{v}
					</Button>
				))}
			</div>
		</div>
	);
};

export default OptionSelect;
