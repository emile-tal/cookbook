import { SvgIconTypeMap, Tooltip } from "@mui/material"

import { OverridableComponent } from "@mui/material/OverridableComponent"

interface IconButtonProps {
    onClick: (e: React.MouseEvent) => void,
    icon?: OverridableComponent<SvgIconTypeMap<object, "svg">>,
    renderIcon?: () => React.ReactNode,
    tooltipTitle: string,
    tooltipPlacement: 'top' | 'bottom' | 'left' | 'right',
    variant: 'light' | 'dark' | 'subtle' | 'white'
}

export default function IconButton({ onClick, icon: Icon, renderIcon, tooltipTitle, tooltipPlacement, variant }: IconButtonProps) {
    return (
        <Tooltip title={tooltipTitle} placement={tooltipPlacement}>
            <button
                onClick={e => {
                    e.stopPropagation();
                    onClick(e);
                }}
                className={`flex items-center justify-center rounded-full h-8 min-w-8 ${variant === 'subtle' ? 'hover:bg-black/5 active:bg-black/20' : 'hover:bg-white hover:shadow-sm active:bg-gray-200'} ${variant === 'dark' ? 'bg-gray-100' : 'bg-gray-50'} ${variant === 'white' ? 'bg-white hover:bg-gray-100' : ''} group`}>
                {renderIcon ? renderIcon() : Icon && <Icon className={`text-text text-base ${variant !== 'subtle' && 'group-hover:text-lg'}`} />}
            </button>
        </Tooltip>
    )
}