import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Props {
    permissionKey: string
    label: string
    checked: boolean,
    onCheckedChange: (isChecked: boolean, name: string) => void
}

const PermissionSwitch = ({ permissionKey, label, checked, onCheckedChange }: Props) => {
    const switchId = `${permissionKey}_switch`;

    return (
        <div className='flex items-center w-full gap-5'>
            <Switch
                checked={checked}
                onCheckedChange={(value) => onCheckedChange(value, permissionKey)}
                id={switchId}
                name={permissionKey}  // Add the name prop if needed
            />
            <Label htmlFor={switchId} className={`cursor-pointer ${checked ? 'text-primary' : 'text-muted-foreground'} hover:-primary`}>{label}</Label>
        </div>
    );
};

export default PermissionSwitch