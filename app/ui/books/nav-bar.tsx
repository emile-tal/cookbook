import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import GridViewIcon from '@mui/icons-material/GridView';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewListIcon from '@mui/icons-material/ViewList';

export function BookNavBar({ view, handleViewChange }: { view: "grid" | "list", handleViewChange: (event: React.MouseEvent<HTMLElement>, newView: "grid" | "list" | null) => void }) {
    return (
        <nav className="flex justify-end py-2 items-center gap-2">
            <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                aria-label="view toggle"
                sx={{
                    border: 'none',
                    '& .MuiButtonBase-root': {
                        border: 'none',
                    },
                }}
            >
                <ToggleButton value="grid" aria-label="grid view">
                    <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="list" aria-label="list view">
                    <ViewListIcon />
                </ToggleButton>
            </ToggleButtonGroup>
            <SettingsIcon />
        </nav>
    )
}